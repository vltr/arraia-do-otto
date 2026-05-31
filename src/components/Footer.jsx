import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import { event } from "../data/event.js";
import OttoImage from "./OttoImage.jsx";
import ErrorBoundary from "./ErrorBoundary.jsx";

// Code-split: Three.js loads only when the footer nears the viewport.
const Embers = lazy(() => import("./Embers.jsx"));

const FORRO_SRC = "/audio/forro.mp3";

// Optional background forró — off by default. The toggle only appears if the
// audio file actually exists in /public/audio, so it never shows a dead control.
function ForroToggle() {
  const audioRef = useRef(null);
  const [available, setAvailable] = useState(false);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const a = new Audio();
    a.src = FORRO_SRC;
    a.loop = true;
    a.preload = "auto";
    const ok = () => setAvailable(true);
    a.addEventListener("canplaythrough", ok, { once: true });
    audioRef.current = a;
    return () => {
      a.pause();
      a.removeEventListener("canplaythrough", ok);
    };
  }, []);

  if (!available) return null;

  function toggle() {
    const a = audioRef.current;
    if (!a) return;
    if (playing) {
      a.pause();
      setPlaying(false);
    } else {
      a.play().then(() => setPlaying(true)).catch(() => {});
    }
  }

  return (
    <button
      onClick={toggle}
      className="font-body text-sm font-bold text-[var(--color-festa-cream)]/80 underline-offset-4 hover:underline"
    >
      {playing ? "🔇 Parar o forró" : "🎶 Botar um forró"}
    </button>
  );
}

export default function Footer() {
  const reduce = useReducedMotion();
  const [showEmbers, setShowEmbers] = useState(false);
  const sentinelRef = useRef(null);

  useEffect(() => {
    if (reduce) return;
    const el = sentinelRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) setShowEmbers(true);
      },
      { rootMargin: "300px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [reduce]);

  return (
    <footer className="relative isolate flex min-h-dvh snap-start flex-col justify-center px-5 pb-12 pt-10 text-center">
      <div ref={sentinelRef} aria-hidden className="pointer-events-none absolute -top-[40vh] h-px w-px" />
      {/* Embers are anchored INSIDE the footer (absolute), so they live at the
          bonfire and scroll with the page — not glued to the viewport. */}
      {showEmbers && (
        <ErrorBoundary>
          <Suspense fallback={null}>
            <Embers />
          </Suspense>
        </ErrorBoundary>
      )}
      <div className="relative z-10 flex flex-col items-center">
      <div className="reveal w-[min(86vw,440px)]">
        <OttoImage
          cutout
          src="/img/footer-despedida.webp"
          alt="Otto sentado perto de uma fogueirinha acenando tchau, no fim da festa."
          label="despedida"
        />
      </div>

      <p className="font-hand mt-6 text-3xl text-[var(--color-festa-corn)] drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
        {event.recados.espera}
      </p>

      <div className="mt-6 flex flex-col items-center gap-4">
        <ForroToggle />
      </div>

      <p className="font-body mt-10 text-xs text-[var(--color-festa-cream)]/50">
        {event.title} · {event.dateLabel}
      </p>
      </div>
    </footer>
  );
}
