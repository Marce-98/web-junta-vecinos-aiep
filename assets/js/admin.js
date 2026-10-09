/* =========================================================================
   admin.js — panel de la directiva: publicar noticias, agendar actividades,
   registrar documentos y usar el asistente de redacción con IA.
   ========================================================================= */

(function () {
  "use strict";

  var esc = window.UTIL.esc;
  var $ = function (id) { return document.getElementById(id); };

  /* ============================== ACCESO ================================ */

  var CLAVE_SESION = "jv_sesion_admin";

  function sesionActiva() {
    try { return window.sessionStorage.getItem(CLAVE_SESION) === "1"; }
    catch (e) { return false; }
  }

  function abrirPanel() {
    $("acceso").hidden = true;
    $("panel").hidden = false;
    refrescarTodo();
  }

  function iniciarAcceso() {
    $("form-acceso").addEventListener("submit", function (ev) {
      ev.preventDefault();
      var error = $("error-acceso");
      if ($("clave").value === window.CONFIG.claveAdmin) {
        try { window.sessionStorage.setItem(CLAVE_SESION, "1"); } catch (e) {}
        error.hidden = true;
        abrirPanel();
      } else {
        error.textContent = "La clave no es correcta. Verifica mayúsculas y minúsculas.";
        error.hidden = false;
        $("clave").value = "";
        $("clave").focus();
      }
    });

    $("btn-salir").addEventListener("click", function () {
      try { window.sessionStorage.removeItem(CLAVE_SESION); } catch (e) {}
      window.location.reload();
    });

    $("btn-restaurar").addEventListener("click", function () {
      if (window.confirm("Esto borra las publicaciones hechas en este navegador y vuelve al contenido de ejemplo. ¿Continuar?")) {
        window.DATOS.restaurarEjemplo();
        refrescarTodo();
      }
    });

    if (sesionActiva()) abrirPanel();
  }

  /* ============================= PESTAÑAS =============================== */

  function iniciarPestanas() {
    var tabs = Array.prototype.slice.call(document.querySelectorAll('[role="tab"]'));
    tabs.forEach(function (tab) {
      tab.addEventListener("click", function () {
        tabs.forEach(function (t) {
          var activo = t === tab;
          t.setAttribute("aria-selected", activo ? "true" : "false");
          $(t.getAttribute("aria-controls")).hidden = !activo;
        });
      });
    });
  }

  /* ======================== FORMULARIOS GENÉRICOS ======================== */

  /** Lee un formulario y devuelve un objeto plano con sus campos. */
  function valores(form) {
    var d = new FormData(form), o = {};
    d.forEach(function (v, k) { o[k] = typeof v === "string" ? v.trim() : v; });
    return o;
  }

  function rellenar(form, item) {
    Object.keys(item).forEach(function (k) {
      var campo = form.elements[k];
      if (!campo) return;
      if (k === "destacada") campo.value = item[k] ? "si" : "no";
      else campo.value = item[k] == null ? "" : item[k];
    });
  }

  function limpiar(form) {
    form.reset();
    if (form.elements.id) form.elements.id.value = "";
  }

  function conectarCancelar() {
    document.querySelectorAll("[data-cancelar]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var form = $(btn.getAttribute("data-cancelar"));
        limpiar(form);
        var leyenda = form.querySelector("legend");
        if (leyenda) leyenda.textContent = leyenda.getAttribute("data-original") || leyenda.textContent;
      });
    });
  }

  /** Dibuja la lista administrable de una colección. */
  function pintarLista(coleccion, contenedorId, textoPrincipal, textoSecundario, form, tituloAlEditar) {
    var cont = $(contenedorId);
    if (!cont) return;
    var lista = window.DATOS.listar(coleccion);

    if (!lista.length) {
      cont.innerHTML = '<p class="vacio">Todavía no hay registros en esta sección.</p>';
      return;
    }

    cont.innerHTML = lista.map(function (item) {
      return '<div class="fila-lista">' +
        '<div class="fila-lista__texto"><strong>' + esc(textoPrincipal(item)) + "</strong>" +
          "<span>" + esc(textoSecundario(item)) + "</span></div>" +
        '<div class="fila-lista__acciones">' +
          '<button class="boton boton--borde boton--pequeno" data-editar="' + esc(item.id) + '">Editar</button>' +
          '<button class="boton boton--peligro boton--pequeno" data-borrar="' + esc(item.id) + '">Eliminar</button>' +
        "</div></div>";
    }).join("");

    cont.querySelectorAll("[data-editar]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var item = window.DATOS.obtener(coleccion, btn.getAttribute("data-editar"));
        if (!item) return;
        limpiar(form);
        rellenar(form, item);
        var leyenda = form.querySelector("legend");
        if (leyenda) leyenda.textContent = tituloAlEditar;
        form.scrollIntoView({ behavior: "smooth", block: "center" });
      });
    });

    cont.querySelectorAll("[data-borrar]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        if (!window.confirm("¿Eliminar este registro? Los vecinos dejarán de verlo.")) return;
        window.DATOS.eliminar(coleccion, btn.getAttribute("data-borrar"));
        refrescarTodo();
      });
    });
  }

  /* =========================== ALTAS Y EDICIONES ========================= */

  function conectarFormulario(formId, coleccion, transformar) {
    var form = $(formId);
    if (!form) return;
    var leyenda = form.querySelector("legend");
    if (leyenda) leyenda.setAttribute("data-original", leyenda.textContent);

    form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); return; }
      var v = valores(form);
      var id = v.id;
      delete v.id;
      var item = transformar ? transformar(v) : v;

      if (id) window.DATOS.actualizar(coleccion, id, item);
      else window.DATOS.crear(coleccion, item);

      limpiar(form);
      if (leyenda) leyenda.textContent = leyenda.getAttribute("data-original");
      refrescarTodo();
      window.alert("Guardado. Ya está visible en el sitio.");
    });
  }

  /* ============================ ASISTENTE IA ============================= */

  var ETIQUETAS = {
    comunicado: "Cuéntalo con tus palabras (qué pasó, a quién afecta, qué se pide)",
    resumen: "Pega aquí el texto del documento que quieres resumir",
    citacion: "Indica motivo, fecha, hora, lugar y temas de la asamblea"
  };

  /** Plantillas locales: se usan si la función de IA no está configurada. */
  function borradorLocal(tarea, entrada) {
    var nombre = window.CONFIG.nombre;
    var sector = window.CONFIG.sector;
    var hoy = window.UTIL.fechaLarga(window.UTIL.hoyISO());

    if (tarea === "resumen") {
      var frases = entrada.replace(/\s+/g, " ").split(/[.;:]\s+/);
      var puntos = frases
        .filter(function (f) { return f.length > 40; })
        .slice(0, 5)
        .map(function (f) { return f.replace(/[.;:]\s*$/, "") + "."; });
      return "RESUMEN PARA LOS VECINOS\n\n" +
        (puntos.length
          ? puntos.map(function (p, i) { return (i + 1) + ". " + p.trim(); }).join("\n")
          : entrada.trim()) +
        "\n\nEl documento completo queda disponible en la sección Documentos del sitio.";
    }

    if (tarea === "citacion") {
      return "CITACIÓN A ASAMBLEA\n" + nombre + " — " + sector + "\n" + hoy + "\n\n" +
        "Estimadas vecinas y estimados vecinos:\n\n" +
        "La directiva cita a asamblea en los siguientes términos:\n\n" +
        entrada.trim() +
        "\n\nSe solicita puntualidad y asistencia, ya que los acuerdos se toman con las personas presentes.\n\n" +
        "Atentamente,\nDirectiva " + nombre;
    }

    return "COMUNICADO\n" + nombre + " — " + sector + "\n" + hoy + "\n\n" +
      "Estimadas vecinas y estimados vecinos:\n\n" +
      "Por medio del presente comunicado, la directiva informa lo siguiente:\n\n" +
      entrada.trim() +
      "\n\nAnte cualquier duda, pueden escribirnos por el formulario de contacto del sitio o " +
      "acercarse a la sede en el horario de atención.\n\n" +
      "Atentamente,\nDirectiva " + nombre;
  }

  function iniciarIA() {
    var form = $("form-ia");
    if (!form) return;
    var salida = $("ia-salida");
    var origen = $("ia-origen");
    var boton = $("ia-enviar");

    $("ia-tarea").addEventListener("change", function () {
      $("ia-etiqueta").textContent = ETIQUETAS[this.value] || ETIQUETAS.comunicado;
    });

    form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      var tarea = $("ia-tarea").value;
      var entrada = $("ia-entrada").value.trim();
      if (!entrada) return;

      boton.disabled = true;
      boton.textContent = "Generando…";
      origen.hidden = true;
      salida.textContent = "Redactando el borrador…";

      fetch(window.CONFIG.ia.endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tarea: tarea,
          entrada: entrada,
          organizacion: window.CONFIG.nombre,
          sector: window.CONFIG.sector
        })
      })
        .then(function (r) {
          if (!r.ok) throw new Error("respuesta " + r.status);
          return r.json();
        })
        .then(function (data) {
          if (!data || !data.texto) throw new Error("sin texto");
          salida.textContent = data.texto;
          origen.textContent = "Generado con IA";
          origen.hidden = false;
        })
        .catch(function () {
          if (!window.CONFIG.ia.permitirRespaldoLocal) {
            salida.textContent = "No se pudo contactar al asistente de IA. Revisa la configuración " +
              "de la función /api/ia en Cloudflare.";
            return;
          }
          salida.textContent = borradorLocal(tarea, entrada);
          origen.textContent = "Plantilla local (IA no configurada)";
          origen.hidden = false;
        })
        .then(function () {
          boton.disabled = false;
          boton.textContent = "Generar borrador";
        });
    });

    $("ia-copiar").addEventListener("click", function () {
      var texto = salida.textContent || "";
      if (navigator.clipboard) navigator.clipboard.writeText(texto);
      else window.prompt("Copia el texto con Ctrl+C:", texto);
    });

    $("ia-a-noticia").addEventListener("click", function () {
      var texto = (salida.textContent || "").trim();
      if (!texto) return;
      var formNoticia = $("form-noticia");
      var lineas = texto.split("\n").filter(function (l) { return l.trim(); });
      limpiar(formNoticia);
      formNoticia.elements.titulo.value = lineas[0] ? lineas[0].slice(0, 90) : "";
      formNoticia.elements.fecha.value = window.UTIL.hoyISO();
      formNoticia.elements.resumen.value = lineas.slice(1, 3).join(" ").slice(0, 300);
      formNoticia.elements.cuerpo.value = texto;
      document.getElementById("tab-noticias").click();
      formNoticia.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  }

  /* ============================== REFRESCO ============================== */

  function refrescarTodo() {
    pintarLista("noticias", "lista-admin-noticias",
      function (n) { return n.titulo; },
      function (n) { return window.UTIL.fechaLarga(n.fecha) + (n.destacada ? " · destacada" : ""); },
      $("form-noticia"), "Editar noticia");

    pintarLista("actividades", "lista-admin-actividades",
      function (a) { return a.titulo; },
      function (a) {
        return window.UTIL.fechaLarga(a.fecha) + (a.hora ? " · " + a.hora + " h" : "") +
               (a.lugar ? " · " + a.lugar : "");
      },
      $("form-actividad"), "Editar actividad");

    pintarLista("documentos", "lista-admin-documentos",
      function (d) { return d.titulo; },
      function (d) { return (d.tipo || "") + " · " + d.archivo; },
      $("form-documento"), "Editar documento");
  }

  /* =============================== INICIO =============================== */

  document.addEventListener("DOMContentLoaded", function () {
    iniciarAcceso();
    iniciarPestanas();
    conectarCancelar();

    conectarFormulario("form-noticia", "noticias", function (v) {
      v.destacada = v.destacada === "si";
      return v;
    });
    conectarFormulario("form-actividad", "actividades");
    conectarFormulario("form-documento", "documentos");

    iniciarIA();

    // Fechas por defecto: hoy
    var hoy = window.UTIL.hoyISO();
    ["n-fecha", "d-fecha"].forEach(function (id) {
      var c = $(id);
      if (c && !c.value) c.value = hoy;
    });
  });
})();
