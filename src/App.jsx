import Sky from "./components/Sky.jsx";
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
      <Sky />
      <main className="relative">
        <Hero />
        <Detalhes />
        <Programacao />
        <Mapa />
        <Rsvp />
        <Footer />
      </main>
      <FloatingCTA />
    </>
  );
}
