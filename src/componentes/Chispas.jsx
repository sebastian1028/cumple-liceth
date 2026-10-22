import { useEffect, useRef } from "react";
import { reducido } from "../lib/movimiento.js";

// Destellos rosados y blancos que suben despacio detrás de la portada
export default function Chispas() {
  const lienzo = useRef(null);

  useEffect(() => {
    const cv = lienzo.current;
    const ctx = cv.getContext("2d");
    const padre = cv.parentElement;
    const estilo = getComputedStyle(document.documentElement);
    const colores = [estilo.getPropertyValue("--rosa-claro").trim(), estilo.getPropertyValue("--blanco").trim()];
    let w = 0, h = 0, dpr = 1, puntos = [], visible = true, raf = 0;

    const nuevo = (alAzar) => ({
      x: Math.random() * w,
      y: alAzar ? Math.random() * h : h + 8,
      r: 0.5 + Math.random() * 1.8,
      v: 0.12 + Math.random() * 0.35,
      f: Math.random() * 6.283,
      vf: 0.012 + Math.random() * 0.03,
      c: colores[Math.random() < 0.7 ? 0 : 1],
    });
    const medir = () => {
      const r = padre.getBoundingClientRect();
      const cambioAncho = Math.abs(r.width - w) > 1;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = r.width;
      h = r.height;
      cv.width = w * dpr;
      cv.height = h * dpr;
      if (cambioAncho || !puntos.length) {
        puntos = Array.from({ length: Math.round(Math.min(80, (w * h) / 8000)) }, () => nuevo(true));
      }
    };
    const pintar = () => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      for (const p of puntos) {
        if (!reducido) {
          p.y -= p.v;
          p.f += p.vf;
          if (p.y < -8) Object.assign(p, nuevo(false));
        }
        const a = 0.2 + 0.8 * Math.abs(Math.sin(p.f));
        ctx.fillStyle = p.c;
        ctx.globalAlpha = a * 0.8;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, 6.283);
        ctx.fill();
        if (p.r > 1.5) {
          ctx.globalAlpha = a * 0.14;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r * 4, 0, 6.283);
          ctx.fill();
        }
      }
      raf = visible && !reducido ? requestAnimationFrame(pintar) : 0;
    };

    medir();
    pintar();
    const ro = new ResizeObserver(() => {
      medir();
      if (!raf) pintar();
    });
    ro.observe(padre);
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible && !raf) pintar();
    });
    io.observe(padre);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
    };
  }, []);

  return <canvas className="chispas" ref={lienzo} aria-hidden="true" />;
}
