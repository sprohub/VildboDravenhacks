import fs from "fs";
import path from "path";

const DB_PATH = path.resolve("./data/grupos.json");

// ── Helpers JSON ──────────────────────────────────────────────────────────────
function loadDB() {
  if (!fs.existsSync(DB_PATH)) {
    fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
    fs.writeFileSync(DB_PATH, JSON.stringify({ grupos: {} }, null, 2));
  }
  try {
    return JSON.parse(fs.readFileSync(DB_PATH, "utf8"));
  } catch {
    return { grupos: {} };
  }
}

function saveDB(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

// ── Exportada para index.js ───────────────────────────────────────────────────
export function isBotActive(groupId) {
  const db = loadDB();
  return db.grupos?.[groupId]?.activo !== false;
}

// ── Comando ───────────────────────────────────────────────────────────────────
export default {
  name: "apagar",
  aliases: ["encender", "boton"],
  superOwnerOnly: true,
  description: "Apaga o enciende el bot en el grupo actual",

  async run(sock, msg, args, chatId) {
    const send = (text) =>
      sock.sendMessage(chatId, { text }, { quoted: msg });

    if (!chatId.endsWith("@g.us")) {
      return send("⚠️ Este comando solo funciona en grupos.");
    }

    const db = loadDB();
    if (!db.grupos) db.grupos = {};

    const estadoActual = db.grupos?.[chatId]?.activo !== false;

    // Leer el comando directamente del texto (soporta conversation y extendedText)
    const bodyRaw =
      msg?.message?.conversation ||
      msg?.message?.extendedTextMessage?.text ||
      "";
    const cmd = bodyRaw.trim().split(/\s+/)[0]?.replace(/^\./, "").toLowerCase();

    let nuevoEstado;
    if (cmd === "encender") {
      nuevoEstado = true;
    } else if (cmd === "apagar") {
      nuevoEstado = false;
    } else {
      // .boton → alterna
      nuevoEstado = !estadoActual;
    }

    // Si ya está en ese estado, avisar sin guardar
    if (nuevoEstado === estadoActual) {
      return send(
        nuevoEstado
          ? "ℹ️ El bot ya está *encendido* en este grupo."
          : "ℹ️ El bot ya está *apagado* en este grupo."
      );
    }

    db.grupos[chatId] = {
      ...(db.grupos[chatId] || {}),
      activo: nuevoEstado,
      updatedAt: new Date().toISOString(),
    };
    saveDB(db);

    if (nuevoEstado) {
      await send(
        "✅ *Bot ENCENDIDO en este grupo*\n\n" +
        "Ya puedo recibir comandos aquí."
      );
    } else {
      await send(
        "🔴 *Bot APAGADO en este grupo*\n\n" +
        "No responderé comandos aquí hasta que uses `.encender`.\n" +
        "_Solo el superOwner puede volver a activarlo._"
      );
    }
  },
};