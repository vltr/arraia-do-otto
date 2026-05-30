import { motion } from "motion/react";
import { event } from "../data/event.js";
import { googleCalendarUrl, downloadIcs } from "../lib/calendar.js";
import Button from "./Button.jsx";

const reveal = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.5 },
};

function Row({ icon, label, value, sub }) {
  return (
    <div className="flex items-center gap-3 text-left">
      <span className="text-3xl">{icon}</span>
      <div>
        <p className="font-body text-xs font-bold uppercase tracking-wider text-[var(--color-festa-wood)]/70">
          {label}
        </p>
        <p className="font-display text-xl leading-tight text-[var(--color-festa-red)]">
          {value}
        </p>
        {sub && (
          <p className="font-body text-sm text-[var(--color-festa-wood-dark)]/80">
            {sub}
          </p>
        )}
      </div>
    </div>
  );
}

export default function Detalhes() {
  return (
    <section id="detalhes" className="px-5 py-14">
      <motion.div
        {...reveal}
        className="mx-auto max-w-md rounded-3xl border-4 border-[var(--color-festa-wood)]/40 bg-[var(--color-festa-cream)] p-7 shadow-[0_14px_30px_rgba(0,0,0,0.3)]"
      >
        <h2 className="font-display mb-6 text-center text-3xl text-[var(--color-festa-wood-dark)]">
          Os detalhe da festa
        </h2>

        <div className="space-y-5">
          <Row icon="📅" label="Quando" value={event.dateLabel} sub={event.timeLabel} />
          <Row
            icon="📍"
            label="Onde"
            value={event.venue}
            sub={`${event.address} (${event.venueDetail})`}
          />
        </div>

        <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button as="a" href={googleCalendarUrl()} target="_blank" rel="noopener" variant="green">
            📆 Google Agenda
          </Button>
          <Button onClick={downloadIcs} variant="corn">
            ⬇️ Baixar convite (.ics)
          </Button>
        </div>
      </motion.div>
    </section>
  );
}
