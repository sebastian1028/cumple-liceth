import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { fotos } from "../lib/datos.js";
import { reducido } from "../lib/movimiento.js";

// Foto en grande: se abre como un círculo que crece desde la foto tocada
export default function Visor({ indice, x, y, origen, onCerrar }) {
  const raiz = useRef(null);
  const cerrarBtn = useRef(null);
  const direccion = useRef(0);
  const toqueX = useRef(null);
  const [i, setI] = useState(indice);
  const total = fotos.length;

  const { contextSafe } = useGSAP(
    () => {
      if (reducido) return;
      const radio = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
      gsap.fromTo(
        raiz.current,
        { clipPath: `circle(0px at ${x}px ${y}px)` },
        { clipPath: `circle(${radio}px at ${x}px ${y}px)`, duration: 0.75, ease: "power3.inOut" }
      );
    },
    { scope: raiz }
  );

  useGSAP(
    () => {
      if (reducido) return;
      const d = direccion.current;
      gsap.fromTo(
        ".visor-img",
        { autoAlpha: 0, x: d * 70, scale: d ? 1 : 0.86 },
        { autoAlpha: 1, x: 0, scale: 1, duration: 0.6, ease: "power3.out", delay: d ? 0 : 0.3 }
      );
    },
    { scope: raiz, dependencies: [i], revertOnUpdate: true }
  );

  const cerrar = contextSafe(() => {
    const volver = () => {
      onCerrar();
      origen?.focus?.({ preventScroll: true });
    };
    if (reducido) return volver();
    gsap.to(raiz.current, { clipPath: `circle(0px at ${x}px ${y}px)`, duration: 0.5, ease: "power3.in", onComplete: volver });
  });

  const mover = (d) => {
    direccion.current = d;
    setI((v) => (v + d + total) % total);
  };

  useEffect(() => {
    cerrarBtn.current?.focus({ preventScroll: true });
  }, []);

  useEffect(() => {
    const teclas = (e) => {
      if (e.key === "Escape") cerrar();
      else if (e.key === "ArrowLeft") mover(-1);
      else if (e.key === "ArrowRight") mover(1);
    };
    window.addEventListener("keydown", teclas);
    return () => window.removeEventListener("keydown", teclas);
  });

  useEffect(() => {
    new Image().src = fotos[(i + 1) % total].grande;
  }, [i, total]);

  return (
    <div
      className="visor"
      ref={raiz}
      role="dialog"
      aria-modal="true"
      aria-label="Foto ampliada"
      onClick={(e) => e.target === e.currentTarget && cerrar()}
      onTouchStart={(e) => (toqueX.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (toqueX.current === null) return;
        const dx = e.changedTouches[0].clientX - toqueX.current;
        if (Math.abs(dx) > 50) mover(dx < 0 ? 1 : -1);
        toqueX.current = null;
      }}
    >
      <button className="circulo visor-cerrar" type="button" aria-label="Cerrar" onClick={cerrar} ref={cerrarBtn}>
        <svg className="ico" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M6 6l12 12M18 6 6 18" />
        </svg>
      </button>
      <button className="circulo visor-prev" type="button" aria-label="Foto anterior" onClick={() => mover(-1)}>
        <svg className="ico" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M15 5l-7 7 7 7" />
        </svg>
      </button>
      <figure className="visor-fig">
        <img className="visor-img" src={fotos[i].grande} alt={`Recuerdo ${i + 1}`} />
        <figcaption>
          {i + 1} de {total}
        </figcaption>
      </figure>
      <button className="circulo visor-next" type="button" aria-label="Foto siguiente" onClick={() => mover(1)}>
        <svg className="ico" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
}
