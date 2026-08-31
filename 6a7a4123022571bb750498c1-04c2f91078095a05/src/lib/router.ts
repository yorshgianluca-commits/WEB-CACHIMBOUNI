import { useCallback, useEffect, useState } from "react";

/** Normaliza cualquier hash a una ruta tipo "/recursos/teoria". */
export function parseHash(hash: string): string {
  const clean = hash.replace(/^#/, "");
  if (!clean || clean === "/") return "/";
  const withSlash = clean.startsWith("/") ? clean : `/${clean}`;
  return withSlash.replace(/\/+$/, "") || "/";
}

export function useHashRoute() {
  const [path, setPath] = useState<string>(() =>
    typeof window === "undefined" ? "/" : parseHash(window.location.hash)
  );

  useEffect(() => {
    const onHashChange = () => setPath(parseHash(window.location.hash));
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  const navigate = useCallback(
    (nextPath: string, options?: { keepScroll?: boolean }) => {
      const target = nextPath.startsWith("/") ? nextPath : `/${nextPath}`;
      if (parseHash(window.location.hash) === target) {
        if (!options?.keepScroll) window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }
      window.location.hash = target;
      if (!options?.keepScroll) {
        window.requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: "auto" }));
      }
    },
    []
  );

  return { path, navigate };
}

export type NavigateFn = ReturnType<typeof useHashRoute>["navigate"];
