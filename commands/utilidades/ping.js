export default {
  name: "ping",
  aliases: ["p"],

  async run(sock, msg, args, chatId) {
    const start = Date.now();
    await sock.sendMessage(chatId, { text: "🏓 Calculando..." }, { quoted: msg });
    const ms = Date.now() - start;

    await sock.sendMessage(chatId, {
      text: [
        "🏓 *Pong!*",
        "",
        `⚡ *Latencia:* ${ms}ms`,
        `🕐 *Hora:* ${new Date().toLocaleString()}`,
      ].join("\n")
    }, { quoted: msg });
  }
};