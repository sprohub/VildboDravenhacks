export default {
  name: "clima",
  aliases: ["weather", "tiempo"],

  async run(sock, msg, args, chatId) {
    const ciudad = args.join(" ").trim();

    if (!ciudad) {
      return sock.sendMessage(chatId, {
        text: "❌ *Uso:* .clima [ciudad]\n\nEjemplo: `.clima Bogotá`"
      }, { quoted: msg });
    }

    try {
      const url = `https://wttr.in/${encodeURIComponent(ciudad)}?format=j1&lang=es`;
      const res  = await fetch(url);

      if (!res.ok) throw new Error("Ciudad no encontrada");

      const data    = await res.json();
      const current = data.current_condition[0];
      const area    = data.nearest_area[0];

      const lugar     = area.areaName[0].value;
      const pais      = area.country[0].value;
      const tempC     = current.temp_C;
      const tempF     = current.temp_F;
      const sensacion = current.FeelsLikeC;
      const humedad   = current.humidity;
      const viento    = current.windspeedKmph;
      const desc      = current.lang_es?.[0]?.value || current.weatherDesc[0].value;
      const uvIndex   = current.uvIndex;
      const visib     = current.visibility;

      // Emoji según descripción
      const emoji =
        desc.toLowerCase().includes("sol") || desc.toLowerCase().includes("despejado") ? "☀️" :
        desc.toLowerCase().includes("nube") ? "⛅" :
        desc.toLowerCase().includes("lluvi") ? "🌧️" :
        desc.toLowerCase().includes("tormenta") ? "⛈️" :
        desc.toLowerCase().includes("nieve") ? "❄️" :
        desc.toLowerCase().includes("niebla") ? "🌫️" : "🌡️";

      // Próximas horas
      const horas = data.weather[0].hourly
        .slice(0, 4)
        .map(h => {
          const hora = String(parseInt(h.time) / 100).padStart(2, "0") + ":00";
          return `  ${hora} → ${h.tempC}°C ${h.lang_es?.[0]?.value || h.weatherDesc[0].value}`;
        }).join("\n");

      await sock.sendMessage(chatId, {
        text: [
          `${emoji} *Clima en ${lugar}, ${pais}*`,
          "",
          `🌡️ *Temperatura:*  ${tempC}°C / ${tempF}°F`,
          `🤔 *Sensación:*    ${sensacion}°C`,
          `💧 *Humedad:*      ${humedad}%`,
          `💨 *Viento:*       ${viento} km/h`,
          `👁️ *Visibilidad:*  ${visib} km`,
          `☀️ *Índice UV:*    ${uvIndex}`,
          `📋 *Condición:*    ${desc}`,
          "",
          "⏰ *Próximas horas:*",
          horas,
        ].join("\n")
      }, { quoted: msg });

    } catch (e) {
      await sock.sendMessage(chatId, {
        text: `❌ No se pudo obtener el clima de *${ciudad}*\n\nVerifica el nombre de la ciudad.`
      }, { quoted: msg });
    }
  }
};