// CSS paper-cut bandeirinhas (bunting) — the stitching between every section.
// Triangular flags hung on a gently drooping string, alternating festa colors.

const FLAG_COLORS = [
  "var(--color-festa-red)",
  "var(--color-festa-corn)",
  "var(--color-festa-green)",
  "var(--color-festa-orange)",
  "var(--color-festa-cream)",
];

export default function Bunting({ count = 14, className = "" }) {
  return (
    <div
      aria-hidden
      className={`relative flex w-full items-start justify-center overflow-hidden ${className}`}
    >
      {/* drooping string */}
      <div className="absolute left-0 right-0 top-[2px] h-[3px] rounded-full bg-[var(--color-festa-wood-dark)]/50" />
      <div className="flex w-full max-w-5xl justify-between px-2">
        {Array.from({ length: count }).map((_, i) => (
          <span
            key={i}
            className="block h-5 w-[clamp(14px,4vw,26px)] origin-top drop-shadow-[0_2px_1px_rgba(0,0,0,0.25)]"
            style={{
              background: FLAG_COLORS[i % FLAG_COLORS.length],
              clipPath: "polygon(0 0, 100% 0, 50% 100%)",
              transform: `rotate(${i % 2 === 0 ? -2 : 2}deg)`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
