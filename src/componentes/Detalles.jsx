import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { CONFIG } from "../config.js";
import { enlaceMaps, enlaceWhatsapp, fechaLarga, hora, lugarDetalle, lugarPrincipal } from "../lib/datos.js";
import { irA, reducido } from "../lib/movimiento.js";

export default function Detalles() {
  const raiz = useRef(null);

  useGSAP(
    () => {
      if (reducido) return;
      gsap
        .timeline({
          defaults: { ease: "expo.out" },
          scrollTrigger: { trigger: ".tarjeta", start: "top 80%", once: true },
        })
        .from(".tarjeta", { y: 70, scale: 0.92, rotationX: 12, transformPerspective: 900, autoAlpha: 0, duration: 1.4 })
        .from(".aparece", { y: 26, autoAlpha: 0, duration: 1, stagger: 0.08 }, "-=0.9")
        .from(".acciones .btn", { scale: 0.9, duration: 0.8, stagger: 0.1, ease: "back.out(2)" }, "<0.5")
        .from(".adorno", { scaleX: 0, duration: 1.2 }, "-=1.4");
    },
    { scope: raiz }
  );

  return (
    <section className="banda banda-rosa evento" id="evento" aria-labelledby="evento-titulo" ref={raiz}>
      <div className="wrap">
        <article className="tarjeta">
          <div className="tarjeta-interior">
            <p className="eyebrow centro aparece">Los detalles</p>
            <h2 className="tarjeta-titulo aparece" id="evento-titulo">
              La celebración
            </h2>
            <p className="tarjeta-nombre aparece">
              {CONFIG.nombre} · {CONFIG.edad} años
            </p>
            <div className="adorno" aria-hidden="true">
              <span />
            </div>
            <dl className="detalles">
              <div className="aparece">
                <dt>Fecha</dt>
                <dd>{fechaLarga}</dd>
              </div>
              <div className="aparece">
                <dt>Hora</dt>
                <dd>{hora}</dd>
              </div>
              <div className="ancho aparece">
                <dt>Lugar</dt>
                <dd>
                  {lugarPrincipal}
                  <small>{lugarDetalle}</small>
                </dd>
              </div>
              <div className="ancho aparece">
                <dt>Regalo</dt>
                <dd>
                  {CONFIG.regalo.titulo}
                  <small>
                    <a href="#regalo" onClick={irA}>
                      Mira cómo funciona
                    </a>
                  </small>
                </dd>
              </div>
            </dl>
            <div className="acciones">
              <a className="btn btn-linea aparece" href={enlaceMaps} target="_blank" rel="noopener">
                <svg className="ico" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 21s-6.5-6.2-6.5-11a6.5 6.5 0 0 1 13 0c0 4.8-6.5 11-6.5 11z" />
                  <circle cx="12" cy="10" r="2.3" />
                </svg>
                Cómo llegar
              </a>
              <a className="btn btn-negro aparece" href={enlaceWhatsapp} target="_blank" rel="noopener">
                <svg className="ico" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M4 5h16v11H9l-5 4z" />
                </svg>
                Confirmar asistencia
              </a>
            </div>
            <p className="acciones-nota aparece">Al confirmar se abre WhatsApp con tu mensaje listo para enviar.</p>
          </div>
        </article>
      </div>
    </section>
  );
}
