import { event } from "../data/event.js";
import Countdown from "./Countdown.jsx";
import OttoImage from "./OttoImage.jsx";
import Button from "./Button.jsx";
import Scene from "./Scene.jsx";

export default function Hero() {
  return (
    <Scene id="hero" topBunting>
      <div className="flex flex-col items-center gap-7 md:flex-row md:justify-center md:gap-14">
        {/* Otto welcome scene — below the text on mobile, left column on desktop */}
        <div
          className="reveal order-2 w-[min(46vw,180px)] shrink-0 md:order-1 md:w-[300px]"
          style={{ animationDelay: "0.2s" }}
        >
          <div className="aspect-[9/16] w-full overflow-hidden rounded-3xl border-4 border-[var(--color-festa-cream)] shadow-[0_12px_30px_rgba(0,0,0,0.35)]">
            <OttoImage
              src="/img/hero-boas-vindas.webp"
              alt="Otto numa barraquinha de espetinhos dando as boas-vindas ao arraiá, ao meio-dia."
              label="boas-vindas"
            />
          </div>
        </div>

        {/* Text column */}
        <div className="order-1 flex max-w-md flex-col items-center text-center md:order-2 md:items-start md:text-left">
          <p className="reveal font-hand text-2xl text-[var(--color-festa-cream)] drop-shadow-[0_2px_2px_rgba(0,0,0,0.4)] sm:text-3xl">
            {event.welcome}
          </p>

          <h1
            className="reveal font-display mt-2 text-[clamp(2.6rem,9vw,5rem)] leading-[0.95] text-[var(--color-festa-corn)] [text-shadow:0_3px_0_var(--color-festa-red),0_6px_0_var(--color-festa-wood-dark)]"
            style={{ animationDelay: "0.08s" }}
          >
            {event.title}
          </h1>

          <p
            className="reveal font-body mt-3 text-lg font-extrabold text-[var(--color-festa-cream)] drop-shadow-[0_2px_2px_rgba(0,0,0,0.4)] sm:text-xl"
            style={{ animationDelay: "0.16s" }}
          >
            {event.subtitle}
          </p>

          <div className="reveal mt-6" style={{ animationDelay: "0.3s" }}>
            <p className="font-body mb-2 text-xs font-bold uppercase tracking-widest text-[var(--color-festa-cream)] drop-shadow-[0_1px_1px_rgba(0,0,0,0.4)]">
              Falta pouco pro arraiá!
            </p>
            <Countdown />
          </div>

          <div className="reveal mt-7" style={{ animationDelay: "0.4s" }}>
            <Button as="a" href="#rsvp" variant="red" className="text-lg">
              {event.recados.ctaRsvp}
            </Button>
          </div>
        </div>
      </div>
    </Scene>
  );
}
