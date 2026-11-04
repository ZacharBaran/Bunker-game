import { getRandom } from "./helpers";

const RaceData = {
  // 1% Шанс
  NONE: [
    {
      title: "Невідоме",
      details: "Фактично ви можете жити вічно",
    },
  ],
  // 5% Шанс
  CATMAN: [
    {
      title: "Котелюд",
      details: "Прекрасні полювальники, можна використовува кігті як озброєння",
    },
  ],
  // 5% Шанс
  ELF: [
    {
      title: "Эльф",
      details: "Підвищений інтелект",
    },
  ],
  // 5% Шанс
  GNOM: [
    {
      title: "Гном",
      details:
        "Прекрасний інженер(може створювати різні структури в залежності від кількості матеріалів)",
    },
  ],
  // 5% Шанс
  ORK: [
    {
      title: "Орк",
      details: "Підвищена мускулатура",
    },
  ],
  // 5% Шанс
  DWORF: [
    {
      title: "Дворф",
      details: "Знає толк в гірництві, відмінні ковалі",
    },
  ],
  // 74% Шанс
  HUMAN: [
    {
      title: "Людина",
      details: "Ви просто людина",
    },
  ],
};

export function generateRaceSexAge() {
  let Age;
  let Height;
  let Sex;
  // Генеруємо Race
  const randomValue = Math.floor(Math.random() * 100) + 1;
  let selectedArray;
  // 1. NONE (Невідоме): 1% шанс (99-100)
  if (randomValue >= 99) {
    // 1. NONE (Невідоме): 1% шанс (99-100)
    selectedArray = RaceData.NONE;
    Age = Math.floor(Math.random() * 9991) + 19;
    Height = Math.floor(Math.random() * 151) + 150;
  } else if (randomValue >= 93) {
    // 2. CATMAN (Котелюд): 6% шанс (93-98)
    selectedArray = RaceData.CATMAN;
    Age = Math.floor(Math.random() * 85) + 19;
    Height = Math.floor(Math.random() * 91) + 100;
  } else if (randomValue >= 87) {
    // 3. ELF (Ельф): 6% шанс (87-92)
    selectedArray = RaceData.ELF;
    Age = Math.floor(Math.random() * 991) + 19;
    Height = Math.floor(Math.random() * 121) + 130;
  } else if (randomValue >= 81) {
    // 4. GNOM (Гном): 6% шанс (81-86)
    selectedArray = RaceData.GNOM;
    Age = Math.floor(Math.random() * 481) + 19;
    Height = Math.floor(Math.random() * 61) + 40;
  } else if (randomValue >= 75) {
    // 5. ORK (Орк): 6% шанс (75-80)
    selectedArray = RaceData.ORK;
    Age = Math.floor(Math.random() * 71) + 19;
    Height = Math.floor(Math.random() * 101) + 100;
  } else if (randomValue >= 69) {
    // 6. DWORF (Дворф): 6% шанс (69-74)
    selectedArray = RaceData.DWORF;
    Age = Math.floor(Math.random() * 331) + 19;
    Height = Math.floor(Math.random() * 81) + 70;
  } else {
    // 7. HUMAN (Людина): 69% шанс (1-68)
    selectedArray = RaceData.HUMAN;
    Age = Math.floor(Math.random() * 76) + 19;
    Height = Math.floor(Math.random() * 49) + 151;
  }
  const randomRace = getRandom(selectedArray);
  // 2. Генерація Статі
  if (randomRace.title === "Без статевий" || randomValue >= 99) {
    Sex = "Без статевий";
  } else {
    let sexRoll = Math.floor(Math.random() * 2) + 1;
    Sex = sexRoll === 1 ? "Чоловіча" : "Жіноча";
  }
  return {
    race: randomRace,
    Sex: Sex,
    Age: Age,
    Height: Height,
  };
}
