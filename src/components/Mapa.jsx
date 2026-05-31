import { event } from "../data/event.js";
import { googleMapsUrl, googleMapsEmbedUrl, wazeUrl } from "../lib/links.js";
import Button from "./Button.jsx";
import Scene from "./Scene.jsx";
import WoodSign from "./WoodSign.jsx";
import WoodFrame from "./WoodFrame.jsx";

export default function Mapa() {
  return (
    <Scene id="mapa" divider="lampioes">
      <WoodFrame className="reveal mx-auto max-w-lg" innerClassName="p-5 sm:p-7">
        <div className="mb-3 text-center">
          <WoodSign>{event.recados.mapaTitle}</WoodSign>
        </div>
        <p className="font-body mb-4 text-center text-sm font-bold text-[var(--color-festa-wood)]/80">
          {event.venue} — {event.address}
        </p>

        <div className="overflow-hidden rounded-2xl border-4 border-[var(--color-festa-wood)]/30">
          <iframe
            title={`Mapa: ${event.venue}`}
            src={googleMapsEmbedUrl()}
            className="aspect-[4/3] w-full sm:aspect-video"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>

        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button as="a" href={googleMapsUrl()} target="_blank" rel="noopener" variant="green">
            🗺️ Abrir no Maps
          </Button>
          <Button as="a" href={wazeUrl()} target="_blank" rel="noopener" variant="corn">
            🚗 Abrir no Waze
          </Button>
        </div>
      </WoodFrame>
    </Scene>
  );
}
