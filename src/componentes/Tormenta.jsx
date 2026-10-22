import { useMemo, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { CONFIG } from "../config.js";
import { reducido } from "../lib/movimiento.js";

const CORAZON = "M100 104c-14-10-22-17-22-26a11 11 0 0 1 22-4 11 11 0 0 1 22 4c0 9-8 16-22 26z";

export default function Tormenta() {
  const raiz = useRef(null);
  const sobres = useMemo(
    () =>
      Array.from({ length: window.innerWidth < 600 ? 14 : 22 }, (_, k) => ({
        k,
        ancho: Math.round(20 + Math.random() * 30),
        izquierda: Math.round(Math.random() * 96),
        tono: k % 3,
      })),
    []
  );

  useGSAP(
    () => {
      const cielo = raiz.current.querySelector(".tormenta");
      const caen = gsap.utils.toArray(".sobrecito");
      if (reducido) {
        caen.forEach((s) => gsap.set(s, { y: gsap.utils.random(0, cielo.offsetHeight - 40), rotation: gsap.utils.random(-30, 30) }));
        return;
      }

      // Lluvia de sobres: caen girando en 3D y se mecen de lado a lado
      const animaciones = caen.flatMap((s) => {
        const caida = gsap.fromTo(
          s,
          { y: -90 },
          { y: () => cielo.offsetHeight + 90, duration: gsap.utils.random(7, 13), ease: "none", repeat: -1 }
        );
        caida.progress(Math.random());
        const vaiven = gsap.to(s, {
          x: "random(-70, 70)",
          rotation: "random(-60, 60)",
          rotationY: "random(-180, 180)",
          rotationX: "random(-50, 50)",
          duration: "random(2.2, 4)",
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
          repeatRefresh: true,
        });
        return [caida, vaiven];
      });
      ScrollTrigger.create({
        trigger: raiz.current,
        start: "top bottom",
        end: "bottom top",
        onToggle: (self) => animaciones.forEach((a) => (self.isActive ? a.resume() : a.pause())),
      });

      const alEntrar = { trigger: ".sobres-texto", start: "top 80%", once: true };
      gsap.from(".sobres-texto > *", { y: 34, autoAlpha: 0, duration: 1.1, stagger: 0.12, ease: "expo.out", scrollTrigger: alEntrar });
      gsap.from(".sobres-caja", { y: 60, autoAlpha: 0, duration: 1.2, ease: "expo.out", scrollTrigger: { trigger: ".sobres-caja", start: "top 85%", once: true } });
      gsap.from(".pasos li", { x: -24, autoAlpha: 0, duration: 0.9, stagger: 0.15, ease: "expo.out", scrollTrigger: { trigger: ".pasos", start: "top 85%", once: true } });

      // El sobre grande se abre a medida que bajas y sale la carta
      gsap.set(".sg-solapa-atras", { scaleY: 0, svgOrigin: "100 50" });
      gsap
        .timeline({ scrollTrigger: { trigger: ".sobre-grande", start: "top 85%", end: "center 45%", scrub: 1 } })
        .to(".sg-solapa-frente", { scaleY: 0, svgOrigin: "100 50", duration: 0.5, ease: "none" })
        .to(".sg-solapa-atras", { scaleY: -1, svgOrigin: "100 50", duration: 0.5, ease: "none" })
        .to(".sg-carta", { y: -62, duration: 1, ease: "power2.out" }, "-=0.15")
        .from(".sg-corazon", { scale: 0, transformOrigin: "50% 50%", duration: 0.45, ease: "back.out(3)" }, "-=0.45");
    },
    { scope: raiz }
  );

  return (
    <section className="banda sobres" id="regalo" aria-labelledby="regalo-titulo" ref={raiz}>
      <div className="tormenta" aria-hidden="true">
        {sobres.map((s) => (
          <svg
            key={s.k}
            className={`sobrecito tono-${s.tono}`}
            style={{ left: `${s.izquierda}%`, width: s.ancho }}
            viewBox="0 0 30 20"
          >
            <rect x="0.5" y="0.5" width="29" height="19" rx="2" />
            <path d="M1.5 2 15 11.5 28.5 2" />
          </svg>
        ))}
      </div>

      <div className="wrap sobres-grid">
        <div className="sobres-texto">
          <p className="eyebrow">El regalo</p>
          <h2 className="titulo" id="regalo-titulo">
            {CONFIG.regalo.titulo}
          </h2>
          <p className="sobres-desc">{CONFIG.regalo.texto}</p>
          <svg className="sobre-grande" viewBox="0 -30 200 200" aria-hidden="true">
            <rect className="sg-interior" x="10" y="50" width="180" height="110" rx="6" />
            <path className="sg-solapa-atras" d="M10 50h180l-90 68z" />
            <g className="sg-carta">
              <rect x="28" y="58" width="144" height="92" rx="5" />
              <path className="sg-corazon" d={CORAZON} />
              <path className="sg-renglon" d="M62 126h76M76 137h48" />
            </g>
            <path className="sg-bolsillo" d="M10 50l90 58 90-58v104a6 6 0 0 1-6 6H16a6 6 0 0 1-6-6z" />
            <path className="sg-pliegue" d="M12 158l70-58M188 158l-70-58" />
            <g className="sg-solapa-frente">
              <path d="M10 50h180l-90 68z" />
              <circle cx="100" cy="106" r="11" />
            </g>
          </svg>
        </div>
        <div className="sobres-caja">
          <p className="sobres-caja-tit">Así funciona</p>
          <ol className="pasos">
            {CONFIG.regalo.pasos.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
