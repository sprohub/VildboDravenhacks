🗼VildboDravenhacks
Bot de WhatsApp basado en Baileys con sistema modular, aliases dinámicos, actualización remota y herramientas de administración para el Owner y SuperOwner.

🔗 Repo: https://github.com/sprohub/VildboDravenhacks

🚀 Características
👁️ Recuperación de View Once
Permite recuperar contenido de "Ver una sola vez":

📸 Imágenes
🎥 Videos
🎵 Audios
🏷️ Sistema de Aliases
Añade nuevos aliases directamente desde WhatsApp.

Ejemplo:
addalias menu help
addalias vv ver
Los aliases se cargan automáticamente y aparecen en el menú.

👑 Sistema Owner + SuperOwner
El bot soporta dos niveles de acceso:

**Owner**: Se obtiene automáticamente desde la sesión. Es el propietario de la instancia instalada.
**SuperOwner**: Configurado desde `config.js`. Tiene acceso a todas las instancias del bot. Compatible con números normales y LID de WhatsApp.

🔄 Actualizaciones Remotas
Los usuarios pueden actualizar el bot desde WhatsApp con `update`.  
El sistema ejecuta: `git pull` + `npm install` y reinicia automáticamente el bot.

♻️ Reinicio Remoto
`restart` reinicia el bot automáticamente. Compatible con PM2.

📂 Sistema Modular
Los comandos se cargan automáticamente desde las carpetas `commands/`.  
No es necesario editar el núcleo del bot para añadir nuevas funciones.

📂 Estructura del Proyecto
VildboDravenhacks/
├── auth_info/
├── commands/
│   ├── Añadidor_de_Aliases/
│   │   └── http://addalias.js
│   ├── media/
│   │   └── http://vv.js
│   ├── menu/
│   │   └── http://menu.js
│   ├── Owner/
│   │   ├── http://restart.js
│   │   └── http://update.js
│   └── private/
│       └── http://push.js
├── plugins/
│   └── http://antiDelete.js
├── http://config.js
├── http://index.js
├── http://logger.js
└── http://package.json

📥 Instalación
📱 **Android Termux**
```bash
pkg update && pkg upgrade -y
pkg install git nodejs -y
termux-setup-storage
git clone https://github.com/sprohub/VildboDravenhacks
cd VildboDravenhacks
npm install
node index.js
💻 *Windows / Linux*
git clone https://github.com/sprohub/VildboDravenhacks
cd VildboDravenhacks
npm install
node index.js
⚙️ *PM2 Recomendado*
npm install -g pm2
pm2 start index.js --name vildbo
pm2 logs vildbo
pm2 save
📋 Comandos Disponibles
Comando	Función
`menu`	Mostrar menú
`vv`	Recuperar View Once
`addalias [comando] [alias]`	Añadir alias
`update`	Actualizar bot vía git pull
`restart`	Reiniciar bot
🔐 Seguridad
⚠️ *Nunca compartas*: `auth_info/` y `session.json`  
Estos archivos contienen las credenciales de tu sesión de WhatsApp.

⚠️ Descargo de Responsabilidad
Este proyecto ha sido desarrollado con fines educativos, de investigación y uso personal.

El autor no promueve ni se hace responsable del uso indebido de esta herramienta, incluyendo: violación de privacidad, acceso no autorizado, incumplimiento de términos de WhatsApp, o actividades ilegales.

Al utilizar VildboDravenhacks, aceptas que cualquier consecuencia derivada de su uso recaerá únicamente sobre quien lo ejecute o distribuya.

🔐 Advertencia de Seguridad
Nunca compartas ni publiques `auth_info/` ni `session.json`. La exposición permite acceso completo a tu cuenta de WhatsApp.

👨‍💻 Créditos
Basado en Draven_Hack por BrayanRK  
Repo actual: https://github.com/sprohub/VildboDravenhacks