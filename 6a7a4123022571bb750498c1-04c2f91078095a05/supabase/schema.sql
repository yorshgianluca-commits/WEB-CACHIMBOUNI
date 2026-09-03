-- ============================================================
--  CachimboUNI · Esquema de base de datos para Supabase
--  Ejecuta este archivo en el SQL Editor de tu proyecto Supabase.
--
--  El sitio es de contenido público (sin login): por eso SÓLO
--  abrimos el SELECT (lectura) al rol anónimo en las tablas de
--  contenido. La tabla `activity` solo permite INSERT para
--  registrar actividad (clicks, visitas) sin exponer el resto.
-- ============================================================

-- ------------------------------------------------------------
-- CATEGORÍAS (las 4 puertas: teoría, exámenes, libros, videos)
-- ------------------------------------------------------------
create table if not exists public.categories (
  id          text primary key,
  sort_index  text not null default '0',      -- "01", "02" ...
  name        text not null,
  tagline     text not null,
  description text not null,
  bullets     jsonb not null default '[]'::jsonb,
  icon        text not null,
  external_url text,                          -- enlace Drive global (opcional)
  position    int  not null default 0
);

alter table public.categories enable row level security;

drop policy if exists "categories_public_read" on public.categories;
create policy "categories_public_read"
  on public.categories
  for select
  to anon
  using (true);

-- ------------------------------------------------------------
-- COLECCIONES (enlaces de cada categoría: carpetas Drive, blogs, playlists)
-- ------------------------------------------------------------
create table if not exists public.collections (
  id          text primary key,
  category_id text not null references public.categories(id) on delete cascade,
  title       text not null,
  description text not null,
  url         text not null,
  type        text not null check (type in ('drive','blog','playlist')),
  subject     text,                            -- Matemática, Física ...
  position    int  not null default 0
);

alter table public.collections enable row level security;

drop policy if exists "collections_public_read" on public.collections;
create policy "collections_public_read"
  on public.collections
  for select
  to anon
  using (true);

-- ------------------------------------------------------------
-- RECURSOS (los "materiales" individuales: teoría, exámenes, libros)
-- ------------------------------------------------------------
create table if not exists public.resources (
  id         text primary key,
  category   text not null references public.categories(id) on delete cascade,
  subject    text not null,
  title      text not null,
  summary    text not null,
  level      text not null check (level in ('Básico','Intermedio','Avanzado')),
  primary_   jsonb not null default '{"label":"","value":""}'::jsonb,
  secondary_ jsonb not null default '{"label":"","value":""}'::jsonb,
  topics     jsonb not null default '[]'::jsonb,
  author     text,
  year       int,
  highlight  boolean not null default false,
  position   int  not null default 0
);

alter table public.resources enable row level security;

drop policy if exists "resources_public_read" on public.resources;
create policy "resources_public_read"
  on public.resources
  for select
  to anon
  using (true);

-- ------------------------------------------------------------
-- ACTIVIDAD (solo lectura pública NO permitida; solo insertar)
--  Registra de forma anónima: visitas a categorías, clicks en
--  recursos, formularios de contacto, etc.
-- ------------------------------------------------------------
create table if not exists public.activity (
  id          bigint generated always as identity primary key,
  created_at  timestamptz not null default now(),
  page        text not null,      -- "recursos", "home", "guia" ...
  path        text not null,      -- ruta completa, ej. "/recursos/teoria"
  action      text not null,      -- "open_category", "click_collection", "contact" ...
  resource_id text,               -- id de categoría/colección/recurso (opcional)
  label       text                -- texto legible (opcional)
);

alter table public.activity enable row level security;

-- Permitir SOLO insertar (sin que nadie pueda leer lo registrado).
drop policy if exists "activity_public_insert" on public.activity;
create policy "activity_public_insert"
  on public.activity
  for insert
  to anon
  with check (true);

-- Dar permisos de uso básicos al rol anónimo (necesarios en Supabase).
grant usage on schema public to anon;
grant select on public.categories, public.collections, public.resources to anon;
grant insert on public.activity to anon;
