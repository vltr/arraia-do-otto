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

export default function Rsvp() {
  const [attending, setAttending] = useState("sim");
  const [token, setToken] = useState("");
  const [status, setStatus] = useState("idle"); // idle | sending | done | error
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    if (status === "sending") return;
    const form = e.currentTarget;
    const data = new FormData(form);

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

    setStatus("sending");
    setErrorMsg("");
    try {
      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          attending: attending === "sim" ? 1 : 0,
          dietary: String(data.get("dietary") || "").trim(),
          // honeypot — must stay empty
          fax: String(data.get("fax") || ""),
          turnstileToken: token,
        }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      celebrate();
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
            <div className="text-5xl">🎉🔥</div>
            <p className="font-hand mt-4 text-3xl leading-snug text-[var(--color-festa-red)]">
              {event.recados.confirmado}
            </p>
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
