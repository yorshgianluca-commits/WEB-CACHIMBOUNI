import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { getAuthClient } from "../lib/authClient";

const GUEST_KEY = "cachimbo_session";

export type AuthProviderId = "google" | "guest";

export type AuthSession = {
  provider: AuthProviderId;
  name: string;
  email?: string;
};

type AuthContextValue = {
  loading: boolean;
  session: AuthSession | null;
  /** true si Supabase está configurado y el login con Google está disponible. */
  hasGoogle: boolean;
  signInWithGoogle: () => Promise<{ ok: boolean; error?: string }>;
  signInAsGuest: () => void;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function readGuest(): AuthSession | null {
  try {
    const raw = localStorage.getItem(GUEST_KEY);
    return raw ? (JSON.parse(raw) as AuthSession) : null;
  } catch {
    return null;
  }
}

function writeGuest(session: AuthSession | null) {
  if (session) localStorage.setItem(GUEST_KEY, JSON.stringify(session));
  else localStorage.removeItem(GUEST_KEY);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<AuthSession | null>(null);
  const [hasGoogle, setHasGoogle] = useState(false);

  useEffect(() => {
    const auth = getAuthClient();
    setHasGoogle(Boolean(auth));

    async function init() {
      // 1) Si hay sesión de Google (Supabase), es la que manda.
      if (auth) {
        try {
          const { data } = await auth.auth.getSession();
          if (data.session?.user) {
            const u = data.session.user;
            setSession({
              provider: "google",
              name: u.user_metadata?.full_name ?? u.email ?? "Usuario",
              email: u.email,
            });
            setLoading(false);
            return;
          }
        } catch {
          /* Ignorar y seguir */
        }
      }

      // 2) Si no, usar la sesión de invitado guardada.
      const guest = readGuest();
      if (guest) setSession(guest);

      setLoading(false);
    }

    init();

    // Reaccionar a cambios de sesión de Google (p. ej. al cerrar el popup).
    if (auth) {
      const { data } = auth.auth.onAuthStateChange((event, newSession) => {
        if (newSession?.user) {
          const u = newSession.user;
          setSession({
            provider: "google",
            name: u.user_metadata?.full_name ?? u.email ?? "Usuario",
            email: u.email,
          });
          writeGuest(null);
        } else if (event === "SIGNED_OUT") {
          setSession((prev) => (prev?.provider === "google" ? null : prev));
        }
      });
      return () => data.subscription.unsubscribe();
    }
  }, []);

  const signInWithGoogle = useCallback(async () => {
    const auth = getAuthClient();
    if (!auth) {
      return {
        ok: false,
        error:
          "El login con Google no está disponible. Configura Supabase (URL y clave) en el archivo .env.",
      };
    }

    try {
      const { error } = await auth.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: window.location.origin },
      });
      if (error) return { ok: false, error: error.message };
      return { ok: true };
    } catch (e) {
      return {
        ok: false,
        error:
          "No se pudo iniciar el login con Google. Revisa que el proveedor Google esté activado en Supabase → Authentication → Providers.",
      };
    }
  }, []);

  const signInAsGuest = useCallback(() => {
    const guest: AuthSession = { provider: "guest", name: "Invitado" };
    writeGuest(guest);
    setSession(guest);
  }, []);

  const signOut = useCallback(async () => {
    const current = readGuest();
    if (current?.provider === "guest") {
      writeGuest(null);
      setSession(null);
      return;
    }
    const auth = getAuthClient();
    if (auth) {
      await auth.auth.signOut().catch(() => undefined);
    }
    writeGuest(null);
    setSession(null);
  }, []);

  const value: AuthContextValue = {
    loading,
    session,
    hasGoogle,
    signInWithGoogle,
    signInAsGuest,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de <AuthProvider>.");
  return ctx;
}
