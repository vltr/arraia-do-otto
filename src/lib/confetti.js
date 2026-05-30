import confetti from "canvas-confetti";

const FESTA = ["#d2382c", "#f08a24", "#f6c544", "#3f9e54", "#fff5e1"];

// Two side cannons of festa-colored confetti — fired on a confirmed RSVP.
export function celebrate() {
  const base = { spread: 70, ticks: 220, gravity: 0.9, colors: FESTA, scalar: 1.1 };
  confetti({ ...base, particleCount: 60, angle: 60, origin: { x: 0, y: 0.7 } });
  confetti({ ...base, particleCount: 60, angle: 120, origin: { x: 1, y: 0.7 } });
  setTimeout(() => {
    confetti({ ...base, particleCount: 50, angle: 90, origin: { x: 0.5, y: 0.4 } });
  }, 220);
}
