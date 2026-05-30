import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";
import { scenes } from "../data/event.js";
import OttoImage from "./OttoImage.jsx";

function SceneCard({ scene, index }) {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  // Gentle parallax: image drifts opposite the text for depth.
  const imgY = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [40, -40]);
  const flip = index % 2 === 1;

  return (
    <div
      ref={ref}
      className={`flex flex-col items-center gap-5 sm:flex-row ${flip ? "sm:flex-row-reverse" : ""}`}
    >
      <motion.div style={{ y: imgY }} className="w-full max-w-[min(70vw,260px)] shrink-0">
        <div className="aspect-[9/16] w-full overflow-hidden rounded-2xl border-4 border-[var(--color-festa-cream)] shadow-[0_10px_24px_rgba(0,0,0,0.3)]">
          <OttoImage src={scene.img} alt={scene.alt} label={scene.title} />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: flip ? -24 : 24 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.5 }}
        className="text-center sm:text-left"
      >
        <h3 className="font-display text-3xl text-[var(--color-festa-corn)] [text-shadow:0_2px_0_var(--color-festa-wood-dark)]">
          {scene.title}
        </h3>
        <p className="font-hand mt-2 text-2xl leading-snug text-[var(--color-festa-cream)] drop-shadow-[0_2px_2px_rgba(0,0,0,0.4)]">
          “{scene.recado}”
        </p>
      </motion.div>
    </div>
  );
}

export default function Programacao() {
  return (
    <section id="programacao" className="px-5 py-14">
      <h2 className="font-display mb-10 text-center text-4xl text-[var(--color-festa-cream)] [text-shadow:0_3px_0_var(--color-festa-red)]">
        A programação, ó!
      </h2>
      <div className="mx-auto flex max-w-2xl flex-col gap-14">
        {scenes.map((scene, i) => (
          <SceneCard key={scene.id} scene={scene} index={i} />
        ))}
      </div>
    </section>
  );
}
