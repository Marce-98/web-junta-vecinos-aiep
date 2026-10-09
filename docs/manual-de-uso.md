# Manual de uso para la directiva

Plataforma web de comunicación vecinal · versión 1.0 · 2026

Este manual está escrito para las personas de la directiva, no para informáticos. Sirve también
como material del taller de capacitación.

---

## 1. Entrar al panel

1. Abre el sitio en el celular o el computador.
2. En el menú, toca **Panel directiva**.
3. Escribe la clave que entregó el equipo y toca **Entrar**.

> La clave la conoce solo la directiva. Si se pierde o se filtra, hay que cambiarla en el archivo
> `config.js` y volver a publicar el sitio.

Para cerrar la sesión, toca **Salir** arriba a la derecha. Si cierras el navegador, la sesión
también se cierra.

---

## 2. Publicar una noticia

1. Pestaña **Noticias**.
2. Completa:
   - **Título**: corto y claro. Ejemplo: “Corte de agua el martes 14”.
   - **Fecha de publicación**: normalmente hoy (viene puesta).
   - **¿Destacar en la portada?**: elige *Sí* solo para lo más importante del momento.
   - **Resumen**: dos o tres líneas. Es lo que el vecino lee primero.
   - **Texto completo**: opcional, para el detalle. Deja una línea en blanco entre párrafos.
3. Toca **Guardar noticia**.

Para corregir algo publicado: busca la noticia en la lista de abajo, toca **Editar**, arregla y
guarda de nuevo. **Eliminar** la saca del sitio de inmediato.

---

## 3. Agendar una actividad

1. Pestaña **Actividades**.
2. Completa nombre, fecha, hora y lugar; el detalle es opcional pero ayuda mucho
   (“traer guantes y bolsas”).
3. Toca **Guardar actividad**.

Las actividades aparecen ordenadas por fecha. Cuando la fecha pasa, la actividad no se borra: queda
más clarita, como registro de lo realizado.

---

## 4. Publicar un documento (acta, estatuto, rendición)

Esto tiene dos partes, porque el archivo PDF debe estar en el sitio:

1. Envía el PDF a la persona encargada de publicar el sitio (o súbelo tú si tienes acceso a
   Cloudflare), para que quede dentro de la carpeta `documentos/`.
2. Cuando el archivo ya esté arriba, entra al panel → pestaña **Documentos**, y registra:
   - **Título**: “Acta de asamblea — octubre 2026”.
   - **Descripción breve**: para qué sirve el documento.
   - **Ruta del archivo**: exactamente `documentos/nombre-del-archivo.pdf`.
3. Toca **Guardar documento** y revisa en la página pública que el botón **Abrir** funcione.

> Consejo: usa nombres de archivo sin tildes, sin espacios y en minúsculas
> (`acta-octubre-2026.pdf`). Evita problemas en algunos celulares.

---

## 5. Asistente de redacción con IA

Sirve para tres cosas: redactar un comunicado, resumir un documento largo y redactar una citación
a asamblea.

1. Pestaña **Asistente de redacción (IA)**.
2. Elige qué necesitas.
3. Escribe la información **con tus palabras**, sin preocuparte de la redacción formal.
   Ejemplo: *“se corta el agua el martes de 9 a 14, afecta los pasajes 3 y 4, hay que juntar agua
   la noche anterior”*.
4. Toca **Generar borrador**.
5. Lee el resultado, corrígelo y luego:
   - **Copiar texto** para pegarlo en WhatsApp o en un cartel, o
   - **Usar como borrador de noticia**, que lo lleva al formulario de noticias ya cargado.

### Tres reglas para usar la IA con responsabilidad

1. **Siempre revisar antes de publicar.** La herramienta redacta, no decide. El texto que se
   publica es responsabilidad de la directiva.
2. **No inventar datos.** Si el borrador agregó una fecha, un monto o un nombre que tú no
   escribiste, bórralo.
3. **No pegar datos personales de vecinos** (RUT, direcciones, teléfonos, información de salud) en
   el asistente.

Si abajo del borrador dice **“Plantilla local (IA no configurada)”**, el texto lo armó el propio
sitio con una plantilla: igual sirve, solo es menos flexible.

---

## 6. Preguntas frecuentes

**Publiqué algo desde el celular y no lo veo en el computador de la sede.**
En esta versión, cada publicación se guarda en el navegador donde se hizo. Para que todos los
vecinos vean lo mismo hay que conectar la base de datos (está explicado en el `README.md`, sección
5). Por eso, mientras esta versión esté en uso, conviene publicar siempre desde el mismo
dispositivo.

**Se me borró todo.**
Si el navegador borró sus datos, el sitio vuelve al contenido de ejemplo. Se puede volver a
publicar; y el botón **Restaurar contenido de ejemplo** deja el sitio como recién instalado.

**¿Cómo cambio el nombre de la junta, el teléfono o la directiva?**
Están en el archivo `config.js`. Lo edita quien publica el sitio; es un cambio de un minuto.

**¿Los vecinos pueden escribir en el sitio?**
No pueden publicar. Solo pueden usar el formulario de **Contacto**, que abre su propio correo con
el mensaje escrito para enviarlo a la directiva.

---

## 7. A quién pedir ayuda

Equipo A+S — Arquitectura de Software, Instituto Profesional AIEP:
Matías Muñoz · Christian Vidal · José Valenzuela · Marcelo Pizarro.

Canal de soporte y plazo de acompañamiento posterior a la entrega: **[completar con el correo o
teléfono del equipo y la fecha de término del acompañamiento]**.
