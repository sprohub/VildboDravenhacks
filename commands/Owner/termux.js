import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export default {
  name: "termux",
  aliases: ["shell", "cmd"],
  superOwnerOnly: true,
  cooldown: 2000,

  async run(sock, msg, args, chatId) {

    if (!args.length) {
      return sock.sendMessage(chatId, {
        text:
          "❌ Uso:\n\n" +
          ".termux pwd\n" +
          ".termux pm2 list\n" +
          ".termux ffmpeg -version"
      }, { quoted: msg });
    }

    const command = args.join(" ");

    await sock.sendMessage(chatId, {
      text: `⚡ Ejecutando:\n\`${command}\``
    }, { quoted: msg });

    try {

      const { stdout, stderr } = await execAsync(command, {
        timeout: 60000,
        maxBuffer: 1024 * 1024
      });

      const output =
        stdout ||
        stderr ||
        "✅ Comando ejecutado sin salida.";

      await sock.sendMessage(chatId, {
        text:
          "📟 Resultado:\n\n```" +
          output.slice(0, 3500) +
          "```"
      }, { quoted: msg });

    } catch (e) {

      await sock.sendMessage(chatId, {
        text:
          "❌ Error:\n\n```" +
          (e.stderr || e.message || String(e)).slice(0, 3500) +
          "```"
      }, { quoted: msg });

    }
  }
};