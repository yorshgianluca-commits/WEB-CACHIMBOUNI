/**
 * Capa de datos del sitio.
 *
 * Intenta cargar el contenido desde Supabase (tablas públicas de solo lectura).
 * Si Supabase NO está configurado, o si la solicitud falla, usa los datos
 * estáticos de `data.ts`. Así la web sigue funcionando igual que antes
 * hasta que conectes una base de datos real.
 */
import { supabaseList, isSupabaseConfigured } from "./supabase";
import {
  CATEGORIES as STATIC_CATEGORIES,
  RESOURCES as STATIC_RESOURCES,
} from "./data";
import type {
  Category,
  CategoryId,
  ExternalLink,
  LevelId,
  ResourceItem,
  SubjectId,
} from "./data";

/* ----------------------------- Tipos de fila de Supabase ----------------------------- */

type CategoryRow = {
  id: string;
  sort_index: string;
  name: string;
  tagline: string;
  description: string;
  bullets: unknown;
  icon: string;
  external_url: string | null;
  position: number;
};

type CollectionRow = {
  id: string;
  category_id: string;
  title: string;
  description: string;
  url: string;
  type: string;
  subject: string | null;
  position: number;
};

type ResourceRow = {
  id: string;
  category: string;
  subject: string;
  title: string;
  summary: string;
  level: string;
  primary_: { label: string; value: string } | null;
  secondary_: { label: string; value: string } | null;
  topics: unknown;
  author: string | null;
  year: number | null;
  highlight: boolean;
  position: number;
};

export type SiteContent = {
  categories: Category[];
  resources: ResourceItem[];
  source: "supabase" | "static";
};

/* ----------------------------- Helpers de mapeo ----------------------------- */

function toStringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((v): v is string => typeof v === "string") : [];
}

const SUBJECT_IDS: SubjectId[] = [
  "Matemática",
  "Física",
  "Química",
  "Aptitud",
  "Humanidades",
];

function isCategoryId(value: string): value is CategoryId {
  return value === "teoria" || value === "examenes" || value === "libros" || value === "videos";
}

function isSubjectId(value: string): value is SubjectId {
  return (SUBJECT_IDS as string[]).includes(value);
}

function isLevelId(value: string): value is LevelId {
  return value === "Básico" || value === "Intermedio" || value === "Avanzado";
}

function mapCollection(row: CollectionRow): ExternalLink {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    url: row.url,
    type: row.type === "playlist" || row.type === "blog" ? row.type : "drive",
    subject: isSubjectId(row.subject ?? "") ? (row.subject as SubjectId) : undefined,
  };
}

function mapCategory(row: CategoryRow, collections: ExternalLink[]): Category {
  return {
    id: isCategoryId(row.id) ? row.id : "teoria",
    index: row.sort_index ?? "",
    name: row.name,
    tagline: row.tagline,
    description: row.description,
    bullets: toStringArray(row.bullets),
    icon: row.icon,
    externalUrl: row.external_url ?? undefined,
    externalCollection: collections,
  };
}

function mapResource(row: ResourceRow): ResourceItem {
  return {
    id: row.id,
    category: isCategoryId(row.category) ? row.category : "teoria",
    subject: isSubjectId(row.subject) ? row.subject : "Matemática",
    title: row.title,
    summary: row.summary,
    level: isLevelId(row.level) ? row.level : "Básico",
    primary: row.primary_ ?? { label: "", value: "" },
    secondary: row.secondary_ ?? { label: "", value: "" },
    topics: toStringArray(row.topics),
    author: row.author ?? undefined,
    year: row.year ?? undefined,
    highlight: row.highlight,
  };
}

/* ----------------------------- Carga desde Supabase ----------------------------- */

async function fetchFromSupabase(): Promise<SiteContent> {
  const [collections, categoryRows, resourceRows] = await Promise.all([
    supabaseList<CollectionRow>("collections", { order: "position.asc" }),
    supabaseList<CategoryRow>("categories", { order: "position.asc" }),
    supabaseList<ResourceRow>("resources", { order: "position.asc" }),
  ]);

  const categories: Category[] = categoryRows.map((row) => {
    const items = collections
      .filter((c) => c.category_id === row.id)
      .sort((a, b) => a.position - b.position)
      .map(mapCollection);
    return mapCategory(row, items);
  });

  const resources = resourceRows.map(mapResource);

  return { categories, resources, source: "supabase" };
}

export function getStaticContent(): SiteContent {
  return {
    categories: STATIC_CATEGORIES,
    resources: STATIC_RESOURCES,
    source: "static",
  };
}

/**
 * Carga el contenido real. Si Supabase no está configurado o falla,
 * devuelve los datos estáticos (la web sigue funcionando).
 */
export async function loadSiteContent(): Promise<SiteContent> {
  if (!isSupabaseConfigured()) return getStaticContent();
  try {
    return await fetchFromSupabase();
  } catch (error) {
    console.warn(
      "CachimboUNI: no se pudo cargar desde Supabase, usando datos estáticos.",
      error
    );
    return getStaticContent();
  }
}
