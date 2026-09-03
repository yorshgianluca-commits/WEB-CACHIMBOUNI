import Icon from "../components/Icon";
import ParticleField from "../components/ParticleField";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";
import GoldResources from "../components/GoldResources";
import GlassNotifications from "../components/GlassNotifications";
import { useAuth } from "../hooks/useAuth";
import { useUI } from "../lib/ui";
import { useSiteContent } from "../hooks/useSiteContent";
import { trackActivity } from "../lib/activity";
import type { NavigateFn } from "../lib/router";

type HomePageProps = {
  navigate: NavigateFn;
  path: string;
};

const METHOD_STEPS = [
  {
    index: "01",
    title: "Comprende",
    text: "Conceptos directos, sin relleno y con la profundidad que exige la UNI.",
  },
  {
    index: "02",
    title: "Construye",
    text: "Ejemplos desarrollados paso a paso para formar criterio matemático.",
  },
  {
    index: "03",
    title: "Conquista",
    text: "Práctica cronometrada para convertir conocimiento en puntaje real.",
  },
];

const EXAM_PARTS = [
  { code: "E1", name: "Aptitud Académica y Humanidades" },
  { code: "E2", name: "Matemática" },
  { code: "E3", name: "Física y Química" },
];

export default function HomePage({ navigate, path }: HomePageProps) {
  const { categories, resources } = useSiteContent();
  const countByCategory = (categoryId: string) =>
    resources.filter((item) => item.category === categoryId).length;
  const { session, signOut } = useAuth();
  const { openAuth } = useUI();

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="page">
      <SiteHeader navigate={navigate} path={path} />
      <GlassNotifications />

      <section className="hero" id="inicio">
        <div className="hero-image" aria-hidden="true" />
        <div className="hero-shade" aria-hidden="true" />
        <div className="orbital orbital-one" aria-hidden="true" />
        <div className="orbital orbital-two" aria-hidden="true" />
        <ParticleField density={110} />

        <div className="hero-uni-crest" aria-hidden="true">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/f/f7/Uni-logo_transparente_granate.png"
            alt=""
            loading="eager"
          />
          <span className="crest-ring" />
          <span className="crest-ring crest-ring--outer" />
        </div>

        <div className="hero-content">
          <div className="hero-brand" aria-label="CachimboUNI">
            <span>CACHIMBO</span>
            <strong>UNI</strong>
          </div>
          <h1>
            Ingreso rápido
            <br />
            a la <em>UNI.</em>
          </h1>
          <p>
            Teoría clara, exámenes resueltos y libros seleccionados para conquistar el examen de
            admisión de la Universidad Nacional de Ingeniería.
          </p>
          <div className="hero-actions">
            <button className="primary-button" onClick={() => navigate("/recursos")}>
              Explorar biblioteca <Icon name="arrow" />
            </button>
            <button className="text-button" onClick={() => scrollTo("metodo")}>
              <span className="play-circle">
                <Icon name="play" size={14} />
              </span>{" "}
              Conoce el método
            </button>
          </div>

          <a
            className="drive-beta"
            href="https://drive.google.com/drive/folders/1Ip3I5jgEgOxFGE1vYHGpfRtpP4jJtXo5?usp=drive_link"
            target="_blank"
            rel="noreferrer noopener"
            aria-label="Abrir Drive V. Beta con material de preparación"
          >
            <span className="drive-beta-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" width="22" height="22" aria-hidden="true">
                <path d="M7.5 16.5 4 20.5h16l-3.5-4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M9 3h6l5 8.5-3 5H7l-3-5Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
                <path d="M12 3v12.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
              </svg>
            </span>
            <span className="drive-beta-text">
              <span className="drive-beta-kicker">Acceso rápido</span>
              <strong>Drive V. Beta</strong>
            </span>
            <span className="drive-beta-pulse" aria-hidden="true" />
            <Icon name="external" size={15} />
          </a>
        </div>

        <button className="scroll-cue" onClick={() => scrollTo("metodo")} aria-label="Bajar a la siguiente sección">
          <span>Desciende</span>
          <i />
        </button>
      </section>

      <section className="manifesto section-pad" id="metodo">
        <div className="section-index">01 / EL MÉTODO</div>
        <div className="manifesto-copy">
          <p className="eyebrow">Preparación con dirección</p>
          <h2>
            No necesitas estudiar más.
            <br />
            Necesitas estudiar <em>mejor.</em>
          </h2>
          <p className="lead">
            Organizamos lo complejo en una ruta precisa: entiende la teoría, observa el método y
            resuelve hasta dominarlo.
          </p>
        </div>
        <div className="method-lines">
          {METHOD_STEPS.map((step) => (
            <div className="method-step" key={step.index}>
              <span>{step.index}</span>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </div>
          ))}
        </div>

        <button className="metodo-highlight" onClick={() => navigate("/camino-rapido")} aria-label="Ir al camino más rápido para ingresar">
          <div className="metodo-highlight-label">
            <span className="metodo-highlight-kicker">Propósito</span>
            <h3>El camino más <em>rápido</em> para ingresar</h3>
            <p>Anual → Intensivo CEPREUNI → Prácticas y exámenes. Una ruta directa sin rodeos.</p>
          </div>
          <span className="metodo-highlight-cta">
            Explorar ruta <Icon name="arrow" size={18} />
          </span>
        </button>
      </section>

      <section className="subjects section-pad" id="ruta">
        <div className="subject-visual" aria-hidden="true">
          <div className="formula formula-a">Σ F = ma</div>
          <div className="formula formula-b">x² + y² = r²</div>
          <div className="formula formula-c">n = m / M</div>
          <div className="subject-ring" />
          <div className="subject-core">UNI</div>
        </div>
        <div className="subject-copy">
          <div className="section-index">02 / LA RUTA</div>
          <p className="eyebrow">El examen, sin puntos ciegos</p>
          <h2>
            Tres pruebas.
            <br />
            Una sola meta.
          </h2>
          <p>
            Entrena las áreas que componen el examen de admisión con una secuencia pensada para
            avanzar desde tus bases hasta el nivel real de la prueba.
          </p>
          <div className="exam-list">
            {EXAM_PARTS.map((part) => (
              <div key={part.code}>
                <span>{part.code}</span>
                <strong>{part.name}</strong>
              </div>
            ))}
          </div>
          <div className="subject-actions">
            <button className="primary-button" onClick={() => navigate("/ruta-uni")}>
              Conocer el campus <Icon name="arrow" />
            </button>
            <a
              className="inline-link"
              href="https://admision.uni.edu.pe/admision2026-2/"
              target="_blank"
              rel="noreferrer"
            >
              Información oficial <Icon name="external" size={16} />
            </a>
          </div>
        </div>
      </section>

      <section className="library-teaser section-pad" id="recursos">
        <div className="teaser-head">
          <div>
            <div className="section-index">03 / BIBLIOTECA ABIERTA</div>
            <p className="eyebrow">Material listo para hoy</p>
            <h2>
              Teoría, exámenes,
              <br />libros y <em>videos.</em>
            </h2>
          </div>
          <div className="teaser-aside">
            <p>
              Todo el material vive en una página propia, organizada en cuatro recuadros para que
              encuentres en segundos lo que necesitas estudiar.
            </p>
            <button className="primary-button" onClick={() => navigate("/recursos")}>
              Ir a la página de recursos <Icon name="arrow" />
            </button>
          </div>
        </div>

        <div className="teaser-grid">
          {categories.map((category) => (
            <button
              key={category.id}
              className="teaser-box"
              onClick={() => {
                trackActivity({
                  page: "home",
                  path: `/recursos/${category.id}`,
                  action: "open_category",
                  resourceId: category.id,
                  label: category.name,
                });
                navigate(`/recursos/${category.id}`);
              }}
              aria-label={`Abrir ${category.name}`}
            >
              <div className="teaser-box-top">
                <span className="teaser-icon">
                  <Icon name={category.icon} size={22} />
                </span>
                <span className="teaser-index">{category.index}</span>
              </div>
              <h3>{category.name}</h3>
              <p>{category.tagline}</p>
              <div className="teaser-box-foot">
                <span>{category.externalCollection ? `${category.externalCollection.length} carpetas` : `${countByCategory(category.id)} materiales`}</span>
                <i>
                  <Icon name="arrow" size={18} />
                </i>
              </div>
            </button>
          ))}
        </div>

        <div className="teaser-stats">
          <div>
            <strong>18</strong>
            <span>recursos curados</span>
          </div>
          <div>
            <strong>5</strong>
            <span>cursos cubiertos</span>
          </div>
          <div>
            <strong>100%</strong>
            <span>acceso gratuito</span>
          </div>
        </div>
      </section>

      <GoldResources navigate={navigate} />

      <section className="home-guia section-pad">
        <div className="home-guia-inner">
          <div className="home-guia-left">
            <div className="section-index">04 / GUÍA · NUEVO</div>
            <p className="eyebrow">Canales y videos curados</p>
            <h2>
              Canales y videos
              <br />
              <em>recomendados.</em>
            </h2>
            <p>
              14 canales curados de YouTube y 2 videos clave para método y mentalidad. Una guía clara
              para no perderte entre miles de clases.
            </p>
            <button className="primary-button" onClick={() => navigate("/guia")}>
              Entrar a la guía <Icon name="arrow" />
            </button>
          </div>
          <div className="home-guia-right" aria-hidden="true">
            <div className="mini-dither-grid">
              {Array.from({ length: 64 }).map((_, i) => (
                <span key={i} style={{ opacity: Math.random() * 0.5 + 0.2 }} />
              ))}
            </div>
            <div className="mini-crest">UNI</div>
          </div>
        </div>
      </section>

      <section className="home-tools section-pad">
        <div className="home-tools-inner">
          <div>
            <div className="section-index">05 / TOOLS STUDY</div>
            <p className="eyebrow">Stack del postulante</p>
            <h2>
              Apps que
              <br />
              <em>multiplican</em> tu estudio.
            </h2>
            <p>
              Anki, OneNote, ChatGPT, Gemini, DeepSeek, Calendar y más. Cada herramienta con su
              propósito real para la UNI.
            </p>
            <button className="primary-button" onClick={() => navigate("/tools-study")}>
              Abrir Tools Study <Icon name="arrow" />
            </button>
          </div>
          <div className="home-tools-strip" aria-hidden="true">
            {["anki", "onenote", "chatgpt", "gemini", "youtube", "calendar"].map((name) => (
              <span key={name} className="home-tools-chip">{name}</span>
            ))}
          </div>
        </div>
      </section>

      <section className="home-registro section-pad" id="registro">
        <div className="registro-card">
          <span className="registro-glow" aria-hidden="true" />
          <div className="registro-copy">
            <div className="section-index">06 / REGISTRO</div>
            <p className="eyebrow">Únete a CachimboUNI</p>
            <h2>
              Regístrate y lleva tu preparación
              <br />
              en <em>otro nivel.</em>
            </h2>
            <p className="registro-text">
              Crea tu cuenta gratis como invitado o con Google: guarda tus recursos favoritos,
              recibe los avisos del CEPREUNI al instante y desbloquea accesos anticipados.
            </p>
            <ul className="registro-benefits">
              <li><Icon name="check" size={14} /> Avisos de horario y cronograma CEPREUNI</li>
              <li><Icon name="check" size={14} /> Marcadores y progreso guardados en tu cuenta</li>
              <li><Icon name="check" size={14} /> Acceso anticipado a Recursos Gold</li>
            </ul>
          </div>

          {session ? (
            <div className="registro-user">
              <span className="registro-avatar" aria-hidden="true">
                {session.name.charAt(0).toUpperCase()}
              </span>
              <div className="registro-user-info">
                <p className="auth-kicker is-mint">
                  {session.provider === "google"
                    ? "SESIÓN ACTIVA · GOOGLE"
                    : session.demo
                      ? "REGISTRO COMPLETADO · GOOGLE (DEMO)"
                      : "SESIÓN ACTIVA · INVITADO"}
                </p>
                <strong>{session.name}</strong>
                {session.email && <small>{session.email}</small>}
              </div>
              <div className="registro-user-actions">
                <button className="auth-submit" onClick={() => openAuth()}>
                  Mi cuenta <Icon name="arrow" size={15} />
                </button>
                <button className="auth-ghost" onClick={() => signOut()}>
                  Cerrar sesión
                </button>
              </div>
            </div>
          ) : (
            <div className="registro-actions">
              <button className="auth-submit is-lg" onClick={() => openAuth("form")}>
                Registrarme como invitado <Icon name="arrow" size={16} />
              </button>
              <button className="auth-google is-lg" onClick={() => openAuth("google")}>
                <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true" focusable="false">
                  <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3l5.7-5.7C34.3 6.1 29.4 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.3-.4-3.5Z" />
                  <path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.9 1.2 8 3l5.7-5.7C34.3 6.1 29.4 4 24 4 16.3 4 9.7 8.3 6.3 14.7Z" />
                  <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.3 0-9.7-3.3-11.3-8l-6.5 5C9.6 39.6 16.3 44 24 44Z" />
                  <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.3-4.1 5.6l6.2 5.2C36.9 39.2 44 34 44 24c0-1.3-.1-2.3-.4-3.5Z" />
                </svg>
                Registrarse con Google
              </button>
              <small>Gratis y sin tarjeta. Puedes cerrar sesión cuando quieras.</small>
            </div>
          )}
        </div>
      </section>

      <section className="commitment section-pad">
        <div className="uni-mark">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/f/f7/Uni-logo_transparente_granate.png"
            alt="Escudo de la Universidad Nacional de Ingeniería del Perú"
            loading="lazy"
          />
        </div>
        <div className="commitment-copy">
          <div className="section-index">04 / EL COMPROMISO</div>
          <blockquote>
            “El talento abre la puerta.
            <br />
            La disciplina te hace <em>ingresar.</em>”
          </blockquote>
          <p>
            CachimboUNI es una iniciativa educativa independiente. Usamos el escudo como referencia
            a la meta de nuestros estudiantes; no representamos oficialmente a la Universidad
            Nacional de Ingeniería.
          </p>
        </div>
      </section>

      <section className="final-cta section-pad">
        <div className="cta-grid" aria-hidden="true" />
        <div>
          <p className="eyebrow">Tu preparación empieza ahora</p>
          <h2>
            El siguiente
            <br />
            cachimbo <em>puedes ser tú.</em>
          </h2>
        </div>
        <div className="contact-cta">
          <span className="contact-cta-kicker">Contacto directo</span>
          <h3>¿Tienes una pregunta o un recurso para compartir?</h3>
          <p>Escríbeme directamente. Responderé consultas, sugerencias y enlaces que puedan ayudar a otros postulantes.</p>
          <a
            href="mailto:giankluccas@gmail.com?subject=Consulta%20desde%20CachimboUNI"
            aria-label="Enviar un correo a giankluccas@gmail.com"
          >
            <span className="contact-cta-icon"><Icon name="mail" size={18} /></span>
            <span>
              <small>Escríbeme a</small>
              <strong>giankluccas@gmail.com</strong>
            </span>
            <Icon name="arrow" size={18} />
          </a>
        </div>
      </section>

      <SiteFooter navigate={navigate} />
    </div>
  );
}
