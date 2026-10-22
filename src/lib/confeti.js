import { reducido } from "./movimiento.js";

let lienzo, ctx, colores;
let piezas = [];
let raf = 0, dpr = 1, ancho = 0, alto = 0;

function preparar() {
  if (!lienzo) {
    lienzo = document.createElement("canvas");
    lienzo.className = "confeti";
    lienzo.setAttribute("aria-hidden", "true");
    document.body.append(lienzo);
    ctx = lienzo.getContext("2d");
    const estilo = getComputedStyle(document.documentElement);
    colores = ["--rosa", "--negro", "--rosa-medio", "--rosa", "--blanco"].map((v) =>
      estilo.getPropertyValue(v).trim()
    );
  }
  dpr = Math.min(window.devicePixelRatio || 1, 2);
  ancho = window.innerWidth;
  alto = window.innerHeight;
  lienzo.width = ancho * dpr;
  lienzo.height = alto * dpr;
}

function paso() {
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, ancho, alto);
  piezas = piezas.filter((p) => p.y < alto + 30);
  for (const p of piezas) {
    p.vx *= 0.985;
    p.vy = Math.min(p.vy + 0.3, 3.6);
    p.giro += p.vg;
    p.x += p.vx + Math.sin(p.giro) * 0.8;
    p.y += p.vy;
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.giro);
    ctx.scale(1, Math.cos(p.giro * 2.2));
    ctx.fillStyle = p.color;
    if (p.redondo) {
      ctx.beginPath();
      ctx.arc(0, 0, p.a / 2, 0, 6.283);
      ctx.fill();
    } else {
      ctx.fillRect(-p.a / 2, -p.b / 2, p.a, p.b);
    }
    ctx.restore();
  }
  if (piezas.length) raf = requestAnimationFrame(paso);
  else {
    raf = 0;
    ctx.clearRect(0, 0, ancho, alto);
  }
}

// Dos cañones de confeti desde las esquinas de abajo
export function lanzarConfeti(cantidad = 180) {
  if (reducido) return;
  preparar();
  for (let i = 0; i < cantidad; i++) {
    const izq = i % 2 === 0;
    piezas.push({
      x: izq ? -10 : ancho + 10,
      y: alto * (0.55 + Math.random() * 0.25),
      vx: (izq ? 1 : -1) * (3 + Math.random() * 9) * Math.min(1.4, ancho / 500),
      vy: -(9 + Math.random() * 13),
      giro: Math.random() * 6.283,
      vg: (Math.random() - 0.5) * 0.25,
      a: 6 + Math.random() * 6,
      b: 9 + Math.random() * 9,
      redondo: Math.random() < 0.25,
      color: colores[i % colores.length],
    });
  }
  if (!raf) raf = requestAnimationFrame(paso);
}
