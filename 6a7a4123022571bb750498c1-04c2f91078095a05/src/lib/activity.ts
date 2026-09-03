import { supabaseInsert } from "./supabase";

/**
 * Registra una actividad anónima en la tabla `activity` de Supabase.
 * Es solo de inserción (nadie puede leerla) y si Supabase no está
 * configurado o falla, se ignora sin molestar al usuario.
 */
export function trackActivity(input: {
  page: string;
  path: string;
  action: string;
  resourceId?: string;
  label?: string;
}): void {
  void supabaseInsert("activity", {
    page: input.page,
    path: input.path,
    action: input.action,
    resource_id: input.resourceId ?? null,
    label: input.label ?? null,
  });
}
