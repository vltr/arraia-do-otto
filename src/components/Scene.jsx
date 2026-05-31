import Bunting from "./Bunting.jsx";

// A full-screen "cena": at least one viewport tall, gently snaps into place,
// centers its content, and gives a wide inner container so desktop layouts can
// use two columns. Mobile stays a single centered column. Use min-h-dvh so each
// item fills the screen; content may grow past it on very short screens.
export default function Scene({ id, children, className = "", inner = "", topBunting = false }) {
  return (
    <section
      id={id}
      className={`relative flex min-h-dvh w-full snap-start flex-col items-center justify-center overflow-hidden px-5 py-16 ${className}`}
    >
      {topBunting && (
        <Bunting count={16} className="absolute inset-x-0 top-0 h-6" />
      )}
      <div className={`mx-auto w-full max-w-5xl ${inner}`}>{children}</div>
    </section>
  );
}
