export type CategoryId = "teoria" | "examenes" | "libros" | "videos";

export type SubjectId =
  | "Matemática"
  | "Física"
  | "Química"
  | "Aptitud"
  | "Humanidades";

export type LevelId = "Básico" | "Intermedio" | "Avanzado";

export type ResourceItem = {
  id: string;
  category: CategoryId;
  subject: SubjectId;
  title: string;
  summary: string;
  level: LevelId;
  primary: { label: string; value: string };
  secondary: { label: string; value: string };
  topics: string[];
  author?: string;
  year?: number;
  highlight?: boolean;
};

export type ExternalLink = {
  id: string;
  title: string;
  description: string;
  url: string;
  type: "drive" | "blog" | "playlist";
  subject?: SubjectId;
};

export type Category = {
  id: CategoryId;
  index: string;
  name: string;
  tagline: string;
  description: string;
  bullets: string[];
  icon: string;
  externalUrl?: string;
  externalCollection?: ExternalLink[];
};

export const TEORIA_COLLECTION: ExternalLink[] = [
  {
    id: "col-01",
    title: "Banco de Teoría UNI · Tomo I",
    description: "Carpeta Drive con separatas y temas base organizados por curso para la preparación.",
    url: "https://drive.google.com/drive/folders/1wvSa5LnIIR6tJa6N83kjmzVv2ApC3sOi",
    type: "drive",
  },
  {
    id: "col-02",
    title: "Banco de Teoría UNI · Tomo II",
    description: "Segunda carpeta Drive con material complementario, apuntes y teoría avanzada.",
    url: "https://drive.google.com/drive/u/0/folders/1Mn_zvTYOMuE034l92NzXv0obgKLV-J8u",
    type: "drive",
  },
  {
    id: "col-03",
    title: "Yachakaj · Blog educativo",
    description: "Apuntes, resoluciones y artículos por curso publicados por la comunidad preuniversitaria.",
    url: "https://yachakaj.blogspot.com/",
    type: "blog",
  },
  {
    id: "col-04",
    title: "Separatas por cursos · Ciencias",
    description: "Material de Física, Química y Matemática en formato PDF dentro de Drive.",
    url: "https://drive.google.com/drive/u/0/folders/1TlA14SIObl3L4w4FmC2pyFWVU30QJePA",
    type: "drive",
  },
  {
    id: "col-05",
    title: "Compendios y guías resueltas",
    description: "Guías y compendios con desarrollo paso a paso para consulta rápida antes del examen.",
    url: "https://drive.google.com/drive/u/0/folders/1v6X_dEHhY_zGFJ8gmvHKvodFTNLXAcnE",
    type: "drive",
  },
];

export const EXAMENES_COLLECTION: ExternalLink[] = [
  {
    id: "exam-01",
    title: "Simulacros y Exámenes UNI · Tomo I",
    description: "Carpeta de Google Drive con simulacros completos, claves y solucionarios de procesos de admisión recientes.",
    url: "https://drive.google.com/drive/u/0/folders/1I23XDpAKvdsbAHGWBw_yi_id0FMwiN-K",
    type: "drive",
  },
  {
    id: "exam-02",
    title: "Exámenes de Admisión UNI · Tomo II",
    description: "Colección adicional de exámenes históricos resueltos paso a paso por profesores especialistas.",
    url: "https://drive.google.com/drive/folders/1a1o0OYw7xx6gYS8YS_LZns2gIYeYgoqT",
    type: "drive",
  },
  {
    id: "exam-03",
    title: "Materiales Destacados y Claves (Drive)",
    description: "Enlace directo a tu panel de carpetas destacadas con solucionarios rápidos y resúmenes de fórmulas.",
    url: "https://drive.google.com/drive/starred?hl=es-419",
    type: "drive",
  },
  {
    id: "exam-04",
    title: "Pruebas de Admisión por Cursos",
    description: "Pruebas clasificadas y separadas para que midas tu nivel en ciencias, matemática y aptitud.",
    url: "https://drive.google.com/drive/folders/1PYax2odHKNtvFf21Xll5_i6GoX5I__Da",
    type: "drive",
  },
];

export const LIBROS_COLLECTION: ExternalLink[] = [
  {
    id: "lib-01",
    title: "Biblioteca de Libros UNI · Tomo I",
    description: "Compendios de teoría y problemas selectos de Álgebra, Aritmética, Geometría y Trigonometría.",
    url: "https://drive.google.com/drive/folders/1i-9wE3_GtGDhm_WdkgU13uF_Z_0WjC-f?hl=es-419",
    type: "drive",
  },
  {
    id: "lib-02",
    title: "Biblioteca de Libros UNI · Tomo II",
    description: "Textos de Física general, Química inorgánica y orgánica para postulantes preuniversitarios de la UNI.",
    url: "https://drive.google.com/drive/folders/1xji4_EXTsWbluFEKcjY39-WYFJ8TXCk6?hl=es-419",
    type: "drive",
  },
  {
    id: "lib-03",
    title: "Colección de Compendios y Lecturas",
    description: "Compendio completo de Humanidades, lenguaje, razonamiento verbal y cultura general.",
    url: "https://drive.google.com/drive/folders/1H5GjViDLbrkOp4I3RJzrJw1BK_7yh7_Y?hl=es-419",
    type: "drive",
  },
];

export const VIDEOS_COLLECTION: ExternalLink[] = [
  {
    id: "vid-01",
    title: "Álgebra",
    description: "Playlist completa de Álgebra: teoría de exponentes, polinomios, ecuaciones y sistemas explicados en video.",
    url: "https://www.youtube.com/playlist?list=PLZZWh41GUPsFdJ5C-RnMtzEtgWcemXByQ",
    type: "playlist",
  },
  {
    id: "vid-02",
    title: "Física",
    description: "Clases grabadas de Física con desarrollo de problemas tipo admisión paso a paso.",
    url: "https://www.youtube.com/playlist?list=PLZZWh41GUPsFxVK1oMotXsPP3F4Vp0LNU",
    type: "playlist",
  },
  {
    id: "vid-03",
    title: "Química",
    description: "Serie completa de Química: estructura atómica, enlace, estequiometría y más.",
    url: "https://www.youtube.com/playlist?list=PLZZWh41GUPsGvxutb8VAIihGO91pABB93",
    type: "playlist",
  },
  {
    id: "vid-04",
    title: "Aritmética",
    description: "Playlist de Aritmética con divisibilidad, razones, proporciones y teoría de números.",
    url: "https://www.youtube.com/playlist?list=PLZZWh41GUPsHQ70zXO4BdFMTEVSbwFLRD",
    type: "playlist",
  },
  {
    id: "vid-05",
    title: "Trigonometría",
    description: "Razones trigonométricas, identidades y circunferencia trigonométrica en video.",
    url: "https://www.youtube.com/watch?v=c_iR35iHETM&list=PLuuOG0qft5YQusuDF4Ev3X60GvjjuOPzs&index=4",
    type: "playlist",
  },
  {
    id: "vid-06",
    title: "Geometría",
    description: "Triángulos, circunferencia, áreas y sólidos desarrollados con gráficos claros.",
    url: "https://www.youtube.com/watch?v=rl_20TNotZg&list=PLuuOG0qft5YQusuDF4Ev3X60GvjjuOPzs&index=4",
    type: "playlist",
  },
];

export const CATEGORIES: Category[] = [
  {
    id: "teoria",
    index: "01",
    name: "Teoría",
    tagline: "Recolección de recursos",
    description:
      "Reuní en un solo lugar las carpetas y blogs más útiles con teoría y material para el examen de la UNI. Cada enlace abre en una pestaña nueva.",
    bullets: ["5 fuentes curadas", "Drives oficiales y comunidad", "Acceso directo sin login"],
    icon: "theory",
    externalUrl: "https://drive.google.com/drive/folders/1eaznZqhy1ZHaa-cZYq4Cwg55dJ7RDgBw?usp=drive_link",
    externalCollection: TEORIA_COLLECTION,
  },
  {
    id: "examenes",
    index: "02",
    name: "Exámenes",
    tagline: "Banco de Evaluaciones",
    description:
      "Colección completa de Drives con simulacros y exámenes pasados resueltos para entrenar bajo las condiciones del examen real.",
    bullets: ["4 carpetas Drive", "Estructura de las 3 pruebas", "Material oficial y solucionarios"],
    icon: "exam",
    externalUrl: "https://drive.google.com/drive/u/0/folders/1I23XDpAKvdsbAHGWBw_yi_id0FMwiN-K",
    externalCollection: EXAMENES_COLLECTION,
  },
  {
    id: "libros",
    index: "03",
    name: "Libros",
    tagline: "Textos Recomendados",
    description:
      "Bibliotecas organizadas con libros esenciales y compendios académicos completos para profundizar en cada área de estudio.",
    bullets: ["3 colecciones masivas", "Física, Química y Matemáticas", "Lecturas selectas y solucionarios"],
    icon: "book",
    externalUrl: "https://drive.google.com/drive/folders/1i-9wE3_GtGDhm_WdkgU13uF_Z_0WjC-f?hl=es-419",
    externalCollection: LIBROS_COLLECTION,
  },
  {
    id: "videos",
    index: "04",
    name: "Videos",
    tagline: "CEPRELIBRE",
    description:
      "Playlists de YouTube organizadas por curso para aprender viendo. Clases completas de CEPRELIBRE con teoría y ejercicios resueltos.",
    bullets: ["6 cursos en video", "Clases completas gratis", "Teoría y práctica juntas"],
    icon: "play",
    externalUrl: "https://www.youtube.com/playlist?list=PLZZWh41GUPsFdJ5C-RnMtzEtgWcemXByQ",
    externalCollection: VIDEOS_COLLECTION,
  },
];

export const SUBJECTS: SubjectId[] = [
  "Matemática",
  "Física",
  "Química",
  "Aptitud",
  "Humanidades",
];

export const RESOURCES: ResourceItem[] = [
  /* ---------------------------------------------------------------- TEORÍA */
  {
    id: "t-01",
    category: "teoria",
    subject: "Matemática",
    title: "Álgebra desde cero",
    summary:
      "Construye la base algebraica que sostiene todo el examen: del lenguaje simbólico a los sistemas de ecuaciones.",
    level: "Básico",
    primary: { label: "Capítulos", value: "12" },
    secondary: { label: "Duración", value: "9 h" },
    topics: ["Productos notables", "Factorización", "Ecuaciones", "Inecuaciones", "Sistemas"],
    highlight: true,
  },
  {
    id: "t-02",
    category: "teoria",
    subject: "Matemática",
    title: "Geometría plana y del espacio",
    summary:
      "Teoremas ordenados por familia, con estrategias de trazo auxiliar y cálculo de áreas y volúmenes.",
    level: "Intermedio",
    primary: { label: "Capítulos", value: "14" },
    secondary: { label: "Duración", value: "11 h" },
    topics: ["Triángulos", "Circunferencia", "Áreas", "Sólidos", "Semejanza"],
  },
  {
    id: "t-03",
    category: "teoria",
    subject: "Matemática",
    title: "Trigonometría aplicada",
    summary:
      "De la circunferencia trigonométrica a las identidades y ecuaciones que aparecen año tras año en la prueba de Matemática.",
    level: "Intermedio",
    primary: { label: "Capítulos", value: "10" },
    secondary: { label: "Duración", value: "7 h" },
    topics: ["Razones", "Identidades", "C.T.", "Ecuaciones", "Resolución de triángulos"],
  },
  {
    id: "t-04",
    category: "teoria",
    subject: "Física",
    title: "Mecánica clásica esencial",
    summary:
      "Cinemática, estática y dinámica explicadas con diagramas de cuerpo libre y método de resolución uniforme.",
    level: "Intermedio",
    primary: { label: "Capítulos", value: "11" },
    secondary: { label: "Duración", value: "10 h" },
    topics: ["Cinemática", "Estática", "Dinámica", "Trabajo y energía", "Momentum"],
    highlight: true,
  },
  {
    id: "t-05",
    category: "teoria",
    subject: "Física",
    title: "Electricidad y magnetismo",
    summary:
      "Campo, potencial y circuitos con el enfoque conceptual que la UNI evalúa en la tercera prueba.",
    level: "Avanzado",
    primary: { label: "Capítulos", value: "9" },
    secondary: { label: "Duración", value: "8 h" },
    topics: ["Electrostática", "Circuitos", "Campo magnético", "Inducción"],
  },
  {
    id: "t-06",
    category: "teoria",
    subject: "Química",
    title: "Materia, átomo y enlace",
    summary:
      "Fundamentos de estructura atómica y enlace químico con tablas de apoyo y errores frecuentes señalados.",
    level: "Básico",
    primary: { label: "Capítulos", value: "8" },
    secondary: { label: "Duración", value: "6 h" },
    topics: ["Estructura atómica", "Tabla periódica", "Enlace", "Nomenclatura"],
  },
  {
    id: "t-07",
    category: "teoria",
    subject: "Química",
    title: "Estequiometría y soluciones",
    summary:
      "El corazón cuantitativo de Química: mol, reacciones, rendimiento y unidades de concentración.",
    level: "Intermedio",
    primary: { label: "Capítulos", value: "7" },
    secondary: { label: "Duración", value: "6 h" },
    topics: ["Mol", "Reacciones", "Rendimiento", "Molaridad", "Gases"],
  },
  {
    id: "t-08",
    category: "teoria",
    subject: "Aptitud",
    title: "Razonamiento matemático con método",
    summary:
      "Estrategias de conteo, orden de información y planteo de ecuaciones para resolver rápido y sin dudar.",
    level: "Intermedio",
    primary: { label: "Capítulos", value: "10" },
    secondary: { label: "Duración", value: "7 h" },
    topics: ["Planteo", "Sucesiones", "Conteo", "Certezas", "Cronometría"],
  },
  {
    id: "t-09",
    category: "teoria",
    subject: "Humanidades",
    title: "Comprensión lectora y lenguaje",
    summary:
      "Técnicas de lectura activa, jerarquía de ideas y precisión léxica para la primera prueba.",
    level: "Básico",
    primary: { label: "Capítulos", value: "9" },
    secondary: { label: "Duración", value: "5 h" },
    topics: ["Ideas principales", "Inferencias", "Conectores", "Ortografía", "Sintaxis"],
  },

  /* -------------------------------------------------------------- EXÁMENES */
  {
    id: "e-01",
    category: "examenes",
    subject: "Matemática",
    title: "Examen de admisión 2026-I · Prueba de Matemática",
    summary:
      "Segunda prueba del proceso 2026-I con solucionario completo y clasificación por tema y dificultad.",
    level: "Avanzado",
    primary: { label: "Preguntas", value: "40" },
    secondary: { label: "Tiempo", value: "3 h" },
    topics: ["Aritmética", "Álgebra", "Geometría", "Trigonometría"],
    year: 2026,
    highlight: true,
  },
  {
    id: "e-02",
    category: "examenes",
    subject: "Física",
    title: "Examen de admisión 2026-I · Física y Química",
    summary:
      "Tercera prueba del proceso 2026-I resuelta con desarrollo completo y comentarios de estrategia.",
    level: "Avanzado",
    primary: { label: "Preguntas", value: "40" },
    secondary: { label: "Tiempo", value: "3 h" },
    topics: ["Mecánica", "Electricidad", "Estequiometría", "Gases"],
    year: 2026,
  },
  {
    id: "e-03",
    category: "examenes",
    subject: "Aptitud",
    title: "Examen de admisión 2026-I · Aptitud y Humanidades",
    summary:
      "Primera prueba del proceso con claves comentadas de razonamiento verbal, matemático y cultura general.",
    level: "Intermedio",
    primary: { label: "Preguntas", value: "40" },
    secondary: { label: "Tiempo", value: "3 h" },
    topics: ["R. Verbal", "R. Matemático", "Historia", "Actualidad"],
    year: 2026,
  },
  {
    id: "e-04",
    category: "examenes",
    subject: "Matemática",
    title: "Examen de admisión 2025-II · Prueba de Matemática",
    summary:
      "Prueba del proceso 2025-II con nivel de exigencia alto en geometría analítica y sucesiones.",
    level: "Avanzado",
    primary: { label: "Preguntas", value: "40" },
    secondary: { label: "Tiempo", value: "3 h" },
    topics: ["Analítica", "Sucesiones", "Números complejos", "Áreas"],
    year: 2025,
  },
  {
    id: "e-05",
    category: "examenes",
    subject: "Química",
    title: "Banco de Química por temas",
    summary:
      "Preguntas de exámenes anteriores agrupadas por capítulo para reforzar exactamente lo que te falta.",
    level: "Intermedio",
    primary: { label: "Preguntas", value: "180" },
    secondary: { label: "Formato", value: "Por tema" },
    topics: ["Enlace", "Mol", "Redox", "Orgánica"],
  },
  {
    id: "e-06",
    category: "examenes",
    subject: "Matemática",
    title: "Simulacro cronometrado N.º 1",
    summary:
      "Simulacro completo con la estructura de las tres pruebas y hoja de resultados para medir tu puntaje.",
    level: "Avanzado",
    primary: { label: "Preguntas", value: "120" },
    secondary: { label: "Tiempo", value: "9 h" },
    topics: ["Simulacro", "Tres pruebas", "Puntaje", "Ranking"],
    highlight: true,
  },
  {
    id: "e-07",
    category: "examenes",
    subject: "Física",
    title: "Problemas UNI de Física 2018-2025",
    summary:
      "Compilado histórico de problemas de Física ordenados por frecuencia de aparición en el examen.",
    level: "Avanzado",
    primary: { label: "Problemas", value: "240" },
    secondary: { label: "Periodo", value: "2018-2025" },
    topics: ["Cinemática", "Dinámica", "Ondas", "Termodinámica"],
    year: 2025,
  },
  {
    id: "e-08",
    category: "examenes",
    subject: "Humanidades",
    title: "Práctica dirigida de Humanidades",
    summary:
      "Ejercicios de literatura, historia, geografía y actualidad con explicación de cada alternativa.",
    level: "Intermedio",
    primary: { label: "Preguntas", value: "90" },
    secondary: { label: "Tiempo", value: "2 h" },
    topics: ["Literatura", "Historia", "Geografía", "Economía"],
  },

  /* ---------------------------------------------------------------- LIBROS */
  {
    id: "l-01",
    category: "libros",
    subject: "Matemática",
    title: "Álgebra · Colección clásica",
    summary:
      "Texto de referencia para dominar teoría de exponentes, polinomios y sistemas con miles de ejercicios.",
    level: "Intermedio",
    primary: { label: "Páginas", value: "560" },
    secondary: { label: "Ejercicios", value: "1 800+" },
    topics: ["Exponentes", "Polinomios", "Matrices", "Determinantes"],
    author: "Compendio académico",
    highlight: true,
  },
  {
    id: "l-02",
    category: "libros",
    subject: "Matemática",
    title: "Geometría · Teoría y problemas",
    summary:
      "Un recorrido completo por la geometría del plano y del espacio con problemas de nivel UNI.",
    level: "Avanzado",
    primary: { label: "Páginas", value: "480" },
    secondary: { label: "Ejercicios", value: "1 200+" },
    topics: ["Triángulos", "Cuadriláteros", "Poliedros", "Superficies"],
    author: "Compendio académico",
  },
  {
    id: "l-03",
    category: "libros",
    subject: "Física",
    title: "Física general para postulantes",
    summary:
      "Base conceptual sólida con problemas graduados desde el nivel escolar hasta el nivel de admisión.",
    level: "Intermedio",
    primary: { label: "Páginas", value: "620" },
    secondary: { label: "Ejercicios", value: "1 500+" },
    topics: ["Mecánica", "Calor", "Ondas", "Electromagnetismo"],
    author: "Texto universitario",
  },
  {
    id: "l-04",
    category: "libros",
    subject: "Química",
    title: "Química: principios y problemas",
    summary:
      "Estructura atómica, reacciones y cálculos químicos explicados con el rigor que exige la UNI.",
    level: "Intermedio",
    primary: { label: "Páginas", value: "440" },
    secondary: { label: "Ejercicios", value: "900+" },
    topics: ["Átomo", "Enlace", "Estequiometría", "Orgánica"],
    author: "Texto universitario",
  },
  {
    id: "l-05",
    category: "libros",
    subject: "Aptitud",
    title: "Razonamiento matemático integral",
    summary:
      "Colección de problemas de ingenio y método con soluciones comentadas para ganar velocidad.",
    level: "Intermedio",
    primary: { label: "Páginas", value: "380" },
    secondary: { label: "Ejercicios", value: "1 100+" },
    topics: ["Ingenio", "Operadores", "Conteo", "Probabilidades"],
    author: "Compendio académico",
  },
  {
    id: "l-06",
    category: "libros",
    subject: "Humanidades",
    title: "Compendio de Humanidades",
    summary:
      "Todo el temario de la primera prueba en un solo volumen: lenguaje, literatura, historia y sociedad.",
    level: "Básico",
    primary: { label: "Páginas", value: "520" },
    secondary: { label: "Unidades", value: "24" },
    topics: ["Lenguaje", "Literatura", "Historia", "Cívica", "Actualidad"],
    author: "Compendio académico",
  },
  {
    id: "l-07",
    category: "libros",
    subject: "Matemática",
    title: "Aritmética razonada",
    summary:
      "Teoría de números, razones y proporciones con enfoque de resolución rápida para el examen.",
    level: "Básico",
    primary: { label: "Páginas", value: "410" },
    secondary: { label: "Ejercicios", value: "1 000+" },
    topics: ["Divisibilidad", "Proporciones", "Porcentajes", "Estadística"],
    author: "Compendio académico",
  },
];

export const LEVELS: LevelId[] = ["Básico", "Intermedio", "Avanzado"];

export function countByCategory(category: CategoryId): number {
  return RESOURCES.filter((item) => item.category === category).length;
}

export function getCategory(id: CategoryId): Category {
  return CATEGORIES.find((category) => category.id === id) ?? CATEGORIES[0];
}
