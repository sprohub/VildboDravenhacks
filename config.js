import { tmpdir } from "os";

export default {
  // ─── Owner / Roles ──────────────────────────────────────────────────────────
  ownerNumber:    "",                               // se llena automático al vincular
  owners:         [],                               // owners fijos adicionales
  superOwner:     ["573223090406", "573225396540"], // superOwners (número real)
  superOwnerLid:  ["204148502954022", "261782870454384"], // LIDs para grupos

  // ─── Bot ────────────────────────────────────────────────────────────────────
  prefix:         ".",

  // ─── Rutas ──────────────────────────────────────────────────────────────────
  sessionDir:     "./auth_info",
  commandsDir:    "./commands",
  tempDir:        tmpdir(),                         // carpeta temporal del sistema

  // ─── Tiempos ────────────────────────────────────────────────────────────────
  queueDelay:     1200,
  defaultCooldown: 3000,
  reloadDebounce: 500,

  // ─── Logs ───────────────────────────────────────────────────────────────────
  logFile:        "./bot.log",
  maxLogSizeMB:   5,

  // ─── APIs externas ──────────────────────────────────────────────────────────
  apiBase:  "https://dv-yer-api.online",              // ← URL base de tu API
  apiKey:   "dvyer854515532839",                      // ← tu API key
};