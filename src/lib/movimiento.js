export const reducido = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Desplazamiento suave a la sección del enlace (#id)
export function irA(evento) {
  const destino = document.getElementById(evento.currentTarget.getAttribute("href").slice(1));
  if (!destino) return;
  evento.preventDefault();
  destino.scrollIntoView({ behavior: reducido ? "auto" : "smooth" });
}
