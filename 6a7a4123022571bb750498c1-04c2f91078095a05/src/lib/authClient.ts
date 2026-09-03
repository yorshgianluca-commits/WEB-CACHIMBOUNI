import { createClient } from "@supabase/supabase-js";
import { getSupabaseConfig } from "./supabase";

/**
 * Cliente de Supabase específico para autenticación (login con Google).
 * Solo se crea si Supabase está configurado (URL + anon key).
 */
export type SupabaseAuth = NonNullable<ReturnType<typeof createClient>>;

let client: SupabaseAuth | null = null;

export function getAuthClient(): SupabaseAuth | null {
  const { url, anonKey, configured } = getSupabaseConfig();
  if (!configured) return null;

  if (!client) {
    client = createClient(url, anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    });
  }

  return client;
}
