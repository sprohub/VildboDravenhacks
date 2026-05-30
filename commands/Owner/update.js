import fs from "fs";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export default {
  name: "up",
  aliases: ["actualizar"],
  ownerOnly: true,

  async run(sock, msg, args, chatId) {
    try {

      // ── Verificar que es repo git ────────────────────────────────────────
      if (!fs.existsSync(".git")) {
        return await sock.sendMessage(chatId, {
          text: [
            "❌ *No es un repositorio Git*",
            "",
            "Este bot fue instalado desde ZIP.",
            "La actualización automática solo funciona si fue clonado con:",
            "",
            "`git clone URL_DEL_REPOSITORIO`"
          ].join("\n")
        }, { quoted: msg });
      }

      // ── Obtener info antes de actualizar ────────────────────────────────
      let branch = "desconocida";
      let commitAntes = "";
      let remoteUrl = "";

      try {
        const r1 = await execAsync("git rev-parse --abbrev-ref HEAD");
        branch = r1.stdout.trim();

        const r2 = await execAsync("git rev-parse --short HEAD");
        commitAntes = r2.stdout.trim();

        const r3 = await execAsync("git remote get-url origin");
        remoteUrl = r3.stdout.trim();
      } catch {}

      // ── Mensaje inicial ──────────────────────────────────────────────────
      await sock.sendMessage(chatId, {
        text: [
          "🔄 *Buscando actualizaciones...*",
          "",
          `📂 *Rama:* ${branch}`,
          `🔖 *Commit actual:* \`${commitAntes}\``,
          remoteUrl ? `🌐 *Repo:* ${remoteUrl}` : "",
        ].filter(Boolean).join("\n")
      }, { quoted: msg });

      // ── git fetch para ver cuántos commits hay detrás ───────────────────
      let commitsPendientes = 0;
      try {
        await execAsync("git fetch origin");
        const r = await execAsync(`git rev-list HEAD..origin/${branch} --count`);
        commitsPendientes = parseInt(r.stdout.trim()) || 0;
      } catch {}

      if (commitsPendientes === 0) {
        return await sock.sendMessage(chatId, {
          text: [
            "✅ *¡Ya estás al día!*",
            "",
            `📂 *Rama:* ${branch}`,
            `🔖 *Commit:* \`${commitAntes}\``,
            "🕐 No hay nuevas actualizaciones disponibles."
          ].join("\n")
        }, { quoted: msg });
      }

      await sock.sendMessage(chatId, {
        text: `📦 *${commitsPendientes} commit(s) nuevo(s) encontrado(s)*\n\n⏳ Aplicando cambios y reinstalando dependencias...`
      }, { quoted: msg });

      // ── git pull + npm install ───────────────────────────────────────────
      const { stdout, stderr } = await execAsync("git pull && npm install");

      // ── Commit nuevo ─────────────────────────────────────────────────────
      let commitDespues = "";
      let logNuevo = "";
      try {
        const r = await execAsync("git rev-parse --short HEAD");
        commitDespues = r.stdout.trim();

        const log = await execAsync(`git log ${commitAntes}..HEAD --oneline`);
        logNuevo = log.stdout.trim();
      } catch {}

      // ── Detectar paquetes instalados ─────────────────────────────────────
      const pkgLines = stdout
        .split("\n")
        .filter(l => l.includes("added") || l.includes("updated") || l.includes("audited"))
        .join("\n")
        .slice(0, 300);

      // ── Mensaje final ────────────────────────────────────────────────────
      const lines = [
        "╔══════════════════════════════╗",
        "   ✅  ACTUALIZACIÓN COMPLETA   ",
        "╚══════════════════════════════╝",
        "",
        `📂 *Rama:*     ${branch}`,
        `🔖 *Antes:*    \`${commitAntes}\``,
        `🆕 *Ahora:*    \`${commitDespues}\``,
        `📦 *Commits:*  ${commitsPendientes}`,
        "",
      ];

      if (logNuevo) {
        lines.push("📋 *Cambios aplicados:*");
        logNuevo.split("\n").slice(0, 10).forEach(l => lines.push(`  • ${l}`));
        lines.push("");
      }

      if (pkgLines) {
        lines.push("📥 *Dependencias:*");
        lines.push(pkgLines);
        lines.push("");
      }

      lines.push("♻️ *Reiniciando en 3 segundos...*");

      await sock.sendMessage(chatId, {
        text: lines.join("\n")
      }, { quoted: msg });

      setTimeout(() => process.exit(0), 3000);

    } catch (e) {
      await sock.sendMessage(chatId, {
        text: [
          "❌ *Error durante la actualización*",
          "",
          `\`\`\`${e.message.slice(0, 800)}\`\`\``
        ].join("\n")
      }, { quoted: msg });
    }
  }
};