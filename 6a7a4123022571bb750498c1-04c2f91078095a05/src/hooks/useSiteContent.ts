import { useEffect, useState } from "react";
import { loadSiteContent, getStaticContent } from "../lib/siteData";
import type { SiteContent } from "../lib/siteData";

export type UseSiteContentResult = SiteContent & { loading: boolean };

/**
 * Expone el contenido del sitio (categorías + recursos).
 *
 * - Arranca de inmediato con los datos estáticos (para no parpadear).
 * - Si Supabase está configurado, lo reemplaza con los datos reales
 *   en cuanto llegan.
 */
export function useSiteContent(): UseSiteContentResult {
  const [content, setContent] = useState<SiteContent>(() => getStaticContent());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    loadSiteContent().then((next) => {
      if (!active) return;
      setContent(next);
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, []);

  return { ...content, loading };
}
