export default {
  name: "hidetag",
  aliases: ["notify"],
  ownerOnly: true,
  cooldown: 5000,

  async run(sock, msg, args, chatId) {
    if (!chatId.endsWith("@g.us")) {
      return sock.sendMessage(chatId, {
        text: "❌ Este comando solo funciona en grupos."
      }, { quoted: msg });
    }

    try {
      const metadata = await sock.groupMetadata(chatId);

      const mentions = metadata.participants.map(p => p.id);

      const texto = args.length
        ? args.join(" ")
        : "📢 Mensaje para todos.";

      await sock.sendMessage(chatId, {
        text: texto,
        mentions
      }, { quoted: msg });

    } catch (e) {
      await sock.sendMessage(chatId, {
        text: `❌ Error:\n${e.message}`
      }, { quoted: msg });
    }
  }
};