/* =========================================================================
   plantilla.js — encabezado, menú y pie de página comunes a todas las páginas.
   Se dibujan desde config.js para no repetir los datos en cada archivo HTML.
   ========================================================================= */

(function () {
  "use strict";

  var C = window.CONFIG;

  var PAGINAS = [
    { archivo: "index.html", texto: "Inicio" },
    { archivo: "noticias.html", texto: "Noticias" },
    { archivo: "actividades.html", texto: "Actividades" },
    { archivo: "documentos.html", texto: "Documentos" },
    { archivo: "contacto.html", texto: "Contacto" }
  ];

  /** Nombre del archivo actual (index.html si se abre la raíz). */
  function paginaActual() {
    var p = window.location.pathname.split("/").pop();
    return p === "" ? "index.html" : p;
  }

  var LOGO = '<svg class="marca__logo" viewBox="0 0 48 48" role="img" aria-label="Logo">' +
    '<rect width="48" height="48" rx="12" fill="#1d4ed8"/>' +
    '<path d="M11 27 24 16l13 11v10a2 2 0 0 1-2 2h-8v-9h-6v9h-8a2 2 0 0 1-2-2z" fill="#fff"/>' +
    '<circle cx="24" cy="12" r="3" fill="#fbbf24"/></svg>';

  function dibujarCabecera() {
    var actual = paginaActual();
    var enlaces = PAGINAS.map(function (p) {
      var aria = p.archivo === actual ? ' aria-current="page"' : "";
      return '<li><a href="' + p.archivo + '"' + aria + ">" + p.texto + "</a></li>";
    }).join("");
    var admin = '<li class="nav-admin"><a href="admin.html"' +
      (actual === "admin.html" ? ' aria-current="page"' : "") +
      ">Panel directiva</a></li>";

    var html =
      '<a class="salto-contenido" href="#contenido">Saltar al contenido</a>' +
      '<header class="cabecera">' +
        '<div class="contenedor cabecera__fila">' +
          '<a class="marca" href="index.html">' + LOGO +
            "<span><span class=\"marca__nombre\">" + C.nombre + "</span><br>" +
            '<span class="marca__sector">' + C.sector + "</span></span>" +
          "</a>" +
          '<button class="menu-boton" type="button" aria-expanded="false" aria-controls="menu-principal">☰ Menú</button>' +
          '<nav class="navegacion" id="menu-principal" aria-label="Menú principal"><ul>' +
            enlaces + admin +
          "</ul></nav>" +
        "</div>" +
      "</header>";

    document.body.insertAdjacentHTML("afterbegin", html);

    var boton = document.querySelector(".menu-boton");
    var nav = document.getElementById("menu-principal");
    boton.addEventListener("click", function () {
      var abierto = nav.classList.toggle("abierto");
      boton.setAttribute("aria-expanded", abierto ? "true" : "false");
    });
  }

  function dibujarPie() {
    var c = C.contacto;
    var redes = "";
    if (c.facebook) redes += '<li><a href="' + c.facebook + '">Facebook</a></li>';
    if (c.whatsapp) redes += '<li><a href="' + c.whatsapp + '">WhatsApp</a></li>';

    var html =
      '<footer class="pie">' +
        '<div class="contenedor">' +
          '<div class="pie__rejilla">' +
            "<div><h3>" + C.nombre + "</h3><p>" + C.sector + "</p><p>" + C.lema + "</p></div>" +
            "<div><h3>Contacto</h3><ul>" +
              "<li>" + c.direccionSede + "</li>" +
              "<li>" + c.telefono + "</li>" +
              '<li><a href="mailto:' + c.correo + '">' + c.correo + "</a></li>" +
              "<li>" + c.horarioAtencion + "</li>" +
              redes +
            "</ul></div>" +
            "<div><h3>Secciones</h3><ul>" +
              PAGINAS.map(function (p) {
                return '<li><a href="' + p.archivo + '">' + p.texto + "</a></li>";
              }).join("") +
              '<li><a href="admin.html">Panel de la directiva</a></li>' +
            "</ul></div>" +
          "</div>" +
          '<p class="pie__legal">Plataforma desarrollada como Actividad de Aprendizaje–Servicio (A+S) por ' +
            C.creditos.equipo + " · " + C.creditos.asignatura + " · " +
            C.creditos.institucion + " · " + C.creditos.anio + ".</p>" +
        "</div>" +
      "</footer>";

    document.body.insertAdjacentHTML("beforeend", html);
  }

  /* ------------------------- utilidades compartidas ------------------------ */

  var MESES = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio",
               "agosto", "septiembre", "octubre", "noviembre", "diciembre"];

  window.UTIL = {
    /** "2026-10-08" -> "8 de octubre de 2026" */
    fechaLarga: function (iso) {
      var p = String(iso).slice(0, 10).split("-");
      if (p.length !== 3) return iso;
      return Number(p[2]) + " de " + MESES[Number(p[1]) - 1] + " de " + p[0];
    },
    dia: function (iso) { return String(iso).slice(8, 10).replace(/^0/, ""); },
    mesCorto: function (iso) { return MESES[Number(String(iso).slice(5, 7)) - 1].slice(0, 3); },
    /** Escapa texto antes de insertarlo en el HTML. */
    esc: function (t) {
      return String(t == null ? "" : t)
        .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
    },
    hoyISO: function () { return new Date().toISOString().slice(0, 10); }
  };

  document.addEventListener("DOMContentLoaded", function () {
    dibujarCabecera();
    dibujarPie();
    document.title = document.title.replace("{sitio}", C.nombre);
  });
})();
