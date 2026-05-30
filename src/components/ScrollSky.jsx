import { useScroll, useTransform, motion, useReducedMotion } from "motion/react";

// Fixed full-viewport background. Four cross-fading gradient layers driven by
// page scroll progress: noon → golden hour → dusk → bonfire night.
// This is the signature effect — the sky literally moves through the day.
const LAYERS = [
  {
    // noon: bright blue sky, sun-warm at the horizon
    bg: "linear-gradient(180deg, #2b9bd4 0%, #5cc0e8 45%, #bfe9f5 100%)",
    range: [0, 0.18, 0.32],
    opacity: [1, 1, 0],
  },
  {
    // golden hour: corn-gold into warm orange
    bg: "linear-gradient(180deg, #6db8d8 0%, #f3a23a 55%, #f6c544 100%)",
    range: [0.2, 0.42, 0.6],
    opacity: [0, 1, 0],
  },
  {
    // dusk: orange burning into purple
    bg: "linear-gradient(180deg, #c25a3a 0%, #8a3b6b 55%, #5a2a55 100%)",
    range: [0.5, 0.72, 0.86],
    opacity: [0, 1, 0],
  },
  {
    // bonfire night: deep purple-black with an ember glow rising from the base
    bg: "radial-gradient(120% 80% at 50% 118%, #f08a24 0%, #b23a2e 22%, #4a1f48 55%, #2a1638 100%)",
    range: [0.78, 0.92, 1],
    opacity: [0, 1, 1],
  },
];

function SkyLayer({ scrollYProgress, layer }) {
  const opacity = useTransform(scrollYProgress, layer.range, layer.opacity);
  return (
    <motion.div
      aria-hidden
      className="fixed inset-0 -z-10"
      style={{ opacity, backgroundImage: layer.bg }}
    />
  );
}

export default function ScrollSky() {
  const { scrollYProgress } = useScroll();
  const reduce = useReducedMotion();

  if (reduce) {
    // Static, calm fallback: a single warm noon→dusk gradient.
    return (
      <div
        aria-hidden
        className="fixed inset-0 -z-10"
        style={{
          backgroundImage:
            "linear-gradient(180deg, #2b9bd4 0%, #f3a23a 55%, #4a1f48 100%)",
        }}
      />
    );
  }

  return (
    <>
      {LAYERS.map((layer, i) => (
        <SkyLayer key={i} scrollYProgress={scrollYProgress} layer={layer} />
      ))}
      {/* Subtle grain for tactile, printed-paper feel */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10 opacity-[0.06] mix-blend-multiply"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />
    </>
  );
}
