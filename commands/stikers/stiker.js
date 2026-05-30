import { tmpdir } from "os";
import { join } from "path";
import { writeFileSync, unlinkSync } from "fs";
import { execSync } from "child_process";
import { downloadMediaMessage } from "@whiskeysockets/baileys";

export default {
  name: "sticker",
  aliases: ["s", "stk"],

  async run(sock, msg, args, chatId) {
    // Aceptar imagen/video citado o directo
    const quoted = msg?.message?.extendedTextMessage?.contextInfo?.quotedMessage;
    const target = quoted || msg.message;

    const hasImage = target?.imageMessage;
    const hasVideo = target?.videoMessage;

    if (!hasImage && !hasVideo) {
      return sock.sendMessage(chatId, {
        text: "❌ Envía o cita una imagen/video con *.sticker*"
      }, { quoted: msg });
    }

    try {
      // Descargar media
      const msgToDownload = quoted
        ? { message: quoted, key: msg?.message?.extendedTextMessage?.contextInfo }
        : msg;

      const buffer = await downloadMediaMessage(msgToDownload, "buffer", {});

      const ext    = hasImage ? "jpg" : "mp4";
      const input  = join(tmpdir(), `sticker_in_${Date.now()}.${ext}`);
      const output = join(tmpdir(), `sticker_out_${Date.now()}.webp`);
      writeFileSync(input, buffer);

      // Convertir con ffmpeg
      if (hasVideo) {
        execSync(`ffmpeg -i "${input}" -vf "scale=512:512:force_original_aspect_ratio=decrease,fps=15" -loop 0 -t 6 -preset default -an -vsync 0 "${output}" -y`);
      } else {
        execSync(`ffmpeg -i "${input}" -vf "scale=512:512:force_original_aspect_ratio=decrease" "${output}" -y`);
      }

      await sock.sendMessage(chatId, {
        sticker: { url: output }
      }, { quoted: msg });

      unlinkSync(input);
      unlinkSync(output);

    } catch (e) {
      await sock.sendMessage(chatId, {
        text: `❌ Error al crear sticker\n\`\`\`${e.message.slice(0, 300)}\`\`\``
      }, { quoted: msg });
    }
  }
};