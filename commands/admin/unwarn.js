import { loadJSON, saveJSON } from "../../utils/database.js";

const FILE = "./data/warns.json";

export default {
  name: "unwarn",
  aliases: ["delwarn"],
  ownerOnly: true,

  async run(sock, msg, args, chatId) {

    const mentioned =
      msg?.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];

    const quoted =
      msg?.message?.extendedTextMessage?.contextInfo?.participant;

    const target = mentioned || quoted;

    if (!target) {
      return sock.sendMessage(chatId, {
        text: "❌ Menciona un usuario."
      }, { quoted: msg });
    }

    const warns = loadJSON(FILE);

    warns[chatId] ??= {};
    warns[chatId][target] ??= 0;

    if (warns[chatId][target] > 0) {
      warns[chatId][target]--;
    }

    saveJSON(FILE, warns);

    await sock.sendMessage(chatId, {
      text:
        `✅ Advertencia eliminada.\n` +
        `📊 Total actual: ${warns[chatId][target]}`,
      mentions: [target]
    }, { quoted: msg });
  }
};