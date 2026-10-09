/* =========================================================================
   paginas.js — dibuja el contenido público (noticias, actividades,
   documentos, directiva y formulario de contacto).
   Cada página incluye solo los contenedores que necesita; este archivo
   detecta cuáles existen y los rellena.
   ========================================================================= */

(function () {
  "use strict";

  var esc = window.UTIL.esc;
  var fechaLarga = window.UTIL.fechaLarga;

  function nodo(id) { return document.getElementById(id); }

  function vacio(texto) {
    return '<p class="vacio">' + esc(texto) + "</p>";
  }

  /* ------------------------------ NOTICIAS ------------------------------- */

  function tarjetaNoticia(n, conCuerpo) {
    var html =
      '<article class="tarjeta' + (n.destacada ? " tarjeta--destacada" : "") + '">' +
        '<span class="tarjeta__fecha">' + esc(fechaLarga(n.fecha)) + "</span>" +
        "<h3>" + esc(n.titulo) + "</h3>" +
        "<p>" + esc(n.resumen) + "</p>";
    if (conCuerpo && n.cuerpo) {
      html += "<details><summary>Leer la información completa</summary>" +
              '<div class="detalle-noticia">' +
              esc(n.cuerpo).split("\n").map(function (p) {
                return p.trim() ? "<p>" + p + "</p>" : "";
              }).join("") +
              "</div></details>";
    }
    return html + "</article>";
  }

  function pintarNoticias() {
    var lista = window.DATOS.listar("noticias");

    var portada = nodo("ultimas-noticias");
    if (portada) {
      portada.innerHTML = lista.length
        ? lista.slice(0, 3).map(function (n) { return tarjetaNoticia(n, false); }).join("")
        : vacio("Todavía no hay noticias publicadas.");
    }

    var completa = nodo("lista-noticias");
    if (completa) {
      completa.innerHTML = lista.length
        ? lista.map(function (n) { return tarjetaNoticia(n, true); }).join("")
        : vacio("Todavía no hay noticias publicadas.");
    }
  }

  /* ---------------------------- ACTIVIDADES ------------------------------ */

  function filaActividad(a) {
    var pasada = String(a.fecha) < window.UTIL.hoyISO();
    return '<article class="actividad' + (pasada ? " actividad--pasada" : "") + '">' +
      '<div class="actividad__fecha" aria-hidden="true">' +
        '<span class="actividad__dia">' + window.UTIL.dia(a.fecha) + "</span>" +
        '<span class="actividad__mes">' + window.UTIL.mesCorto(a.fecha) + "</span>" +
      "</div>" +
      '<div class="actividad__datos">' +
        "<h3>" + esc(a.titulo) + "</h3>" +
        '<p class="actividad__meta">' + esc(fechaLarga(a.fecha)) +
          (a.hora ? " · " + esc(a.hora) + " h" : "") +
          (a.lugar ? " · " + esc(a.lugar) : "") +
          (pasada ? " · actividad realizada" : "") +
        "</p>" +
        (a.detalle ? "<p>" + esc(a.detalle) + "</p>" : "") +
      "</div></article>";
  }

  function pintarActividades() {
    var lista = window.DATOS.listar("actividades");
    var hoy = window.UTIL.hoyISO();

    var portada = nodo("proximas-actividades");
    if (portada) {
      var proximas = lista.filter(function (a) { return String(a.fecha) >= hoy; }).slice(0, 3);
      portada.innerHTML = proximas.length
        ? proximas.map(filaActividad).join("")
        : vacio("No hay actividades agendadas por ahora.");
    }

    var completa = nodo("lista-actividades");
    if (completa) {
      completa.innerHTML = lista.length
        ? lista.map(filaActividad).join("")
        : vacio("No hay actividades agendadas por ahora.");
    }
  }

  /* ----------------------------- DOCUMENTOS ------------------------------ */

  function pintarDocumentos() {
    var cont = nodo("lista-documentos");
    if (!cont) return;
    var lista = window.DATOS.listar("documentos");
    cont.innerHTML = lista.length ? lista.map(function (d) {
      return '<article class="documento">' +
        '<div class="documento__icono" aria-hidden="true">' + esc(d.tipo || "DOC") + "</div>" +
        '<div class="documento__datos">' +
          "<h3>" + esc(d.titulo) + "</h3>" +
          "<p>" + esc(d.descripcion || "") +
            (d.fecha ? " · publicado el " + esc(fechaLarga(d.fecha)) : "") + "</p>" +
        "</div>" +
        '<a class="boton boton--borde boton--pequeno" href="' + esc(d.archivo) +
          '" target="_blank" rel="noopener">Abrir</a>' +
      "</article>";
    }).join("") : vacio("Todavía no hay documentos publicados.");
  }

  /* ------------------------------ DIRECTIVA ------------------------------ */

  function pintarDirectiva() {
    var cont = nodo("directiva");
    if (!cont) return;
    cont.innerHTML = window.CONFIG.directiva.map(function (m) {
      return '<div class="tarjeta"><h3>' + esc(m.cargo) + "</h3><p>" + esc(m.nombre) + "</p></div>";
    }).join("");
  }

  /* ------------------------------ CONTACTO ------------------------------- */

  function prepararContacto() {
    var form = nodo("form-contacto");
    if (!form) return;
    var aviso = nodo("aviso-contacto");

    form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      var d = new FormData(form);
      var asunto = "[Sitio vecinal] " + (d.get("motivo") || "Mensaje de un vecino");
      var cuerpo =
        "Nombre: " + (d.get("nombre") || "") + "\n" +
        "Dirección: " + (d.get("direccion") || "") + "\n" +
        "Teléfono o correo de contacto: " + (d.get("contacto") || "") + "\n" +
        "Motivo: " + (d.get("motivo") || "") + "\n\n" +
        (d.get("mensaje") || "");

      var enlace = "mailto:" + window.CONFIG.contacto.correo +
        "?subject=" + encodeURIComponent(asunto) +
        "&body=" + encodeURIComponent(cuerpo);

      aviso.className = "mensaje mensaje--ok";
      aviso.innerHTML = "Se abrirá tu aplicación de correo con el mensaje listo para enviar. " +
        "Si no se abre, escribe directamente a <strong>" + esc(window.CONFIG.contacto.correo) +
        "</strong> o llama al " + esc(window.CONFIG.contacto.telefono) + ".";
      aviso.hidden = false;
      window.location.href = enlace;
    });
  }

  /* -------------------------------- inicio ------------------------------- */

  document.addEventListener("DOMContentLoaded", function () {
    pintarNoticias();
    pintarActividades();
    pintarDocumentos();
    pintarDirectiva();
    prepararContacto();
  });
})();
