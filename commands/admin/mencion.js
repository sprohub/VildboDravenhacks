export default {
  name: "mentionall",
  aliases: ["everyone", "todos", "all"],
  ownerOnly: true,

  async run(sock, msg, args, chatId) {
    const isGroup = chatId.endsWith("@g.us");

    if (!isGroup) {
      return sock.sendMessage(chatId, {
        text: "❌ Este comando solo funciona en grupos."
      }, { quoted: msg });
    }

    try {
      const meta         = await sock.groupMetadata(chatId);
      const participants = meta.participants.map(p => p.id);
      const nombre       = meta.subject;
      const mensaje      = args.join(" ") || "¡Atención a todos! 📢";

      const menciones = participants
        .map(p => `@${p.split("@")[0]}`)
        .join(" ");

      await sock.sendMessage(chatId, {
        text: `📢 *${nombre}*\n\n${mensaje}\n\n${menciones}`,
        mentions: participants
      }, { quoted: msg });

    } catch (e) {
      await sock.sendMessage(chatId, {
        text: `❌ Error al mencionar.\n\`\`\`${e.message.slice(0, 200)}\`\`\``
      }, { quoted: msg });
    }
  }
};