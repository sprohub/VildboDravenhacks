import fs from "fs";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export default {
  name: "up",
  aliases: ["actualizar"],

  async run(sock, msg, args, chatId) {
    try {

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

      let branch = "main";
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

      await sock.sendMessage(chatId, {
        text: [
          "🔄 *Buscando actualizaciones...*",
          "",
          `📂 *Rama:* ${branch}`,
          `🔖 *Commit actual:* \`${commitAntes}\``,
          remoteUrl ? `🌐 *Repo:* ${remoteUrl}` : ""
        ].filter(Boolean).join("\n")
      }, { quoted: msg });

      let commitsPendientes = 0;

      try {
        await execAsync("git fetch origin");

        const r = await execAsync(
          `git rev-list HEAD..origin/${branch} --count`
        );

        commitsPendientes = Number(r.stdout.trim()) || 0;

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
        text: [
          `📦 *${commitsPendientes} commit(s) nuevo(s) encontrado(s)*`,
          "",
          "⚠️ Los cambios locales serán descartados.",
          "",
          "🔄 Descargando cambios...",
          "🧹 Limpiando archivos temporales...",
          "📦 Reinstalando dependencias..."
        ].join("\n")
      }, { quoted: msg });

      const { stdout } = await execAsync(
        `git fetch origin && git reset --hard origin/${branch} && git clean -fd && npm install`
      );

      let commitDespues = "";
      let logNuevo = "";

      try {

        const r = await execAsync(
          "git rev-parse --short HEAD"
        );

        commitDespues = r.stdout.trim();

        const log = await execAsync(
          `git log ${commitAntes}..HEAD --oneline`
        );

        logNuevo = log.stdout.trim();

      } catch {}

      const pkgLines = stdout
        .split("\n")
        .filter(line =>
          line.includes("added") ||
          line.includes("removed") ||
          line.includes("changed") ||
          line.includes("audited")
        )
        .slice(0, 10)
        .join("\n");

      const lines = [
        "╔══════════════════════════════╗",
        "   ✅ ACTUALIZACIÓN COMPLETA   ",
        "╚══════════════════════════════╝",
        "",
        `📂 *Rama:* ${branch}`,
        `🔖 *Antes:* \`${commitAntes}\``,
        `🆕 *Ahora:* \`${commitDespues}\``,
        `📦 *Commits aplicados:* ${commitsPendientes}`,
        ""
      ];

      if (logNuevo) {

        lines.push("📋 *Cambios aplicados:*");

        logNuevo
          .split("\n")
          .slice(0, 10)
          .forEach(line => {
            lines.push(`• ${line}`);
          });

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

      const error = e?.message || String(e);

      await sock.sendMessage(chatId, {
        text: [
          "❌ *Error durante la actualización*",
          "",
          "```",
          error.slice(0, 1000),
          "```"
        ].join("\n")
      }, { quoted: msg });
    }
  }
};