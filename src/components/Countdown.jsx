import { useEffect, useState } from "react";
import { event } from "../data/event.js";

const TARGET = new Date(event.start).getTime();

function diff() {
  const ms = Math.max(0, TARGET - Date.now());
  const total = Math.floor(ms / 1000);
  return {
    dias: Math.floor(total / 86400),
    horas: Math.floor((total % 86400) / 3600),
    min: Math.floor((total % 3600) / 60),
    seg: total % 60,
    over: ms === 0,
  };
}

function Unit({ value, label }) {
  return (
    <div className="flex flex-col items-center">
      <span className="font-display grid min-w-[2.6ch] place-items-center rounded-xl border-2 border-[var(--color-festa-wood-dark)]/30 bg-[var(--color-festa-cream)] px-2 py-1 text-2xl tabular-nums text-[var(--color-festa-red)] shadow-[0_3px_0_rgba(0,0,0,0.2)] sm:text-4xl">
        {String(value).padStart(2, "0")}
      </span>
      <span className="font-body mt-1 text-[0.65rem] font-bold uppercase tracking-wider text-[var(--color-festa-cream)] drop-shadow-[0_1px_1px_rgba(0,0,0,0.4)] sm:text-xs">
        {label}
      </span>
    </div>
  );
}

export default function Countdown() {
  const [t, setT] = useState(diff);

  useEffect(() => {
    const id = setInterval(() => setT(diff()), 1000);
    return () => clearInterval(id);
  }, []);

  if (t.over) {
    return (
      <p className="font-hand text-3xl text-[var(--color-festa-cream)] drop-shadow-[0_2px_2px_rgba(0,0,0,0.4)]">
        É hoje, sô! 🎉
      </p>
    );
  }

  return (
    <div
      className="flex items-center justify-center gap-2 sm:gap-4"
      aria-label={`Faltam ${t.dias} dias, ${t.horas} horas, ${t.min} minutos e ${t.seg} segundos`}
    >
      <Unit value={t.dias} label="dias" />
      <Unit value={t.horas} label="horas" />
      <Unit value={t.min} label="min" />
      <Unit value={t.seg} label="seg" />
    </div>
  );
}
