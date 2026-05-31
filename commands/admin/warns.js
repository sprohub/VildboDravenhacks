import { loadJSON } from "../../utils/database.js";

const FILE = "./data/warns.json";

export default {
  name: "warns",
  aliases: ["verwarns"],
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

    const total =
      warns?.[chatId]?.[target] || 0;

    await sock.sendMessage(chatId, {
      text:
        `📊 Advertencias de @${target.split("@")[0]}\n\n` +
        `⚠️ Total: ${total}/3`,
      mentions: [target]
    }, { quoted: msg });
  }
};