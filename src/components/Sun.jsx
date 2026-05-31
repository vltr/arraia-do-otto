// Warm sunburst: glowing disc that gently pulses + faint translucent rays that
// slowly rotate (concentric, so the crown spins on center). CSS does the motion
// (see index.css .sb-*). 70×70 base box; the Sky scales/positions it.
export default function Sun() {
  return (
    <div className="relative h-[70px] w-[70px]">
      <div className="sb-raybox">
        {Array.from({ length: 10 }, (_, i) => (
          <div key={i} className={`sb-ray sb-ray${i + 1}`} />
        ))}
      </div>
      <div className="sb-disc sun-pulse absolute inset-0 m-auto" />
    </div>
  );
}
