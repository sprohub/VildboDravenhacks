// Sesiones activas: chatId -> { pregunta, respuesta, opciones, timeout }
const sesiones = new Map();

const preguntas = [
  {
    pregunta: "¿Cuál es el planeta más grande del sistema solar?",
    opciones: ["Saturno", "Júpiter", "Neptuno", "Urano"],
    respuesta: "Júpiter",
    emoji: "🪐"
  },
  {
    pregunta: "¿En qué año llegó el hombre a la Luna por primera vez?",
    opciones: ["1965", "1967", "1969", "1971"],
    respuesta: "1969",
    emoji: "🌙"
  },
  {
    pregunta: "¿Cuál es el río más largo del mundo?",
    opciones: ["Amazonas", "Nilo", "Yangtsé", "Misisipi"],
    respuesta: "Nilo",
    emoji: "🌊"
  },
  {
    pregunta: "¿Cuántos huesos tiene el cuerpo humano adulto?",
    opciones: ["196", "206", "216", "226"],
    respuesta: "206",
    emoji: "🦴"
  },
  {
    pregunta: "¿Cuál es el país más grande del mundo por superficie?",
    opciones: ["China", "Canadá", "Estados Unidos", "Rusia"],
    respuesta: "Rusia",
    emoji: "🗺️"
  },
  {
    pregunta: "¿A qué velocidad viaja la luz en el vacío?",
    opciones: ["200,000 km/s", "300,000 km/s", "400,000 km/s", "150,000 km/s"],
    respuesta: "300,000 km/s",
    emoji: "💡"
  },
  {
    pregunta: "¿Cuál es el elemento químico con símbolo 'Au'?",
    opciones: ["Plata", "Aluminio", "Oro", "Arsénico"],
    respuesta: "Oro",
    emoji: "⚗️"
  },
  {
    pregunta: "¿Quién escribió 'Cien años de soledad'?",
    opciones: ["Mario Vargas Llosa", "Pablo Neruda", "Jorge Luis Borges", "Gabriel García Márquez"],
    respuesta: "Gabriel García Márquez",
    emoji: "📚"
  },
  {
    pregunta: "¿Cuántos continentes hay en el mundo?",
    opciones: ["5", "6", "7", "8"],
    respuesta: "7",
    emoji: "🌍"
  },
  {
    pregunta: "¿Cuál es el animal terrestre más rápido?",
    opciones: ["León", "Guepardo", "Antílope", "Caballo"],
    respuesta: "Guepardo",
    emoji: "🐆"
  },
  {
    pregunta: "¿Qué gas es el más abundante en la atmósfera terrestre?",
    opciones: ["Oxígeno", "Dióxido de carbono", "Nitrógeno", "Hidrógeno"],
    respuesta: "Nitrógeno",
    emoji: "🌬️"
  },
  {
    pregunta: "¿En qué país se originó el sushi?",
    opciones: ["China", "Corea", "Japón", "Tailandia"],
    respuesta: "Japón",
    emoji: "🍣"
  },
  {
    pregunta: "¿Cuántos lados tiene un hexágono?",
    opciones: ["5", "6", "7", "8"],
    respuesta: "6",
    emoji: "🔷"
  },
  {
    pregunta: "¿Cuál es la capital de Australia?",
    opciones: ["Sídney", "Melbourne", "Brisbane", "Canberra"],
    respuesta: "Canberra",
    emoji: "🦘"
  },
  {
    pregunta: "¿Qué instrumento usa un médico para escuchar el corazón?",
    opciones: ["Termómetro", "Estetoscopio", "Esfigmomanómetro", "Otoscopio"],
    respuesta: "Estetoscopio",
    emoji: "🩺"
  },
];

function obtenerPreguntaAleatoria() {
  return preguntas[Math.floor(Math.random() * preguntas.length)];
}

function normalizarRespuesta(texto) {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

export default {
  name: "trivia",
  aliases: ["quiz", "pregunta"],
  cooldown: 3000,

  async run(sock, msg, args, chatId) {
    const subcomando = args[0]?.toLowerCase();

    // ── Cancelar partida activa ───────────────────────────────────────────────
    if (subcomando === "cancelar" || subcomando === "stop") {
      if (!sesiones.has(chatId)) {
        return sock.sendMessage(chatId, {
          text: "❌ No hay ninguna trivia activa en este chat."
        }, { quoted: msg });
      }

      clearTimeout(sesiones.get(chatId).timeout);
      sesiones.delete(chatId);

      return sock.sendMessage(chatId, {
        text: "🛑 *Trivia cancelada.*"
      }, { quoted: msg });
    }

    // ── Responder una pregunta activa ─────────────────────────────────────────
    if (sesiones.has(chatId) && args.length > 0 && !subcomando === "cancelar") {
      const sesion  = sesiones.get(chatId);
      const intento = normalizarRespuesta(args.join(" "));
      const correcta = normalizarRespuesta(sesion.respuesta);

      // Verificar si es una de las opciones
      const opcionValida = sesion.opciones.some(
        o => normalizarRespuesta(o) === intento
      );

      if (!opcionValida) {
        return sock.sendMessage(chatId, {
          text: `⚠️ Esa no es una opción válida. Elige entre:\n${sesion.opciones.map((o, i) => `  ${i + 1}. ${o}`).join("\n")}`
        }, { quoted: msg });
      }

      if (intento === correcta) {
        clearTimeout(sesion.timeout);
        sesiones.delete(chatId);

        const sender = msg?.key?.participant || msg?.key?.remoteJid;
        const nombre = msg?.pushName || sender?.split("@")[0] || "Alguien";

        return sock.sendMessage(chatId, {
          text: [
            `✅ *¡Correcto, ${nombre}!* 🎉`,
            "",
            `${sesion.emoji} La respuesta era: *${sesion.respuesta}*`,
            "",
            "💡 Escribe *.trivia* para otra pregunta."
          ].join("\n"),
          mentions: sender ? [sender] : []
        }, { quoted: msg });
      } else {
        return sock.sendMessage(chatId, {
          text: [
            `❌ *Incorrecto.*`,
            `Intenta de nuevo o escribe *.trivia cancelar* para rendirte.`
          ].join("\n")
        }, { quoted: msg });
      }
    }

    // ── Nueva pregunta ────────────────────────────────────────────────────────
    if (sesiones.has(chatId)) {
      return sock.sendMessage(chatId, {
        text: [
          "⚠️ Ya hay una trivia activa.",
          "",
          `${sesiones.get(chatId).emoji} *${sesiones.get(chatId).pregunta}*`,
          "",
          sesiones.get(chatId).opciones.map((o, i) => `  ${i + 1}. ${o}`).join("\n"),
          "",
          "📝 Responde con el texto de la opción o escribe *.trivia cancelar*."
        ].join("\n")
      }, { quoted: msg });
    }

    const datos = obtenerPreguntaAleatoria();
    const TIEMPO_LIMITE = 30_000; // 30 segundos

    // Timeout automático si nadie responde
    const timeout = setTimeout(async () => {
      if (sesiones.has(chatId)) {
        sesiones.delete(chatId);
        await sock.sendMessage(chatId, {
          text: [
            "⏰ *¡Tiempo agotado!*",
            "",
            `${datos.emoji} La respuesta correcta era: *${datos.respuesta}*`,
            "",
            "💡 Escribe *.trivia* para intentarlo de nuevo."
          ].join("\n")
        });
      }
    }, TIEMPO_LIMITE);

    sesiones.set(chatId, {
      pregunta: datos.pregunta,
      respuesta: datos.respuesta,
      opciones: datos.opciones,
      emoji: datos.emoji,
      timeout,
    });

    await sock.sendMessage(chatId, {
      text: [
        "🎯 *¡Nueva pregunta de Trivia!*",
        "",
        `${datos.emoji} ${datos.pregunta}`,
        "",
        datos.opciones.map((o, i) => `  *${i + 1}.* ${o}`).join("\n"),
        "",
        `⏱️ Tienes *30 segundos* para responder.`,
        "📝 Escribe el texto de la opción correcta."
      ].join("\n")
    }, { quoted: msg });
  }
};
