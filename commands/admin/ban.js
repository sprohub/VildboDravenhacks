import { readFileSync, writeFileSync, existsSync } from "fs";

const BAN_FILE = "./banned.json";

function loadBanned() {
  if (!existsSync(BAN_FILE)) return [];
  try { return JSON.parse(readFileSync(BAN_FILE, "utf8")); } catch { return []; }
}

function saveBanned(list) {
  writeFileSync(BAN_FILE, JSON.stringify(list, null, 2));
}

export function isBanned(jid) {
  return loadBanned().includes(jid);
}

export default {
  name: "ban",
  aliases: ["unban", "banlist"],
  ownerOnly: true,

  async run(sock, msg, args, chatId) {
    const subCmd = args[0]?.toLowerCase();

    // ── .ban list ─────────────────────────────────────────────────────────
    if (subCmd === "list" || this.name === "banlist") {
      const banned = loadBanned();
      if (banned.length === 0) {
        return sock.sendMessage(chatId, {
          text: "✅ No hay usuarios baneados."
        }, { quoted: msg });
      }
      const lista = banned.map((j, i) => `  ${i + 1}. @${j.split("@")[0]}`).join("\n");
      return sock.sendMessage(chatId, {
        text: `🚫 *Usuarios baneados (${banned.length}):*\n\n${lista}`,
        mentions: banned
      }, { quoted: msg });
    }

    // Obtener target
    const mentioned = msg?.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
    const quoted    = msg?.message?.extendedTextMessage?.contextInfo?.participant;
    const target    = mentioned || quoted;

    if (!target) {
      return sock.sendMessage(chatId, {
        text: [
          "❌ *Uso:*",
          "  `.ban @usuario` — banear usuario",
          "  `.unban @usuario` — desbanear usuario",
          "  `.ban list` — ver lista de baneados",
        ].join("\n")
      }, { quoted: msg });
    }

    const numero  = target.split("@")[0];
    let banned    = loadBanned();

    // ── .unban ─────────────────────────────────────────────────────────────
    if (subCmd === "unban" || msg?.message?.conversation?.startsWith(".unban") ||
        msg?.message?.extendedTextMessage?.text?.startsWith(".unban")) {
      if (!banned.includes(target)) {
        return sock.sendMessage(chatId, {
          text: `⚠️ @${numero} no está baneado.`,
          mentions: [target]
        }, { quoted: msg });
      }
      banned = banned.filter(j => j !== target);
      saveBanned(banned);
      return sock.sendMessage(chatId, {
        text: `✅ *@${numero}* fue desbaneado.`,
        mentions: [target]
      }, { quoted: msg });
    }

    // ── .ban ──────────────────────────────────────────────────────────────
    if (banned.includes(target)) {
      return sock.sendMessage(chatId, {
        text: `⚠️ @${numero} ya está baneado.`,
        mentions: [target]
      }, { quoted: msg });
    }

    banned.push(target);
    saveBanned(banned);

    await sock.sendMessage(chatId, {
      text: `🚫 *@${numero}* fue baneado del bot.\nYa no podrá usar ningún comando.`,
      mentions: [target]
    }, { quoted: msg });
  }
};