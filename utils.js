import { tmpdir } from "os";
import { downloadMediaMessage } from "@whiskeysockets/baileys";

// ─── Mensajería ───────────────────────────────────────────────────────────────

/**
 * Responde un mensaje con texto
 */
export function reply(sock, jid, text, msg) {
  return sock.sendMessage(jid, { text: String(text) }, { quoted: msg });
}

/**
 * Envía un mensaje sin citar
 */
export function send(sock, jid, text) {
  return sock.sendMessage(jid, { text: String(text) });
}

/**
 * Reacciona a un mensaje con un emoji
 */
export function react(sock, msg, emoji) {
  return sock.sendMessage(msg.key.remoteJid, {
    react: { text: emoji, key: msg.key }
  });
}

// ─── Extracción de datos del mensaje ─────────────────────────────────────────

/**
 * Obtiene el texto del mensaje (conversación, caption, extended, etc.)
 */
export function getBody(msg) {
  return (
    msg?.message?.conversation ||
    msg?.message?.extendedTextMessage?.text ||
    msg?.message?.imageMessage?.caption ||
    msg?.message?.videoMessage?.caption ||
    msg?.message?.documentMessage?.caption ||
    ""
  ).trim();
}

/**
 * Obtiene el JID del sender (funciona en grupos y privado)
 */
export function getSenderJid(msg) {
  const remoteJid = msg?.key?.remoteJid || "";
  const isGroup   = remoteJid.endsWith("@g.us");
  return isGroup
    ? (msg?.key?.participant || "")
    : remoteJid;
}

/**
 * Obtiene solo el número del sender (sin @s.whatsapp.net ni @lid)
 */
export function getSenderNumber(msg) {
  return getSenderJid(msg).split("@")[0].replace(/\D/g, "");
}

/**
 * Verifica si el mensaje viene de un grupo
 */
export function isGroup(msg) {
  return String(msg?.key?.remoteJid || "").endsWith("@g.us");
}

/**
 * Obtiene el mensaje citado (quoted) si existe
 */
export function getQuoted(msg) {
  return msg?.message?.extendedTextMessage?.contextInfo?.quotedMessage || null;
}

/**
 * Obtiene el JID del autor del mensaje citado
 */
export function getQuotedSender(msg) {
  return msg?.message?.extendedTextMessage?.contextInfo?.participant || null;
}

/**
 * Obtiene los JIDs mencionados en el mensaje
 */
export function getMentions(msg) {
  return msg?.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
}

/**
 * Detecta el tipo de media en el mensaje o en el quoted
 */
export function getMediaType(msg) {
  const m = msg?.message;
  if (!m) return null;

  const quoted = m?.extendedTextMessage?.contextInfo?.quotedMessage;
  const target = quoted || m;

  if (target?.imageMessage)    return "image";
  if (target?.videoMessage)    return "video";
  if (target?.audioMessage)    return "audio";
  if (target?.stickerMessage)  return "sticker";
  if (target?.documentMessage) return "document";
  return null;
}

// ─── Descarga de media ────────────────────────────────────────────────────────

/**
 * Descarga la media de un mensaje como Buffer
 * Soporta quoted automáticamente
 */
export async function downloadMedia(msg) {
  const quoted = msg?.message?.extendedTextMessage?.contextInfo?.quotedMessage;

  // Si hay quoted, construir un msg ficticio para descargarlo
  const target = quoted
    ? {
        key: msg?.message?.extendedTextMessage?.contextInfo,
        message: quoted,
      }
    : msg;

  return downloadMediaMessage(target, "buffer", {});
}

// ─── Archivos temporales ──────────────────────────────────────────────────────

/**
 * Genera una ruta en la carpeta temporal del sistema
 */
export function tempPath(name) {
  return `${tmpdir()}/${name}_${Date.now()}`;
}

// ─── Formato ──────────────────────────────────────────────────────────────────

/**
 * Formatea bytes a KB / MB / GB
 */
export function formatBytes(bytes) {
  if (bytes < 1024)        return `${bytes} B`;
  if (bytes < 1024 ** 2)   return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 ** 3)   return `${(bytes / 1024 ** 2).toFixed(1)} MB`;
  return `${(bytes / 1024 ** 3).toFixed(1)} GB`;
}

/**
 * Formatea segundos a Xd Xh Xm Xs
 */
export function formatUptime(seconds) {
  const d = Math.floor(seconds / 86400);
  const h = Math.floor((seconds % 86400) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  return [d && `${d}d`, h && `${h}h`, m && `${m}m`, `${s}s`].filter(Boolean).join(" ");
}

/**
 * Limpia un nombre de archivo de caracteres inválidos
 */
export function safeFileName(name) {
  return String(name || "file")
    .replace(/[\\/:*?"<>|]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 80) || "file";
}