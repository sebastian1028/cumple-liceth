import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { CONFIG } from "../config.js";
import { reducido } from "../lib/movimiento.js";
import { lanzarConfeti } from "../lib/confeti.js";

export default function Pie() {
  const raiz = useRef(null);

  useGSAP(
    () => {
      if (reducido) return;
      const alEntrar = { trigger: raiz.current, start: "top 80%", once: true };
      gsap.fromTo(
        ".pie-script",
        { clipPath: "inset(-40% 100% -40% -10%)" },
        { clipPath: "inset(-40% -10% -40% -10%)", duration: 2, ease: "power2.inOut", scrollTrigger: alEntrar }
      );
      gsap.from(".pie-firma, .pie .btn", { y: 18, autoAlpha: 0, duration: 1, stagger: 0.15, delay: 1, ease: "expo.out", scrollTrigger: alEntrar });
    },
    { scope: raiz }
  );

  return (
    <footer className="pie" ref={raiz}>
      <div className="wrap pie-inner">
        <p className="pie-script">¡Te esperamos!</p>
        <p className="pie-firma">{CONFIG.firma}</p>
        <button className="btn btn-linea" type="button" onClick={() => lanzarConfeti(200)}>
          Lanzar confeti
        </button>
      </div>
    </footer>
  );
}
