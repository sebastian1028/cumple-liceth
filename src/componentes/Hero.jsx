import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { CONFIG } from "../config.js";
import { fechaCorta, hora } from "../lib/datos.js";
import { irA, reducido } from "../lib/movimiento.js";
import Chispas from "./Chispas.jsx";

export default function Hero({ iniciar }) {
  const raiz = useRef(null);
  const intro = useRef(null);

  useGSAP(
    () => {
      if (reducido) return;
      intro.current = gsap
        .timeline({ paused: true, defaults: { ease: "expo.out" } })
        .from(".hero-eyebrow", { y: 24, autoAlpha: 0, duration: 1 })
        .from(
          ".hero-digito",
          { yPercent: 60, rotationX: -95, autoAlpha: 0, transformOrigin: "50% 100%", duration: 1.7, stagger: 0.2 },
          "-=0.6"
        )
        .fromTo(
          ".hero-nombre",
          { clipPath: "inset(-40% 100% -40% -10%)" },
          { clipPath: "inset(-40% -10% -40% -10%)", duration: 2, ease: "power2.inOut" },
          "-=1.1"
        )
        .from(".hero-apellidos", { autoAlpha: 0, letterSpacing: "1.1em", duration: 1.5 }, "-=1.1")
        .from(".hero-fecha", { y: 18, autoAlpha: 0, duration: 1 }, "-=0.9")
        .from(".hero-bajar", { y: 12, autoAlpha: 0, duration: 0.8 }, "-=0.5");

      // Al bajar, el 50 se aleja y el nombre sube un poco más rápido
      const alBajar = { trigger: raiz.current, start: "top top", end: "bottom top", scrub: true };
      gsap.to(".hero-cifra", { yPercent: 22, scale: 0.88, autoAlpha: 0.2, ease: "none", scrollTrigger: alBajar });
      gsap.to(".hero-nombre-wrap", { yPercent: -35, ease: "none", scrollTrigger: alBajar });
    },
    { scope: raiz }
  );

  useEffect(() => {
    if (iniciar) intro.current?.play();
  }, [iniciar]);

  return (
    <header className="hero" id="inicio" ref={raiz}>
      <Chispas />
      <div className="wrap hero-inner">
        <p className="eyebrow centro hero-eyebrow">Te invitamos a celebrar</p>
        <p className="hero-cifra" aria-hidden="true">
          {String(CONFIG.edad)
            .split("")
            .map((d, i) => (
              <span className="hero-digito foil" key={i}>
                {d}
              </span>
            ))}
        </p>
        <div className="hero-nombre-wrap">
          <h1 className="hero-nombre">
            <span className="sr-only">Los {CONFIG.edad} años de </span>
            {CONFIG.nombre}
          </h1>
          <p className="hero-apellidos">{CONFIG.apellidos}</p>
        </div>
        <p className="hero-fecha">
          {fechaCorta} · {hora}
        </p>
        <a className="hero-bajar" href="#cuenta" onClick={irA}>
          Desliza
          <svg className="ico" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M6 9l6 6 6-6" />
          </svg>
        </a>
      </div>
    </header>
  );
}
