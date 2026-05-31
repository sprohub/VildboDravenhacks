import { loadJSON, saveJSON } from "../utils/database.js";

const CONFIG_FILE = "./data/antispam.json";
const WARN_FILE = "./data/warns.json";

const LIMIT = 3;
const WINDOW = 3000;

export function registerAntiSpam(sock) {

  sock.ev.on("messages.upsert", async ({ messages }) => {

    const msg = messages?.[0];

    if (!msg?.message) return;
    if (msg.key.fromMe) return;

    const chatId = msg.key.remoteJid;

    if (!chatId.endsWith("@g.us")) return;

    const config = loadJSON(CONFIG_FILE);

    if (!config[chatId]) return;

    const sender =
      msg.key.participant ||
      msg.key.remoteJid;

    const spamData = loadJSON(CONFIG_FILE);

    spamData.__users ??= {};
    spamData.__users[chatId] ??= {};
    spamData.__users[chatId][sender] ??= [];

    const now = Date.now();

    spamData.__users[chatId][sender] =
      spamData.__users[chatId][sender]
        .filter(t => now - t < WINDOW);

    spamData.__users[chatId][sender]
      .push(now);

    if (
      spamData.__users[chatId][sender]
        .length >= LIMIT
    ) {

      const warns = loadJSON(WARN_FILE);

      warns[chatId] ??= {};
      warns[chatId][sender] ??= 0;

      warns[chatId][sender]++;

      const total =
        warns[chatId][sender];

      saveJSON(WARN_FILE, warns);

      spamData.__users[chatId][sender] = [];

      await sock.sendMessage(chatId, {
        text:
          `⚠️ Spam detectado\n\n` +
          `@${sender.split("@")[0]}\n` +
          `Advertencias: ${total}/3`,
        mentions: [sender]
      });

      if (total >= 3) {

        try {

          await sock.groupParticipantsUpdate(
            chatId,
            [sender],
            "remove"
          );

          delete warns[chatId][sender];

          saveJSON(WARN_FILE, warns);

          await sock.sendMessage(chatId, {
            text:
              `🚫 @${sender.split("@")[0]} expulsado por spam.`,
            mentions: [sender]
          });

        } catch {}
      }
    }

    saveJSON(CONFIG_FILE, spamData);

  });
}