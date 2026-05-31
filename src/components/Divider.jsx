import Bunting from "./Bunting.jsx";

// Section separators, varied per scene. Built from CSS or properly-designed
// repeatable assets — NOT by stretching/tiling a flat texture (that looked bad
// as a "beam"). More types (lampião, balões, pipoca…) get added as real
// repeatable elements with correct spacing on a string.
export default function Divider({ type = "bunting" }) {
  if (type === "lampioes") {
    // a real garland: lanterns hung at proper spacing on a CSS string
    return (
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 z-[1] flex h-16 items-start justify-around px-3"
      >
        <div className="absolute inset-x-0 top-2 h-[3px] rounded-full bg-[var(--color-festa-wood-dark)]/45" />
        {Array.from({ length: 8 }).map((_, i) => (
          <img
            key={i}
            src="/img/sep-lampiao.webp"
            alt=""
            loading="lazy"
            className="lampiao-sway relative h-14 w-auto shrink-0 drop-shadow-[0_4px_4px_rgba(0,0,0,0.25)]"
            style={{ transformOrigin: "top center", animationDelay: `${(i % 5) * 0.4}s` }}
          />
        ))}
      </div>
    );
  }
  return <Bunting count={16} className="absolute inset-x-0 top-0 h-6" />;
}
