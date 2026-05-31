export default {
  name: "listadmins",
  aliases: ["admins", "adminslist"],
  ownerOnly: true,
  cooldown: 3000,

  async run(sock, msg, args, chatId) {
    if (!chatId.endsWith("@g.us")) {
      return sock.sendMessage(chatId, {
        text: "❌ Este comando solo funciona en grupos."
      }, { quoted: msg });
    }

    try {
      const metadata = await sock.groupMetadata(chatId);

      const admins = metadata.participants.filter(
        p => p.admin === "admin" || p.admin === "superadmin"
      );

      let text = `👑 *Administradores de ${metadata.subject}*\n\n`;

      for (const admin of admins) {
        text += `➤ @${admin.id.split("@")[0]}\n`;
      }

      await sock.sendMessage(chatId, {
        text,
        mentions: admins.map(a => a.id)
      }, { quoted: msg });

    } catch (e) {
      await sock.sendMessage(chatId, {
        text: `❌ Error:\n${e.message}`
      }, { quoted: msg });
    }
  }
};