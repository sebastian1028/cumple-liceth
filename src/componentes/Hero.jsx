import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { CONFIG } from "../config.js";
import { fechaCorta, hora } from "../lib/datos.js";
import { irA, reducido } from "../lib/movimiento.js";

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
        .from(".hero-anios", { y: 20, autoAlpha: 0, duration: 1.1 }, "-=1")
        .fromTo(
          ".hero-nombre",
          { clipPath: "inset(-40% 100% -40% -10%)" },
          { clipPath: "inset(-40% -10% -40% -10%)", duration: 2, ease: "power2.inOut" },
          "-=0.7"
        )
        .from(".hero-apellidos", { autoAlpha: 0, letterSpacing: "1.1em", duration: 1.5 }, "-=1.1")
        .from(".hero-fecha", { y: 18, autoAlpha: 0, duration: 1 }, "-=0.9")
        .from(".hero-bajar", { y: 12, autoAlpha: 0, duration: 0.8 }, "-=0.5");

      // Al bajar, el 50 se aleja y se desvanece
      gsap.to(".hero-cifra", {
        scale: 0.9,
        autoAlpha: 0.25,
        ease: "none",
        scrollTrigger: { trigger: raiz.current, start: "top top", end: "bottom top", scrub: true },
      });
    },
    { scope: raiz }
  );

  useEffect(() => {
    if (iniciar) intro.current?.play();
  }, [iniciar]);

  return (
    <header className="hero" id="inicio" ref={raiz}>
      <div className="wrap hero-inner">
        <p className="eyebrow centro hero-eyebrow">Te invitamos a celebrar los</p>
        <p className="hero-cifra" aria-hidden="true">
          {String(CONFIG.edad)
            .split("")
            .map((d, i) => (
              <span className="hero-digito" key={i}>
                {d}
              </span>
            ))}
        </p>
        <p className="hero-anios" aria-hidden="true">
          años
        </p>
        <div className="hero-nombre-wrap">
          <h1 className="hero-nombre">
            <span className="sr-only">Los {CONFIG.edad} años de </span>
            {CONFIG.nombrePortada}
          </h1>
          <p className="hero-apellidos">
            {CONFIG.nombre} {CONFIG.apellidos}
          </p>
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
