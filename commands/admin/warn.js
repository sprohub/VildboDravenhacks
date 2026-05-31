import { loadJSON, saveJSON } from "../../utils/database.js";

const FILE = "./data/warns.json";

export default {
  name: "warn",
  aliases: ["advertir"],
  ownerOnly: true,
  cooldown: 3000,

  async run(sock, msg, args, chatId) {

    if (!chatId.endsWith("@g.us")) {
      return sock.sendMessage(chatId, {
        text: "❌ Solo funciona en grupos."
      }, { quoted: msg });
    }

    const mentioned =
      msg?.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];

    const quoted =
      msg?.message?.extendedTextMessage?.contextInfo?.participant;

    const target = mentioned || quoted;

    if (!target) {
      return sock.sendMessage(chatId, {
        text: "❌ Menciona o responde a un usuario."
      }, { quoted: msg });
    }

    const warns = loadJSON(FILE);

    warns[chatId] ??= {};
    warns[chatId][target] ??= 0;

    warns[chatId][target]++;

    saveJSON(FILE, warns);

    const total = warns[chatId][target];

    await sock.sendMessage(chatId, {
      text:
        `⚠️ Advertencia para @${target.split("@")[0]}\n\n` +
        `📊 Total: ${total}/3`,
      mentions: [target]
    }, { quoted: msg });

    if (total >= 3) {
      try {
        await sock.groupParticipantsUpdate(
          chatId,
          [target],
          "remove"
        );

        delete warns[chatId][target];
        saveJSON(FILE, warns);

        await sock.sendMessage(chatId, {
          text: "🚫 Usuario expulsado por acumular 3 advertencias."
        });

      } catch {}
    }
  }
};