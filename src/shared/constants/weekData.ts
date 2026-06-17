export interface WeekData {
  week: number;
  babySize: string;
  fruitEmoji: string;
  description: string;
}

export const PREGNANCY_WEEK_DATA: Record<number, WeekData> = {
  4:  { week: 4,  babySize: 'Semilla de amapola', fruitEmoji: '🌱', description: 'El embrión se está formando.' },
  8:  { week: 8,  babySize: 'Frambuesa', fruitEmoji: '🍒', description: 'Los órganos principales se desarrollan.' },
  12: { week: 12, babySize: 'Lima', fruitEmoji: '🍋', description: 'Ya tiene todos los dedos formados.' },
  16: { week: 16, babySize: 'Aguacate', fruitEmoji: '🥑', description: 'Puede oír tu voz.' },
  20: { week: 20, babySize: 'Plátano', fruitEmoji: '🍌', description: 'Mitad del camino, ¡felicidades!' },
  24: { week: 24, babySize: 'Mazorca de maíz', fruitEmoji: '🌽', description: 'Abre y cierra los ojos.' },
  28: { week: 28, babySize: 'Berenjena', fruitEmoji: '🍆', description: 'Tercer trimestre. El cerebro crece rápido.' },
  32: { week: 32, babySize: 'Calabaza', fruitEmoji: '🎃', description: 'Practica la respiración.' },
  36: { week: 36, babySize: 'Lechuga romana', fruitEmoji: '🥬', description: 'Ya está casi listo.' },
  40: { week: 40, babySize: 'Sandía pequeña', fruitEmoji: '🍉', description: '¡Fecha probable de parto!' },
};

export function getWeekData(week: number): WeekData {
  const keys = Object.keys(PREGNANCY_WEEK_DATA).map(Number).sort((a, b) => b - a);
  const match = keys.find((k) => week >= k);
  return PREGNANCY_WEEK_DATA[match ?? 4];
}
