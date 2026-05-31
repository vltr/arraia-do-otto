import { scenes } from "../data/event.js";
import OttoImage from "./OttoImage.jsx";
import Scene from "./Scene.jsx";

// Each Otto scene is its own full-screen cena: image + recado side by side on
// desktop (alternating sides), stacked on mobile.
export default function Programacao() {
  return (
    <>
      {scenes.map((scene, i) => {
        const flip = i % 2 === 1;
        return (
          <Scene id={scene.id} key={scene.id} divider={["lampioes", "milho", "maca", "baloes"][i % 4]}>
            <div
              className={`flex flex-col items-center gap-8 md:justify-center md:gap-14 ${
                flip ? "md:flex-row-reverse" : "md:flex-row"
              }`}
            >
              <div
                className="reveal w-[min(62vw,260px)] shrink-0 md:w-[380px]"
                style={{ animationDelay: "0.1s" }}
              >
                <div className="aspect-[9/16] w-full overflow-hidden rounded-3xl border-4 border-[var(--color-festa-cream)] shadow-[0_12px_30px_rgba(0,0,0,0.35)]">
                  <OttoImage src={scene.img} alt={scene.alt} label={scene.title} />
                </div>
              </div>

              <div
                className="reveal max-w-md text-center md:text-left"
                style={{ animationDelay: "0.2s" }}
              >
                <p className="font-body text-sm font-bold uppercase tracking-widest text-[var(--color-festa-cream)]/80 drop-shadow-[0_1px_1px_rgba(0,0,0,0.4)]">
                  No arraiá
                </p>
                <h2 className="font-display mt-2 text-[clamp(2.2rem,7vw,4rem)] leading-none text-[var(--color-festa-corn)] [text-shadow:0_3px_0_var(--color-festa-red),0_5px_0_var(--color-festa-wood-dark)]">
                  {scene.title}
                </h2>
                <p className="font-hand mt-4 text-3xl leading-snug text-[var(--color-festa-cream)] drop-shadow-[0_2px_2px_rgba(0,0,0,0.45)]">
                  “{scene.recado}”
                </p>
              </div>
            </div>
          </Scene>
        );
      })}
    </>
  );
}
