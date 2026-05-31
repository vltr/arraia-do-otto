import { useState } from "react";

// Renders a generated Otto WebP. Until the asset exists in /public/img, it shows
// a styled "barraca" placeholder so the layout is complete during development.
// Drop the real .webp into public/img and it appears automatically.
export default function OttoImage({ src, alt, className = "", label, cutout = false }) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`grid ${cutout ? "aspect-[3/4]" : ""} place-items-center rounded-2xl border-4 border-dashed border-[var(--color-festa-wood)]/60 bg-[var(--color-festa-cream)]/70 p-6 text-center ${className}`}
      >
        <div>
          <div className="text-4xl">🌽</div>
          <p className="font-hand mt-2 text-2xl text-[var(--color-festa-wood)]">
            {label || "cena do Otto"}
          </p>
          <p className="font-body mt-1 text-xs text-[var(--color-festa-wood)]/70">
            imagem em geração
          </p>
        </div>
      </div>
    );
  }

  // cutout = transparent PNG/WebP that composites over the live sky (no frame,
  // natural aspect, soft ground shadow). Otherwise a framed cover image.
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
      onError={() => setFailed(true)}
      className={
        cutout
          ? `w-full drop-shadow-[0_16px_16px_rgba(0,0,0,0.28)] ${className}`
          : `h-full w-full rounded-2xl object-cover ${className}`
      }
    />
  );
}
