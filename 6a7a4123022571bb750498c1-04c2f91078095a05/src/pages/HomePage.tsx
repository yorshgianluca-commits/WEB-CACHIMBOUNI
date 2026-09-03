import Icon from "../components/Icon";
import ParticleField from "../components/ParticleField";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";
import GoldResources from "../components/GoldResources";
import GlassNotifications from "../components/GlassNotifications";
import PartnerMarquee from "../components/PartnerMarquee";
import { FrameSequenceHero, type FrameSequenceStep } from "../components/ui/frame-sequence-hero";
import { useSiteContent } from "../hooks/useSiteContent";
import { trackActivity } from "../lib/activity";
import { useReveal } from "../hooks/useReveal";
import HomeBackdrop from "../components/HomeBackdrop";
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


const GUIA_FRAME_COUNT = 64;
const guiaFramePath = (i: number) =>
  `/frames/guia/frame_${String(i).padStart(4, "0")}.jpg`;

const GUIA_STEPS: FrameSequenceStep[] = [
  {
    from: 0.02,
    to: 0.28,
    color: "#f3a066",
    num: "01",
    total: "04",
    icon: "✦",
    title: "14 canales curados.",
    description:
      "Los profesores de YouTube que sí explican para el nivel UNI, filtrados uno por uno.",
    label: "Canales",
  },
  {
    from: 0.28,
    to: 0.55,
    color: "#d8763e",
    num: "02",
    total: "04",
    icon: "◐",
    title: "Método antes que horas.",
    description:
      "Dos videos clave sobre cómo estudiar y sostener la disciplina durante todo el ciclo.",
    label: "Método",
  },
  {
    from: 0.55,
    to: 0.82,
    color: "#c25a3a",
    num: "03",
    total: "04",
    icon: "▣",
    title: "Ordenado por curso.",
    description:
      "Matemática, Física, Química y Aptitud: cada canal en el lugar donde te hace falta.",
    label: "Cursos",
  },
  {
    from: 0.82,
    to: 1.01,
    color: "#8c1f36",
    num: "04",
    total: "04",
    icon: "⌁",
    title: "Sin perderte entre miles.",
    description:
      "Una ruta clara para dejar de buscar clases y empezar a avanzar de verdad.",
    label: "Ruta",
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

  useReveal([categories.length, resources.length]);

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

          <div className="hero-destacados" role="navigation" aria-label="Enlaces destacados">
            <span className="destacados-kicker">
              <i aria-hidden="true" /> DESTACADOS
            </span>
            <div className="destacados-list">
              <a
                className="destacado-chip"
                href="https://universetostudy.com/"
                target="_blank"
                rel="noreferrer noopener"
                aria-label="Abrir Universe To Study"
              >
                <span className="destacado-ico" aria-hidden="true">
                  <Icon name="target" size={16} />
                </span>
                <span className="destacado-txt">
                  <strong>Universe To Study</strong>
                  <small>Rutas de estudio interactivas · nuevo</small>
                </span>
                <Icon name="arrow" size={15} className="destacado-go" />
              </a>
              <a
                className="destacado-chip"
                href="https://drive.google.com/drive/u/0/folders/1Mn_zvTYOMuE034l92NzXv0obgKLV-J8u"
                target="_blank"
                rel="noreferrer noopener"
                aria-label="Abrir el Drive Banco de Teoría UNI · Tomo II"
              >
                <span className="destacado-ico is-drive" aria-hidden="true">
                  <Icon name="book" size={16} />
                </span>
                <span className="destacado-txt">
                  <strong>Banco de Teoría · Tomo II</strong>
                  <small>Drive: apuntes y teoría avanzada</small>
                </span>
                <Icon name="arrow" size={15} className="destacado-go" />
              </a>
            </div>
          </div>
        </div>

        <button className="scroll-cue" onClick={() => scrollTo("metodo")} aria-label="Bajar a la siguiente sección">
          <span>Desciende</span>
          <i />
        </button>
      </section>

      <div className="home-flow" id="home-flow">
        <HomeBackdrop targetId="home-flow" />
        <span className="home-thread" aria-hidden="true" />

      <section className="metodo-vortex" id="metodo">
        <div className="metodo-vortex-shade" aria-hidden="true" />

        <div className="metodo-vortex-inner">
          <div className="section-index is-center">01 / EL MÉTODO</div>
          <h2 className="metodo-vortex-title">
            El sistema de preparación
            <br />
            <span>para postulantes a la UNI</span>
          </h2>
          <p className="metodo-vortex-sub">
            Coordina teoría, práctica y simulacros en una sola ruta.
            <br />
            Material verificado que mantiene cada sesión con dirección y control.
          </p>
          <div className="metodo-vortex-actions">
            <button className="vortex-cta is-solid" onClick={() => navigate("/recursos")}>
              EMPEZAR AHORA <Icon name="arrow" size={15} />
            </button>
            <button className="vortex-cta" onClick={() => navigate("/camino-rapido")}>
              VER EL CAMINO RÁPIDO
            </button>
          </div>

          <div className="metodo-vortex-steps">
            {METHOD_STEPS.map((step) => (
              <div className="vortex-step" key={step.index}>
                <span>{step.index}</span>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="metodo-vortex-foot">
          <PartnerMarquee />
        </div>
      </section>

      <div className="section-seam" aria-hidden="true" />
      <section className="ruta-aero" id="ruta">
        <div className="ruta-aero-inner">
          <div className="ruta-glass">
            <div className="ruta-glass-sheen" aria-hidden="true" />
            <div className="ruta-glass-body">
              <div className="section-index is-warm">02 / LA RUTA</div>
              <p className="eyebrow is-warm">El examen, sin puntos ciegos</p>
              <h2 className="ruta-title">
                Tres pruebas.
                <br />
                <span>Una sola meta.</span>
              </h2>
              <p className="ruta-lead">
                Entrena las áreas que componen el examen de admisión con una secuencia pensada para
                avanzar desde tus bases hasta el nivel real de la prueba.
              </p>

              <div className="ruta-exams">
                {EXAM_PARTS.map((part) => (
                  <div className="ruta-exam" key={part.code}>
                    <span>{part.code}</span>
                    <strong>{part.name}</strong>
                    <Icon name="arrow" size={15} />
                  </div>
                ))}
              </div>

              <div className="ruta-actions">
                <button className="ruta-cta is-solid" onClick={() => navigate("/ruta-uni")}>
                  Conocer el campus <Icon name="arrow" size={15} />
                </button>
                <a
                  className="ruta-cta"
                  href="https://admision.uni.edu.pe/admision2026-2/"
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  Información oficial <Icon name="external" size={15} />
                </a>
              </div>
            </div>
          </div>

          <div className="ruta-glass is-aside">
            <div className="ruta-glass-sheen" aria-hidden="true" />
            <div className="ruta-orbit" aria-hidden="true">
              <span className="ruta-orbit-ring" />
              <span className="ruta-orbit-ring is-two" />
              <span className="ruta-orbit-core">UNI</span>
              <span className="ruta-formula is-a">Σ F = ma</span>
              <span className="ruta-formula is-b">x² + y² = r²</span>
              <span className="ruta-formula is-c">n = m / M</span>
            </div>
            <p className="ruta-aside-note">
              Mantén pulsado sobre el fondo para reunir las esquirlas.
            </p>
          </div>
        </div>
      </section>

      <div className="section-seam" aria-hidden="true" />
      <section className="library-teaser section-pad reveal-up" id="recursos">
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

      <div className="section-seam" aria-hidden="true" />
      <GoldResources navigate={navigate} />

      <div className="section-seam" aria-hidden="true" />
      <section className="home-guia-seq" id="guia">
        <FrameSequenceHero
          frameCount={GUIA_FRAME_COUNT}
          framePath={guiaFramePath}
          eagerCount={20}
          scrollHeight="260vh"
          kicker="04 / GUÍA · NUEVO"
          title={
            <>
              Canales y videos
              <br />
              <span className="fsh-title-accent">recomendados.</span>
            </>
          }
          subtitle="Desplázate para recorrer la guía."
          ctaLabel="Entrar a la guía"
          onCta={() => navigate("/guia")}
          steps={GUIA_STEPS}
        />
      </section>

      <div className="section-seam" aria-hidden="true" />
      <section className="home-tools section-pad reveal-up">
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

      <div className="section-seam" aria-hidden="true" />
      <section className="commitment section-pad reveal-up">
        <div className="uni-mark">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/f/f7/Uni-logo_transparente_granate.png"
            alt="Escudo de la Universidad Nacional de Ingeniería del Perú"
            loading="lazy"
          />
        </div>
        <div className="commitment-copy">
          <div className="section-index">06 / EL COMPROMISO</div>
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

      </div>

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
