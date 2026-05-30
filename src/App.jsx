import ScrollSky from "./components/ScrollSky.jsx";
import Bunting from "./components/Bunting.jsx";
import Hero from "./components/Hero.jsx";
import Detalhes from "./components/Detalhes.jsx";
import Programacao from "./components/Programacao.jsx";
import Mapa from "./components/Mapa.jsx";
import Rsvp from "./components/Rsvp.jsx";
import Footer from "./components/Footer.jsx";
import FloatingCTA from "./components/FloatingCTA.jsx";

export default function App() {
  return (
    <>
      <ScrollSky />
      <div className="relative mx-auto max-w-3xl">
        <Hero />
        <Bunting className="h-6" />
        <Detalhes />
        <Bunting className="h-6" />
        <Programacao />
        <Bunting className="h-6" />
        <Mapa />
        <Bunting className="h-6" />
        <Rsvp />
        <Bunting className="h-6" />
        <Footer />
      </div>
      <FloatingCTA />
    </>
  );
}
