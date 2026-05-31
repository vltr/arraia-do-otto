import { useEffect, useState } from "react";
import { useReducedMotion } from "motion/react";
import Sun from "./Sun.jsx";

// Dynamic 2D sky: cross-fading day→night gradient, parallax clouds that thin out
// toward night, a sun that gently pulses then sets, and a full moon + stars that
// rise at the bonfire end (Otto's favorite 🌙). Driven by a plain rAF-throttled
// scroll-progress state + direct inline styles — reliable across browsers and
// independent of any animation-library quirks. Idle motion (drift/pulse/twinkle/
// bob) is pure CSS. WebGL is reserved for the embers (Embers.jsx, footer only).

// --- math helpers ---
const clamp01 = (t) => Math.min(1, Math.max(0, t));
const lerp = (a, b, t) => a + (b - a) * t;

// piecewise-linear interpolation over stops→values (numbers)
function piece(p, stops, vals) {
  if (p <= stops[0]) return vals[0];
  for (let i = 1; i < stops.length; i++) {
    if (p <= stops[i]) {
      const t = (p - stops[i - 1]) / (stops[i] - stops[i - 1]);
      return lerp(vals[i - 1], vals[i], t);
    }
  }
  return vals[vals.length - 1];
}

// rAF-throttled page scroll progress 0→1
function useScrollProgress() {
  const [p, setP] = useState(0);
  useEffect(() => {
    let raf = 0;
    const read = () => {
      raf = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const next = max > 0 ? clamp01(window.scrollY / max) : 0;
      setP((prev) => (Math.abs(prev - next) > 0.001 ? next : prev));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(read);
    };
    read();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);
  return p;
}

const GRADIENTS = [
  { bg: "linear-gradient(180deg, #2b9bd4 0%, #5cc0e8 45%, #bfe9f5 100%)", stops: [0, 0.18, 0.32], op: [1, 1, 0] },
  { bg: "linear-gradient(180deg, #6db8d8 0%, #f3a23a 55%, #f6c544 100%)", stops: [0.2, 0.42, 0.6], op: [0, 1, 0] },
  { bg: "linear-gradient(180deg, #c25a3a 0%, #8a3b6b 55%, #5a2a55 100%)", stops: [0.5, 0.72, 0.86], op: [0, 1, 0] },
  { bg: "radial-gradient(120% 80% at 50% 118%, #f08a24 0%, #b23a2e 22%, #4a1f48 55%, #2a1638 100%)", stops: [0.78, 0.92, 1], op: [0, 1, 1] },
];

// top%, left%, scale, drift class, parallax strength (vh), base opacity
const CLOUDS = [
  { top: 8, left: 6, scale: 0.85, drift: "a", par: -90, op: 0.9 },
  { top: 14, left: 64, scale: 1.15, drift: "b", par: -150, op: 0.95 },
  { top: 24, left: 30, scale: 0.7, drift: "a", par: -60, op: 0.8 },
  { top: 33, left: 78, scale: 0.9, drift: "b", par: -120, op: 0.85 },
  { top: 5, left: 40, scale: 0.6, drift: "b", par: -40, op: 0.7 },
];

const STARS = [
  [12, 18], [22, 70], [30, 42], [8, 84], [18, 55], [40, 12], [46, 88],
  [52, 33], [60, 66], [15, 35], [36, 76], [50, 8], [26, 92], [44, 50],
  [6, 62], [33, 24], [58, 18], [62, 80], [10, 48], [38, 60],
];

function CloudShape({ style }) {
  return (
    <svg viewBox="0 0 220 110" style={style} aria-hidden>
      <g fill="#ffffff">
        <ellipse cx="62" cy="70" rx="52" ry="30" />
        <ellipse cx="112" cy="58" rx="48" ry="36" />
        <ellipse cx="156" cy="72" rx="46" ry="28" />
        <rect x="42" y="72" width="138" height="30" rx="15" />
      </g>
    </svg>
  );
}

export default function Sky() {
  const reduce = useReducedMotion();
  const p = useScrollProgress();

  if (reduce) {
    return (
      <div
        aria-hidden
        className="fixed inset-0 -z-10"
        style={{ backgroundImage: "linear-gradient(180deg, #2b9bd4 0%, #f3a23a 55%, #4a1f48 100%)" }}
      />
    );
  }

  const cloudFade = piece(p, [0, 0.5, 0.82], [1, 0.75, 0]);
  const starFade = piece(p, [0.72, 0.95], [0, 1]);

  // sun (warm sunburst, see Sun.jsx) — fades out and drifts down as it sets
  const sunFade = piece(p, [0, 0.55, 0.74], [1, 1, 0]);
  const sunDropPct = piece(p, [0, 0.74], [0, 60]); // translateY % of own size

  // moon
  const moonFade = piece(p, [0.74, 0.92], [0, 1]);
  const moonDropPct = piece(p, [0.74, 1], [18, 0]);

  return (
    <div aria-hidden className="fixed inset-0 -z-10 overflow-hidden">
      {/* gradient day→night */}
      {GRADIENTS.map((g, i) => (
        <div key={i} className="absolute inset-0" style={{ backgroundImage: g.bg, opacity: piece(p, g.stops, g.op) }} />
      ))}

      {/* stars (night) */}
      <div className="absolute inset-0" style={{ opacity: starFade }}>
        {STARS.map(([top, left], i) => (
          <span
            key={i}
            className="star-twinkle absolute rounded-full bg-white"
            style={{
              top: `${top}%`,
              left: `${left}%`,
              width: i % 4 === 0 ? "3px" : "2px",
              height: i % 4 === 0 ? "3px" : "2px",
              animationDelay: `${(i % 7) * 0.5}s`,
              boxShadow: "0 0 4px 1px rgba(255,255,255,0.7)",
            }}
          />
        ))}
      </div>

      {/* sun — warm sunburst (Sun.jsx). Outer: fade + drift (inline transform);
          inner: responsive scale (Tailwind transform) on a separate element so
          the two transforms don't collide. */}
      <div
        className="absolute left-[68%] top-[13%]"
        style={{ opacity: sunFade, transform: `translateY(${sunDropPct}%)` }}
      >
        <div className="origin-center scale-[0.62] md:scale-110">
          <Sun />
        </div>
      </div>

      {/* moon — full moon (craters + halo), gentle bob */}
      <div
        className="absolute left-[60%] top-[13%] h-[4.5rem] w-[4.5rem]"
        style={{ opacity: moonFade, transform: `translateY(${moonDropPct}%)` }}
      >
        <div className="moon-bob relative h-full w-full">
          <div className="absolute inset-[-30%] rounded-full bg-[radial-gradient(circle,rgba(232,236,248,0.55)_0%,rgba(232,236,248,0)_68%)]" />
          <div
            className="absolute inset-0 overflow-hidden rounded-full"
            style={{
              background: "radial-gradient(circle at 38% 34%, #fbfcff 0%, #e7ebf6 55%, #cfd6e6 100%)",
              boxShadow: "0 0 30px 8px rgba(220,228,248,0.5), inset -6px -6px 12px rgba(150,160,185,0.45)",
            }}
          >
            <span className="absolute h-3 w-3 rounded-full bg-[#c4ccde]/70" style={{ top: "26%", left: "30%" }} />
            <span className="absolute h-2 w-2 rounded-full bg-[#c4ccde]/60" style={{ top: "52%", left: "58%" }} />
            <span className="absolute h-2.5 w-2.5 rounded-full bg-[#c4ccde]/55" style={{ top: "62%", left: "28%" }} />
            <span className="absolute h-1.5 w-1.5 rounded-full bg-[#c4ccde]/60" style={{ top: "34%", left: "62%" }} />
          </div>
        </div>
      </div>

      {/* clouds — in FRONT of the sun/moon (clouds pass over them), parallax
          (inline translateY) + idle drift (CSS, inner) */}
      {CLOUDS.map((cloud, i) => (
        <div
          key={i}
          className="absolute"
          style={{
            top: `${cloud.top}%`,
            left: `${cloud.left}%`,
            width: `${cloud.scale * 200}px`,
            opacity: cloudFade,
            transform: `translateY(${p * cloud.par}vh)`,
            filter: "blur(0.4px) drop-shadow(0 6px 10px rgba(0,0,0,0.08))",
          }}
        >
          <div className={cloud.drift === "a" ? "cloud-drift-a" : "cloud-drift-b"}>
            <CloudShape style={{ width: "100%", opacity: cloud.op }} />
          </div>
        </div>
      ))}

      {/* grain */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06] mix-blend-multiply"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />
    </div>
  );
}
