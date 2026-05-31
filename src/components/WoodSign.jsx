// Rustic wooden plaque for section titles — dark wood with grain, corner screws,
// and a pressable shadow. Gives the festa-junina "plaquinha de madeira" look.
export default function WoodSign({ children, className = "" }) {
  const screw =
    "absolute h-2 w-2 rounded-full bg-[#2a1810] shadow-[inset_0_1px_1px_rgba(255,255,255,0.25)]";
  return (
    <div
      className={`relative inline-block overflow-hidden rounded-xl border-2 border-[#2a1810]/40 bg-[#5a3a1e] bg-[url('/img/wood.webp')] bg-cover bg-center px-7 py-3 shadow-[0_6px_0_#2a1810,0_12px_20px_rgba(0,0,0,0.35)] ${className}`}
    >
      {/* darken slightly so the cream text pops */}
      <div className="pointer-events-none absolute inset-0 bg-black/15" />
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
