import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { CONFIG } from "../config.js";
import { reducido } from "../lib/movimiento.js";
import { lanzarConfeti } from "../lib/confeti.js";

export default function Sobre({ onAbriendo, onListo }) {
  const raiz = useRef(null);
  const abriendo = useRef(false);

  const { contextSafe } = useGSAP(
    () => {
      if (reducido) return;
      gsap.from(".sobre-flota", { y: 60, autoAlpha: 0, rotation: -4, duration: 1.2, ease: "expo.out" });
      gsap.from([".sobre-para", ".sobre-toca"], { y: 14, autoAlpha: 0, duration: 0.9, stagger: 0.2, delay: 0.4 });
      gsap.to(".sobre", { y: -9, rotation: 0.6, duration: 2.4, ease: "sine.inOut", yoyo: true, repeat: -1, delay: 1.2 });
      gsap.to(".sobre-toca", { autoAlpha: 0.45, duration: 1.2, ease: "sine.inOut", yoyo: true, repeat: -1, delay: 1.4 });
    },
    { scope: raiz }
  );

  const abrir = contextSafe(() => {
    if (abriendo.current) return;
    abriendo.current = true;
    if (reducido) {
      onAbriendo();
      onListo();
      return;
    }
    gsap.killTweensOf([".sobre", ".sobre-toca"]);
    gsap
      .timeline({ onComplete: onListo })
      .to([".sobre-para", ".sobre-toca"], { autoAlpha: 0, duration: 0.3 }, 0)
      .to(".sobre", { y: 0, rotation: 0, duration: 0.3 }, 0)
      .to(".sello", { scale: 1.25, duration: 0.15, ease: "power1.out" }, 0)
      .to(".sello", { scale: 0, rotation: 220, autoAlpha: 0, duration: 0.5, ease: "back.in(2)" }, 0.15)
      .to(".sobre-dest", { autoAlpha: 0, duration: 0.3 }, 0.1)
      .to(".sobre-solapa", { rotationX: 180, duration: 0.85, ease: "power2.inOut" }, 0.4)
      .set(".sobre-solapa", { zIndex: 0 }, 0.82)
      .to(".sobre-papel", { yPercent: -62, duration: 1, ease: "expo.out" }, 1)
      .add(() => {
        lanzarConfeti();
        onAbriendo();
      }, 1.55)
      .to(".sobre-flota", { scale: 1.7, autoAlpha: 0, duration: 0.85, ease: "power2.in" }, 1.75)
      .to(raiz.current, { autoAlpha: 0, duration: 0.7 }, 1.95);
  });

  return (
    <div className="sobre-capa" ref={raiz}>
      <p className="eyebrow centro sobre-para">Una invitación especial</p>
      <div className="sobre-flota">
        <button className="sobre" type="button" aria-label="Abrir la invitación" onClick={abrir}>
          <span className="sobre-fondo" />
          <span className="sobre-papel" aria-hidden="true">
            <span className="papel-nombre">{CONFIG.nombre}</span>
            <span className="papel-sub">
              cumple <b>{CONFIG.edad}</b>
            </span>
          </span>
          <span className="sobre-bolsillo" />
          <span className="sobre-dest" aria-hidden="true">
            Para ti
          </span>
          <span className="sobre-solapa">
            <span />
          </span>
          <span className="sello" aria-hidden="true">
            {CONFIG.edad}
          </span>
        </button>
      </div>
      <p className="sobre-toca">Toca el sobre para abrirlo</p>
    </div>
  );
}
