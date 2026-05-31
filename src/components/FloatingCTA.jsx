import { useEffect, useState } from "react";
import { event } from "../data/event.js";

// Floating "Confirma a presença, ó!" button. Appears after the hero scrolls
// away and hides once the RSVP section is in view. CSS transition (reliable).
export default function FloatingCTA() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const rsvp = document.getElementById("rsvp");
    function onScroll() {
      const pastHero = window.scrollY > window.innerHeight * 0.9;
      let rsvpVisible = false;
      if (rsvp) {
        const r = rsvp.getBoundingClientRect();
        rsvpVisible = r.top < window.innerHeight && r.bottom > 0;
      }
      setShow(pastHero && !rsvpVisible);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <a
      href="#rsvp"
      aria-hidden={!show}
      className={`fixed inset-x-0 bottom-4 z-20 mx-auto flex w-fit items-center gap-2 rounded-full border-2 border-[var(--color-festa-cream)] bg-[var(--color-festa-red)] px-6 py-3 font-body text-base font-extrabold text-[var(--color-festa-cream)] shadow-[0_8px_24px_rgba(0,0,0,0.4)] transition-all duration-300 active:translate-y-0.5 ${
        show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-6 opacity-0"
      }`}
      style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
    >
      🎪 {event.recados.ctaRsvp}
    </a>
  );
}
