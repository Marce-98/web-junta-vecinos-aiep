/* =========================================================================
   functions/api/ia.js
   -------------------------------------------------------------------------
   Función de Cloudflare Pages (se publica sola al subir el sitio) que recibe
   la petición del panel y consulta un modelo de lenguaje.
   La clave de la API NUNCA viaja al navegador: vive como variable de entorno
   del proyecto en Cloudflare.

   Variables de entorno a crear en Cloudflare Pages → Settings → Environment
   variables:
     API_KEY   (obligatoria)  clave de la API del proveedor de IA
     MODELO    (opcional)     identificador del modelo a usar
     PROVEEDOR (opcional)     "anthropic" (por defecto) u "openai"

   Si no hay API_KEY configurada, responde 501 y el panel usa sus plantillas
   locales, de modo que la demostración funciona igual.
   ========================================================================= */

const INSTRUCCIONES = {
  comunicado:
    "Redacta un comunicado formal breve (máximo 250 palabras) de una junta de vecinos chilena " +
    "dirigido a los vecinos del sector. Usa lenguaje claro, respetuoso y sin tecnicismos. " +
    "Estructura: encabezado con el nombre de la organización y la fecha, saludo, información, " +
    "qué se pide a los vecinos y despedida de la directiva.",
  resumen:
    "Resume el siguiente documento para vecinos sin formación técnica, en máximo 200 palabras. " +
    "Entrega primero una frase con la idea central y luego entre 3 y 5 puntos concretos. " +
    "No inventes datos que no estén en el texto.",
  citacion:
    "Redacta una citación formal a asamblea de una junta de vecinos chilena. Debe indicar con " +
    "claridad fecha, hora, lugar y tabla de temas, y recordar que los acuerdos se toman con los " +
    "asistentes presentes. Máximo 200 palabras."
};

function json(datos, estado = 200) {
  return new Response(JSON.stringify(datos), {
    status: estado,
    headers: { "Content-Type": "application/json; charset=utf-8" }
  });
}

export async function onRequestPost({ request, env }) {
  let cuerpo;
  try {
    cuerpo = await request.json();
  } catch (e) {
    return json({ error: "Cuerpo de la petición inválido." }, 400);
  }

  const tarea = INSTRUCCIONES[cuerpo.tarea] ? cuerpo.tarea : "comunicado";
  const entrada = String(cuerpo.entrada || "").slice(0, 8000);
  if (!entrada.trim()) return json({ error: "Falta el texto de entrada." }, 400);

  if (!env.API_KEY) {
    return json({
      error: "El asistente de IA no está configurado en el servidor.",
      ayuda: "Cree la variable de entorno API_KEY en Cloudflare Pages."
    }, 501);
  }

  const contexto =
    `Organización: ${cuerpo.organizacion || "Junta de vecinos"}. ` +
    `Sector: ${cuerpo.sector || "sector no indicado"}. ` +
    `Fecha de hoy: ${new Date().toISOString().slice(0, 10)}.`;

  const instruccion = `${INSTRUCCIONES[tarea]}\n\n${contexto}\n\nTexto del usuario:\n${entrada}`;

  try {
    const proveedor = (env.PROVEEDOR || "anthropic").toLowerCase();
    const texto = proveedor === "openai"
      ? await pedirOpenAI(env, instruccion)
      : await pedirAnthropic(env, instruccion);

    return json({ texto, tarea, proveedor });
  } catch (e) {
    return json({ error: "El proveedor de IA no respondió correctamente.", detalle: String(e) }, 502);
  }
}

/* --------------------------- proveedores ---------------------------------- */

async function pedirAnthropic(env, instruccion) {
  const r = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": env.API_KEY,
      "anthropic-version": "2023-06-01"
    },
    body: JSON.stringify({
      model: env.MODELO || "claude-sonnet-4-5",
      max_tokens: 900,
      messages: [{ role: "user", content: instruccion }]
    })
  });
  if (!r.ok) throw new Error(`Anthropic ${r.status}: ${await r.text()}`);
  const d = await r.json();
  return (d.content || []).map((b) => b.text || "").join("").trim();
}

async function pedirOpenAI(env, instruccion) {
  const r = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${env.API_KEY}`
    },
    body: JSON.stringify({
      model: env.MODELO || "gpt-4o-mini",
      max_tokens: 900,
      messages: [{ role: "user", content: instruccion }]
    })
  });
  if (!r.ok) throw new Error(`OpenAI ${r.status}: ${await r.text()}`);
  const d = await r.json();
  return (d.choices?.[0]?.message?.content || "").trim();
}

/* Cualquier otro método devuelve 405. */
export const onRequest = async (ctx) =>
  ctx.request.method === "POST"
    ? onRequestPost(ctx)
    : json({ error: "Use POST." }, 405);
