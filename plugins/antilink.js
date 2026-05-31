import { loadJSON, saveJSON } from "../utils/database.js";

const CONFIG_FILE = "./data/antilink.json";
const WARN_FILE = "./data/warns.json";

const LINK_REGEX =
  /(https?:\/\/|www\.|chat\.whatsapp\.com\/|wa\.me\/)/i;

export function registerAntiLink(sock) {

  sock.ev.on("messages.upsert", async ({ messages }) => {

    const msg = messages?.[0];

    if (!msg?.message) return;
    if (msg.key.fromMe) return;

    const chatId = msg.key.remoteJid;

    if (!chatId.endsWith("@g.us")) return;

    const config = loadJSON(CONFIG_FILE);

    if (!config[chatId]) return;

    const body =
      msg?.message?.conversation ||
      msg?.message?.extendedTextMessage?.text ||
      msg?.message?.imageMessage?.caption ||
      msg?.message?.videoMessage?.caption ||
      "";

    if (!LINK_REGEX.test(body)) return;

    const sender =
      msg.key.participant ||
      msg.key.remoteJid;

    const warns = loadJSON(WARN_FILE);

    warns[chatId] ??= {};
    warns[chatId][sender] ??= 0;

    warns[chatId][sender]++;

    const total = warns[chatId][sender];

    saveJSON(WARN_FILE, warns);

    await sock.sendMessage(chatId, {
      text:
        `🔗 Link detectado.\n\n` +
        `⚠️ @${sender.split("@")[0]}\n` +
        `Advertencia: ${total}/3`,
      mentions: [sender]
    });

    try {
      await sock.sendMessage(chatId, {
        delete: msg.key
      });
    } catch {}

    if (total >= 3) {

      try {

        await sock.groupParticipantsUpdate(
          chatId,
          [sender],
          "remove"
        );

        delete warns[chatId][sender];

        saveJSON(WARN_FILE, warns);

        await sock.sendMessage(chatId, {
          text:
            `🚫 @${sender.split("@")[0]} expulsado por enviar enlaces.`,
          mentions: [sender]
        });

      } catch {}
    }

  });

}