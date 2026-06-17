import type { Milestone } from '@/entities/development/model/types';
import type { MilestoneCategory } from '@/entities/development/model/types';

export const CATEGORY_CONFIG: Record<MilestoneCategory, { color: string; emoji: string; label: string }> = {
  motor:       { color: '#0EA5E9', emoji: '🏃', label: 'Motor' },
  cognitive:   { color: '#8B5CF6', emoji: '🧠', label: 'Cognitivo' },
  language:    { color: '#F4614A', emoji: '💬', label: 'Lenguaje' },
  social:      { color: '#10B981', emoji: '🤝', label: 'Social' },
  educational: { color: '#F59E0B', emoji: '📚', label: 'Educativo' },
};

export const MILESTONES: Milestone[] = [
  // ── 0-12 months ────────────────────────────────────────────────────────────
  { id: 'dev-0-mot-1', category: 'motor',       ageGroup: '0-12 meses', ageMonthsMin: 0,  ageMonthsMax: 3,  title: 'Sostiene la cabeza',               description: 'El bebé levanta y sostiene la cabeza brevemente cuando está boca abajo.' },
  { id: 'dev-0-mot-2', category: 'motor',       ageGroup: '0-12 meses', ageMonthsMin: 3,  ageMonthsMax: 6,  title: 'Se apoya en los antebrazos',        description: 'En posición prona, se apoya en los antebrazos y levanta el pecho.' },
  { id: 'dev-0-mot-3', category: 'motor',       ageGroup: '0-12 meses', ageMonthsMin: 4,  ageMonthsMax: 7,  title: 'Se gira solo (prono → supino)',      description: 'Rueda de boca abajo a boca arriba de forma voluntaria.' },
  { id: 'dev-0-mot-4', category: 'motor',       ageGroup: '0-12 meses', ageMonthsMin: 6,  ageMonthsMax: 9,  title: 'Se sienta sin apoyo',               description: 'Mantiene la posición sentada de forma estable sin necesitar apoyo externo.' },
  { id: 'dev-0-mot-5', category: 'motor',       ageGroup: '0-12 meses', ageMonthsMin: 9,  ageMonthsMax: 13, title: 'Gatea con coordinación',            description: 'Se desplaza gateando alternando brazos y piernas de forma coordinada.' },

  { id: 'dev-0-cog-1', category: 'cognitive',   ageGroup: '0-12 meses', ageMonthsMin: 0,  ageMonthsMax: 2,  title: 'Sigue objetos con la mirada',       description: 'Rastrea visualmente un objeto que se mueve de un lado a otro.' },
  { id: 'dev-0-cog-2', category: 'cognitive',   ageGroup: '0-12 meses', ageMonthsMin: 4,  ageMonthsMax: 7,  title: 'Explora objetos con las manos',     description: 'Agarra y examina objetos, los pasa de una mano a la otra.' },
  { id: 'dev-0-cog-3', category: 'cognitive',   ageGroup: '0-12 meses', ageMonthsMin: 8,  ageMonthsMax: 12, title: 'Permanencia del objeto',            description: 'Busca un objeto que acaba de ser ocultado, demostrando permanencia del objeto.' },

  { id: 'dev-0-lan-1', category: 'language',    ageGroup: '0-12 meses', ageMonthsMin: 1,  ageMonthsMax: 3,  title: 'Emite sonidos vocálicos',           description: 'Produce sonidos como "aaah" o "oooh" en respuesta a estímulos.' },
  { id: 'dev-0-lan-2', category: 'language',    ageGroup: '0-12 meses', ageMonthsMin: 4,  ageMonthsMax: 7,  title: 'Balbuceo consonante-vocal',         description: 'Repite sílabas simples: "ba-ba", "ma-ma", "da-da".' },
  { id: 'dev-0-lan-3', category: 'language',    ageGroup: '0-12 meses', ageMonthsMin: 9,  ageMonthsMax: 13, title: 'Primeras palabras',                 description: 'Dice al menos una o dos palabras con significado ("mama", "papa", "agua").' },

  { id: 'dev-0-soc-1', category: 'social',      ageGroup: '0-12 meses', ageMonthsMin: 1,  ageMonthsMax: 3,  title: 'Sonrisa social',                    description: 'Sonríe en respuesta al rostro o la voz de un cuidador conocido.' },
  { id: 'dev-0-soc-2', category: 'social',      ageGroup: '0-12 meses', ageMonthsMin: 5,  ageMonthsMax: 9,  title: 'Reconoce personas conocidas',       description: 'Muestra preferencia por cuidadores principales y puede mostrar ansiedad ante extraños.' },
  { id: 'dev-0-soc-3', category: 'social',      ageGroup: '0-12 meses', ageMonthsMin: 8,  ageMonthsMax: 12, title: 'Juego de dar y tomar',              description: 'Participa en intercambios simples: ofrece y acepta objetos.' },

  { id: 'dev-0-edu-1', category: 'educational', ageGroup: '0-12 meses', ageMonthsMin: 0,  ageMonthsMax: 4,  title: 'Responde a su nombre',              description: 'Gira la cabeza o reacciona al escuchar su propio nombre.' },
  { id: 'dev-0-edu-2', category: 'educational', ageGroup: '0-12 meses', ageMonthsMin: 5,  ageMonthsMax: 9,  title: 'Imita gestos simples',              description: 'Copia gestos como aplaudir o agitar la mano.' },
  { id: 'dev-0-edu-3', category: 'educational', ageGroup: '0-12 meses', ageMonthsMin: 9,  ageMonthsMax: 13, title: 'Señala para comunicarse',           description: 'Usa el dedo índice para señalar objetos de interés o para pedir.' },

  // ── 1-2 years ──────────────────────────────────────────────────────────────
  { id: 'dev-1-mot-1', category: 'motor',       ageGroup: '1-2 años',   ageMonthsMin: 10, ageMonthsMax: 15, title: 'Camina de forma independiente',     description: 'Da pasos sin apoyo manteniendo el equilibrio.' },
  { id: 'dev-1-mot-2', category: 'motor',       ageGroup: '1-2 años',   ageMonthsMin: 13, ageMonthsMax: 18, title: 'Sube escaleras con apoyo',          description: 'Asciende escalones apoyándose en la pared o barandilla.' },
  { id: 'dev-1-mot-3', category: 'motor',       ageGroup: '1-2 años',   ageMonthsMin: 15, ageMonthsMax: 24, title: 'Corre con cierta torpeza',          description: 'Se desplaza corriendo aunque con movimiento aún poco coordinado.' },

  { id: 'dev-1-cog-1', category: 'cognitive',   ageGroup: '1-2 años',   ageMonthsMin: 12, ageMonthsMax: 18, title: 'Juego de causa y efecto',           description: 'Activa intencionalmente botones o mecanismos para producir efectos.' },
  { id: 'dev-1-cog-2', category: 'cognitive',   ageGroup: '1-2 años',   ageMonthsMin: 14, ageMonthsMax: 20, title: 'Encaja formas simples',             description: 'Introduce figuras básicas (círculo, cuadrado) en sus orificios correspondientes.' },
  { id: 'dev-1-cog-3', category: 'cognitive',   ageGroup: '1-2 años',   ageMonthsMin: 18, ageMonthsMax: 24, title: 'Juego simbólico inicial',           description: 'Imita acciones cotidianas: da de comer a un muñeco, habla por teléfono de juguete.' },

  { id: 'dev-1-lan-1', category: 'language',    ageGroup: '1-2 años',   ageMonthsMin: 12, ageMonthsMax: 18, title: 'Vocabulario de 5-10 palabras',      description: 'Usa entre 5 y 10 palabras con significado de forma consistente.' },
  { id: 'dev-1-lan-2', category: 'language',    ageGroup: '1-2 años',   ageMonthsMin: 16, ageMonthsMax: 22, title: 'Combina dos palabras',              description: 'Forma frases de dos palabras: "más agua", "papá aquí", "pelota no".' },
  { id: 'dev-1-lan-3', category: 'language',    ageGroup: '1-2 años',   ageMonthsMin: 20, ageMonthsMax: 24, title: 'Vocabulario de 50+ palabras',       description: 'Maneja al menos 50 palabras y se le entiende la mayor parte del tiempo.' },

  { id: 'dev-1-soc-1', category: 'social',      ageGroup: '1-2 años',   ageMonthsMin: 12, ageMonthsMax: 18, title: 'Juega junto a otros niños',         description: 'Juega en paralelo junto a otros niños sin interacción directa aún.' },
  { id: 'dev-1-soc-2', category: 'social',      ageGroup: '1-2 años',   ageMonthsMin: 14, ageMonthsMax: 20, title: 'Muestra afecto espontáneo',         description: 'Abraza, besa o acurruca a personas queridas por iniciativa propia.' },
  { id: 'dev-1-soc-3', category: 'social',      ageGroup: '1-2 años',   ageMonthsMin: 18, ageMonthsMax: 24, title: 'Comienza a mostrar empatía',        description: 'Reacciona cuando otro niño o adulto llora, a veces ofreciendo consuelo.' },

  { id: 'dev-1-edu-1', category: 'educational', ageGroup: '1-2 años',   ageMonthsMin: 12, ageMonthsMax: 18, title: 'Sigue instrucciones simples',       description: 'Comprende y realiza órdenes de un paso: "dame el juguete", "ven aquí".' },
  { id: 'dev-1-edu-2', category: 'educational', ageGroup: '1-2 años',   ageMonthsMin: 15, ageMonthsMax: 21, title: 'Identifica objetos por nombre',     description: 'Señala o coge el objeto correcto cuando se lo nombran.' },
  { id: 'dev-1-edu-3', category: 'educational', ageGroup: '1-2 años',   ageMonthsMin: 18, ageMonthsMax: 24, title: 'Imita garabatos',                   description: 'Coge un lápiz o cera e intenta hacer marcas en el papel imitando al adulto.' },

  // ── 2-4 years ──────────────────────────────────────────────────────────────
  { id: 'dev-2-mot-1', category: 'motor',       ageGroup: '2-4 años',   ageMonthsMin: 24, ageMonthsMax: 30, title: 'Salta con los dos pies',            description: 'Da saltos con ambos pies a la vez, despegando del suelo.' },
  { id: 'dev-2-mot-2', category: 'motor',       ageGroup: '2-4 años',   ageMonthsMin: 28, ageMonthsMax: 36, title: 'Pedalea en triciclo',               description: 'Pedalea y dirige un triciclo de forma autónoma.' },
  { id: 'dev-2-mot-3', category: 'motor',       ageGroup: '2-4 años',   ageMonthsMin: 30, ageMonthsMax: 48, title: 'Se mantiene sobre un pie',          description: 'Mantiene el equilibrio sobre un pie durante al menos 2 segundos.' },

  { id: 'dev-2-cog-1', category: 'cognitive',   ageGroup: '2-4 años',   ageMonthsMin: 24, ageMonthsMax: 30, title: 'Clasifica por color o forma',       description: 'Agrupa objetos según su color, forma o tamaño.' },
  { id: 'dev-2-cog-2', category: 'cognitive',   ageGroup: '2-4 años',   ageMonthsMin: 28, ageMonthsMax: 36, title: 'Puzzle de 4-6 piezas',              description: 'Completa puzzles sencillos de 4 a 6 piezas sin ayuda.' },
  { id: 'dev-2-cog-3', category: 'cognitive',   ageGroup: '2-4 años',   ageMonthsMin: 36, ageMonthsMax: 48, title: 'Entiende el concepto de "después"',  description: 'Comprende la secuencia temporal básica: antes, ahora, después.' },

  { id: 'dev-2-lan-1', category: 'language',    ageGroup: '2-4 años',   ageMonthsMin: 24, ageMonthsMax: 30, title: 'Frases de 3-4 palabras',            description: 'Construye frases de tres o cuatro palabras con sentido.' },
  { id: 'dev-2-lan-2', category: 'language',    ageGroup: '2-4 años',   ageMonthsMin: 30, ageMonthsMax: 40, title: 'Hace preguntas con "por qué"',       description: 'Utiliza frecuentemente "¿por qué?" para explorar el mundo.' },
  { id: 'dev-2-lan-3', category: 'language',    ageGroup: '2-4 años',   ageMonthsMin: 36, ageMonthsMax: 48, title: 'Cuenta experiencias pasadas',        description: 'Narra eventos recientes con cierto orden y coherencia.' },

  { id: 'dev-2-soc-1', category: 'social',      ageGroup: '2-4 años',   ageMonthsMin: 24, ageMonthsMax: 32, title: 'Juego colaborativo simple',         description: 'Juega con otros niños de forma coordinada y con roles.' },
  { id: 'dev-2-soc-2', category: 'social',      ageGroup: '2-4 años',   ageMonthsMin: 28, ageMonthsMax: 40, title: 'Comparte juguetes',                 description: 'Comparte espontáneamente sus juguetes con otros niños.' },
  { id: 'dev-2-soc-3', category: 'social',      ageGroup: '2-4 años',   ageMonthsMin: 36, ageMonthsMax: 48, title: 'Identifica emociones básicas',      description: 'Nombra emociones como alegría, tristeza, miedo o enfado en sí mismo y en otros.' },

  { id: 'dev-2-edu-1', category: 'educational', ageGroup: '2-4 años',   ageMonthsMin: 24, ageMonthsMax: 32, title: 'Conoce su nombre completo',         description: 'Dice su nombre y apellido cuando se le pregunta.' },
  { id: 'dev-2-edu-2', category: 'educational', ageGroup: '2-4 años',   ageMonthsMin: 30, ageMonthsMax: 40, title: 'Cuenta hasta 5',                    description: 'Cuenta objetos o repite la secuencia numérica hasta el número 5.' },
  { id: 'dev-2-edu-3', category: 'educational', ageGroup: '2-4 años',   ageMonthsMin: 36, ageMonthsMax: 48, title: 'Reconoce colores básicos',          description: 'Identifica y nombra correctamente al menos 4 colores.' },

  // ── 4-6 years ──────────────────────────────────────────────────────────────
  { id: 'dev-4-mot-1', category: 'motor',       ageGroup: '4-6 años',   ageMonthsMin: 48, ageMonthsMax: 56, title: 'Salta a la pata coja',              description: 'Salta varias veces seguidas sobre un solo pie.' },
  { id: 'dev-4-mot-2', category: 'motor',       ageGroup: '4-6 años',   ageMonthsMin: 48, ageMonthsMax: 60, title: 'Dibuja figura humana simple',       description: 'Dibuja una persona reconocible con cabeza, cuerpo, brazos y piernas.' },
  { id: 'dev-4-mot-3', category: 'motor',       ageGroup: '4-6 años',   ageMonthsMin: 54, ageMonthsMax: 72, title: 'Usa tijeras con destreza',          description: 'Recorta siguiendo una línea recta o curva suave con tijeras de punta roma.' },

  { id: 'dev-4-cog-1', category: 'cognitive',   ageGroup: '4-6 años',   ageMonthsMin: 48, ageMonthsMax: 60, title: 'Entiende la conservación de cantidad', description: 'Comprende que la cantidad no cambia aunque cambie la forma del recipiente (inicio).' },
  { id: 'dev-4-cog-2', category: 'cognitive',   ageGroup: '4-6 años',   ageMonthsMin: 48, ageMonthsMax: 60, title: 'Ordena objetos por tamaño',         description: 'Coloca objetos en orden de menor a mayor o viceversa.' },
  { id: 'dev-4-cog-3', category: 'cognitive',   ageGroup: '4-6 años',   ageMonthsMin: 54, ageMonthsMax: 72, title: 'Resuelve puzzles de 20+ piezas',    description: 'Completa puzzles de mayor complejidad de forma autónoma.' },

  { id: 'dev-4-lan-1', category: 'language',    ageGroup: '4-6 años',   ageMonthsMin: 48, ageMonthsMax: 56, title: 'Habla con frases complejas',        description: 'Usa oraciones subordinadas y conectores lógicos ("porque", "aunque").' },
  { id: 'dev-4-lan-2', category: 'language',    ageGroup: '4-6 años',   ageMonthsMin: 48, ageMonthsMax: 60, title: 'Cuenta historias con estructura',   description: 'Narra cuentos con inicio, nudo y desenlace.' },
  { id: 'dev-4-lan-3', category: 'language',    ageGroup: '4-6 años',   ageMonthsMin: 54, ageMonthsMax: 72, title: 'Reconoce letras del abecedario',    description: 'Identifica la mayoría de letras mayúsculas y las asocia con su sonido.' },

  { id: 'dev-4-soc-1', category: 'social',      ageGroup: '4-6 años',   ageMonthsMin: 48, ageMonthsMax: 58, title: 'Resuelve conflictos con palabras',  description: 'Intenta resolver disputas con compañeros usando el diálogo.' },
  { id: 'dev-4-soc-2', category: 'social',      ageGroup: '4-6 años',   ageMonthsMin: 48, ageMonthsMax: 60, title: 'Distingue realidad de fantasía',    description: 'Comprende la diferencia entre lo que es real y lo que es imaginario.' },
  { id: 'dev-4-soc-3', category: 'social',      ageGroup: '4-6 años',   ageMonthsMin: 54, ageMonthsMax: 72, title: 'Tiene amigos preferidos',           description: 'Establece amistades selectivas y muestra preferencias por ciertos compañeros.' },

  { id: 'dev-4-edu-1', category: 'educational', ageGroup: '4-6 años',   ageMonthsMin: 48, ageMonthsMax: 58, title: 'Escribe su nombre',                 description: 'Escribe su propio nombre en mayúsculas de forma reconocible.' },
  { id: 'dev-4-edu-2', category: 'educational', ageGroup: '4-6 años',   ageMonthsMin: 50, ageMonthsMax: 62, title: 'Cuenta hasta 20',                   description: 'Recita y comprende la secuencia numérica hasta el 20.' },
  { id: 'dev-4-edu-3', category: 'educational', ageGroup: '4-6 años',   ageMonthsMin: 54, ageMonthsMax: 72, title: 'Inicia lectura de palabras simples', description: 'Empieza a decodificar palabras cortas y frecuentes.' },

  // ── 6-12 years ─────────────────────────────────────────────────────────────
  { id: 'dev-6-mot-1', category: 'motor',       ageGroup: '6-12 años',  ageMonthsMin: 72, ageMonthsMax: 84, title: 'Monta en bicicleta sin ruedines',   description: 'Pedalea y mantiene el equilibrio en bicicleta sin ruedas auxiliares.' },
  { id: 'dev-6-mot-2', category: 'motor',       ageGroup: '6-12 años',  ageMonthsMin: 72, ageMonthsMax: 96, title: 'Practica deportes de equipo',       description: 'Participa activamente en deportes con reglas y trabajo en equipo.' },
  { id: 'dev-6-mot-3', category: 'motor',       ageGroup: '6-12 años',  ageMonthsMin: 84, ageMonthsMax: 108, title: 'Escritura cursiva fluida',          description: 'Escribe en cursiva con legibilidad y velocidad adecuada para su edad.' },

  { id: 'dev-6-cog-1', category: 'cognitive',   ageGroup: '6-12 años',  ageMonthsMin: 72, ageMonthsMax: 84, title: 'Pensamiento lógico-concreto',       description: 'Resuelve problemas usando lógica aplicada a situaciones concretas.' },
  { id: 'dev-6-cog-2', category: 'cognitive',   ageGroup: '6-12 años',  ageMonthsMin: 78, ageMonthsMax: 96, title: 'Comprende operaciones básicas',     description: 'Realiza sumas, restas, y empieza con multiplicaciones y divisiones.' },
  { id: 'dev-6-cog-3', category: 'cognitive',   ageGroup: '6-12 años',  ageMonthsMin: 96, ageMonthsMax: 120, title: 'Razonamiento abstracto inicial',   description: 'Empieza a trabajar con conceptos abstractos y a planificar a futuro.' },

  { id: 'dev-6-lan-1', category: 'language',    ageGroup: '6-12 años',  ageMonthsMin: 72, ageMonthsMax: 84, title: 'Lee textos simples',                description: 'Lee en voz alta con fluidez textos de nivel escolar adecuado a su edad.' },
  { id: 'dev-6-lan-2', category: 'language',    ageGroup: '6-12 años',  ageMonthsMin: 78, ageMonthsMax: 96, title: 'Comprende textos leídos',           description: 'Responde preguntas de comprensión sobre textos que ha leído.' },
  { id: 'dev-6-lan-3', category: 'language',    ageGroup: '6-12 años',  ageMonthsMin: 90, ageMonthsMax: 120, title: 'Produce textos escritos',          description: 'Escribe redacciones breves con coherencia y estructura.' },

  { id: 'dev-6-soc-1', category: 'social',      ageGroup: '6-12 años',  ageMonthsMin: 72, ageMonthsMax: 84, title: 'Comprende reglas sociales',         description: 'Entiende y sigue las normas sociales del entorno escolar y familiar.' },
  { id: 'dev-6-soc-2', category: 'social',      ageGroup: '6-12 años',  ageMonthsMin: 78, ageMonthsMax: 96, title: 'Muestra empatía avanzada',          description: 'Adopta la perspectiva del otro y regula sus propias emociones ante conflictos.' },
  { id: 'dev-6-soc-3', category: 'social',      ageGroup: '6-12 años',  ageMonthsMin: 90, ageMonthsMax: 120, title: 'Construye identidad propia',       description: 'Desarrolla intereses, valores y una imagen de sí mismo diferenciada.' },

  { id: 'dev-6-edu-1', category: 'educational', ageGroup: '6-12 años',  ageMonthsMin: 72, ageMonthsMax: 84, title: 'Trabaja de forma autónoma',         description: 'Completa tareas escolares sin supervisión constante del adulto.' },
  { id: 'dev-6-edu-2', category: 'educational', ageGroup: '6-12 años',  ageMonthsMin: 78, ageMonthsMax: 96, title: 'Gestiona el tiempo básico',         description: 'Organiza sus actividades y tareas con cierta planificación.' },
  { id: 'dev-6-edu-3', category: 'educational', ageGroup: '6-12 años',  ageMonthsMin: 90, ageMonthsMax: 120, title: 'Investiga por interés propio',     description: 'Busca información sobre temas que le apasionan de forma independiente.' },
];

export const AGE_GROUPS = ['0-12 meses', '1-2 años', '2-4 años', '4-6 años', '6-12 años'] as const;

// ─── Mock data — Sofía (~39 months) ──────────────────────────────────────────
const SOFIA_ACHIEVED_IDS: string[] = [
  'dev-0-mot-1','dev-0-mot-2','dev-0-mot-3','dev-0-mot-4','dev-0-mot-5',
  'dev-0-cog-1','dev-0-cog-2','dev-0-cog-3',
  'dev-0-lan-1','dev-0-lan-2','dev-0-lan-3',
  'dev-0-soc-1','dev-0-soc-2','dev-0-soc-3',
  'dev-0-edu-1','dev-0-edu-2','dev-0-edu-3',
  'dev-1-mot-1','dev-1-mot-2','dev-1-mot-3',
  'dev-1-cog-1','dev-1-cog-2','dev-1-cog-3',
  'dev-1-lan-1','dev-1-lan-2','dev-1-lan-3',
  'dev-1-soc-1','dev-1-soc-2','dev-1-soc-3',
  'dev-1-edu-1','dev-1-edu-2','dev-1-edu-3',
  'dev-2-mot-1','dev-2-mot-2',
  'dev-2-cog-1','dev-2-cog-2',
  'dev-2-lan-1','dev-2-lan-2',
  'dev-2-soc-1',
  'dev-2-edu-1',
];

export const MOCK_ACHIEVEMENTS_SOFIA: Record<string, string> = Object.fromEntries(
  SOFIA_ACHIEVED_IDS.map((id) => [id, '2025-01-15'])
);

// ─── Mock data — Lucas (~58 months) ──────────────────────────────────────────
const LUCAS_ACHIEVED_IDS: string[] = [
  'dev-0-mot-1','dev-0-mot-2','dev-0-mot-3','dev-0-mot-4','dev-0-mot-5',
  'dev-0-cog-1','dev-0-cog-2','dev-0-cog-3',
  'dev-0-lan-1','dev-0-lan-2','dev-0-lan-3',
  'dev-0-soc-1','dev-0-soc-2','dev-0-soc-3',
  'dev-0-edu-1','dev-0-edu-2','dev-0-edu-3',
  'dev-1-mot-1','dev-1-mot-2','dev-1-mot-3',
  'dev-1-cog-1','dev-1-cog-2','dev-1-cog-3',
  'dev-1-lan-1','dev-1-lan-2','dev-1-lan-3',
  'dev-1-soc-1','dev-1-soc-2','dev-1-soc-3',
  'dev-1-edu-1','dev-1-edu-2','dev-1-edu-3',
  'dev-2-mot-1','dev-2-mot-2','dev-2-mot-3',
  'dev-2-cog-1','dev-2-cog-2','dev-2-cog-3',
  'dev-2-lan-1','dev-2-lan-2','dev-2-lan-3',
  'dev-2-soc-1','dev-2-soc-2','dev-2-soc-3',
  'dev-2-edu-1','dev-2-edu-2','dev-2-edu-3',
  'dev-4-mot-1','dev-4-mot-2',
  'dev-4-cog-1','dev-4-cog-2',
  'dev-4-lan-1','dev-4-lan-2',
  'dev-4-soc-1','dev-4-soc-2',
  'dev-4-edu-1',
];

export const MOCK_ACHIEVEMENTS_LUCAS: Record<string, string> = Object.fromEntries(
  LUCAS_ACHIEVED_IDS.map((id) => [id, '2025-06-01'])
);
