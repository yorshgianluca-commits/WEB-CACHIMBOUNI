# Guía: conectar una base de datos (Supabase) a CachimboUNI

Este proyecto **ya incluye la integración con Supabase** lista para usar. Antes no había
ninguna base de datos: todo el contenido vivía escrito a mano en `src/lib/data.ts`.

Con esta guía la conectas en ~10 minutos. Todo el contenido que hoy está en el código pasa a
vivir en la base de datos, y podrás editarlo **sin tocar código** desde el panel de Supabase.

---

## 1. Qué se agregó (resumen)

| Archivo | Qué hace |
|---|---|
| `supabase/schema.sql` | Crea las tablas y sus permisos de seguridad (RLS). |
| `supabase/seed.sql` | Inserta el contenido actual (categorías, enlaces, recursos). |
| `src/lib/supabase.ts` | Cliente ligero (usa la REST API, sin librerías pesadas). |
| `src/lib/siteData.ts` | Carga desde Supabase, o desde `data.ts` si no está configurado. |
| `src/hooks/useSiteContent.ts` | Hook que entrega el contenido a las páginas. |
| `src/lib/activity.ts` | Registra actividad anónima (clicks, visitas) en la tabla `activity`. |
| `.env.example` | Plantilla de variables de entorno. |

> **Importante:** si **no** configuras las variables, la web **sigue funcionando igual**
> como hasta ahora (usa los datos de `data.ts`). La base de datos es un "extra" que se
> activa cuando agregas tus claves.

---

## 2. Crear el proyecto en Supabase

1. Ve a <https://supabase.com> e inicia sesión.
2. Crea un **nuevo project**. Nómbralo por ejemplo `cachimbo-uni`.
3. Guarda la **contraseña de la base de datos** (solo se muestra una vez).
4. Espera a que termine de aprovisionarse.

---

## 3. Ejecutar el esquema y los datos

1. En el panel de tu proyecto, abre **SQL Editor**.
2. Copia y pega el contenido de **`supabase/schema.sql`** y ejecútalo (botón **Run**).
3. Ahora copia y pega **`supabase/seed.sql`** y ejecútalo.

Eso crea las tablas y las llena con tus datos actuales.

> ¿Quieres regenerar el `seed.sql` cuando actualices `src/lib/data.ts`?
> ```
> node scripts/generate-seed.mjs
> ```

---

## 4. Obtener la URL y la clave pública (anon key)

En el panel del proyecto:

1. **Project Settings → General** → copia **Project URL** (tipo `https://xxxx.supabase.co`).
2. **Project Settings → API** → copia la **anon public** (una clave `eyJ...`).
   - En Supabase ahora se llama "Publishable key" o "API Key". Usa la **pública de lectura**.

---

## 5. Configurar las variables de entorno

### En local (desarrollo)

Copia la plantilla y pega tus valores en la raíz del proyecto:

```bash
cp .env.example .env
```

Edita `.env`:

```dotenv
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
```

Reinicia el servidor (`npm run dev`).

### En Netlify (producción)

1. **Site settings → Environment variables.**
2. Agrega las dos variables con los mismos nombres:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
3. Guarda y **redespliega** el sitio (o haz un deploy nuevo).

> Las variables deben empezar con `VITE_` para que Vite las incruste en el bundle.

---

## 6. Cómo saber que está funcionando

- En **Supabase → Table Editor** verás las tablas `categories`, `collections`,
  `resources` y `activity` con datos.
- En la consola del navegador, al cargar la página, verás una petición a
  `/rest/v1/categories?...`, `/rest/v1/collections?...` y `/rest/v1/resources?...`.
- Si en la consola aparece el aviso:
  > "no se pudo cargar desde Supabase, usando datos estáticos"
  entonces algo falló (URL/clave incorrectas, RLS mal, tabla sin datos, etc.).

---

## 7. Agregar o editar contenido (sin tocar código)

1. En **Supabase → Table Editor**, abre `categories`, `collections` o `resources`.
2. Edita una fila o crea una nueva (**Insert row**).
3. Los cambios se reflejan en la web al recargar (o al siguiente deploy).

Reglas rápidas:

- `categories.id` → `teoria`, `examenes`, `libros`, `videos`.
- `resources.category` debe coincidir con un `categories.id`.
- `collections.category_id` debe coincidir con un `categories.id`.
- `collections.type` → `drive` | `blog` | `playlist`.
- `resources.level` → `Básico` | `Intermedio` | `Avanzado`.
- Los campos `bullets`, `topics`, `primary_`, `secondary_` son **JSON** (se editan
  como texto JSON en el editor, p. ej. `["a","b"]`).

---

## 8. La tabla `activity` (datos de uso)

Cada vez que un visitante abre una categoría o hace clic en un enlace, se registra una
fila anónima en `activity`:

| Columna | Ejemplo |
|---|---|
| `page` | `recursos` |
| `path` | `/recursos/teoria` |
| `action` | `open_category` / `land_category` / `click_collection` |
| `resource_id` | `teoria` o `col-01` |
| `label` | `Teoría` |
| `created_at` | fecha/hora |

> La RLS está configurada para que cualquiera pueda **insertar** actividad, pero nadie
> pueda **leerla** (es privada para ti). Tú la ves desde el panel de Supabase.

Para verla: **Table Editor → `activity`**.

---

## 9. Seguridad (RLS)

En un sitio público sin login **no abrimos escritura** en las tablas de contenido:

- `categories`, `collections`, `resources` → solo **lectura** (`SELECT`) para el rol anónimo.
- `activity` → solo **inserción** (`INSERT`), **sin lectura** para nadie.

Esto es lo que quieres para que los visitantes puedan ver el catálogo pero no modificarlo.

---

## 10. ¿Y si quieres login/usuarios después?

El esquema está listo para crecer. Para añadir cuentas de usuario solo necesitas:

1. Enable **Authentication** en Supabase.
2. Añadir una columna `user_id` (uuid) a las tablas que quieras por usuario.
3. Cambiar la RLS de `SELECT` a `USING (auth.uid() = user_id)` y añadir policies
   para cada tabla.

Pero para el caso actual (contenido + actividad, sin login) ya está todo resuelto.
