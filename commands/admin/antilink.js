import { loadJSON, saveJSON } from "../../utils/database.js";

const FILE = "./data/antilink.json";

export default {
  name: "antilink",
  aliases: ["alink"],
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
          "❌ Uso incorrecto.\n\n" +
          ".antilink on\n" +
          ".antilink off"
      }, { quoted: msg });
    }

    const data = loadJSON(FILE);

    data[chatId] = option === "on";

    saveJSON(FILE, data);

    await sock.sendMessage(chatId, {
      text:
        option === "on"
          ? "✅ AntiLink activado."
          : "❌ AntiLink desactivado."
    }, { quoted: msg });
  }
};