import { useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { fotos } from "../lib/datos.js";
import { reducido } from "../lib/movimiento.js";

const porFila = Math.ceil(fotos.length / 3);
const FILAS = [0, 1, 2].map((f) => fotos.slice(f * porFila, (f + 1) * porFila));

function Cuadro({ foto, copia, onAbrir }) {
  const abrir = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    onAbrir({ indice: foto.i, x: r.left + r.width / 2, y: r.top + r.height / 2, origen: e.currentTarget });
  };
  return (
    <button
      className="cuadro"
      type="button"
      onClick={abrir}
      aria-label={copia ? undefined : `Ver la foto ${foto.i + 1} en grande`}
      aria-hidden={copia || undefined}
      tabIndex={copia ? -1 : undefined}
    >
      <img src={foto.mini} alt="" loading="lazy" decoding="async" width="600" height="600" />
    </button>
  );
}

export default function Galeria({ onAbrir }) {
  const raiz = useRef(null);
  const [todas, setTodas] = useState(false);

  // Tres filas que desfilan sin fin; al bajar rápido, aceleran
  useGSAP(
    () => {
      if (reducido) return;
      gsap.from(".sec-cabeza > *", {
        y: 30,
        autoAlpha: 0,
        duration: 1,
        stagger: 0.12,
        ease: "expo.out",
        scrollTrigger: { trigger: raiz.current, start: "top 75%", once: true },
      });
      gsap.from(".fila", {
        x: (k) => (k % 2 ? -160 : 160),
        autoAlpha: 0,
        duration: 1.6,
        stagger: 0.12,
        ease: "expo.out",
        scrollTrigger: { trigger: ".marquesina", start: "top 85%", once: true },
      });

      const pistas = gsap.utils.toArray(".pista");
      const desfiles = pistas.map((pista, k) => {
        const duracion = FILAS[k].length * 4;
        return k % 2
          ? gsap.fromTo(pista, { xPercent: -50 }, { xPercent: 0, duration: duracion, ease: "none", repeat: -1 })
          : gsap.to(pista, { xPercent: -50, duration: duracion, ease: "none", repeat: -1 });
      });
      const ritmo = { v: 1 };
      const aplicar = () => desfiles.forEach((d) => d.timeScale(ritmo.v));
      ScrollTrigger.create({
        trigger: raiz.current,
        start: "top bottom",
        end: "bottom top",
        onToggle: (self) => desfiles.forEach((d) => (self.isActive ? d.resume() : d.pause())),
        onUpdate: (self) => {
          const extra = Math.min(Math.abs(self.getVelocity()) / 200, 8);
          if (1 + extra <= ritmo.v) return;
          gsap.to(ritmo, {
            v: 1 + extra,
            duration: 0.15,
            overwrite: true,
            onUpdate: aplicar,
            onComplete: () => gsap.to(ritmo, { v: 1, duration: 1.6, ease: "power2.out", onUpdate: aplicar }),
          });
        },
      });
    },
    { scope: raiz }
  );

  // Cuadrícula con todas las fotos
  useGSAP(
    () => {
      if (!todas) return;
      ScrollTrigger.refresh();
      if (reducido) return;
      gsap.set(".todas .cuadro", { autoAlpha: 0, scale: 0.6, rotation: () => gsap.utils.random(-8, 8) });
      ScrollTrigger.batch(".todas .cuadro", {
        start: "top 95%",
        once: true,
        onEnter: (lote) =>
          gsap.to(lote, { autoAlpha: 1, scale: 1, rotation: 0, duration: 0.7, ease: "back.out(1.7)", stagger: 0.05 }),
      });
    },
    { scope: raiz, dependencies: [todas], revertOnUpdate: true }
  );

  return (
    <section className="banda fotos" id="fotos" aria-labelledby="fotos-titulo" ref={raiz}>
      <div className="wrap">
        <div className="sec-cabeza centro">
          <p className="eyebrow">Recuerdos</p>
          <h2 className="titulo" id="fotos-titulo">
            Su vida en fotos
          </h2>
          <p className="sec-intro">Toca una foto para verla en grande.</p>
        </div>
      </div>

      <div className="marquesina">
        {FILAS.map((fila, k) => (
          <div className="fila" key={k}>
            <div className="pista">
              {fila.map((foto) => (
                <Cuadro key={foto.i} foto={foto} onAbrir={onAbrir} />
              ))}
              {!reducido && fila.map((foto) => <Cuadro key={`c${foto.i}`} foto={foto} copia onAbrir={onAbrir} />)}
            </div>
          </div>
        ))}
      </div>

      <div className="wrap fotos-pie">
        <button className="btn btn-linea" type="button" aria-expanded={todas} onClick={() => setTodas((v) => !v)}>
          {todas ? "Ocultar la cuadrícula" : `Ver las ${fotos.length} fotos`}
        </button>
        {todas && (
          <div className="todas">
            {fotos.map((foto) => (
              <Cuadro key={foto.i} foto={foto} onAbrir={onAbrir} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
