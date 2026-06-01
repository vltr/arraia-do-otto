// POST /api/rsvp — Cloudflare Pages Function.
// Validates input, rejects honeypot hits, verifies Turnstile, writes to D1.
//
// Bindings/secrets (wrangler.jsonc + Pages env):
//   env.DB                    -> D1 database (binding "DB")
//   env.TURNSTILE_SECRET_KEY  -> Turnstile secret (optional locally; required in prod)

const MAX_NAME = 120;
const MAX_DIETARY = 500;
const MAX_COMPANIONS = 8;

// Clean a person record from raw input.
function cleanPerson(p) {
  const name = String(p?.name || "").trim();
  const dietary = String(p?.dietary || "").trim().slice(0, MAX_DIETARY) || null;
  return { name, dietary };
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

  return json({ ok: true, count: people.length });
}

export async function onRequest(context) {
  if (context.request.method !== "POST") {
    return json({ ok: false, error: "método não permitido" }, 405);
  }
  return handlePost(context);
}
