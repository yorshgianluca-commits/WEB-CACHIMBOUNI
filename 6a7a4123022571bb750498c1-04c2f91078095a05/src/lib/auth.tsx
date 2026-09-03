import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";

export type AuthMethod = "invitado" | "google";

export type RegisteredUser = {
  name: string;
  email: string;
  method: AuthMethod;
  registeredAt: string;
};

type AuthContextValue = {
  user: RegisteredUser | null;
  /** Abre el modal de registro desde cualquier parte del sitio. */
  openAuth: (start?: "form" | "google") => void;
  closeAuth: () => void;
  isAuthOpen: boolean;
  /** Paso inicial con el que se abrió el modal. */
  authStart: "form" | "google";
  /** Registra al usuario (flujo simulado, ver AuthModal) y guarda la sesión en localStorage. */
  register: (payload: Omit<RegisteredUser, "registeredAt">) => void;
  logout: () => void;
};

const STORAGE_KEY = "cachimbouni.user";

const AuthContext = createContext<AuthContextValue | null>(null);

function readStoredUser(): RegisteredUser | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as RegisteredUser;
    if (parsed && typeof parsed.name === "string" && typeof parsed.email === "string") return parsed;
    return null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<RegisteredUser | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authStart, setAuthStart] = useState<"form" | "google">("form");

  useEffect(() => {
    setUser(readStoredUser());
  }, []);

  const openAuth = useCallback((start: "form" | "google" = "form") => {
    setAuthStart(start);
    setIsAuthOpen(true);
  }, []);
  const closeAuth = useCallback(() => setIsAuthOpen(false), []);

  const register = useCallback((payload: Omit<RegisteredUser, "registeredAt">) => {
    const next: RegisteredUser = { ...payload, registeredAt: new Date().toISOString() };
    setUser(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* almacenamiento no disponible: la sesión vive solo en memoria */
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* noop */
    }
  }, []);

  const value = useMemo(
    () => ({ user, openAuth, closeAuth, isAuthOpen, authStart, register, logout }),
    [user, isAuthOpen, authStart, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de <AuthProvider>");
  return ctx;
}
