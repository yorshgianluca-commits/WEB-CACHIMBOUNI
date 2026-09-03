#!/usr/bin/env node
/**
 * Genera `supabase/seed.sql` a partir del contenido actual de `src/lib/data.ts`.
 *
 * Así puedes poblar la base de datos de Supabase con los mismos datos que hoy
 * se muestran en la web estática, sin copiarlos a mano.
 *
 * Uso:
 *   node scripts/generate-seed.mjs
 */
import { build } from "esbuild";
import { writeFileSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const outfile = path.join("/tmp", "web-cachimbouni-data.mjs");

await build({
  entryPoints: [path.join(root, "src/lib/data.ts")],
  bundle: true,
  format: "esm",
  platform: "node",
  outfile,
});
const mod = await import(new URL(`file://${outfile}?t=${Date.now()}`));

const { CATEGORIES, RESOURCES } = mod;

/** Escapa comillas simples para SQL. */
const sq = (v) => (v == null ? "null" : `'${String(v).replace(/'/g, "''")}'`);
const jsonb = (v) => (v == null ? "null" : `'${JSON.stringify(v).replace(/'/g, "''")}'::jsonb`);

/** Genera la cláusula ON CONFLICT para que el seed sea re-ejecutable. */
const onConflictUpdate = (cols) =>
  `on conflict (id) do update set ${cols.map((c) => `${c} = excluded.${c}`).join(", ")}`;

const lines = [];
lines.push("-- ============================================================");
lines.push("--  CachimboUNI · Datos iniciales (seed)");
lines.push("--  Generado automáticamente con `node scripts/generate-seed.mjs`.");
lines.push("--  Ejecútalo en el SQL Editor después de `supabase/schema.sql`.");
lines.push("--  Es idempotente: puedes ejecutarlo varias veces sin errores.");
lines.push("-- ============================================================");
lines.push("");

/* ------------------------------------------------- CATEGORÍAS + COLECCIONES */
lines.push("-- Categorías y sus colecciones");
for (const category of CATEGORIES) {
  const dbId = category.id;
  lines.push(
    `insert into public.categories (id, sort_index, name, tagline, description, bullets, icon, external_url, position) values (${sq(
      dbId
    )}, ${sq(category.index)}, ${sq(category.name)}, ${sq(category.tagline)}, ${sq(
      category.description
    )}, ${jsonb(category.bullets)}, ${sq(category.icon)}, ${sq(
      category.externalUrl ?? null
    )}, ${Number(category.index ?? 0) - 1})\n  ${onConflictUpdate([
      "sort_index",
      "name",
      "tagline",
      "description",
      "bullets",
      "icon",
      "external_url",
      "position",
    ])};`
  );
  for (const [position, link] of (category.externalCollection ?? []).entries()) {
    lines.push(
      `insert into public.collections (id, category_id, title, description, url, type, subject, position) values (${sq(
        link.id
      )}, ${sq(dbId)}, ${sq(link.title)}, ${sq(link.description)}, ${sq(link.url)}, ${sq(
        link.type
      )}, ${sq(link.subject ?? null)}, ${position})\n  ${onConflictUpdate([
        "category_id",
        "title",
        "description",
        "url",
        "type",
        "subject",
        "position",
      ])};`
    );
  }
}

lines.push("");
lines.push("-- Recursos (materiales individuales)");
for (const r of RESOURCES) {
  lines.push(
    `insert into public.resources (id, category, subject, title, summary, level, primary_, secondary_, topics, author, year, highlight, position) values (${sq(
      r.id
    )}, ${sq(r.category)}, ${sq(r.subject)}, ${sq(r.title)}, ${sq(r.summary)}, ${sq(
      r.level
    )}, ${jsonb(r.primary)}, ${jsonb(r.secondary)}, ${jsonb(r.topics)}, ${sq(
      r.author ?? null
    )}, ${r.year ?? "null"}, ${r.highlight ? "true" : "false"}, 0)\n  ${onConflictUpdate([
      "category",
      "subject",
      "title",
      "summary",
      "level",
      "primary_",
      "secondary_",
      "topics",
      "author",
      "year",
      "highlight",
      "position",
    ])};`
  );
}

const outPath = path.join(root, "supabase", "seed.sql");
writeFileSync(outPath, lines.join("\n") + "\n");
console.log(`✔ Seed generado en ${outPath}`);
