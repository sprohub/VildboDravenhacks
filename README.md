<div align="center">

<img src="https://i.ibb.co/4wYP7W55/sprohacks.jpg" alt="SPROHhacks Banner" width="600"/>

# 🗼 VildboDravenhacks

**Bot de WhatsApp modular basado en Baileys — con aliases dinámicos, sistema de roles, protecciones automáticas y actualización remota.**

[![Node.js](https://img.shields.io/badge/Node.js-ESModules-green?logo=node.js)](https://nodejs.org/)
[![Baileys](https://img.shields.io/badge/Baileys-7.x-blue)](https://github.com/WhiskeySockets/Baileys)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Platform](https://img.shields.io/badge/Platform-Termux%20%7C%20Linux%20%7C%20Windows-lightgrey)]()

🔗 **Repo:** [github.com/sprohub/VildboDravenhacks](https://github.com/sprohub/VildboDravenhacks)

</div>

---

## ✨ Características Principales

| Función | Descripción |
|---|---|
| 👁️ **View Once Recovery** | Recupera imágenes, videos y audios de "ver una sola vez" |
| 🏷️ **Aliases Dinámicos** | Añade aliases a comandos desde WhatsApp sin tocar el código |
| 👑 **Sistema de Roles** | Owner (sesión) + SuperOwner (config) + acceso público |
| 🔄 **Actualización Remota** | `git pull` + `npm install` + reinicio automático desde el chat |
| ♻️ **Reinicio Remoto** | Reinicio instantáneo, compatible con PM2 |
| 🛡️ **Protecciones Automáticas** | Anti-link, anti-spam y anti-delete configurables por grupo |
| 📂 **Sistema Modular** | Comandos cargados automáticamente desde `commands/` |
| 🌦️ **Utilidades** | Clima, info del bot, ping y más |

---

## 📋 Comandos Disponibles

### ⚡ Generales
| Comando | Aliases | Función |
|---|---|---|
| `.menu` | `.help`, `.comandos`, `.cmds` | Mostrar el menú de comandos |
| `.ping` | `.p` | Medir latencia del bot |
| `.info` | — | Ver información del bot |
| `.clima` | — | Consultar el clima actual |

### 🎬 Media
| Comando | Aliases | Función |
|---|---|---|
| `.vv` | `.ver` | Recuperar contenido de View Once |
| `.youtube` | — | Descargar audio/video de YouTube |
| `.stiker` | — | Convertir imagen a sticker |

### 🔱 Administración (Solo Admins del grupo)
| Comando | Función |
|---|---|
| `.ban` | Banear usuario del grupo |
| `.kick` | Expulsar usuario |
| `.promote` | Ascender a admin |
| `.demote` | Quitar admin |
| `.warn` / `.unwarn` / `.warns` | Sistema de advertencias |
| `.antilink` | Activar/desactivar anti-link |
| `.antispam` | Activar/desactivar anti-spam |
| `.hidetag` | Mencionar a todos sin mostrar el tag |
| `.mencion` | Mencionar usuarios |
| `.listadmins` | Listar admins del grupo |
| `.link` / `.resetlink` | Obtener/resetear link de invitación |
| `.abrir` / `.cerrar` | Abrir/cerrar el grupo |

### 💀 Owner (Solo propietario de sesión)
| Comando | Función |
|---|---|
| `.update` | Actualizar bot vía `git pull` + `npm install` |
| `.restart` | Reiniciar el bot |
| `.apagar` | Apagar el bot |
| `.ffmpeg` | Herramientas de FFmpeg |
| `.termux` | Ejecutar comandos en Termux |

### 🏷️ Aliases
```
.addalias menu help
.addalias vv ver
```
Los aliases se cargan automáticamente y aparecen en el menú.

---

## 📂 Estructura del Proyecto

```
VildboDravenhacks/
├── auth_info/              ← Sesión de WhatsApp (NO compartir)
├── commands/
│   ├── Añadidor_de_Aliases/
│   │   └── addalias.js
│   ├── admin/              ← Comandos de administración de grupos
│   ├── media/              ← vv.js, youtube.js, stiker.js
│   ├── menu/               ← menu.js
│   ├── Owner/              ← update.js, restart.js, apagar.js...
│   └── utilidades/         ← ping.js, info.js, clima.js
├── plugins/
│   ├── antiDelete.js
│   ├── antilink.js
│   └── antispam.js
├── utils/
│   ├── antidelete.js
│   └── database.js
├── config.js               ← Configuración principal
├── index.js                ← Núcleo del bot
├── logger.js
└── package.json
```

---

## 📥 Instalación

### 📱 Android — Termux

```bash
pkg update && pkg upgrade -y
pkg install git nodejs -y
termux-setup-storage
git clone https://github.com/sprohub/VildboDravenhacks
cd VildboDravenhacks
npm install
node index.js
```

### 💻 Windows / Linux

```bash
git clone https://github.com/sprohub/VildboDravenhacks
cd VildboDravenhacks
npm install
node index.js
```

### ⚙️ Con PM2 (Recomendado para producción)

```bash
npm install -g pm2
pm2 start index.js --name vildbo
pm2 logs vildbo
pm2 save
```

---

## ⚙️ Configuración (`config.js`)

```js
export default {
  // ─── Roles ──────────────────────────────
  ownerNumber:    "",                     // Se llena automático al vincular
  owners:         ["tu_numero"],          // Owners fijos adicionales
  superOwner:     ["numero_real"],        // SuperOwners (acceso total)
  superOwnerLid:  ["lid_whatsapp"],       // LIDs para grupos

  // ─── Bot ────────────────────────────────
  prefix:         ".",

  // ─── Tiempos ────────────────────────────
  queueDelay:     1200,
  defaultCooldown: 3000,
  reloadDebounce: 500,

  // ─── Logs ───────────────────────────────
  logFile:        "./bot.log",
  maxLogSizeMB:   5,

  // ─── API externa ────────────────────────
  apiBase: "https://tu-api.com",
  apiKey:  "tu_api_key",
};
```

### Sistema de Roles

| Rol | Descripción |
|---|---|
| **SuperOwner** | Configurado en `config.js`. Acceso total a todas las instancias. Compatible con número real y LID de WhatsApp. |
| **Owner** | Se obtiene automáticamente desde la sesión vinculada. |
| **Admin** | Admin del grupo de WhatsApp. Acceso a comandos de administración. |
| **Usuario** | Acceso a comandos públicos. |

---

## 🔐 Seguridad

> ⚠️ **NUNCA compartas ni publiques:**
> - `auth_info/`
> - `session.json`
>
> Estos archivos contienen las credenciales de tu sesión de WhatsApp. Exponerlos permite acceso completo a tu cuenta.

---

## 📦 Dependencias

| Paquete | Versión | Uso |
|---|---|---|
| `@whiskeysockets/baileys` | `^7.0.0-rc.3` | Conexión con WhatsApp Web |
| `axios` | `^1.16.1` | Peticiones HTTP |
| `pino` | `^9.0.0` | Logging eficiente |
| `qrcode-terminal` | `^0.12.0` | Mostrar QR en terminal |

---

## ⚠️ Descargo de Responsabilidad

Este proyecto ha sido desarrollado con fines **educativos, de investigación y uso personal**.

El autor **no promueve ni se hace responsable** del uso indebido de esta herramienta, incluyendo: violación de privacidad, acceso no autorizado, incumplimiento de los términos de servicio de WhatsApp, o cualquier actividad ilegal.

Al utilizar VildboDravenhacks, aceptas que cualquier consecuencia derivada de su uso recaerá únicamente sobre quien lo ejecute o distribuya.

---

## 👨‍💻 Créditos

- Basado en **Draven_Hack** por [BrayanRK](https://github.com/BrayanRK)
- Desarrollado y mantenido por **SPROHub**
- 🔗 Repo: [github.com/sprohub/VildboDravenhacks](https://github.com/sprohub/VildboDravenhacks)

---

<div align="center">

**⚡ SPROHhacks Bot System ⚡**

</div>
