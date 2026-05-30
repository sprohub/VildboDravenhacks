import os from "os";
import { readFileSync } from "fs";

function formatUptime(seconds) {
  const d = Math.floor(seconds / 86400);
  const h = Math.floor((seconds % 86400) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  return [d && `${d}d`, h && `${h}h`, m && `${m}m`, `${s}s`].filter(Boolean).join(" ");
}

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 ** 2) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 ** 3) return `${(bytes / 1024 ** 2).toFixed(1)} MB`;
  return `${(bytes / 1024 ** 3).toFixed(1)} GB`;
}

export default {
  name: "info",
  aliases: ["botinfo", "estado"],

  async run(sock, msg, args, chatId) {
    let version = "1.0.0";
    try {
      const pkg = JSON.parse(readFileSync("./package.json", "utf8"));
      version = pkg.version || version;
    } catch {}

    const mem      = process.memoryUsage();
    const totalMem = os.totalmem();
    const freeMem  = os.freemem();
    const usedMem  = totalMem - freeMem;
    const uptime   = formatUptime(process.uptime());
    const platform = os.platform();
    const node     = process.version;

    await sock.sendMessage(chatId, {
      text: [
        "╔══════════════════════════════╗",
        "   🤖  LUCHO DIAS HACKS     ",
        "╚══════════════════════════════╝",
        "",
        `📦 *Versión:*    v${version}`,
        `⏱️ *Uptime:*     ${uptime}`,
        `🕐 *Hora:*       ${new Date().toLocaleString()}`,
        "",
        "━━━━━━ 💻 Sistema ━━━━━━",
        `🖥️ *OS:*         ${platform}`,
        `🟢 *Node.js:*    ${node}`,
        `🧠 *RAM usada:*  ${formatBytes(usedMem)} / ${formatBytes(totalMem)}`,
        `📊 *Heap:*       ${formatBytes(mem.heapUsed)} / ${formatBytes(mem.heapTotal)}`,
        "",
        "━━━━━━ 📡 Bot ━━━━━━",
        `✅ *Estado:*     Conectado`,
        `🌐 *Modo:*       Público + Roles`,
      ].join("\n")
    }, { quoted: msg });
  }
};