// POST /api/rsvp — Cloudflare Pages Function.
// Validates input, rejects honeypot hits, verifies Turnstile, writes to D1.
//
// Bindings/secrets (wrangler.jsonc + Pages env):
//   env.DB                    -> D1 database (binding "DB")
//   env.TURNSTILE_SECRET_KEY  -> Turnstile secret (optional locally; required in prod)

const MAX_NAME = 120;
const MAX_DIETARY = 500;
const MAX_COMPANIONS = 8;

// Owner notification (Cloudflare Email Sending). FROM must be on a domain
// onboarded to Email Sending (ottok.com.br). Sent fire-and-forget.
const OWNER_EMAIL = "rkuesters@gmail.com";
const FROM = { email: "rsvp@ottok.com.br", name: "Arraiá do Otto" };

// Clean a person record from raw input.
function cleanPerson(p) {
  const name = String(p?.name || "").trim();
  const dietary = String(p?.dietary || "").trim().slice(0, MAX_DIETARY) || null;
  return { name, dietary };
}

const escapeHtml = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

// Email the owner a summary of one submission via the Email Routing send_email
// binding (cloudflare:email + mimetext). No-op without the EMAIL binding (local
// dev / before setup). Never throws to the caller.
async function notifyOwner(env, { primary, attending, companions, count }) {
  if (!env.EMAIL) return;
  const { EmailMessage } = await import("cloudflare:email");
  const { createMimeMessage } = await import("mimetext");

  const status = attending ? "VAI ✅" : "não vai ❌";
  const lines = [`Responsável: ${primary.name} — ${status}${primary.dietary ? ` · ${primary.dietary}` : ""}`];
  if (companions.length) {
    lines.push("Acompanhantes:");
    for (const c of companions) lines.push(`• ${c.name}${c.dietary ? ` · ${c.dietary}` : ""}`);
    lines.push(`Total: ${count} pessoa(s)`);
  }
  const text = lines.join("\n");
  const html = `<div style="font-family:system-ui,sans-serif;font-size:15px;line-height:1.5;color:#3a2410">
    <h2 style="margin:0 0 8px">🎪 Novo RSVP — Arraiá do Otto</h2>
    ${lines.map((l) => `<p style="margin:2px 0">${escapeHtml(l)}</p>`).join("")}
  </div>`;

  const msg = createMimeMessage();
  msg.setSender({ name: FROM.name, addr: FROM.email });
  msg.setRecipient(OWNER_EMAIL);
  msg.setSubject(`🎪 RSVP: ${primary.name} ${attending ? "vem" : "não vem"}${companions.length ? ` (+${companions.length})` : ""}`);
  msg.addMessage({ contentType: "text/plain", data: text });
  msg.addMessage({ contentType: "text/html", data: html });

  await env.EMAIL.send(new EmailMessage(FROM.email, OWNER_EMAIL, msg.asRaw()));
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json; charset=utf-8" },
  });
}

async function verifyTurnstile(secret, token, ip) {
  const body = new FormData();
  body.append("secret", secret);
  body.append("response", token || "");
  if (ip) body.append("remoteip", ip);
  const res = await fetch(
    "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    { method: "POST", body },
  );
  const data = await res.json().catch(() => ({ success: false }));
  return data.success === true;
}

async function handlePost(context) {
  const { request, env } = context;

  let payload;
  try {
    payload = await request.json();
  } catch {
    return json({ ok: false, error: "payload inválido" }, 400);
  }

  // Honeypot: a real user never fills "fax". Pretend success, write nothing.
  if (typeof payload.fax === "string" && payload.fax.trim() !== "") {
    return json({ ok: true });
  }

  const attending = payload.attending === 1 || payload.attending === "1" ? 1 : 0;
  const primary = cleanPerson(payload);

  if (!primary.name || primary.name.length > MAX_NAME) {
    return json({ ok: false, error: "nome inválido" }, 400);
  }

  // Companions: only when the primary is coming. Drop blanks, validate, cap.
  let companions = [];
  if (attending === 1 && Array.isArray(payload.companions)) {
    companions = payload.companions
      .map(cleanPerson)
      .filter((c) => c.name.length > 0 && c.name.length <= MAX_NAME)
      .slice(0, MAX_COMPANIONS);
  }

  // Turnstile — enforced whenever a secret is configured (once per submission).
  if (env.TURNSTILE_SECRET_KEY) {
    const ip = request.headers.get("CF-Connecting-IP");
    const ok = await verifyTurnstile(
      env.TURNSTILE_SECRET_KEY,
      payload.turnstileToken,
      ip,
    );
    if (!ok) return json({ ok: false, error: "verificação falhou" }, 403);
  }

  if (!env.DB) {
    return json({ ok: false, error: "banco indisponível" }, 500);
  }

  // A shared group_id ties a household together (NULL when it's a solo RSVP).
  const groupId = companions.length > 0 ? crypto.randomUUID() : null;
  const people = [
    { name: primary.name, attending, dietary: primary.dietary },
    ...companions.map((c) => ({ name: c.name, attending: 1, dietary: c.dietary })),
  ];

  try {
    const stmt = env.DB.prepare(
      "INSERT INTO rsvps (name, attending, dietary, group_id) VALUES (?, ?, ?, ?)",
    );
    await env.DB.batch(
      people.map((p) => stmt.bind(p.name, p.attending, p.dietary, groupId)),
    );
  } catch {
    return json({ ok: false, error: "erro ao salvar" }, 500);
  }

  // Notify the owner in the background — never blocks or fails the RSVP.
  context.waitUntil(
    notifyOwner(env, { primary, attending, companions, count: people.length }).catch(() => {}),
  );

  return json({ ok: true, count: people.length });
}

export async function onRequest(context) {
  if (context.request.method !== "POST") {
    return json({ ok: false, error: "método não permitido" }, 405);
  }
  return handlePost(context);
}
