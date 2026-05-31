export default {
  name: "link",
  aliases: ["grouplink"],
  ownerOnly: true,
  cooldown: 3000,

  async run(sock, msg, args, chatId) {
    if (!chatId.endsWith("@g.us")) {
      return sock.sendMessage(chatId, {
        text: "❌ Este comando solo funciona en grupos."
      }, { quoted: msg });
    }

    try {
      const code = await sock.groupInviteCode(chatId);

      await sock.sendMessage(chatId, {
        text: `🔗 *Link del grupo:*\n\nhttps://chat.whatsapp.com/${code}`
      }, { quoted: msg });

    } catch (e) {
      await sock.sendMessage(chatId, {
        text: `❌ Error:\n${e.message}`
      }, { quoted: msg });
    }
  }
};