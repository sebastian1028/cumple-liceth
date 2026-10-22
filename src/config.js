/* ================================================================
   DATOS DE LA TARJETA — cambia solo este archivo
   ================================================================ */
export const CONFIG = {
  nombre: "Liceth Yaneth",
  apellidos: "Santafe Vasquez",
  nombrePortada: "Yaneth Santafe", // El nombre grande en letra cursiva de la portada
  edad: 50,
  fechaNacimiento: "1976-10-27", // AAAA-MM-DD

  // Fecha y hora de la fiesta. El -05:00 es la hora de Colombia.
  fecha: "2026-10-27T20:00:00-05:00",
  zonaHoraria: "America/Bogota",
  duracionHoras: 6,

  lugar: "", // Nombre del sitio, si tiene (ej.: "Salón Los Almendros")
  direccion: "Avenida 2 #10-49",
  barrio: "San Luis",
  ciudad: "Cúcuta",
  // Opcional: pega el enlace exacto de Google Maps. Si lo dejas vacío, se busca la dirección.
  enlaceGoogleMaps: "",

  sobreElla: {
    titulo: "Medio siglo para celebrar",
    texto: [
      "Este 27 de octubre Liceth Yaneth cumple 50 años, y queremos celebrarlo con las personas que más quiere.",
      "Acompáñanos a brindar por ella, por todo lo vivido y por todo lo que viene.",
    ],
  },

  // Fotos en public/galeria/mini (cuadradas) y public/galeria/grande (completas): 01.jpg, 02.jpg…
  totalFotos: 45,

  regalo: {
    titulo: "Tormenta de sobres",
    texto:
      "Tu compañía es el mejor regalo. Si además quieres tener un detalle con ella, la celebración será con tormenta de sobres.",
    pasos: [
      "Prepara un sobre con el aporte que quieras darle.",
      "Si quieres, escríbele tu nombre o un mensaje bonito.",
      "Llévalo el día de la fiesta.",
    ],
  },

  // El botón "Confirmar asistencia" abre WhatsApp con este número y este mensaje.
  confirmacion: {
    whatsapp: "573002366480", // Con indicativo del país (57), sin + ni espacios
    mensaje: "¡Claro que sí, estaré allí! 💃🥂",
  },

  firma: "Con cariño, su familia",
};
