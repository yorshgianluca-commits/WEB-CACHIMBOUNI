import { useEffect, useRef, useState } from "react";
import Icon from "./Icon";
import { SlideToUnlock } from "./ui/reward-card";
import ConfettiBurst from "./ui/confetti-burst";
import { useAuth } from "../hooks/useAuth";
import { useUI, markJustRegistered, consumeJustRegistered } from "../lib/ui";
import type { NavigateFn } from "../lib/router";

/**
 * Modal de registro / cuenta de CachimboUNI.
 *
 * - Invitado: usa `signInAsGuest` del hook real (sesión local persistente).
 * - Google: si Supabase está configurado (VITE_SUPABASE_URL + ANON KEY) lanza el
 *   OAuth real (`signInWithGoogle`); al volver de Google, la ventanita
 *   "Se ha completado tu registro" se muestra automáticamente (flag de sesión).
 *   Si Supabase NO está configurado, ofrece un flujo demo para poder probar la UX.
 */

type AuthModalProps = {
  navigate: NavigateFn;
};

type Step = "form" | "google" | "success" | "signed";

const DEMO_GOOGLE_ACCOUNTS = [
  { name: "Postulante UNI", email: "postulante.uni@gmail.com" },
  { name: "Cachimbo Demo", email: "cachimbo.demo@gmail.com" },
];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Regalo que se desbloquea al registrarse con Google. */
const GIFT_URL = "https://linktr.ee/SuperAcademyUNI";

function GiftIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="8" width="18" height="4" rx="1" />
      <path d="M12 12v8" />
      <path d="M19 12v8H5v-8" />
      <path d="M19 8a4 4 0 0 0-8 0" />
      <path d="M5 8a4 4 0 0 1 8 0" />
    </svg>
  );
}

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
  const { session, hasGoogle, signInAsGuest, signInWithGoogle, signOut } = useAuth();
  const { isAuthOpen, authStart, closeAuth } = useUI();
  const [step, setStep] = useState<Step>("form");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [otherEmail, setOtherEmail] = useState("");
  const [otherName, setOtherName] = useState("");
  const [useOther, setUseOther] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [lastMethod, setLastMethod] = useState<"invitado" | "google">("invitado");
  const [autoSuccess, setAutoSuccess] = useState(false);
  const [giftUnlocked, setGiftUnlocked] = useState(false);
  const checkedReturn = useRef(false);

  const visible = isAuthOpen || autoSuccess;
  const needsProfile = !session || (session.provider === "guest" && (!session.email || session.name === "Invitado"));

  // Al volver del OAuth real de Google: ventanita automática de registro completado.
  useEffect(() => {
    if (checkedReturn.current) return;
    checkedReturn.current = true;
    if (session?.provider === "google" && consumeJustRegistered()) {
      setLastMethod("google");
      setStep("success");
      setAutoSuccess(true);
    }
  }, [session]);

  useEffect(() => {
    if (isAuthOpen) {
      setError("");
      setUseOther(false);
      setOtherEmail("");
      setOtherName("");
      setBusy(false);
      setGiftUnlocked(false);
      if (authStart === "google") {
        setStep("google");
      } else if (session && !needsProfile) {
        setStep("signed");
      } else {
        setStep("form");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthOpen, authStart]);

  useEffect(() => {
    if (!visible) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setAutoSuccess(false);
        closeAuth();
      }
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [visible, closeAuth]);

  if (!visible) return null;

  const dismiss = () => {
    setAutoSuccess(false);
    closeAuth();
  };

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
    signInAsGuest({ name: name.trim(), email: email.trim().toLowerCase() });
    setStep("success");
  };

  const chooseDemoGoogleAccount = (accountName: string, accountEmail: string) => {
    setError("");
    setLastMethod("google");
    signInAsGuest({ name: accountName, email: accountEmail, demo: true });
    setStep("success");
  };

  const startRealGoogle = async () => {
    setBusy(true);
    setError("");
    markJustRegistered();
    const res = await signInWithGoogle();
    setBusy(false);
    if (!res.ok) {
      setError(res.error ?? "No se pudo iniciar el login con Google.");
    }
    // Si todo va bien, la página redirige a Google y al volver se muestra el éxito.
  };

  return (
    <div
      className="auth-overlay"
      role="dialog"
      aria-modal="true"
      aria-label={step === "success" ? "Registro completado" : "Registro en CachimboUNI"}
      onClick={(event) => {
        if (event.target === event.currentTarget) dismiss();
      }}
    >
      <div className={`auth-card ${step === "success" ? "is-success" : ""}`}>
        <button className="auth-close" onClick={dismiss} aria-label="Cerrar ventana de registro">
          <Icon name="close" size={16} />
        </button>
        <span className="auth-card-glow" aria-hidden="true" />

        {step === "form" && (
          <>
            <p className="auth-kicker">COMUNIDAD CACHIMBOUNI</p>
            <h3>{session ? "Completa tu registro" : "Crea tu cuenta gratis"}</h3>
            <p className="auth-sub">
              Guarda tu progreso, recibe los avisos del CEPREUNI y accede a los recursos gold antes que nadie.
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
                {session ? "Guardar mi perfil" : "Registrarme como invitado"} <Icon name="arrow" size={16} />
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
            {hasGoogle ? (
              <>
                <div className="auth-google-head">
                  <GoogleGlyph />
                  <div>
                    <strong>Entrar con Google</strong>
                    <span>CachimboUNI se conecta con Supabase</span>
                  </div>
                </div>
                <button className="auth-google" onClick={startRealGoogle} disabled={busy}>
                  <GoogleGlyph /> {busy ? "Abriendo Google…" : "Continuar con mi cuenta de Google"}
                </button>
                {error && <p className="auth-error" role="alert" style={{ marginTop: 12 }}>{error}</p>}
                <p className="auth-note">
                  Serás redirigido a Google y volverás aquí con tu sesión iniciada.
                </p>
              </>
            ) : (
              <>
                <div className="auth-google-head">
                  <GoogleGlyph />
                  <div>
                    <strong>Elige una cuenta</strong>
                    <span>para continuar a CachimboUNI (demo)</span>
                  </div>
                </div>
                {!useOther ? (
                  <div className="auth-google-list">
                    {DEMO_GOOGLE_ACCOUNTS.map((account) => (
                      <button
                        key={account.email}
                        className="auth-google-option"
                        onClick={() => chooseDemoGoogleAccount(account.name, account.email)}
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
                      chooseDemoGoogleAccount(
                        otherName.trim() || mail.split("@")[0].replace(/[._]/g, " "),
                        mail
                      );
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
                  Modo demo: configura Supabase (URL + anon key en .env) para habilitar el login real con Google.
                </p>
              </>
            )}
            <button className="auth-back" type="button" onClick={() => setStep("form")} style={{ marginTop: 14 }}>
              <Icon name="arrowLeft" size={15} /> Volver al registro
            </button>
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
                ? `Listo${session ? `, ${session.name.split(" ")[0]}` : ""}: tu cuenta de Google quedó vinculada a CachimboUNI.`
                : `Listo, ${session?.name.split(" ")[0] ?? name.split(" ")[0]}: tu registro como invitado se completó correctamente.`}
            </p>

            {lastMethod === "google" && (
              <>
                <ConfettiBurst fire={giftUnlocked} />
                <SlideToUnlock
                  className="reward-card is-auth"
                  sliderText="Desliza para abrir tu regalo"
                  onUnlock={() => setGiftUnlocked(true)}
                  unlockedContent={
                    <a
                      className="reward-gift"
                      href={GIFT_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <span className="reward-gift-text">
                        <strong>Super Academy UNI</strong>
                        <small>Toca para reclamar tus recursos</small>
                      </span>
                      <span className="reward-gift-badge" aria-hidden="true">
                        <Icon name="arrow" size={17} />
                      </span>
                    </a>
                  }
                >
                  <div className="reward-head">
                    <span className="reward-gift-ring" aria-hidden="true">
                      <GiftIcon className="reward-gift-icon" />
                    </span>
                    <p className="auth-kicker is-mint">REGALO DE BIENVENIDA</p>
                    <strong>Tienes un regalo desbloqueable</strong>
                    <small>
                      Por registrarte con Google te dejamos un pack de recursos para tu preparación
                      UNI. Deslízalo para abrirlo.
                    </small>
                  </div>
                </SlideToUnlock>
              </>
            )}

            <div className="auth-success-actions">
              <button
                className="auth-submit"
                onClick={() => {
                  dismiss();
                  navigate("/recursos");
                }}
              >
                Ir a la biblioteca <Icon name="arrow" size={16} />
              </button>
              <button className="auth-ghost" onClick={dismiss}>
                Seguir explorando
              </button>
            </div>
          </div>
        )}

        {step === "signed" && session && (
          <div className="auth-success">
            <span className="auth-success-ring is-signed" aria-hidden="true">
              {session.name.charAt(0).toUpperCase()}
            </span>
            <p className="auth-kicker">
              {session.provider === "google"
                ? "CUENTA GOOGLE VINCULADA"
                : session.demo
                  ? "CUENTA GOOGLE · DEMO"
                  : "CUENTA DE INVITADO"}
            </p>
            <h3>
              Hola, <em>{session.name.split(" ")[0]}.</em>
            </h3>
            <p className="auth-sub">
              {session.email
                ? `Tu registro está activo con ${session.email}. La sesión queda guardada en este dispositivo.`
                : "Tu registro está activo en este dispositivo. Completa tu correo para recibir los avisos del CEPREUNI."}
            </p>
            <div className="auth-success-actions">
              {!session.email && (
                <button className="auth-submit" onClick={() => setStep("form")}>
                  Completar mi registro <Icon name="arrow" size={16} />
                </button>
              )}
              {session.provider === "guest" && !session.demo && !hasGoogle && (
                <button className="auth-google" onClick={() => setStep("google")}>
                  <GoogleGlyph /> Vincular Google
                </button>
              )}
              <button
                className="auth-submit"
                onClick={() => {
                  dismiss();
                  navigate("/recursos");
                }}
              >
                Continuar a la biblioteca <Icon name="arrow" size={16} />
              </button>
              <button
                className="auth-ghost"
                onClick={async () => {
                  await signOut();
                  dismiss();
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
