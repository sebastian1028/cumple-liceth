import { useRef } from "react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import { CONFIG } from "../config.js";
import { cifras, cifrasPie, nf } from "../lib/datos.js";
import { reducido } from "../lib/movimiento.js";

export default function Ella() {
  const raiz = useRef(null);

  useGSAP(
    () => {
      if (reducido) return;
      const texto = raiz.current.querySelector(".ella-texto");
      gsap.from(".ella-texto .eyebrow", { x: -30, autoAlpha: 0, duration: 1, ease: "expo.out", scrollTrigger: { trigger: texto, start: "top 80%", once: true } });
      SplitText.create(".ella-texto .titulo, .ella-desc p", {
        type: "lines",
        mask: "lines",
        autoSplit: true,
        onSplit: (self) =>
          gsap.from(self.lines, {
            yPercent: 110,
            duration: 1.2,
            stagger: 0.09,
            ease: "expo.out",
            scrollTrigger: { trigger: texto, start: "top 80%", once: true },
          }),
      });

      const panel = raiz.current.querySelector(".numeros");
      gsap.from(".numeros, .numeros dl > div", {
        y: 40,
        autoAlpha: 0,
        duration: 1,
        stagger: 0.08,
        ease: "expo.out",
        scrollTrigger: { trigger: panel, start: "top 80%", once: true },
      });
      raiz.current.querySelectorAll("[data-n]").forEach((el) => {
        const meta = Number(el.dataset.n);
        const contador = { v: 0 };
        el.textContent = "0";
        gsap.to(contador, {
          v: meta,
          duration: 2,
          ease: "power3.out",
          onUpdate: () => (el.textContent = nf.format(Math.round(contador.v))),
          scrollTrigger: { trigger: panel, start: "top 75%", once: true },
        });
      });
    },
    { scope: raiz }
  );

  return (
    <section className="banda banda-blanca ella" id="ella" aria-labelledby="ella-titulo" ref={raiz}>
      <div className="wrap ella-grid">
        <div className="ella-texto">
          <p className="eyebrow">La cumpleañera</p>
          <h2 className="titulo" id="ella-titulo">
            {CONFIG.sobreElla.titulo}
          </h2>
          <div className="ella-desc">
            {CONFIG.sobreElla.texto.map((t) => (
              <p key={t}>{t}</p>
            ))}
          </div>
        </div>
        <aside className="numeros" aria-labelledby="numeros-tit">
          <p className="numeros-tit" id="numeros-tit">
            Medio siglo en números
          </p>
          <dl>
            {cifras.map((c) => (
              <div key={c.etiqueta}>
                <dt>{c.etiqueta}</dt>
                <dd data-n={c.valor}>{nf.format(c.valor)}</dd>
              </div>
            ))}
          </dl>
          <p className="numeros-pie">{cifrasPie}</p>
        </aside>
      </div>
    </section>
  );
}
