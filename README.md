# Plataforma web de comunicación vecinal

Sitio web para una junta de vecinos: noticias, calendario de actividades, documentos oficiales,
contacto y un panel para que la directiva publique sin depender del equipo de desarrollo.

Desarrollado como **Actividad de Aprendizaje–Servicio (A+S)** de la asignatura Arquitectura de
Software, Ingeniería de Ejecución en Informática — Instituto Profesional AIEP, 2026.
Equipo: Matías Muñoz · Christian Vidal · José Valenzuela · Marcelo Pizarro.

---

## 1. Qué incluye

| Página | Archivo | Contenido |
|---|---|---|
| Inicio | `index.html` | Últimas 3 noticias, próximas actividades y directiva vigente |
| Noticias | `noticias.html` | Listado completo con texto extendido |
| Actividades | `actividades.html` | Calendario; las actividades pasadas quedan atenuadas |
| Documentos | `documentos.html` | Estatutos, actas y rendiciones descargables |
| Contacto | `contacto.html` | Formulario que abre el correo del vecino ya redactado |
| Panel directiva | `admin.html` | Publicar/editar/eliminar contenido + asistente de redacción con IA |

Sin framework, sin proceso de compilación y sin base de datos: HTML, CSS y JavaScript planos.
Eso mantiene el sitio gratuito de operar y fácil de mantener para la organización.

## 2. Personalizar el sitio (paso obligatorio)

Todo el contenido variable está en **`config.js`**. Hay que editar ese único archivo:

```js
nombre: "Junta de Vecinos N.º __",       // nombre real de la organización
sector: "Sector __, comuna de __",
contacto: { direccionSede, telefono, correo, horarioAtencion, facebook, whatsapp },
directiva: [ { cargo, nombre }, ... ],
claveAdmin: "juntadevecinos2026"          // cambiar antes de entregar
```

## 3. Publicar en Cloudflare Pages

### Opción A — arrastrar la carpeta (la más rápida)

1. Entrar a `dash.cloudflare.com` → **Workers & Pages** → **Create** → **Pages** →
   **Upload assets**.
2. Nombre del proyecto: por ejemplo `junta-vecinos`.
3. Arrastrar **el contenido de esta carpeta** (no la carpeta comprimida) y pulsar **Deploy**.
4. Queda publicado en `https://junta-vecinos.pages.dev`.

### Opción B — desde Git (recomendada para seguir trabajando)

1. Subir esta carpeta a un repositorio de GitHub.
2. En Cloudflare Pages: **Create** → **Connect to Git** → elegir el repositorio.
3. Configuración de compilación:
   - Framework preset: **None**
   - Build command: *(vacío)*
   - Build output directory: `/`
4. Cada `git push` republica el sitio automáticamente.

### Opción C — línea de comandos

```bash
npm install -g wrangler
wrangler pages deploy . --project-name junta-vecinos
```

## 4. Activar el asistente de IA

El panel funciona sin IA (usa plantillas locales). Para conectar un modelo real:

1. En Cloudflare Pages → el proyecto → **Settings** → **Variables and Secrets**, crear:

   | Variable | Valor |
   |---|---|
   | `API_KEY` | clave de la API del proveedor (**secreto**, nunca en el repositorio) |
   | `PROVEEDOR` | `anthropic` (por defecto) u `openai` |
   | `MODELO` | identificador del modelo vigente del proveedor |

2. Volver a publicar el sitio. La función `functions/api/ia.js` se despliega sola y queda
   disponible en `/api/ia`.
3. Verificación rápida:

```bash
curl -X POST https://TU-SITIO.pages.dev/api/ia \
  -H "Content-Type: application/json" \
  -d '{"tarea":"comunicado","entrada":"Se corta el agua el martes de 9 a 14 h en el pasaje 3"}'
```

Si responde `501`, falta `API_KEY`. Mientras no esté configurada, el panel avisa que el borrador
salió de una plantilla local en lugar de un modelo de IA.

## 5. Cómo trabaja el sitio por dentro

```
navegador (HTML/CSS/JS)
    ├── config.js            datos de la organización
    ├── assets/js/datos.js   lectura/escritura del contenido (localStorage)
    ├── assets/js/paginas.js dibuja las páginas públicas
    └── assets/js/admin.js   panel de la directiva
             │
             └── POST /api/ia  →  functions/api/ia.js (Cloudflare)  →  modelo de lenguaje
```

Las publicaciones que hace la directiva se guardan en el **almacenamiento local del navegador**
(`localStorage`). Esto significa:

- El contenido de ejemplo se ve igual para todos los visitantes.
- Lo que la directiva publica **se ve solo en el dispositivo donde lo publicó**.

Es suficiente para demostrar y capacitar, pero **no** para operación real. Para que las
publicaciones lleguen a todos los vecinos hay dos caminos, ambos gratuitos en su plan inicial:

1. **Cloudflare D1 + Pages Functions** — base de datos SQL; se agregan funciones
   `functions/api/noticias.js` (GET/POST) y `datos.js` pasa a llamarlas en vez de `localStorage`.
   Es el cambio mínimo, porque toda la lectura/escritura ya está aislada en un solo archivo.
2. **Cloudflare KV** — más simple, guarda el JSON completo de cada colección.

Lo mismo aplica al acceso del panel: `claveAdmin` se valida en el navegador, así que sirve para la
demostración pero cualquiera puede leerla en el código. La versión productiva debe autenticar en el
servidor (Cloudflare Access sobre `/admin.html`, o una función que emita un token de sesión).

Estas dos limitaciones están documentadas a propósito: son las decisiones de arquitectura que el
equipo debe poder justificar en la defensa del proyecto.

## 6. Documentos oficiales

Los PDF viven en la carpeta `documentos/`. Los cuatro archivos incluidos son **de ejemplo** y hay
que reemplazarlos por los reales. Para agregar uno nuevo:

1. Copiar el PDF dentro de `documentos/`.
2. Volver a publicar el sitio (arrastrar la carpeta otra vez o `git push`).
3. En el panel → pestaña **Documentos**, registrarlo indicando la ruta exacta,
   por ejemplo `documentos/acta-octubre-2026.pdf`.

## 7. Accesibilidad

Decisiones tomadas pensando en dirigentes y vecinos de edad avanzada:

- Texto base de 17 px y títulos escalables; contraste sobre AA en todo el texto.
- Botones y campos con área de toque amplia (≥ 44 px).
- Navegación operable con teclado, enlace “Saltar al contenido” y foco siempre visible.
- Menú de una sola columna en el celular, sin menús desplegables anidados.
- Marcas semánticas (`header`, `main`, `nav`, `article`) para lectores de pantalla.

## 8. Probar en el computador

```bash
python3 -m http.server 8080
# abrir http://localhost:8080
```

La función `/api/ia` no corre con ese servidor; para probarla localmente:

```bash
npx wrangler pages dev .
```

## 9. Estructura de archivos

```
.
├── index.html  noticias.html  actividades.html  documentos.html  contacto.html
├── admin.html  404.html
├── config.js                  ← único archivo a editar para personalizar
├── _headers                   ← cabeceras de seguridad (Cloudflare)
├── assets/
│   ├── css/estilos.css
│   └── js/{plantilla,datos,paginas,admin}.js
├── documentos/*.pdf           ← documentos oficiales (ejemplos reemplazables)
├── docs/manual-de-uso.md      ← manual para la directiva
└── functions/api/ia.js        ← función de IA (se despliega sola en Pages)
```
