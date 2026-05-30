import fs from 'fs';
import path from 'path';
import { pathToFileURL } from 'url';

const CATEGORY_ICONS = {
  GENERAL:  "⚡",
  MEDIA:    "🎬",
  TOOLS:    "⚙️",
  FUN:      "🎮",
  OWNER:    "💀",
  ADMIN:    "🔱",
  INFO:     "📡",
  NSFW:     "🔞",
  STIKERS:  "🎨",
  UTILS:    "🛠️",
  DEFAULT:  "📌",
};

function getCategoryIcon(cat) {
  return CATEGORY_ICONS[cat] || CATEGORY_ICONS.DEFAULT;
}

export default {
  name: "menu",
  aliases: ["help", "comandos", "cmd", "OWNER"],
  async run(sock, msg) {
    const jid = msg.key.remoteJid;
    const prefix = ".";
    const commandsDir = path.join(process.cwd(), 'commands');

    const getFiles = (dir) => {
      let results = [];
      const list = fs.readdirSync(dir, { withFileTypes: true });
      for (const item of list) {
        const res = path.resolve(dir, item.name);
        if (item.isDirectory()) {
          results = [...results, ...getFiles(res)];
        } else if (item.name.endsWith('.js')) {
          results.push(res);
        }
      }
      return results;
    };

    try {
      const allFiles = getFiles(commandsDir);
      let menuData = {};

      for (const filePath of allFiles) {
        if (filePath.endsWith('menu.js')) continue;

        try {
          const { default: cmd } = await import(`${pathToFileURL(filePath).href}?update=${Date.now()}`);
          if (cmd && cmd.name) {
            const raw = path.basename(path.dirname(filePath)).toUpperCase();
            const category = raw === 'COMMANDS' ? 'GENERAL' : raw;
            if (!menuData[category]) menuData[category] = [];
            menuData[category].push({
              name: cmd.name,
              aliases: cmd.aliases || [],
            });
          }
        } catch (e) {
          console.error(`Error en menú al leer ${filePath}:`, e.message);
        }
      }

      const categories = Object.keys(menuData).sort();
      const totalCmds = categories.reduce((acc, c) => acc + menuData[c].length, 0);

      let t = "";

      // ── HEADER ──────────────────────────────────────────
      t += `*🤖 SPROHhacks Bot System*\n`;
      t += `▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔\n`;
      t += `📦 Comandos: *${totalCmds}*\n`;
      t += `🔑 Prefijo: *${prefix}*\n`;
      t += `🌐 Estado: *Online ✅*\n`;
      t += `▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔\n\n`;

      // ── CATEGORÍAS ──────────────────────────────────────
      for (const category of categories) {
        const icon = getCategoryIcon(category);
        const cmds = menuData[category];

        t += `${icon} *${category}*\n`;
        t += `┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄\n`;

        for (const c of cmds) {
          t += `  ▸ \`${prefix}${c.name}\``;

          if (c.aliases.length > 0) {
            const aliasStr = c.aliases.map(a => `\`${prefix}${a}\``).join("  ");
            t += `\n    ↳ ${aliasStr}`;
          }
          t += `\n`;
        }

        t += `\n`;
      }

      // ── FOOTER ──────────────────────────────────────────
      t += `▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔\n`;
      t += `⚡ _Usa ${prefix}help <cmd> para más info_\n`;
      t += `💀 _Cmds de owner: solo el dueño_`;

      await sock.sendMessage(jid, { text: t.trim() }, { quoted: msg });

    } catch (error) {
      console.error("Error crítico en menú:", error);
    }
  },
};
