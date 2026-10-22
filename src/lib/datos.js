import { CONFIG } from "../config.js";

const mayus = (s) => s.charAt(0).toUpperCase() + s.slice(1);
const enc = encodeURIComponent;

export const nf = new Intl.NumberFormat("es-CO");
export const inicio = new Date(CONFIG.fecha);
export const fin = new Date(inicio.getTime() + CONFIG.duracionHoras * 36e5);
export const fmt = (opciones, fecha = inicio) =>
  new Intl.DateTimeFormat("es-CO", { timeZone: CONFIG.zonaHoraria, ...opciones }).format(fecha);
export const diaDe = (fecha) => fmt({ year: "numeric", month: "2-digit", day: "2-digit" }, fecha);

export const fechaCorta = mayus(fmt({ weekday: "long", day: "numeric", month: "long" }).replace(",", ""));
export const fechaLarga = mayus(fmt({ weekday: "long", day: "numeric", month: "long", year: "numeric" }));
export const hora = fmt({ hour: "numeric", minute: "2-digit" });

const zonaLugar = [CONFIG.barrio && `Barrio ${CONFIG.barrio}`, CONFIG.ciudad].filter(Boolean).join(" · ");
const direccionCompleta = [CONFIG.lugar, CONFIG.direccion, CONFIG.barrio, CONFIG.ciudad].filter(Boolean).join(", ");
export const lugarPrincipal = CONFIG.lugar || CONFIG.direccion;
export const lugarDetalle = CONFIG.lugar ? `${CONFIG.direccion} · ${zonaLugar}` : zonaLugar;

export const enlaceMaps =
  CONFIG.enlaceGoogleMaps || `https://www.google.com/maps/search/?api=1&query=${enc(`${direccionCompleta}, Colombia`)}`;
export const enlaceWhatsapp = `https://wa.me/${CONFIG.confirmacion.whatsapp.replace(/\D/g, "")}?text=${enc(
  CONFIG.confirmacion.mensaje
)}`;

const base = import.meta.env.BASE_URL;
export const fotos = Array.from({ length: CONFIG.totalFotos }, (_, i) => {
  const archivo = `${String(i + 1).padStart(2, "0")}.jpg`;
  return { i, mini: `${base}galeria/mini/${archivo}`, grande: `${base}galeria/grande/${archivo}` };
});

// Medio siglo en números, contado hasta el día de la fiesta
const [nA, nM, nD] = CONFIG.fechaNacimiento.split("-").map(Number);
const [fA, fM, fD] = CONFIG.fecha.slice(0, 10).split("-").map(Number);
const diasVividos = Math.round((Date.UTC(fA, fM - 1, fD) - Date.UTC(nA, nM - 1, nD)) / 864e5);
const mesesVividos = (fA - nA) * 12 + (fM - nM) - (fD < nD ? 1 : 0);
export const cifras = [
  { etiqueta: "años", valor: Math.floor(mesesVividos / 12) },
  { etiqueta: "meses", valor: mesesVividos },
  { etiqueta: "semanas", valor: Math.floor(diasVividos / 7) },
  { etiqueta: "días", valor: diasVividos },
];
export const cifrasPie =
  fM === nM && fD === nD
    ? `Cumplidos el ${fmt({ day: "numeric", month: "long", year: "numeric" })}.`
    : "Contados hasta el día de la fiesta.";
