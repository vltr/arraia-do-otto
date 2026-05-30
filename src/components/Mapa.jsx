import { motion } from "motion/react";
import { event } from "../data/event.js";
import { googleMapsUrl, googleMapsEmbedUrl, wazeUrl } from "../lib/links.js";
import Button from "./Button.jsx";

export default function Mapa() {
  return (
    <section id="mapa" className="px-5 py-14">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5 }}
        className="mx-auto max-w-md rounded-3xl border-4 border-[var(--color-festa-wood)]/40 bg-[var(--color-festa-cream)] p-5 shadow-[0_14px_30px_rgba(0,0,0,0.3)]"
      >
        <h2 className="font-display mb-1 text-center text-3xl text-[var(--color-festa-wood-dark)]">
          {event.recados.mapaTitle}
        </h2>
        <p className="font-body mb-4 text-center text-sm font-bold text-[var(--color-festa-wood)]/80">
          {event.venue} — {event.address}
        </p>

        <div className="overflow-hidden rounded-2xl border-4 border-[var(--color-festa-wood)]/30">
          <iframe
            title={`Mapa: ${event.venue}`}
            src={googleMapsEmbedUrl()}
            className="aspect-[4/3] w-full"
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
      </motion.div>
    </section>
  );
}
