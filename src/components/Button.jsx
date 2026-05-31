// Chunky wooden festa button with a pressable shadow. Renders as <a> or <button>.
const VARIANTS = {
  red: "bg-[var(--color-festa-red)] text-[var(--color-festa-cream)] shadow-[0_5px_0_#9c241b]",
  green:
    "bg-[var(--color-festa-green)] text-[var(--color-festa-cream)] shadow-[0_5px_0_#2c6e3b]",
  corn: "bg-[var(--color-festa-corn)] text-[var(--color-festa-wood-dark)] shadow-[0_5px_0_#c79a1f]",
  cream:
    "bg-[var(--color-festa-cream)] text-[var(--color-festa-wood-dark)] shadow-[0_5px_0_#c9b48a]",
  blue: "bg-[var(--color-sky-noon)] text-[var(--color-festa-cream)] shadow-[0_5px_0_#1f6f9e]",
};

export default function Button({
  as = "button",
  variant = "red",
  className = "",
  children,
  ...props
}) {
  const Tag = as;
  return (
    <Tag
      className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-xl px-5 py-3 text-center font-body text-base font-extrabold leading-tight transition-all duration-100 hover:-translate-y-0.5 active:translate-y-[3px] active:shadow-none ${VARIANTS[variant]} ${className}`}
      {...props}
    >
      {children}
    </Tag>
  );
}
