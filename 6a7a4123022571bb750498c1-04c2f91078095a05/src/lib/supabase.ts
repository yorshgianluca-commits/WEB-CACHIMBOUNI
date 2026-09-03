/**
 * Cliente ligero de Supabase basado en la REST API.
 *
 * No instalamos `@supabase/supabase-js` a propósito: para datos públicos
 * (sin login) basta con `fetch` contra el endpoint REST de PostgREST,
 * lo que mantiene el bundle de la web estática pequeño.
 */

export type SupabaseConfig = {
  url: string;
  anonKey: string;
  configured: boolean;
};

/** Lee la configuración desde variables de entorno de Vite. */
export function getSupabaseConfig(): SupabaseConfig {
  const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

  return {
    url: url?.trim() ?? "",
    anonKey: anonKey?.trim() ?? "",
    configured: Boolean(url && anonKey),
  };
}

/** ¿Está Supabase configurado con credenciales reales? */
export function isSupabaseConfigured(): boolean {
  return getSupabaseConfig().configured;
}

/**
 * Trae registros de una tabla.
 *
 * @param table    nombre de la tabla, ej. "collections"
 * @param options  query opcional (select, order, filters)
 *
 * Ejemplo:
 *   supabaseList<CollectionRow>("collections", {
 *     order: "position.asc"
 *   })
 */
export async function supabaseList<T>(
  table: string,
  options?: { select?: string; order?: string; filters?: Record<string, string> }
): Promise<T[]> {
  const { url, anonKey, configured } = getSupabaseConfig();
  if (!configured) {
    throw new Error(
      "Supabase no está configurado. Define VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY."
    );
  }

  const params = new URLSearchParams();
  if (options?.select) params.set("select", options.select);
  if (options?.order) params.set("order", options.order);
  if (options?.filters) {
    for (const [key, value] of Object.entries(options.filters)) {
      params.set(key, value);
    }
  }

  const endpoint = `${url.replace(/\/$/, "")}/rest/v1/${table}?${params.toString()}`;
  const res = await fetch(endpoint, {
    headers: {
      apikey: anonKey,
      Authorization: `Bearer ${anonKey}`,
      Accept: "application/json",
    },
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Supabase ${res.status} al leer "${table}": ${body}`);
  }

  const data = (await res.json()) as T | T[];
  return Array.isArray(data) ? data : data ? [data] : [];
}

/**
 * Inserta una fila en una tabla (usado para registrar actividad de forma
 * anónima en la tabla `activity`, que solo permite insertar).
 */
export async function supabaseInsert(
  table: string,
  payload: Record<string, unknown>
): Promise<void> {
  const { url, anonKey, configured } = getSupabaseConfig();
  if (!configured) return;

  const endpoint = `${url.replace(/\/$/, "")}/rest/v1/${table}`;
  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      apikey: anonKey,
      Authorization: `Bearer ${anonKey}`,
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    // No rompemos la UI si la actividad falla; solo lo ignoramos.
    console.warn(`Supabase ${res.status} al insertar en "${table}": ${body}`);
  }
}
