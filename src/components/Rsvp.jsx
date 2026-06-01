import { useState } from "react";
import { event } from "../data/event.js";
import { celebrate } from "../lib/confetti.js";
import Button from "./Button.jsx";
import Scene from "./Scene.jsx";
import WoodSign from "./WoodSign.jsx";
import WoodFrame from "./WoodFrame.jsx";
import Turnstile, { turnstileEnabled } from "./Turnstile.jsx";

const fieldClass =
  "w-full rounded-xl border-2 border-[var(--color-festa-wood)]/30 bg-white px-4 py-3 font-body text-base text-[var(--color-festa-wood-dark)] outline-none transition focus:border-[var(--color-festa-red)] focus:ring-2 focus:ring-[var(--color-festa-red)]/30";

const MAX_COMPANIONS = 8;

export default function Rsvp() {
  const [attending, setAttending] = useState("sim");
  const [companions, setCompanions] = useState([]); // [{ name, dietary }]
  const [token, setToken] = useState("");
  const [status, setStatus] = useState("idle"); // idle | sending | done | error
  const [errorMsg, setErrorMsg] = useState("");
  const [count, setCount] = useState(1); // how many people this submission confirmed

  const addCompanion = () =>
    setCompanions((c) => (c.length < MAX_COMPANIONS ? [...c, { name: "", dietary: "" }] : c));
  const removeCompanion = (i) => setCompanions((c) => c.filter((_, idx) => idx !== i));
  const setCompanion = (i, field, val) =>
    setCompanions((c) => c.map((x, idx) => (idx === i ? { ...x, [field]: val } : x)));

  async function handleSubmit(e) {
    e.preventDefault();
    if (status === "sending") return;
    const form = e.currentTarget;
    const data = new FormData(form);
    const coming = attending === "sim";

    const name = String(data.get("name") || "").trim();
    if (!name) {
      setErrorMsg("Põe teu nome aí, ó!");
      setStatus("error");
      return;
    }
    if (turnstileEnabled && !token) {
      setErrorMsg("Confirma que cê num é robô, viu?");
      setStatus("error");
      return;
    }

    const validCompanions = coming
      ? companions
          .map((c) => ({ name: c.name.trim(), dietary: c.dietary.trim() }))
          .filter((c) => c.name)
      : [];

    setStatus("sending");
    setErrorMsg("");
    try {
      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          attending: coming ? 1 : 0,
          dietary: String(data.get("dietary") || "").trim(),
          companions: validCompanions,
          // honeypot — must stay empty
          fax: String(data.get("fax") || ""),
          turnstileToken: token,
        }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setCount(coming ? 1 + validCompanions.length : 1);
      if (coming) celebrate();
      setStatus("done");
    } catch {
      setErrorMsg("Deu um perrengue pra enviá. Tenta de novo, ó!");
      setStatus("error");
    }
  }

  return (
    <Scene id="rsvp" divider="milho">
      <WoodFrame className="reveal mx-auto max-w-md" innerClassName="p-7">
        {status === "done" ? (
          <div className="reveal py-6 text-center">
            <div className="text-5xl">{attending === "sim" ? "🎉🔥" : "💛"}</div>
            <p className="font-hand mt-4 text-3xl leading-snug text-[var(--color-festa-red)]">
              {attending === "sim" ? event.recados.confirmado : event.recados.naoVem}
            </p>
            {attending === "sim" && count > 1 && (
              <p className="font-body mt-3 text-sm font-bold text-[var(--color-festa-wood-dark)]">
                Anotei cês {count}, viu? 🎉
              </p>
            )}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
              <div className="text-center">
                <WoodSign>{event.recados.ctaRsvp}</WoodSign>
              </div>
              <p className="font-body text-center text-sm text-[var(--color-festa-wood)]/80">
                {event.recados.espera}
              </p>

              <div>
                <label htmlFor="name" className="font-body mb-1 block text-sm font-bold text-[var(--color-festa-wood-dark)]">
                  Seu nome
                </label>
                <input id="name" name="name" type="text" required autoComplete="name" className={fieldClass} placeholder="Como cê se chama?" />
              </div>

              <fieldset>
                <legend className="font-body mb-1 block text-sm font-bold text-[var(--color-festa-wood-dark)]">
                  Cê vem?
                </legend>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { v: "sim", label: "Tô dentro! 🎉", on: "border-[var(--color-festa-green)] bg-[var(--color-festa-green)] text-[var(--color-festa-cream)]" },
                    { v: "nao", label: "Num vô podê 😔", on: "border-[var(--color-festa-red)] bg-[var(--color-festa-red)] text-[var(--color-festa-cream)]" },
                  ].map((opt) => (
                    <button
                      key={opt.v}
                      type="button"
                      onClick={() => setAttending(opt.v)}
                      aria-pressed={attending === opt.v}
                      className={`rounded-xl border-2 px-3 py-3 font-body text-sm font-extrabold transition ${
                        attending === opt.v
                          ? opt.on
                          : "border-[var(--color-festa-wood)]/30 bg-white text-[var(--color-festa-wood-dark)]"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </fieldset>

              <div>
                <label htmlFor="dietary" className="font-body mb-1 block text-sm font-bold text-[var(--color-festa-wood-dark)]">
                  Alguma restrição alimentar? <span className="font-normal text-[var(--color-festa-wood)]/60">(opcional)</span>
                </label>
                <input id="dietary" name="dietary" type="text" className={fieldClass} placeholder="Ex.: sem glúten, vegetariano…" />
              </div>

              {/* Companions — only when the responsável is coming */}
              {attending === "sim" && (
                <div className="space-y-2 rounded-xl border-2 border-dashed border-[var(--color-festa-wood)]/25 p-3">
                  <p className="font-body text-sm font-bold text-[var(--color-festa-wood-dark)]">
                    Vai levá quem, ó? <span className="font-normal text-[var(--color-festa-wood)]/60">(acompanhantes)</span>
                  </p>

                  {companions.map((c, i) => (
                    <div key={i} className="space-y-2 rounded-lg bg-white/60 p-2">
                      <div className="flex items-center gap-2">
                        <input
                          value={c.name}
                          onChange={(e) => setCompanion(i, "name", e.target.value)}
                          placeholder={`Nome do acompanhante ${i + 1}`}
                          className={`${fieldClass} flex-1`}
                        />
                        <button
                          type="button"
                          onClick={() => removeCompanion(i)}
                          aria-label="Remover acompanhante"
                          className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border-2 border-[var(--color-festa-red)]/40 text-lg text-[var(--color-festa-red)] transition hover:bg-[var(--color-festa-red)]/10"
                        >
                          🗑️
                        </button>
                      </div>
                      <input
                        value={c.dietary}
                        onChange={(e) => setCompanion(i, "dietary", e.target.value)}
                        placeholder="Restrição alimentar dele(a)? (opcional)"
                        className={fieldClass}
                      />
                    </div>
                  ))}

                  {companions.length < MAX_COMPANIONS && (
                    <button
                      type="button"
                      onClick={addCompanion}
                      className="w-full rounded-xl border-2 border-[var(--color-festa-green)]/50 bg-[var(--color-festa-green)]/10 py-2.5 font-body text-sm font-extrabold text-[var(--color-festa-green)] transition hover:bg-[var(--color-festa-green)]/20"
                    >
                      ➕ Adicionar acompanhante
                    </button>
                  )}
                </div>
              )}

              {/* Honeypot — hidden from real users */}
              <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden" tabIndex={-1}>
                <label htmlFor="fax">Não preencha</label>
                <input id="fax" name="fax" type="text" tabIndex={-1} autoComplete="off" />
              </div>

              <Turnstile onToken={setToken} />

              {status === "error" && (
                <p className="font-body text-center text-sm font-bold text-[var(--color-festa-red)]">
                  {errorMsg}
                </p>
              )}

            <div className="pt-1 text-center">
              <Button type="submit" variant="blue" className="w-full" disabled={status === "sending"}>
                {status === "sending" ? "Mandando…" : event.recados.ctaRsvp}
              </Button>
            </div>
          </form>
        )}
      </WoodFrame>
    </Scene>
  );
}
