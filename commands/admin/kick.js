export default {
  name: "kick",
  aliases: ["expulsar"],
  ownerOnly: true,

  async run(sock, msg, args, chatId) {
    const isGroup = chatId.endsWith("@g.us");

    if (!isGroup) {
      return sock.sendMessage(chatId, {
        text: "❌ Este comando solo funciona en grupos."
      }, { quoted: msg });
    }

    // Obtener mencionado o citado
    const mentioned = msg?.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
    const quoted    = msg?.message?.extendedTextMessage?.contextInfo?.participant;
    const target    = mentioned || quoted;

    if (!target) {
      return sock.sendMessage(chatId, {
        text: "❌ *Uso:* .kick @usuario\n\nMenciona o cita al usuario a expulsar."
      }, { quoted: msg });
    }

    try {
      await sock.groupParticipantsUpdate(chatId, [target], "remove");

      const numero = target.split("@")[0];
      await sock.sendMessage(chatId, {
        text: `✅ *@${numero}* fue expulsado del grupo.`,
        mentions: [target]
      }, { quoted: msg });

    } catch (e) {
      await sock.sendMessage(chatId, {
        text: `❌ No se pudo expulsar.\n\`\`\`${e.message.slice(0, 200)}\`\`\``
      }, { quoted: msg });
    }
  }
};