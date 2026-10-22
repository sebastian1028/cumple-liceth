import { useEffect, useState } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Sobre from "./componentes/Sobre.jsx";
import Hero from "./componentes/Hero.jsx";
import Cuenta from "./componentes/Cuenta.jsx";
import Ella from "./componentes/Ella.jsx";
import Galeria from "./componentes/Galeria.jsx";
import Visor from "./componentes/Visor.jsx";
import Detalles from "./componentes/Detalles.jsx";
import Tormenta from "./componentes/Tormenta.jsx";
import Pie from "./componentes/Pie.jsx";

export default function App() {
  // Un enlace con #seccion entra directo, sin el sobre
  const [fase, setFase] = useState(() => (window.location.hash.length > 1 ? "listo" : "sobre"));
  const [visor, setVisor] = useState(null);

  useEffect(() => {
    document.documentElement.classList.toggle("bloqueado", fase !== "listo" || visor !== null);
  }, [fase, visor]);

  useEffect(() => {
    if (fase === "listo") ScrollTrigger.refresh();
  }, [fase]);

  useEffect(() => {
    const id = window.location.hash.slice(1);
    if (id) requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView());
  }, []);

  return (
    <>
      {fase !== "listo" && <Sobre onAbriendo={() => setFase("abriendo")} onListo={() => setFase("listo")} />}
      <Hero iniciar={fase !== "sobre"} />
      <main>
        <Cuenta />
        <Ella />
        <Galeria onAbrir={setVisor} />
        <Detalles />
        <Tormenta />
      </main>
      <Pie />
      {visor && <Visor {...visor} onCerrar={() => setVisor(null)} />}
    </>
  );
}
