// Rustic wooden frame around a cream card: an outer wood-textured border holding
// an inner cream panel. Reuses the real wood texture (works as a frame, unlike a
// stretched "beam"). Pass card content as children.
export default function WoodFrame({ children, className = "", innerClassName = "" }) {
  return (
    <div
      className={`overflow-hidden rounded-3xl bg-[#5a3a1e] bg-[url('/img/wood.webp')] bg-cover bg-center p-[11px] shadow-[0_14px_32px_rgba(0,0,0,0.38)] ${className}`}
    >
      <div className={`rounded-[1.25rem] bg-[var(--color-festa-cream)] shadow-[inset_0_0_0_1px_rgba(42,24,16,0.25)] ${innerClassName}`}>
        {children}
      </div>
    </div>
  );
}
