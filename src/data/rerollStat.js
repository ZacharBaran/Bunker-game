import { generateProfession, rareProfession } from "./profession";
import { generateHealthStatus } from "./health";
import { generateBodyStatus } from "./body";
import { generateBaggage } from "./baggage";
import { generateDopInfo } from "./DopInfo";
import { getRandomKnowledge } from "./knowledges";
import { getRandombigItem } from "./BigInventory";

const formatResult = (val) => {
  if (val === null || val === undefined) return "";
  if (typeof val === "string") return val;
  if (typeof val === "number" || typeof val === "boolean") return String(val);

  if (Array.isArray(val)) {
    return val.map(formatResult).filter(Boolean).join(", ");
  }

  if (typeof val === "object") {
    // 👈 Повертаємо тільки чисту назву професії
    if (val.name) return val.name;

    const parts = Object.values(val).map(formatResult).filter(Boolean);
    return parts.join(" — ");
  }

  return String(val);
};

export const getNewStatValue = (traitKey) => {
  try {
    switch (traitKey) {
      case "profession": {
        const res =
          typeof generateProfession === "function"
            ? generateProfession()
            : "Без професії";
        return formatResult(res);
      }
      case "rareProfession":
      case "professionExp": {
        const res =
          typeof rareProfession === "function"
            ? rareProfession()
            : "(початківець)";
        return formatResult(res);
      }
      case "health": {
        const res =
          typeof generateHealthStatus === "function"
            ? generateHealthStatus()
            : "Здоровий";
        return formatResult(res);
      }
      case "body": {
        const res =
          typeof generateBodyStatus === "function"
            ? generateBodyStatus()
            : "Звичайна";
        return formatResult(res);
      }
      case "baggage": {
        const res =
          typeof generateBaggage === "function"
            ? generateBaggage()
            : ["Предмет"];
        return formatResult(res);
      }
      case "dopInfo":
      case "DopInfo": {
        const res =
          typeof generateDopInfo === "function" ? generateDopInfo() : "Немає";
        return formatResult(res);
      }
      case "knowledge": {
        const res =
          typeof getRandomKnowledge === "function"
            ? getRandomKnowledge()
            : "Немає знань";
        return formatResult(res);
      }
      case "BigInventory": {
        const res =
          typeof getRandombigItem === "function"
            ? getRandombigItem()
            : "Порожньо";
        return formatResult(res);
      }
      default:
        return null;
    }
  } catch (err) {
    console.error("Помилка реролу:", err);
    return "Помилка";
  }
};
