export default {
  name: "demote",
  aliases: ["quitaradmin"],
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
        text: "❌ *Uso:* .demote @usuario"
      }, { quoted: msg });
    }

    try {
      await sock.groupParticipantsUpdate(chatId, [target], "demote");

      await sock.sendMessage(chatId, {
        text: `✅ @${target.split("@")[0]} ya no es administrador.`,
        mentions: [target]
      }, { quoted: msg });

    } catch (e) {
      await sock.sendMessage(chatId, {
        text: `❌ Error:\n${e.message}`
      }, { quoted: msg });
    }
  }
};