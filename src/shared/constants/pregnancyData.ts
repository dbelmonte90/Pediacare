import type { ChecklistItem, Symptom, FAQItem, WeightEntry } from '@/entities/pregnancy/model/types';

// ─── Week-by-week data (all 40 weeks) ────────────────────────────────────────

export interface WeekData {
  week: number;
  babySize: string;
  fruitEmoji: string;
  description: string;
  length: string;  // cm
  weight: string;  // g or kg
}

export const PREGNANCY_WEEK_DATA: Record<number, WeekData> = {
  4:  { week: 4,  babySize: 'Semilla de amapola', fruitEmoji: '🌱', description: 'El embrión comienza a formarse. El corazón empieza a latir.', length: '0.2 cm', weight: '<1 g' },
  5:  { week: 5,  babySize: 'Semilla de sésamo', fruitEmoji: '🫘', description: 'Se forman el tubo neural, corazón y sistema circulatorio.', length: '0.4 cm', weight: '<1 g' },
  6:  { week: 6,  babySize: 'Lenteja', fruitEmoji: '🟤', description: 'El corazón late unas 100-160 veces por minuto.', length: '0.6 cm', weight: '<1 g' },
  7:  { week: 7,  babySize: 'Arándano', fruitEmoji: '🫐', description: 'Se forman los brazos, piernas, ojos y orejas.', length: '1 cm', weight: '<1 g' },
  8:  { week: 8,  babySize: 'Frambuesa', fruitEmoji: '🍒', description: 'Los órganos principales se desarrollan. Tiene 1 cm de largo.', length: '1.6 cm', weight: '1 g' },
  9:  { week: 9,  babySize: 'Aceituna', fruitEmoji: '🫒', description: 'Los músculos se están formando y puede moverse.', length: '2.3 cm', weight: '2 g' },
  10: { week: 10, babySize: 'Ciruela pequeña', fruitEmoji: '🍑', description: 'Ya no es embrión, ¡es un feto! Todos los órganos están presentes.', length: '3.1 cm', weight: '4 g' },
  11: { week: 11, babySize: 'Higo', fruitEmoji: '🫐', description: 'Los dedos están separados y las uñas empiezan a crecer.', length: '4.1 cm', weight: '7 g' },
  12: { week: 12, babySize: 'Lima', fruitEmoji: '🍋', description: 'Ya tiene todos los dedos formados. Puede bostezar.', length: '5.4 cm', weight: '14 g' },
  13: { week: 13, babySize: 'Guisante', fruitEmoji: '🟢', description: 'Fin del primer trimestre. El riesgo de aborto disminuye.', length: '7.4 cm', weight: '23 g' },
  14: { week: 14, babySize: 'Limón', fruitEmoji: '🍋', description: 'Puede hacer muecas y chuparse el pulgar.', length: '8.7 cm', weight: '43 g' },
  15: { week: 15, babySize: 'Manzana', fruitEmoji: '🍎', description: 'Los huesos están creciendo y endureciéndose.', length: '10.1 cm', weight: '70 g' },
  16: { week: 16, babySize: 'Aguacate', fruitEmoji: '🥑', description: 'Puede oír tu voz. Los ojos pueden detectar la luz.', length: '11.6 cm', weight: '100 g' },
  17: { week: 17, babySize: 'Nabo', fruitEmoji: '🥔', description: 'Se está formando el tejido adiposo bajo la piel.', length: '13 cm', weight: '140 g' },
  18: { week: 18, babySize: 'Pimiento', fruitEmoji: '🫑', description: 'Es posible que empieces a notar sus movimientos.', length: '14.2 cm', weight: '190 g' },
  19: { week: 19, babySize: 'Tomate', fruitEmoji: '🍅', description: 'Está cubierto de vérnix, una capa protectora.', length: '15.3 cm', weight: '240 g' },
  20: { week: 20, babySize: 'Plátano', fruitEmoji: '🍌', description: '¡Mitad del embarazo! Puede tragar y oye sonidos externos.', length: '25.6 cm', weight: '300 g' },
  21: { week: 21, babySize: 'Zanahoria', fruitEmoji: '🥕', description: 'Sus movimientos son más fuertes y coordinados.', length: '26.7 cm', weight: '360 g' },
  22: { week: 22, babySize: 'Papaya', fruitEmoji: '🥭', description: 'Sus párpados y cejas están bien formados.', length: '27.8 cm', weight: '430 g' },
  23: { week: 23, babySize: 'Berenjena pequeña', fruitEmoji: '🍆', description: 'La piel sigue siendo muy fina y arrugada.', length: '28.9 cm', weight: '500 g' },
  24: { week: 24, babySize: 'Mazorca de maíz', fruitEmoji: '🌽', description: 'Abre y cierra los ojos. Su cerebro se desarrolla rápidamente.', length: '30 cm', weight: '600 g' },
  25: { week: 25, babySize: 'Nabo grande', fruitEmoji: '🧅', description: 'Puede responder a sonidos y luz con el corazón.', length: '34.6 cm', weight: '660 g' },
  26: { week: 26, babySize: 'Lechuga', fruitEmoji: '🥬', description: 'Abre los ojos por primera vez. Sus pulmones maduran.', length: '35.6 cm', weight: '760 g' },
  27: { week: 27, babySize: 'Coliflor', fruitEmoji: '🥦', description: 'Empieza el tercer trimestre. El cerebro crece a gran velocidad.', length: '36.6 cm', weight: '875 g' },
  28: { week: 28, babySize: 'Berenjena', fruitEmoji: '🍆', description: 'Puede soñar en fase REM. Sus movimientos son muy activos.', length: '37.6 cm', weight: '1 kg' },
  29: { week: 29, babySize: 'Butternut', fruitEmoji: '🎃', description: 'Sus huesos están completamente formados, aunque blandos.', length: '38.6 cm', weight: '1.15 kg' },
  30: { week: 30, babySize: 'Repollo', fruitEmoji: '🥬', description: 'Practica la respiración. Sus uñas han llegado a las puntas de los dedos.', length: '39.9 cm', weight: '1.3 kg' },
  31: { week: 31, babySize: 'Coco', fruitEmoji: '🥥', description: 'Todos los sentidos están funcionando.', length: '41.1 cm', weight: '1.5 kg' },
  32: { week: 32, babySize: 'Calabaza', fruitEmoji: '🎃', description: 'Practica la respiración. Sus pies pueden caber en tu palma.', length: '42.4 cm', weight: '1.7 kg' },
  33: { week: 33, babySize: 'Piña', fruitEmoji: '🍍', description: 'Sus huesos se endurecen excepto el cráneo, que sigue flexible.', length: '43.7 cm', weight: '1.9 kg' },
  34: { week: 34, babySize: 'Melón cantalupo', fruitEmoji: '🍈', description: 'Sus pulmones están casi completamente maduros.', length: '45 cm', weight: '2.15 kg' },
  35: { week: 35, babySize: 'Melón honeydew', fruitEmoji: '🍈', description: 'Ocupa casi todo el espacio en el útero. Sus riñones están maduros.', length: '46.2 cm', weight: '2.38 kg' },
  36: { week: 36, babySize: 'Lechuga romana', fruitEmoji: '🥬', description: 'Está bajando hacia la pelvis. Ya está casi listo.', length: '47.4 cm', weight: '2.62 kg' },
  37: { week: 37, babySize: 'Acelga', fruitEmoji: '🥗', description: 'Se considera término temprano. Podría nacer en cualquier momento.', length: '48.6 cm', weight: '2.86 kg' },
  38: { week: 38, babySize: 'Puerro', fruitEmoji: '🥬', description: 'Sus órganos están listos para funcionar fuera del útero.', length: '49.8 cm', weight: '3.08 kg' },
  39: { week: 39, babySize: 'Sandía pequeña', fruitEmoji: '🍉', description: 'Es término completo. El bebé está listo para nacer.', length: '50.7 cm', weight: '3.28 kg' },
  40: { week: 40, babySize: 'Sandía', fruitEmoji: '🍉', description: '¡Fecha probable de parto! El bebé podría llegar en cualquier momento.', length: '51.2 cm', weight: '3.46 kg' },
};

export function getWeekData(week: number): WeekData {
  const keys = Object.keys(PREGNANCY_WEEK_DATA).map(Number).sort((a, b) => b - a);
  const match = keys.find((k) => week >= k);
  return PREGNANCY_WEEK_DATA[match ?? 4];
}

// ─── Prenatal checklist ───────────────────────────────────────────────────────

export const PRENATAL_CHECKLIST: ChecklistItem[] = [
  // Blood tests
  { id: 'bt-1', category: 'blood_tests', label: 'Analítica 1er trimestre', weekRange: 'Sem. 10-12' },
  { id: 'bt-2', category: 'blood_tests', label: 'Test prenatal no invasivo (NIPT)', weekRange: 'Sem. 10-14' },
  { id: 'bt-3', category: 'blood_tests', label: 'Analítica 2º trimestre', weekRange: 'Sem. 24-28' },
  { id: 'bt-4', category: 'blood_tests', label: "Test tolerancia glucosa (O'Sullivan)", weekRange: 'Sem. 24-28' },
  { id: 'bt-5', category: 'blood_tests', label: 'Estreptococo B (SGB)', weekRange: 'Sem. 35-37' },
  { id: 'bt-6', category: 'blood_tests', label: 'Analítica 3er trimestre', weekRange: 'Sem. 35-37' },

  // Ultrasounds
  { id: 'us-1', category: 'ultrasounds', label: 'Ecografía transvaginal inicial', weekRange: 'Sem. 6-8' },
  { id: 'us-2', category: 'ultrasounds', label: 'Ecografía 1er trimestre (translucencia nucal)', weekRange: 'Sem. 11-13' },
  { id: 'us-3', category: 'ultrasounds', label: 'Ecografía morfológica', weekRange: 'Sem. 18-22' },
  { id: 'us-4', category: 'ultrasounds', label: 'Ecografía 3er trimestre', weekRange: 'Sem. 28-32' },
  { id: 'us-5', category: 'ultrasounds', label: 'Ecografía biofísica final', weekRange: 'Sem. 36+' },

  // Vaccines
  { id: 'vac-1', category: 'vaccines', label: 'Vacuna tosferina (Tdpa)', weekRange: 'Sem. 27-36' },
  { id: 'vac-2', category: 'vaccines', label: 'Vacuna gripe (temporada)', weekRange: 'Oct–Mar' },
  { id: 'vac-3', category: 'vaccines', label: 'Vacuna COVID-19 (si no vacunada)' },

  // Supplements
  { id: 'sup-1', category: 'supplements', label: 'Ácido fólico (400-800 mcg)', weekRange: 'Desde antes' },
  { id: 'sup-2', category: 'supplements', label: 'Yodo (200 mcg/día)', weekRange: 'Todo el embarazo' },
  { id: 'sup-3', category: 'supplements', label: 'Vitamina D (si prescrita)', weekRange: 'Según análisis' },
  { id: 'sup-4', category: 'supplements', label: 'Hierro (si anemia)', weekRange: 'Según análisis' },
  { id: 'sup-5', category: 'supplements', label: 'Omega-3 DHA (200 mg)', weekRange: 'Todo el embarazo' },

  // Birth plan
  { id: 'bp-1', category: 'birth_plan', label: 'Informarme sobre opciones de analgesia' },
  { id: 'bp-2', category: 'birth_plan', label: 'Decidir tipo de parto deseado' },
  { id: 'bp-3', category: 'birth_plan', label: 'Redactar el plan de parto' },
  { id: 'bp-4', category: 'birth_plan', label: 'Visita preanestesia al hospital', weekRange: 'Sem. 32-36' },
  { id: 'bp-5', category: 'birth_plan', label: 'Entregar plan de parto al hospital', weekRange: 'Sem. 36-38' },
  { id: 'bp-6', category: 'birth_plan', label: 'Curso de preparación al parto' },

  // Hospital bag
  { id: 'hb-1', category: 'hospital_bag', label: 'DNI, tarjeta sanitaria y cartilla' },
  { id: 'hb-2', category: 'hospital_bag', label: 'Ropa cómoda para el parto (camisón)' },
  { id: 'hb-3', category: 'hospital_bag', label: 'Ropa para bebé (3-5 mudas + gorrito)' },
  { id: 'hb-4', category: 'hospital_bag', label: 'Pañales recién nacido (talla 0/1)' },
  { id: 'hb-5', category: 'hospital_bag', label: 'Artículos de higiene personal' },
  { id: 'hb-6', category: 'hospital_bag', label: 'Almohada de lactancia' },
  { id: 'hb-7', category: 'hospital_bag', label: 'Cargador de móvil + música/auriculares' },
  { id: 'hb-8', category: 'hospital_bag', label: 'Snacks y bebidas para el acompañante' },
  { id: 'hb-9', category: 'hospital_bag', label: 'Silla de coche instalada' },
];

// ─── Symptoms by trimester ────────────────────────────────────────────────────

export const PREGNANCY_SYMPTOMS: Symptom[] = [
  // Trimester 1
  { id: 's-1', trimester: 1, label: 'Náuseas y vómitos', urgency: 'info', advice: 'Come en pequeñas cantidades frecuentes. El jengibre y las galletas saladas pueden ayudar. Si no puedes retener líquidos, consulta a tu médico.' },
  { id: 's-2', trimester: 1, label: 'Cansancio extremo', urgency: 'info', advice: 'Es completamente normal en el primer trimestre. Duerme todo lo que puedas. Tu cuerpo trabaja mucho formando la placenta.' },
  { id: 's-3', trimester: 1, label: 'Sangrado de implantación', urgency: 'warning', advice: 'Un pequeño manchado rosado o marrón puede ser normal. Si el sangrado es abundante, rojo o acompañado de dolor, acude a urgencias.' },
  { id: 's-4', trimester: 1, label: 'Mareos y desmayos', urgency: 'info', advice: 'Levántate despacio, come algo ligero al despertar. Mantente hidratada y evita estar de pie mucho tiempo.' },
  { id: 's-5', trimester: 1, label: 'Pechos sensibles e hinchados', urgency: 'info', advice: 'Usa sujetadores de maternidad con buena sujeción. Es una señal de que las hormonas están trabajando correctamente.' },
  { id: 's-6', trimester: 1, label: 'Cambios de humor', urgency: 'info', advice: 'Las fluctuaciones hormonales son las responsables. Habla con tu pareja y personas cercanas. Es completamente normal.' },

  // Trimester 2
  { id: 's-7', trimester: 2, label: 'Dolor lumbar y pelviano', urgency: 'info', advice: 'El centro de gravedad cambia al crecer el vientre. Ejercicio suave (yoga prenatal), calor local y una buena postura ayudan mucho.' },
  { id: 's-8', trimester: 2, label: 'Hinchazón en pies y tobillos', urgency: 'info', advice: 'Eleva los pies cuando puedas, reduce el sodio y mantente hidratada. Si la hinchazón es repentina, intensa o acompañada de dolor de cabeza, consulta.' },
  { id: 's-9', trimester: 2, label: 'Contracciones Braxton Hicks', urgency: 'warning', advice: 'Son irregulares, sin ritmo y no duelen. Si se vuelven regulares (cada 5-10 min), aumentan en intensidad o rompes aguas, ve al hospital.' },
  { id: 's-10', trimester: 2, label: 'Manchas en la piel (cloasma)', urgency: 'info', advice: 'Usa protector solar SPF 50+ cada día. Las manchas hormonales suelen desaparecer tras el parto.' },
  { id: 's-11', trimester: 2, label: 'Estrías', urgency: 'info', advice: 'Hidrata la piel con aceite de rosa mosqueta o manteca de karité. No se pueden prevenir del todo, pero la hidratación reduce su aparición.' },
  { id: 's-12', trimester: 2, label: 'Ardor de estómago', urgency: 'info', advice: 'Comidas pequeñas y frecuentes. No te acuestes hasta 2h después de comer. Eleva ligeramente la cabecera de la cama.' },

  // Trimester 3
  { id: 's-13', trimester: 3, label: 'Dificultad para dormir', urgency: 'info', advice: 'Coloca una almohada entre las rodillas y otra bajo el vientre. Duérmete sobre el lado izquierdo para mejorar la circulación.' },
  { id: 's-14', trimester: 3, label: 'Presión pélvica intensa', urgency: 'info', advice: 'El bebé está bajando hacia la pelvis, señal de que se prepara. El fisioterapeuta de suelo pélvico puede ayudarte a aliviar la presión.' },
  { id: 's-15', trimester: 3, label: 'Dificultad para respirar', urgency: 'info', advice: 'El útero presiona el diafragma. Mantén una postura erguida y duerme semi-incorporada si es necesario.' },
  { id: 's-16', trimester: 3, label: 'Contracciones regulares', urgency: 'urgent', advice: '🚨 Si las contracciones son regulares cada 5 minutos durante 1 hora, o si son muy dolorosas, dirígete al hospital inmediatamente.' },
  { id: 's-17', trimester: 3, label: 'Pérdida de líquido amniótico', urgency: 'urgent', advice: '🚨 Si sientes un chorro de líquido o una pérdida constante, se ha roto la bolsa. Dirígete al hospital inmediatamente aunque no tengas contracciones.' },
  { id: 's-18', trimester: 3, label: 'Reducción de movimientos fetales', urgency: 'urgent', advice: '🚨 Si notas menos de 10 movimientos en 2 horas (cuenta de patadas), llama a tu médico o ve a urgencias. No esperes.' },
];

// ─── FAQ validada por Dra. Saray Mesonero ────────────────────────────────────

export const PREGNANCY_FAQ: FAQItem[] = [
  {
    id: 'faq-1',
    question: '¿Cuándo debo ir a urgencias?',
    answer: 'Ve a urgencias si tienes: sangrado abundante o con coágulos, dolor abdominal intenso y constante, fiebre superior a 38°C, pérdida de líquido amniótico, contracciones regulares antes de la semana 37, visión borrosa o manchas, dolor de cabeza intenso que no cede, o si notas que el bebé se mueve menos de lo habitual.',
  },
  {
    id: 'faq-2',
    question: '¿Puedo hacer ejercicio durante el embarazo?',
    answer: 'Sí, el ejercicio moderado es muy beneficioso. Caminar, yoga prenatal, natación y pilates adaptado son ideales. Evita deportes de impacto alto, de contacto, buceo y actividades con riesgo de caída. El objetivo es mantener el ritmo cardíaco por debajo de 140 ppm. Consulta siempre con tu médico si tienes dudas.',
  },
  {
    id: 'faq-3',
    question: '¿Qué alimentos debo evitar?',
    answer: 'Evita: pescados con alto contenido en mercurio (atún rojo, pez espada, tiburón), carne y huevos crudos o poco cocinados, quesos no pasteurizados y de corteza blanda, embutidos y fiambres sin calentar, patés refrigerados, alcohol (ninguna cantidad es segura) y cafeína en exceso (máximo 200 mg/día, equivale a 1-2 cafés).',
  },
  {
    id: 'faq-4',
    question: '¿Son normales las contracciones Braxton Hicks?',
    answer: 'Sí, son contracciones de entrenamiento completamente normales desde la segunda mitad del embarazo. Son irregulares, no siguen un patrón, no son dolorosas (puede ser molestia) y ceden al cambiar de postura o caminar. Si se vuelven regulares, aumentan en intensidad, van acompañadas de sangrado o pérdida de líquido, acude al hospital.',
  },
  {
    id: 'faq-5',
    question: '¿Cuándo empezaré a notar los movimientos del bebé?',
    answer: 'En primíparas (primer embarazo) generalmente entre las semanas 18 y 22, como pequeños burbujeos o aleteos. En embarazos posteriores, a partir de la semana 16. A partir de la semana 28, es recomendable contar los movimientos: deberías notar al menos 10 en 2 horas. Si no es así, contacta con tu médico.',
  },
  {
    id: 'faq-6',
    question: '¿Qué es el plan de parto y cómo lo hago?',
    answer: 'El plan de parto es un documento donde expresas tus deseos y preferencias para el proceso del parto: tipo de analgesia (epidural, protóxido, sin medicación), posiciones para dilatar y pujar, quién te acompaña, cómo quieres el alumbramiento, contacto piel con piel inmediato, lactancia y primer baño del bebé. Se entrega al hospital en la semana 36-38.',
  },
  {
    id: 'faq-7',
    question: '¿Cuánto peso es normal ganar durante el embarazo?',
    answer: 'Depende de tu peso previo. Si tenías normopeso: 11,5-16 kg. Bajo peso: 12,5-18 kg. Sobrepeso: 7-11,5 kg. Obesidad: 5-9 kg. La mayor ganancia se produce en el segundo y tercer trimestre (500 g/semana en promedio). No hagas dietas restrictivas; come de forma saludable y variada.',
  },
  {
    id: 'faq-8',
    question: '¿Puedo viajar durante el embarazo?',
    answer: 'El segundo trimestre (semanas 14-28) es el momento más seguro para viajar. Evita viajes largos en el tercer trimestre y a partir de la semana 36 la mayoría de aerolíneas no permiten volar. En coche, para cada 2 horas para caminar. En avión, levántate frecuentemente, lleva medias de compresión y mantente muy hidratada.',
  },
];

// ─── Mock weight entries ──────────────────────────────────────────────────────

export const MOCK_WEIGHT_ENTRIES: WeightEntry[] = [
  { date: '2026-01-08', weight: 62.0 },
  { date: '2026-01-22', weight: 62.3 },
  { date: '2026-02-05', weight: 62.8 },
  { date: '2026-02-19', weight: 63.4 },
  { date: '2026-03-05', weight: 64.1 },
  { date: '2026-03-19', weight: 64.8 },
  { date: '2026-04-02', weight: 65.6 },
  { date: '2026-04-16', weight: 66.2 },
];
