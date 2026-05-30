import fs from 'fs';
import path from 'path';
import { pathToFileURL } from 'url';

// ══ ÍCONOS POR CATEGORÍA ══════════════════════════════════════════════════════
const CATEGORY_ICONS = {
  GENERAL:  "⚡",
  MEDIA:    "🎬",
  TOOLS:    "⚙️",
  FUN:      "🎮",
  OWNER:    "💀",
  ADMIN:    "🔱",
  INFO:     "📡",
  NSFW:     "🔞",
  DEFAULT:  "🗡️",
};

// ══ DECORADORES POR CATEGORÍA ══════════════════════════════════════════════════
const CATEGORY_DECO = {
  GENERAL:  ["◈", "◇"],
  MEDIA:    ["◉", "◌"],
  TOOLS:    ["◆", "◇"],
  FUN:      ["★", "☆"],
  OWNER:    ["◤", "◢"],
  ADMIN:    ["▣", "□"],
  INFO:     ["◎", "○"],
  NSFW:     ["◈", "◇"],
  DEFAULT:  ["◆", "◇"],
};

function getCategoryIcon(cat) {
  return CATEGORY_ICONS[cat] || CATEGORY_ICONS.DEFAULT;
}

function getCategoryDeco(cat) {
  return CATEGORY_DECO[cat] || CATEGORY_DECO.DEFAULT;
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

      // ══ HEADER ══════════════════════════════════════════
      t += `┏━━━━━━━━━━━━━━━━━━━━━━━━━━━┓\n`;
      t += `┃                           ┃\n`;
      t += `┃  𝙎𝙋𝙍𝙊𝙃𝙝𝙖𝙘𝙠𝙨            ┃\n`;
      t += `┃  ▸ *B O T  S Y S T E M* ◂ ┃\n`;
      t += `┃                           ┃\n`;
      t += `┗━━━━━━━━━━━━━━━━━━━━━━━━━━━┛\n`;
      t += `\n`;
      t += `◈━━━━━━━━━━━━━━━━━━━━━━━━━◈\n`;
      t += `  📦 *Comandos cargados:* ${totalCmds}\n`;
      t += `  🔑 *Prefijo activo:* \`${prefix}\`\n`;
      t += `  🌐 *Sistema:* Online ✅\n`;
      t += `◈━━━━━━━━━━━━━━━━━━━━━━━━━◈\n`;
      t += `\n`;

      // ══ CATEGORÍAS ══════════════════════════════════════
      for (const category of categories) {
        const icon = getCategoryIcon(category);
        const [decoL, decoR] = getCategoryDeco(category);
        const cmds = menuData[category];

        t += `╔══════════════════════════╗\n`;
        t += `║  ${decoL} ${icon} *${category}* ${decoR}  \n`;
        t += `╠══════════════════════════╣\n`;

        for (const c of cmds) {
          t += `║  ➤ \`${prefix}${c.name}\`\n`;

          if (c.aliases.length > 0) {
            for (let i = 0; i < c.aliases.length; i += 3) {
              const chunk = c.aliases.slice(i, i + 3);
              t += `║    ↳ _${chunk.map(a => `${prefix}${a}`).join("  ·  ")}_\n`;
            }
          }
        }

        t += `╚══════════════════════════╝\n`;
        t += `\n`;
      }

      // ══ FOOTER ══════════════════════════════════════════
      t += `◈━━━━━━━━━━━━━━━━━━━━━━━━━◈\n`;
      t += `  ⚡ _${prefix}help <cmd> para más info_\n`;
      t += `  💀 _Comandos de owner: solo el dueño_\n`;
      t += `  🔗 _SPROHhacks Bot System_\n`;
      t += `◈━━━━━━━━━━━━━━━━━━━━━━━━━◈`;

      await sock.sendMessage(jid, { text: t.trim() }, { quoted: msg });

    } catch (error) {
      console.error("Error crítico en menú:", error);
    }
  },
};
