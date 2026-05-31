import fs from "fs";

export function loadJSON(file, defaultValue = {}) {
  try {
    if (!fs.existsSync(file)) {
      fs.writeFileSync(
        file,
        JSON.stringify(defaultValue, null, 2)
      );
      return defaultValue;
    }

    return JSON.parse(
      fs.readFileSync(file, "utf8")
    );

  } catch {
    return defaultValue;
  }
}

export function saveJSON(file, data) {
  fs.writeFileSync(
    file,
    JSON.stringify(data, null, 2)
  );
}