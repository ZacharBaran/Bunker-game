import { getRandom } from "./helpers";

const bodyData = {
  // 5% Шанс — Виняткова фізична форма
  PERFECT: [
    {
      title: "Інструктор з йоги",
      details: "Ідеальна гнучкість, витривалість та контроль дихання.",
    },
    {
      title: "Марафонський бігун",
      details: "Сталеві легені, працює годинами без втоми.",
    },
    {
      title: "Важковаговик-силовик",
      details: "Неймовірна сила, легко піднімає важкі завали.",
    },
  ],

  // 25% Шанс — Добра фізична форма
  GOOD: [
    {
      title: "Любитель паркуру",
      details: "Швидка реакція, висока мобільність і координація.",
    },
    {
      title: "Гірський турист",
      details: "Звик до важких рюкзаків і холоду.",
    },
    {
      title: "Пловець",
      details: "Витривалий, має міцний плечовий пояс.",
    },
  ],

  // 40% Шанс — Середня форма
  AVERAGE: [
    {
      title: "Офісний працівник",
      details: "Звичайна форма, злегка сутула спина.",
    },
    {
      title: "Дачник",
      details: "Звик до сезонної фізичної праці.",
    },
    {
      title: "Помірно активний",
      details: "Помірний тонус, потребує повноцінного відпочинку.",
    },
  ],

  // 20% Шанс — Слабке тіло
  WEAK: [
    {
      title: "Домашній геймер",
      details: "Слабкі м'язи, швидка задишка від бігу.",
    },
    {
      title: "Дохлик",
      details: "Дуже худий, швидко замерзає в холоді.",
    },
    {
      title: "Малорухливий містянин",
      details: "Зайва вага, важко підніматися сходами.",
    },
  ],

  // 10% Шанс — Критична форма
  CRITICAL: [
    {
      title: "Важке ожиріння",
      details: "Низька мобільність, важко проходити крізь люки.",
    },
    {
      title: "М'язова атрофія",
      details: "Хвороблива виснаженість, будь-який рух викликає біль.",
    },
  ],
};

export function generateBodyStatus() {
  const randomValue = Math.floor(Math.random() * 100) + 1;
  let selectedArray;

  if (randomValue >= 96) {
    // 5% шанс (96-100)
    selectedArray = bodyData.PERFECT;
  } else if (randomValue >= 71) {
    // 25% шанс (71-95)
    selectedArray = bodyData.GOOD;
  } else if (randomValue >= 21) {
    // 50% шанс (21-70)
    selectedArray = bodyData.AVERAGE;
  } else if (randomValue >= 6) {
    // 15% шанс (6-20)
    selectedArray = bodyData.WEAK;
  } else {
    // 5% шанс (1-10)
    selectedArray = bodyData.CRITICAL;
  }

  return getRandom(selectedArray);
}
