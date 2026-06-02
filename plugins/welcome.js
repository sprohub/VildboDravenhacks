// plugins/welcome.js

import fs from "fs";
import path from "path";

// ── Imágenes aleatorias (carpeta opcional) ─────────────────────────────────
const imgDir = path.resolve("./src/img");
let images = [];

try {
  images = fs
    .readdirSync(imgDir)
    .filter((f) => /\.(jpe?g|png|webp)$/i.test(f));
} catch {
  images = [];
}

function getRandomImage() {
  if (images.length === 0) return null;
  const file = images[Math.floor(Math.random() * images.length)];
  try {
    return fs.readFileSync(path.join(imgDir, file));
  } catch {
    return null;
  }
}

// ── Audio URLs ─────────────────────────────────────────────────────────────
const AUDIO_WELCOME = "https://files.catbox.moe/ha1slk.mp3";
const AUDIO_GOODBYE = "https://files.catbox.moe/5cslwo.mp3";

// ── Estado on/off ──────────────────────────────────────────────────────────
let active = true;

export function toggleWelcome(state) {
  active = state;
  console.log(`[welcome] ${active ? "✅ Activado" : "❌ Desactivado"}`);
}

export function isWelcomeActive() {
  return active;
}

// ── Registro del listener ──────────────────────────────────────────────────
export function registerWelcome(sock) {
  sock.ev.on("group-participants.update", async (event) => {
    if (!active) return;

    const { id: chatId, participants, action } = event;

    // Solo nos interesan entradas y salidas
    if (!["add", "remove", "leave"].includes(action)) return;

    const thumbnail = getRandomImage();

    for (const participantJid of participants) {
      try {
        const numeroLimpio = participantJid.split("@")[0];

        if (action === "add") {
          // ── BIENVENIDA ───────────────────────────────────────────────────
          await sock.sendMessage(chatId, {
            audio: { url: AUDIO_WELCOME },
            mimetype: "audio/mpeg",
            ptt: true,
            contextInfo: {
              mentionedJid: [participantJid],
              externalAdReply: {
                title: "─ W E L C O M E ─ 🥷🏻",
                body: `+${numeroLimpio} ha llegado al grupo!`,
                ...(thumbnail ? { thumbnail } : {}),
                mediaType: 1,
                renderLargerThumbnail: false,
                sourceUrl: `https://wa.me/${numeroLimpio}`,
              },
            },
          });

          console.log(`[welcome] ✅ Bienvenida enviada a +${numeroLimpio} en ${chatId}`);
        }

        if (action === "remove" || action === "leave") {
          // ── DESPEDIDA ────────────────────────────────────────────────────
          await sock.sendMessage(chatId, {
            audio: { url: AUDIO_GOODBYE },
            mimetype: "audio/mpeg",
            ptt: true,
            contextInfo: {
              mentionedJid: [participantJid],
              externalAdReply: {
                title: "─ A D I Ó S ─ 👋🏻",
                body: `+${numeroLimpio} se ha despedido.`,
                ...(thumbnail ? { thumbnail } : {}),
                mediaType: 1,
                renderLargerThumbnail: false,
                sourceUrl: `https://wa.me/${numeroLimpio}`,
              },
            },
          });

          console.log(`[welcome] 👋 Despedida enviada a +${numeroLimpio} en ${chatId}`);
        }
      } catch (err) {
        console.error(`[welcome] ❌ Error con ${participantJid}:`, err);
      }
    }
  });

  console.log("[welcome] ✅ Listener registrado");
}
