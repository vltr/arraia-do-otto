// Rustic wooden plaque for section titles — dark wood with grain, corner screws,
// and a pressable shadow. Gives the festa-junina "plaquinha de madeira" look.
export default function WoodSign({ children, className = "" }) {
  const screw =
    "absolute h-2 w-2 rounded-full bg-[#2a1810] shadow-[inset_0_1px_1px_rgba(255,255,255,0.25)]";
  return (
    <div
      className={`relative inline-block rounded-xl bg-[var(--color-festa-wood)] px-7 py-3 shadow-[0_6px_0_#3a2414,0_12px_20px_rgba(0,0,0,0.3)] ${className}`}
    >
      {/* wood grain */}
      <div className="pointer-events-none absolute inset-0 rounded-xl opacity-25 [background:repeating-linear-gradient(90deg,rgba(0,0,0,0.18)_0_2px,transparent_2px_10px)]" />
      <span className={`${screw} left-2 top-2`} />
      <span className={`${screw} right-2 top-2`} />
      <span className={`${screw} bottom-2 left-2`} />
      <span className={`${screw} bottom-2 right-2`} />
      <span className="relative font-display text-2xl text-[var(--color-festa-cream)] drop-shadow-[0_2px_2px_rgba(0,0,0,0.55)] sm:text-3xl">
        {children}
      </span>
    </div>
  );
}
