import { motion, useReducedMotion } from "motion/react";
import { event } from "../data/event.js";
import Countdown from "./Countdown.jsx";
import OttoImage from "./OttoImage.jsx";
import Button from "./Button.jsx";

export default function Hero() {
  const reduce = useReducedMotion();
  const rise = reduce
    ? {}
    : {
        initial: { opacity: 0, y: 24 },
        animate: { opacity: 1, y: 0 },
      };

  return (
    <header className="relative flex min-h-dvh flex-col items-center justify-center px-5 pb-16 pt-10 text-center">
      <motion.p
        {...rise}
        transition={{ duration: 0.5 }}
        className="font-hand text-2xl text-[var(--color-festa-cream)] drop-shadow-[0_2px_2px_rgba(0,0,0,0.35)] sm:text-3xl"
      >
        {event.welcome}
      </motion.p>

      <motion.h1
        {...rise}
        transition={{ duration: 0.6, delay: 0.08 }}
        className="font-display mt-3 text-[clamp(2.7rem,12vw,6rem)] leading-[0.95] text-[var(--color-festa-corn)] [text-shadow:0_3px_0_var(--color-festa-red),0_6px_0_var(--color-festa-wood-dark)]"
      >
        {event.title}
      </motion.h1>

      <motion.p
        {...rise}
        transition={{ duration: 0.6, delay: 0.16 }}
        className="font-body mt-3 text-lg font-extrabold text-[var(--color-festa-cream)] drop-shadow-[0_2px_2px_rgba(0,0,0,0.35)] sm:text-2xl"
      >
        {event.subtitle}
      </motion.p>

      {/* Otto welcome scene */}
      <motion.div
        {...rise}
        transition={{ duration: 0.7, delay: 0.24 }}
        className="mt-7 w-full max-w-[min(78vw,340px)]"
      >
        <div className="aspect-[9/16] w-full overflow-hidden rounded-3xl border-4 border-[var(--color-festa-cream)] shadow-[0_12px_30px_rgba(0,0,0,0.35)]">
          <OttoImage
            src="/img/hero-boas-vindas.webp"
            alt="Otto numa barraquinha de espetinhos dando as boas-vindas ao arraiá, ao meio-dia."
            label="boas-vindas"
          />
        </div>
      </motion.div>

      <motion.div
        {...rise}
        transition={{ duration: 0.6, delay: 0.34 }}
        className="mt-8"
      >
        <p className="font-body mb-3 text-sm font-bold uppercase tracking-widest text-[var(--color-festa-cream)] drop-shadow-[0_1px_1px_rgba(0,0,0,0.4)]">
          Falta pouco pro arraiá!
        </p>
        <Countdown />
      </motion.div>

      <motion.div
        {...rise}
        transition={{ duration: 0.6, delay: 0.42 }}
        className="mt-9"
      >
        <Button as="a" href="#rsvp" variant="red" className="text-lg">
          {event.recados.ctaRsvp}
        </Button>
      </motion.div>
    </header>
  );
}
