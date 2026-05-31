import Bunting from "./Bunting.jsx";

// Garland separators: a row of real festa elements hung on a CSS string (proper
// spacing, gentle sway) — high quality, no stretched textures. Generated single
// elements live in /public/img/sep-*.webp.
const GARLANDS = {
  lampioes: { src: "/img/sep-lampiao.webp", h: 56, count: 8 },
  baloes: { src: "/img/sep-balao.webp", h: 58, count: 7 },
  milho: { src: "/img/sep-milho.webp", h: 42, count: 9 },
  maca: { src: "/img/sep-maca.webp", h: 48, count: 8 },
};

function Garland({ src, h, count }) {
  return (
    <div
      aria-hidden
      className="absolute inset-x-0 top-0 z-[1] flex h-16 items-start justify-around px-3"
    >
      <div className="absolute inset-x-0 top-2 h-[3px] rounded-full bg-[var(--color-festa-wood-dark)]/45" />
      {Array.from({ length: count }).map((_, i) => (
        <img
          key={i}
          src={src}
          alt=""
          loading="lazy"
          className="lampiao-sway relative w-auto shrink-0 drop-shadow-[0_4px_4px_rgba(0,0,0,0.25)]"
          style={{ height: `${h}px`, transformOrigin: "top center", animationDelay: `${(i % 5) * 0.4}s` }}
        />
      ))}
    </div>
  );
}

export default function Divider({ type = "bunting" }) {
  const g = GARLANDS[type];
  if (g) return <Garland {...g} />;
  return <Bunting count={16} className="absolute inset-x-0 top-0 h-6" />;
}
