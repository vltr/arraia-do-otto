import { event } from "../data/event.js";
import { googleCalendarUrl, downloadIcs } from "../lib/calendar.js";
import Button from "./Button.jsx";
import Scene from "./Scene.jsx";
import WoodSign from "./WoodSign.jsx";
import WoodFrame from "./WoodFrame.jsx";

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
    <Scene id="detalhes" divider="baloes">
      <WoodFrame className="reveal mx-auto max-w-md" innerClassName="p-6">
        <div className="mb-7 text-center">
          <WoodSign>Os detalhe do festerê</WoodSign>
        </div>

        <div className="space-y-5">
          <Row icon="📅" label="Quando" value={event.dateLabel} sub={event.timeLabel} />
          <Row
            icon="📍"
            label="Onde"
            value={event.venue}
            sub={`${event.address} (${event.venueDetail})`}
          />
        </div>

        <p className="font-hand mt-5 text-center text-2xl leading-snug text-[var(--color-festa-wood)]">
          {event.recados.traje}
        </p>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button as="a" href={googleCalendarUrl()} target="_blank" rel="noopener" variant="green">
            📆 Google Agenda
          </Button>
          <Button onClick={downloadIcs} variant="corn">
            ⬇️ Baixar convite (.ics)
          </Button>
        </div>
      </WoodFrame>
    </Scene>
  );
}
