export function getRandom(arr) {
  const randomIndex = Math.floor(Math.random() * arr.length);
  return arr[randomIndex];
}

export function getYearDeclension(c) {
  if (c % 100 >= 11 && c % 100 <= 19) return "років";
  const l = c % 10;
  if (l === 1) return "рік";
  if (l >= 2 && l <= 4) return "роки";
  return "років";
}
