/* =========================================================================
   datos.js — contenido inicial + capa de almacenamiento.
   -------------------------------------------------------------------------
   El sitio guarda lo que publica la directiva en localStorage del navegador,
   de modo que funciona sin servidor (ideal para Cloudflare Pages).
   Si en el futuro se agrega un backend, solo hay que cambiar las funciones
   de este archivo: el resto del sitio no se entera.
   ========================================================================= */

(function () {
  "use strict";

  var CLAVES = {
    noticias: "jv_noticias",
    actividades: "jv_actividades",
    documentos: "jv_documentos",
    mensajes: "jv_mensajes"
  };

  /* --------------------------- contenido de ejemplo ---------------------- */
  var SEMILLA = {
    noticias: [
      {
        id: "n1",
        titulo: "Asamblea general ordinaria de octubre",
        fecha: "2026-09-28",
        resumen: "Se cita a todas y todos los vecinos a la asamblea general donde se presentará la rendición de cuentas del año y se votará el proyecto de mejoramiento de luminarias.",
        cuerpo: "La directiva convoca a la asamblea general ordinaria a realizarse en la sede vecinal.\n\nTemas de la citación:\n1. Lectura del acta anterior.\n2. Rendición de cuentas del período.\n3. Presentación del proyecto de mejoramiento de luminarias.\n4. Votación del proyecto y elección de la comisión de seguimiento.\n\nSe solicita puntualidad. Quienes no puedan asistir podrán revisar el acta publicada en la sección Documentos de este sitio.",
        destacada: true
      },
      {
        id: "n2",
        titulo: "Operativo de salud y vacunación en la sede vecinal",
        fecha: "2026-09-22",
        resumen: "En conjunto con el CESFAM del sector se realizará un operativo de control de presión, glicemia y vacunación contra la influenza.",
        cuerpo: "El operativo se realizará en la sede vecinal en horario continuado.\n\nNo requiere inscripción previa: basta con presentarse con la cédula de identidad. Se atenderá por orden de llegada, con prioridad para personas mayores y personas con movilidad reducida.",
        destacada: false
      },
      {
        id: "n3",
        titulo: "Resultados del fondo concursable de seguridad vecinal",
        fecha: "2026-09-15",
        resumen: "El proyecto postulado por la junta de vecinos fue aprobado. Aquí publicamos en qué se invertirán los recursos y los plazos comprometidos.",
        cuerpo: "El proyecto postulado al fondo concursable municipal fue aprobado.\n\nLos recursos se destinarán a:\n- Instalación de luminarias en el pasaje principal.\n- Reposición de señalética de tránsito.\n- Materiales para el taller de prevención comunitaria.\n\nLa rendición del uso de los recursos quedará disponible en la sección Documentos una vez cerrado el proyecto.",
        destacada: false
      },
      {
        id: "n4",
        titulo: "Nuevo horario de retiro de residuos voluminosos",
        fecha: "2026-09-08",
        resumen: "La municipalidad informó el cambio de día para el retiro de escombros y muebles en nuestro sector.",
        cuerpo: "El retiro de residuos voluminosos (muebles, escombros, ramas) cambia de día en nuestro sector.\n\nSe pide dejar el material en la vereda solo la noche anterior, para evitar microbasurales. Los casos de acopio irregular se pueden informar a la directiva a través del formulario de la sección Contacto.",
        destacada: false
      }
    ],
    actividades: [
      {
        id: "a1",
        titulo: "Asamblea general ordinaria",
        fecha: "2026-10-08",
        hora: "19:00",
        lugar: "Sede vecinal",
        detalle: "Rendición de cuentas y votación del proyecto de luminarias."
      },
      {
        id: "a2",
        titulo: "Taller de capacitación: uso de la plataforma web",
        fecha: "2026-10-15",
        hora: "18:30",
        lugar: "Sede vecinal",
        detalle: "Dirigido a la directiva. Publicación de noticias, carga de documentos y uso del asistente de redacción."
      },
      {
        id: "a3",
        titulo: "Operativo de salud y vacunación",
        fecha: "2026-10-22",
        hora: "10:00",
        lugar: "Sede vecinal",
        detalle: "Control de presión y glicemia, vacunación contra la influenza."
      },
      {
        id: "a4",
        titulo: "Jornada de limpieza comunitaria",
        fecha: "2026-11-07",
        hora: "09:30",
        lugar: "Plaza del sector",
        detalle: "Se solicita traer guantes y bolsas. La municipalidad aporta el retiro del material."
      }
    ],
    documentos: [
      {
        id: "d1",
        titulo: "Estatutos de la junta de vecinos",
        descripcion: "Documento constitutivo vigente de la organización.",
        archivo: "documentos/estatutos.pdf",
        tipo: "PDF",
        fecha: "2026-09-01"
      },
      {
        id: "d2",
        titulo: "Acta de asamblea — septiembre 2026",
        descripcion: "Acuerdos tomados en la asamblea del mes de septiembre.",
        archivo: "documentos/acta-septiembre-2026.pdf",
        tipo: "PDF",
        fecha: "2026-09-12"
      },
      {
        id: "d3",
        titulo: "Rendición de cuentas 2026",
        descripcion: "Detalle de ingresos y egresos del período.",
        archivo: "documentos/rendicion-2026.pdf",
        tipo: "PDF",
        fecha: "2026-09-20"
      },
      {
        id: "d4",
        titulo: "Reglamento de uso de la sede",
        descripcion: "Condiciones para solicitar y usar la sede vecinal.",
        archivo: "documentos/reglamento-sede.pdf",
        tipo: "PDF",
        fecha: "2026-09-05"
      }
    ]
  };

  /* --------------------------- acceso a los datos ------------------------ */

  function leer(coleccion) {
    try {
      var guardado = window.localStorage.getItem(CLAVES[coleccion]);
      if (guardado) return JSON.parse(guardado);
    } catch (e) {
      // Navegador sin almacenamiento (modo privado): se usa el contenido inicial.
    }
    return (SEMILLA[coleccion] || []).slice();
  }

  function guardar(coleccion, lista) {
    try {
      window.localStorage.setItem(CLAVES[coleccion], JSON.stringify(lista));
      return true;
    } catch (e) {
      return false;
    }
  }

  function nuevoId() {
    return "x" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  }

  window.DATOS = {
    /** Lista ordenada: noticias y documentos de más nuevo a más antiguo;
     *  actividades en orden cronológico ascendente. */
    listar: function (coleccion) {
      var lista = leer(coleccion);
      lista.sort(function (a, b) {
        if (coleccion === "actividades") return String(a.fecha).localeCompare(String(b.fecha));
        return String(b.fecha).localeCompare(String(a.fecha));
      });
      return lista;
    },
    obtener: function (coleccion, id) {
      return leer(coleccion).filter(function (x) { return x.id === id; })[0] || null;
    },
    crear: function (coleccion, item) {
      var lista = leer(coleccion);
      item.id = nuevoId();
      lista.push(item);
      guardar(coleccion, lista);
      return item;
    },
    actualizar: function (coleccion, id, cambios) {
      var lista = leer(coleccion).map(function (x) {
        return x.id === id ? Object.assign({}, x, cambios) : x;
      });
      guardar(coleccion, lista);
    },
    eliminar: function (coleccion, id) {
      guardar(coleccion, leer(coleccion).filter(function (x) { return x.id !== id; }));
    },
    /** Devuelve el sitio al contenido de ejemplo (útil para demostraciones). */
    restaurarEjemplo: function () {
      Object.keys(CLAVES).forEach(function (k) {
        try { window.localStorage.removeItem(CLAVES[k]); } catch (e) {}
      });
    }
  };
})();
