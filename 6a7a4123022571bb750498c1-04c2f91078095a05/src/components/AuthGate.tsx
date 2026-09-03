import { useState } from "react";
import { useAuth } from "../hooks/useAuth";

/**
 * Pantalla de acceso previa a todo el sitio.
 * Obliga a entrar con Google o como invitado antes de ver el contenido.
 */
export default function AuthGate() {
  const { signInWithGoogle, signInAsGuest, hasGoogle } = useAuth();
  const [busy, setBusy] = useState<"google" | "guest" | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGoogle = async () => {
    setBusy("google");
    setError(null);
    const res = await signInWithGoogle();
    if (!res.ok) setError(res.error ?? "No se pudo iniciar sesión con Google.");
    // Si es ok, el flujo de redirección/popup de Supabase hace el resto.
    setBusy(null);
  };

  const handleGuest = () => {
    setBusy("guest");
    setError(null);
    signInAsGuest();
    setBusy(null);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        background:
          "radial-gradient(1200px 700px at 78% -10%, rgba(140,31,54,.28), transparent 50%), radial-gradient(900px 600px at 10% 110%, rgba(216,118,62,.18), transparent 55%), #080b0d",
        color: "#e8e7e1",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 420,
          padding: "clamp(28px, 5vw, 44px)",
          borderRadius: 22,
          background: "rgba(16,20,22,.72)",
          border: "1px solid rgba(255,255,255,.1)",
          backdropFilter: "blur(14px)",
          boxShadow: "0 30px 80px rgba(0,0,0,.5)",
          textAlign: "center",
        }}
      >
        {/* Marca */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: 56,
            height: 56,
            marginBottom: 18,
            borderRadius: "50%",
            border: "1px solid rgba(255,255,255,.45)",
            fontSize: 30,
            fontWeight: 700,
            color: "#f3a066",
            fontFamily: "'Oswald', sans-serif",
          }}
        >
          C
        </div>

        <p
          style={{
            margin: "0 0 6px",
            fontSize: 11,
            letterSpacing: "0.28em",
            textTransform: "uppercase",
            color: "#8b918e",
            fontWeight: 600,
          }}
        >
          CachimboUNI
        </p>
        <h1
          style={{
            margin: "0 0 10px",
            fontSize: "clamp(26px, 6vw, 34px)",
            lineHeight: 1.05,
            fontFamily: "'Oswald', sans-serif",
            fontWeight: 700,
            letterSpacing: "0.01em",
          }}
        >
          Bienvenido al <span style={{ color: "#f3a066" }}>ingreso</span>
        </h1>
        <p
          style={{
            margin: "0 0 26px",
            fontSize: 14,
            lineHeight: 1.6,
            color: "#a7adaa",
          }}
        >
          Elige cómo prefieres entrar para acceder a la biblioteca, la ruta y todos
          los recursos de la UNI.
        </p>

        {/* Botón: Continuar con Google */}
        <button
          onClick={handleGoogle}
          disabled={busy !== null}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            padding: "14px 16px",
            borderRadius: 12,
            fontSize: 15,
            fontWeight: 600,
            color: "#1f2937",
            background: "#ffffff",
            border: "1px solid #e5e7eb",
            cursor: busy !== null ? "default" : "pointer",
            opacity: busy === "google" ? 0.7 : 1,
          }}
        >
          <svg width="20" height="20" viewBox="0 0 48 48" aria-hidden="true">
            <path
              fill="#EA4335"
              d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.65 9.5 24 9.5z"
            />
            <path
              fill="#4285F4"
              d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
            />
            <path
              fill="#FBBC05"
              d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.55 10.78l7.98-6.19z"
            />
            <path
              fill="#34A853"
              d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.35 0-11.57-4.22-13.46-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
            />
          </svg>
          {busy === "google" ? "Conectando con Google…" : "Continuar con Google"}
        </button>

        {!hasGoogle && (
          <p style={{ margin: "12px 0 0", fontSize: 11.5, color: "#8b918e", lineHeight: 1.5 }}>
            El botón de Google solo aparece activo cuando configuras Supabase. Mientras
            tanto, puedes entrar como invitado.
          </p>
        )}

        {/* Separador */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            margin: "20px 0",
            color: "#6b7280",
            fontSize: 12,
          }}
        >
          <span style={{ flex: 1, height: 1, background: "rgba(255,255,255,.12)" }} />
          o
          <span style={{ flex: 1, height: 1, background: "rgba(255,255,255,.12)" }} />
        </div>

        {/* Botón: Entrar como invitado */}
        <button
          onClick={handleGuest}
          disabled={busy !== null}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            padding: "14px 16px",
            borderRadius: 12,
            fontSize: 15,
            fontWeight: 600,
            color: "#f3a066",
            background: "rgba(216,118,62,.14)",
            border: "1px solid rgba(243,160,102,.35)",
            cursor: busy !== null ? "default" : "pointer",
            opacity: busy === "guest" ? 0.7 : 1,
          }}
        >
          {busy === "guest" ? "Entrando…" : "Entrar como invitado"}
        </button>

        {error && (
          <p
            style={{
              margin: "16px 0 0",
              fontSize: 12.5,
              color: "#f87171",
              lineHeight: 1.5,
              textAlign: "left",
              padding: "10px 12px",
              borderRadius: 10,
              background: "rgba(248,113,113,.1)",
              border: "1px solid rgba(248,113,113,.25)",
            }}
          >
            {error}
          </p>
        )}

        <p style={{ margin: "22px 0 0", fontSize: 11.5, color: "#6b7280", lineHeight: 1.6 }}>
          Al continuar aceptas el uso del sitio con fines educativos. El material es de
          acceso libre y gratuito.
        </p>
      </div>
    </div>
  );
}
