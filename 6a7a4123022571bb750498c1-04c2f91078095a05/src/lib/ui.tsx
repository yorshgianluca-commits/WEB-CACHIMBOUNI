import { createContext, useCallback, useContext, useMemo, useState } from "react";
import type { ReactNode } from "react";

/**
 * Estado de UI compartido: controla la apertura del modal de registro/cuenta
 * desde cualquier parte del sitio (header, sección de registro, etc.).
 * La sesión real vive en `src/hooks/useAuth.tsx` (Supabase / invitado).
 */

export type AuthModalStart = "form" | "google";

type UIContextValue = {
  isAuthOpen: boolean;
  /** Paso con el que se abre el modal por defecto. */
  authStart: AuthModalStart;
  openAuth: (start?: AuthModalStart) => void;
  closeAuth: () => void;
};

const UIContext = createContext<UIContextValue | null>(null);

export function UIProvider({ children }: { children: ReactNode }) {
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authStart, setAuthStart] = useState<AuthModalStart>("form");

  const openAuth = useCallback((start: AuthModalStart = "form") => {
    setAuthStart(start);
    setIsAuthOpen(true);
  }, []);

  const closeAuth = useCallback(() => setIsAuthOpen(false), []);

  const value = useMemo(
    () => ({ isAuthOpen, authStart, openAuth, closeAuth }),
    [isAuthOpen, authStart]
  );

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
}

export function useUI(): UIContextValue {
  const ctx = useContext(UIContext);
  if (!ctx) throw new Error("useUI debe usarse dentro de <UIProvider>.");
  return ctx;
}

/** Flag de un solo uso: avisa que acabamos de volver del OAuth de Google. */
export const JUST_REGISTERED_KEY = "cachimbouni.justRegistered";

export function markJustRegistered() {
  try {
    sessionStorage.setItem(JUST_REGISTERED_KEY, "google");
  } catch {
    /* noop */
  }
}

export function consumeJustRegistered(): boolean {
  try {
    const v = sessionStorage.getItem(JUST_REGISTERED_KEY);
    if (v) sessionStorage.removeItem(JUST_REGISTERED_KEY);
    return v === "google";
  } catch {
    return false;
  }
}
