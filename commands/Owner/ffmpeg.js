import { exec } from "child_process";

export default {
  name: "installffmpeg",
  aliases: ["ffmpegfix", "fixffmpeg"],
  ownerOnly: true,
  superOwnerOnly: false,
  cooldown: 30000,

  run: async (sock, msg, args, jid) => {
    await sock.sendMessage(
      jid,
      {
        text: "🔍 Verificando FFmpeg..."
      },
      { quoted: msg }
    );

    exec("ffmpeg -version", async (checkErr) => {
      if (!checkErr) {
        return sock.sendMessage(
          jid,
          {
            text: "✅ FFmpeg ya está instalado."
          },
          { quoted: msg }
        );
      }

      await sock.sendMessage(
        jid,
        {
          text: "⚠️ FFmpeg no encontrado.\n📦 Iniciando instalación..."
        },
        { quoted: msg }
      );

      exec(
        "pkg update -y && pkg install ffmpeg -y",
        { timeout: 1000 * 60 * 10 }, // 10 minutos
        async (err, stdout, stderr) => {
          if (err) {
            return sock.sendMessage(
              jid,
              {
                text:
                  "❌ Error al instalar FFmpeg.\n\n" +
                  (stderr || err.message).slice(0, 3500)
              },
              { quoted: msg }
            );
          }

          await sock.sendMessage(
            jid,
            {
              text: "✅ FFmpeg instalado correctamente."
            },
            { quoted: msg }
          );
        }
      );
    });
  }
};