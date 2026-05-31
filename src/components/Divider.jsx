import Bunting from "./Bunting.jsx";

// Garland separators: real festa elements on a string. Two modes:
//  - "tight": the element is tiled edge-to-edge (background-repeat) for a dense
//    row (milho almost touching, lanterns, candy apples). The element webp has
//    built-in horizontal padding so the spacing is baked in.
//  - "spaced": a few elements hung on the string with gaps + gentle sway.
const GARLANDS = {
  lampioes: { src: "/img/sep-lampiao.webp", h: 54, mode: "tight" },
  milho: { src: "/img/sep-milho.webp", h: 40, mode: "tight" },
  maca: { src: "/img/sep-maca.webp", h: 48, mode: "tight" },
  baloes: { src: "/img/sep-balao.webp", h: 58, count: 7, mode: "spaced" },
};

function Garland({ src, h, count, mode }) {
  if (mode === "tight") {
    return (
      <div aria-hidden className="absolute inset-x-0 top-0 z-[1]" style={{ height: `${h + 6}px` }}>
        <div className="absolute inset-x-0 top-2 h-[3px] rounded-full bg-[var(--color-festa-wood-dark)]/40" />
        <div
          className="absolute inset-x-0 top-0 bg-repeat-x drop-shadow-[0_4px_4px_rgba(0,0,0,0.22)]"
          style={{ height: `${h}px`, backgroundImage: `url(${src})`, backgroundSize: `auto ${h}px`, backgroundPosition: "top center" }}
        />
      </div>
    );
  }
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
