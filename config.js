/* =========================================================================
   CONFIGURACIÓN DEL SITIO
   -------------------------------------------------------------------------
   Este es el ÚNICO archivo que hay que editar para personalizar el sitio.
   Cambia los datos de la junta de vecinos y se actualizan todas las páginas.
   ========================================================================= */

window.CONFIG = {
  // --- Identidad de la organización ---
  nombre: "Junta de Vecinos N.º __",
  sector: "Sector __, comuna de __",
  lema: "Información vecinal clara, en un solo lugar",

  // --- Datos de contacto (aparecen en Contacto y en el pie de página) ---
  contacto: {
    direccionSede: "[Dirección de la sede vecinal]",
    telefono: "[+56 9 0000 0000]",
    correo: "[correo@juntadevecinos.cl]",
    horarioAtencion: "Martes y jueves de 18:00 a 20:00 h",
    // Deja el enlace vacío ("") si la organización no tiene esa red.
    facebook: "",
    whatsapp: ""
  },

  // --- Directiva (se muestra en la página de inicio) ---
  directiva: [
    { cargo: "Presidencia", nombre: "[Nombre]" },
    { cargo: "Secretaría", nombre: "[Nombre]" },
    { cargo: "Tesorería", nombre: "[Nombre]" }
  ],

  // --- Acceso al panel de administración -----------------------------------
  // IMPORTANTE: esta clave solo protege el panel en el navegador (demostración
  // académica). NO es seguridad real: cualquiera que lea este archivo la ve.
  // Para producción hay que autenticar en el servidor (ver README.md).
  claveAdmin: "juntadevecinos2026",

  // --- Asistente de IA generativa ---
  ia: {
    // Ruta de la función de Cloudflare Pages que habla con el modelo.
    endpoint: "/api/ia",
    // Si la función no está configurada, el asistente usa plantillas locales.
    permitirRespaldoLocal: true
  },

  // --- Equipo A+S que desarrolló la plataforma (pie de página) ---
  creditos: {
    equipo: "Matías Muñoz · Christian Vidal · José Valenzuela · Marcelo Pizarro",
    asignatura: "Arquitectura de Software · Ingeniería de Ejecución en Informática",
    institucion: "Instituto Profesional AIEP",
    anio: 2026
  }
};
