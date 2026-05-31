export default {
  name: "resetlink",
  aliases: ["revoke", "revokelink"],
  ownerOnly: true,
  cooldown: 5000,

  async run(sock, msg, args, chatId) {
    if (!chatId.endsWith("@g.us")) {
      return sock.sendMessage(chatId, {
        text: "❌ Este comando solo funciona en grupos."
      }, { quoted: msg });
    }

    try {
      const code = await sock.groupRevokeInvite(chatId);

      await sock.sendMessage(chatId, {
        text: `✅ Link regenerado.\n\n🔗 Nuevo enlace:\nhttps://chat.whatsapp.com/${code}`
      }, { quoted: msg });

    } catch (e) {
      await sock.sendMessage(chatId, {
        text: `❌ Error:\n${e.message}`
      }, { quoted: msg });
    }
  }
};