export default {
  name: "promote",
  aliases: ["admin"],
  ownerOnly: true,

  async run(sock, msg, args, chatId) {
    if (!chatId.endsWith("@g.us")) {
      return sock.sendMessage(chatId, {
        text: "❌ Este comando solo funciona en grupos."
      }, { quoted: msg });
    }

    const mentioned = msg?.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
    const quoted = msg?.message?.extendedTextMessage?.contextInfo?.participant;
    const target = mentioned || quoted;

    if (!target) {
      return sock.sendMessage(chatId, {
        text: "❌ *Uso:* .promote @usuario"
      }, { quoted: msg });
    }

    try {
      await sock.groupParticipantsUpdate(chatId, [target], "promote");

      await sock.sendMessage(chatId, {
        text: `✅ @${target.split("@")[0]} ahora es administrador.`,
        mentions: [target]
      }, { quoted: msg });

    } catch (e) {
      await sock.sendMessage(chatId, {
        text: `❌ Error:\n${e.message}`
      }, { quoted: msg });
    }
  }
};