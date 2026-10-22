import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { CONFIG } from "../config.js";
import { inicio, fin, diaDe, fechaCorta, hora, lugarPrincipal } from "../lib/datos.js";
import { reducido } from "../lib/movimiento.js";
import { lanzarConfeti } from "../lib/confeti.js";

const UNIDADES = [
  ["dias", "Día", "Días"],
  ["horas", "Hora", "Horas"],
  ["minutos", "Minuto", "Minutos"],
  ["segundos", "Segundo", "Segundos"],
];

function calcular(ahora) {
  if (ahora >= fin) return { estado: "despues" };
  if (ahora >= inicio) return { estado: "durante" };
  const s = Math.floor((inicio - ahora) / 1000);
  return {
    estado: diaDe(new Date(ahora)) === diaDe(inicio) ? "hoy" : "antes",
    valores: {
      dias: Math.floor(s / 86400),
      horas: Math.floor((s % 86400) / 3600),
      minutos: Math.floor((s % 3600) / 60),
      segundos: s % 60,
    },
  };
}

const TEXTOS = {
  antes: ["Faltan", `para celebrar juntos el ${fechaCorta.toLowerCase()} a las ${hora}`],
  hoy: ["¡Es hoy! Faltan", `Nos vemos a las ${hora} en ${lugarPrincipal}.`],
  durante: ["¡Hoy es la fiesta!", `La celebración ya empezó. Te esperamos en ${lugarPrincipal}.`],
  despues: ["Gracias por celebrar con nosotros", `Fue una noche para recordar. Gracias por acompañar a ${CONFIG.nombre}.`],
};

// Tarjeta que se voltea como un reloj de aeropuerto cada vez que cambia el valor
function Volteo({ valor, etiqueta }) {
  const raiz = useRef(null);
  const anterior = useRef(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(raiz);
      const [fijaA, fijaB, solA, solB] = [".fija-a", ".fija-b", ".sol-a", ".sol-b"].map((s) => q(s)[0]);
      const texto = (el) => el.firstChild;
      const viejo = anterior.current;
      anterior.current = valor;

      if (viejo === null || viejo === valor || reducido) {
        [fijaA, fijaB, solA, solB].forEach((el) => (texto(el).textContent = valor));
        gsap.set(solA, { rotationX: 0 });
        gsap.set(solB, { rotationX: 90 });
        return;
      }
      texto(fijaA).textContent = valor;
      texto(fijaB).textContent = viejo;
      texto(solA).textContent = viejo;
      texto(solB).textContent = valor;
      gsap
        .timeline({ onComplete: () => (texto(fijaB).textContent = valor) })
        .fromTo(solA, { rotationX: 0 }, { rotationX: -90, duration: 0.28, ease: "power1.in" })
        .fromTo(solB, { rotationX: 90 }, { rotationX: 0, duration: 0.34, ease: "power2.out" });
    },
    { dependencies: [valor], scope: raiz, revertOnUpdate: true }
  );

  return (
    <div className="volteo" ref={raiz}>
      <div className="volteo-tarjeta">
        <div className="mitad arriba fija-a"><span /></div>
        <div className="mitad abajo fija-b"><span /></div>
        <div className="mitad arriba solapa sol-a"><span /></div>
        <div className="mitad abajo solapa sol-b"><span /></div>
      </div>
      <span className="volteo-lbl">{etiqueta}</span>
    </div>
  );
}

export default function Cuenta() {
  const raiz = useRef(null);
  const [tiempo, setTiempo] = useState(() => calcular(Date.now()));
  const estadoPrevio = useRef(tiempo.estado);

  useEffect(() => {
    let id;
    const tic = () => {
      setTiempo(calcular(Date.now()));
      id = setTimeout(tic, 1000 - (Date.now() % 1000) + 5);
    };
    id = setTimeout(tic, 1000 - (Date.now() % 1000) + 5);
    return () => clearTimeout(id);
  }, []);

  useEffect(() => {
    if (estadoPrevio.current !== tiempo.estado && tiempo.estado === "durante") lanzarConfeti(220);
    estadoPrevio.current = tiempo.estado;
  }, [tiempo.estado]);

  useGSAP(
    () => {
      if (reducido) return;
      const alEntrar = { trigger: raiz.current, start: "top 75%", once: true };
      gsap.from(".sec-cabeza > *", { y: 30, autoAlpha: 0, duration: 1, stagger: 0.12, ease: "expo.out", scrollTrigger: alEntrar });
      gsap.from(".volteo", {
        y: 50,
        rotationX: -60,
        autoAlpha: 0,
        transformPerspective: 600,
        duration: 1.2,
        stagger: 0.1,
        ease: "expo.out",
        delay: 0.2,
        scrollTrigger: alEntrar,
      });
      gsap.from(".cuenta-pie", { y: 20, autoAlpha: 0, duration: 1, delay: 0.6, scrollTrigger: alEntrar });
    },
    { scope: raiz }
  );

  const [titulo, pie] = TEXTOS[tiempo.estado];

  return (
    <section className="banda banda-rosa cuenta" id="cuenta" aria-labelledby="cuenta-titulo" ref={raiz}>
      <div className="wrap">
        <div className="sec-cabeza centro">
          <p className="eyebrow">Cuenta regresiva</p>
          <h2 className="titulo" id="cuenta-titulo">
            {titulo}
          </h2>
        </div>
        {tiempo.valores && (
          <div className="reloj" role="timer">
            {UNIDADES.map(([clave, uno, varios]) => {
              const v = tiempo.valores[clave];
              return <Volteo key={clave} valor={String(v).padStart(2, "0")} etiqueta={v === 1 ? uno : varios} />;
            })}
          </div>
        )}
        <p className="cuenta-pie">{pie}</p>
      </div>
    </section>
  );
}
