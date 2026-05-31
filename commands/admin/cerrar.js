export default {
  name: "cerrar",
  aliases: ["close"],
  ownerOnly: true,

  async run(sock, msg, args, chatId) {
    if (!chatId.endsWith("@g.us")) {
      return sock.sendMessage(chatId, {
        text: "❌ Solo grupos."
      }, { quoted: msg });
    }

    try {
      await sock.groupSettingUpdate(chatId, "announcement");

      await sock.sendMessage(chatId, {
        text: "🔒 Grupo cerrado. Solo administradores pueden enviar mensajes."
      }, { quoted: msg });

    } catch (e) {
      await sock.sendMessage(chatId, {
        text: `❌ Error:\n${e.message}`
      }, { quoted: msg });
    }
  }
};