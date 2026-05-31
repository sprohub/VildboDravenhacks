import { loadJSON, saveJSON } from "../../utils/database.js";

const FILE = "./data/antispam.json";

export default {
  name: "antispam",
  aliases: ["spam"],
  ownerOnly: true,

  async run(sock, msg, args, chatId) {

    if (!chatId.endsWith("@g.us")) {
      return sock.sendMessage(chatId, {
        text: "❌ Solo funciona en grupos."
      }, { quoted: msg });
    }

    const option = args[0]?.toLowerCase();

    if (!["on", "off"].includes(option)) {
      return sock.sendMessage(chatId, {
        text:
          "❌ Uso:\n\n" +
          ".antispam on\n" +
          ".antispam off"
      }, { quoted: msg });
    }

    const data = loadJSON(FILE);

    data[chatId] = option === "on";

    saveJSON(FILE, data);

    await sock.sendMessage(chatId, {
      text:
        option === "on"
          ? "✅ AntiSpam activado."
          : "❌ AntiSpam desactivado."
    }, { quoted: msg });
  }
};