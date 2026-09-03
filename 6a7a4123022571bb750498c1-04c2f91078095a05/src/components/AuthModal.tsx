import { useEffect, useState } from "react";
import Icon from "./Icon";
import { useAuth } from "../lib/auth";
import type { NavigateFn } from "../lib/router";

/**
 * Modal de registro de CachimboUNI.
 *
 * IMPORTANTE: el flujo de Google está SIMULADO (este sitio es estático, sin backend).
 * Para conectar OAuth real, reemplaza `chooseGoogleAccount` por Google Identity
 * Services (google.accounts.oauth2) o Firebase `signInWithPopup(new GoogleAuthProvider())`
 * y luego llama a `register({ method: "google", ... })` con los datos del perfil.
 */

type AuthModalProps = {
  navigate: NavigateFn;
};

type Step = "form" | "google" | "success" | "signed";

const GOOGLE_SUGGESTED = [
  { name: "Postulante UNI", email: "postulante.uni@gmail.com" },
  { name: "Cachimbo Demo", email: "cachimbo.demo@gmail.com" },
];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function GoogleGlyph() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true" focusable="false">
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3l5.7-5.7C34.3 6.1 29.4 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.3-.4-3.5Z" />
      <path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.9 1.2 8 3l5.7-5.7C34.3 6.1 29.4 4 24 4 16.3 4 9.7 8.3 6.3 14.7Z" />
      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.3 0-9.7-3.3-11.3-8l-6.5 5C9.6 39.6 16.3 44 24 44Z" />
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.3-4.1 5.6l6.2 5.2C36.9 39.2 44 34 44 24c0-1.3-.1-2.3-.4-3.5Z" />
    </svg>
  );
}

export default function AuthModal({ navigate }: AuthModalProps) {
  const { user, isAuthOpen, authStart, closeAuth, register, logout } = useAuth();
  const [step, setStep] = useState<Step>("form");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [otherEmail, setOtherEmail] = useState("");
  const [otherName, setOtherName] = useState("");
  const [useOther, setUseOther] = useState(false);
  const [error, setError] = useState("");
  const [lastMethod, setLastMethod] = useState<"invitado" | "google">("invitado");

  // El paso inicial solo se define al ABRIR el modal; si el usuario se registra
  // mientras está abierto, dejamos ver la ventanita de éxito antes de "signed".
  useEffect(() => {
    if (isAuthOpen) {
      setStep(user ? "signed" : authStart);
      setError("");
      setUseOther(false);
      setOtherEmail("");
      setOtherName("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthOpen]);

  useEffect(() => {
    if (!isAuthOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeAuth();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [isAuthOpen, closeAuth]);

  if (!isAuthOpen) return null;

  const submitGuest = (event: React.FormEvent) => {
    event.preventDefault();
    if (name.trim().length < 3) {
      setError("Escribe tu nombre completo para continuar.");
      return;
    }
    if (!EMAIL_RE.test(email.trim())) {
      setError("Escribe un correo válido, por ejemplo: tú@gmail.com");
      return;
    }
    setError("");
    setLastMethod("invitado");
    register({ name: name.trim(), email: email.trim().toLowerCase(), method: "invitado" });
    setStep("success");
  };

  const chooseGoogleAccount = (accountName: string, accountEmail: string) => {
    setError("");
    setLastMethod("google");
    register({ name: accountName, email: accountEmail, method: "google" });
    setStep("success");
  };

  return (
    <div
      className="auth-overlay"
      role="dialog"
      aria-modal="true"
      aria-label={step === "success" ? "Registro completado" : "Registro en CachimboUNI"}
      onClick={(event) => {
        if (event.target === event.currentTarget) closeAuth();
      }}
    >
      <div className={`auth-card ${step === "success" ? "is-success" : ""}`}>
        <button className="auth-close" onClick={closeAuth} aria-label="Cerrar ventana de registro">
          <Icon name="close" size={16} />
        </button>
        <span className="auth-card-glow" aria-hidden="true" />

        {step === "form" && (
          <>
            <p className="auth-kicker">COMUNIDAD CACHIMBOUNI</p>
            <h3>
              Crea tu cuenta <em>gratis</em>
            </h3>
            <p className="auth-sub">
              Guarda tu progreso, recibe avisos del CEPREUNI y accede a los recursos gold antes que nadie.
            </p>
            <form className="auth-form" onSubmit={submitGuest} noValidate>
              <label>
                <span>Nombre completo</span>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ej. Giancarlos Yors"
                  autoComplete="name"
                />
              </label>
              <label>
                <span>Correo electrónico</span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tucorreo@gmail.com"
                  autoComplete="email"
                />
              </label>
              {error && <p className="auth-error" role="alert">{error}</p>}
              <button className="auth-submit" type="submit">
                Registrarme como invitado <Icon name="arrow" size={16} />
              </button>
            </form>
            <div className="auth-divider"><span>o continúa con</span></div>
            <button className="auth-google" onClick={() => setStep("google")}>
              <GoogleGlyph /> Registrarse con Google
            </button>
            <p className="auth-legal">
              Al registrarte aceptas que usemos tus datos solo para mejorar tu experiencia en CachimboUNI.
            </p>
          </>
        )}

        {step === "google" && (
          <div className="auth-google-sheet">
            <div className="auth-google-head">
              <GoogleGlyph />
              <div>
                <strong>Elige una cuenta</strong>
                <span>para continuar a CachimboUNI</span>
              </div>
            </div>
            {!useOther ? (
              <div className="auth-google-list">
                {GOOGLE_SUGGESTED.map((account) => (
                  <button
                    key={account.email}
                    className="auth-google-option"
                    onClick={() => chooseGoogleAccount(account.name, account.email)}
                  >
                    <span className="auth-google-avatar" aria-hidden="true">
                      {account.name.charAt(0).toUpperCase()}
                    </span>
                    <span>
                      <strong>{account.name}</strong>
                      <small>{account.email}</small>
                    </span>
                    <Icon name="arrow" size={15} />
                  </button>
                ))}
                <button className="auth-google-option is-other" onClick={() => setUseOther(true)}>
                  <span className="auth-google-avatar is-add" aria-hidden="true">
                    <Icon name="check" size={15} />
                  </span>
                  <span>
                    <strong>Usar otra cuenta</strong>
                    <small>Escribe tu correo de Google</small>
                  </span>
                  <Icon name="arrow" size={15} />
                </button>
              </div>
            ) : (
              <form
                className="auth-form"
                onSubmit={(e) => {
                  e.preventDefault();
                  const mail = otherEmail.trim().toLowerCase();
                  if (!EMAIL_RE.test(mail)) {
                    setError("Escribe un correo de Google válido (ej. nombre@gmail.com).");
                    return;
                  }
                  chooseGoogleAccount(otherName.trim() || mail.split("@")[0].replace(/[._]/g, " "), mail);
                }}
                noValidate
              >
                <label>
                  <span>Tu nombre (opcional)</span>
                  <input
                    type="text"
                    value={otherName}
                    onChange={(e) => setOtherName(e.target.value)}
                    placeholder="Como te llamaremos en CachimboUNI"
                  />
                </label>
                <label>
                  <span>Correo de Google</span>
                  <input
                    type="email"
                    value={otherEmail}
                    onChange={(e) => setOtherEmail(e.target.value)}
                    placeholder="nombre@gmail.com"
                    autoFocus
                  />
                </label>
                {error && <p className="auth-error" role="alert">{error}</p>}
                <button className="auth-submit is-google" type="submit">
                  <GoogleGlyph /> Continuar con esta cuenta
                </button>
                <button className="auth-back" type="button" onClick={() => setUseOther(false)}>
                  <Icon name="arrowLeft" size={15} /> Volver a la lista
                </button>
              </form>
            )}
            <p className="auth-note">
              Demo local: conecta Google OAuth (Firebase o Google Identity Services) para cuentas reales.
            </p>
          </div>
        )}

        {step === "success" && (
          <div className="auth-success">
            <span className="auth-success-ring" aria-hidden="true">
              <Icon name="check" size={34} strokeWidth={2.4} />
              <i />
            </span>
            <p className="auth-kicker is-mint">REGISTRO COMPLETADO</p>
            <h3>
              ¡Se ha completado <em>tu registro!</em>
            </h3>
            <p className="auth-sub">
              {lastMethod === "google"
                ? `Tu cuenta de Google (${user?.email}) quedó vinculada a CachimboUNI.`
                : `Listo, ${user?.name.split(" ")[0]}: tu registro como invitado se completó correctamente.`}
            </p>
            <div className="auth-success-actions">
              <button
                className="auth-submit"
                onClick={() => {
                  closeAuth();
                  navigate("/recursos");
                }}
              >
                Ir a la biblioteca <Icon name="arrow" size={16} />
              </button>
              <button className="auth-ghost" onClick={closeAuth}>
                Seguir explorando
              </button>
            </div>
          </div>
        )}

        {step === "signed" && (
          <div className="auth-success">
            <span className="auth-success-ring is-signed" aria-hidden="true">
              {user?.name.charAt(0).toUpperCase()}
            </span>
            <p className="auth-kicker">{user?.method === "google" ? "CUENTA GOOGLE VINCULADA" : "CUENTA DE INVITADO"}</p>
            <h3>
              Hola, <em>{user?.name.split(" ")[0]}.</em>
            </h3>
            <p className="auth-sub">
              Tu registro ya está activo con {user?.email}. Tu sesión queda guardada en este dispositivo.
            </p>
            <div className="auth-success-actions">
              <button
                className="auth-submit"
                onClick={() => {
                  closeAuth();
                  navigate("/recursos");
                }}
              >
                Continuar a la biblioteca <Icon name="arrow" size={16} />
              </button>
              <button
                className="auth-ghost"
                onClick={() => {
                  logout();
                  closeAuth();
                }}
              >
                Cerrar sesión
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
