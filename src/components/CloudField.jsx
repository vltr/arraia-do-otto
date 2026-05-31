import { useMemo } from "react";
import { CLOUD_SHAPES } from "../data/clouds.js";

// A field of Simpsons-style clouds. Shapes/sizes/positions/speeds are randomized
// once per session (no two clouds alike), they drift slowly across in a random
// per-session wind direction, carry a soft drop-shadow, take scroll parallax
// (translateY), and fade with `fade` toward night. CSS-only motion.
const rand = (a, b) => a + Math.random() * (b - a);
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

export default function CloudField({ p, fade }) {
  // wind direction: per session
  const wind = useMemo(() => (Math.random() < 0.5 ? "cloud-cross-l" : "cloud-cross-r"), []);

  const clouds = useMemo(() => {
    const n = 7;
    return Array.from({ length: n }, () => {
      const s = pick(CLOUD_SHAPES);
      return {
        s,
        top: rand(2, 44), // %
        width: rand(95, 215), // px
        dur: rand(75, 155), // s — slow
        delay: -rand(0, 155), // negative → spread across at load
        par: -rand(20, 80), // parallax strength (vh)
      };
    });
  }, []);

  return (
    <>
      {/* shape defs (once) */}
      <svg width="0" height="0" aria-hidden style={{ position: "absolute" }}>
        <defs>
          {CLOUD_SHAPES.map((s) => (
            <symbol key={s.id} id={s.id} viewBox={s.vb}>
              {s.paths.map(([d, f], i) => (
                <path key={i} d={d} fill={f} />
              ))}
            </symbol>
          ))}
        </defs>
      </svg>

      {clouds.map((c, i) => (
        <div
          key={i}
          className="absolute"
          style={{
            top: `${c.top}%`,
            left: 0,
            opacity: fade,
            transform: `translateY(${p * c.par}vh)`,
          }}
        >
          <svg
            className={wind}
            viewBox={c.s.vb}
            style={{
              width: `${c.width}px`,
              animationDuration: `${c.dur}s`,
              animationDelay: `${c.delay}s`,
              filter: "drop-shadow(0 8px 7px rgba(40,70,110,0.18))",
              overflow: "visible",
            }}
          >
            <use href={`#${c.s.id}`} />
          </svg>
        </div>
      ))}
    </>
  );
}
