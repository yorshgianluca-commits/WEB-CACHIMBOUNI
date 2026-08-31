import { useEffect, useRef, useState, type MouseEvent } from "react";
import {
  animate,
  motion,
  useInView,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";
import ParticleField from "../components/ParticleField";
import Icon from "../components/Icon";
import { GOLD_LINKS, type GoldLink } from "../components/GoldResources";
import type { NavigateFn } from "../lib/router";

type Props = {
  navigate: NavigateFn;
  path: string;
};

/* Contador animado cuando entra en pantalla */
function CountUp({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, to, {
      duration: 1.8,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setValue(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, to]);

  return (
    <span ref={ref}>
      {value}
      {suffix}
    </span>
  );
}

/* Orbes dorados con posiciones estables entre renders */
function useOrbs(count: number) {
  return Array.from({ length: count }).map((_, i) => ({
    id: i,
    left: (i * 37 + 11) % 100,
    top: (i * 53 + 7) % 100,
    size: 10 + ((i * 29) % 34),
    delay: (i % 6) * 0.7,
    duration: 7 + (i % 5) * 2,
    opacity: 0.25 + ((i * 13) % 40) / 100,
  }));
}

const MARQUEE_WORDS = [
  "Material teórico",
  "Pizarras de clases",
  "Simulacros",
  "Temarios UNI",
  "Comunidad",
  "100% gratis",
  "Avisos al día",
];

const STEPS = [
  {
    index: "01",
    icon: "spark",
    title: "Elige un recurso",
    text: "Cada tarjeta te lleva directo al canal, plataforma o grupo sin pasos intermedios.",
  },
  {
    index: "02",
    icon: "play",
    title: "Estudia con método",
    text: "Teoría, pizarras de clases y simulacros para avanzar con dirección real.",
  },
  {
    index: "03",
    icon: "layers",
    title: "Acompaña tu avance",
    text: "Únete a la comunidad, pregunta y comparte recursos con otros postulantes.",
  },
];

function GoldTiltCard({ link, index }: { link: GoldLink; index: number }) {
  const cardRef = useRef<HTMLAnchorElement>(null);

  const handleMove = (event: MouseEvent<HTMLAnchorElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;
    card.style.setProperty("--gx", `${x * 100}%`);
    card.style.setProperty("--gy", `${y * 100}%`);
    card.style.setProperty("--rx", `${(0.5 - y) * 12}deg`);
    card.style.setProperty("--ry", `${(x - 0.5) * 12}deg`);
  };

  const handleLeave = () => {
    const card = cardRef.current;
    if (!card) return;
    card.style.setProperty("--rx", "0deg");
    card.style.setProperty("--ry", "0deg");
  };

  return (
    <motion.a
      ref={cardRef}
      href={link.url}
      target="_blank"
      rel="noreferrer noopener"
      className="gold-card gold-tilt-card"
      aria-label={`Abrir ${link.title}`}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      initial={{ opacity: 0, y: 60, rotateX: -8 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.65, delay: index * 0.08, ease: [0.2, 0.8, 0.2, 1] }}
    >
      <span className="gold-card-sheen" aria-hidden="true" />
      <span className="gold-card-glow" aria-hidden="true" />

      <span className="gold-card-top">
        <span className="gold-card-index">#{String(index + 1).padStart(2, "0")}</span>
        <span className="gold-card-icon">
          <Icon name={link.icon} size={22} />
        </span>
      </span>

      <span className="gold-card-badge">{link.badge}</span>
      <h3>{link.title}</h3>
      <p>{link.text}</p>

      <span className="gold-card-open">
        Abrir recurso <Icon name="external" size={15} />
      </span>
    </motion.a>
  );
}

export default function RecursosGoldPage({ navigate, path }: Props) {
  const heroRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const { scrollYProgress: pageProgress } = useScroll();

  /* Barra de progreso de lectura */
  const progressScale = useSpring(pageProgress, { stiffness: 120, damping: 30 });

  /* Parallax del hero */
  const ghostY = useSpring(useTransform(scrollYProgress, [0, 1], [0, -320]), {
    stiffness: 55,
    damping: 18,
  });
  const ghostRotate = useTransform(scrollYProgress, [0, 1], [0, 35]);
  const yMid = useSpring(useTransform(scrollYProgress, [0, 1], [0, 260]), {
    stiffness: 55,
    damping: 18,
  });
  const yNear = useSpring(useTransform(scrollYProgress, [0, 1], [0, 420]), {
    stiffness: 55,
    damping: 18,
  });
  const heroContentY = useSpring(useTransform(scrollYProgress, [0, 1], [0, 140]), {
    stiffness: 55,
    damping: 18,
  });
  const heroFade = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  const orbs = useOrbs(9);
  const particles = useOrbs(12);

  const scrollToList = () =>
    listRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });

  return (
    <div className="page gold-page">
      {/* Barra de progreso dorada */}
      <motion.div className="gold-progress" style={{ scaleX: progressScale }} aria-hidden="true" />

      <SiteHeader navigate={navigate} path={path} variant="solid" />

      {/* ================= HERO CON PARALLAX MULTICAPA ================= */}
      <section className="gold-hero" id="inicio" ref={heroRef}>
        <ParticleField density={90} parallax={26} className="particle-canvas gold-hero-canvas" />

        <div className="gold-grid-bg" aria-hidden="true" />

        <motion.div className="gold-ghost gold-ghost--page" style={{ y: ghostY, rotate: ghostRotate }} aria-hidden="true">
          GOLD
        </motion.div>

        <motion.div className="gold-layer" style={{ y: yMid }} aria-hidden="true">
          {orbs.map((orb) => (
            <span
              key={orb.id}
              className="gold-orb"
              style={{
                left: `${orb.left}%`,
                top: `${orb.top}%`,
                width: orb.size * 1.6,
                height: orb.size * 1.6,
                opacity: orb.opacity,
                animationDelay: `${orb.delay}s`,
                animationDuration: `${orb.duration}s`,
              }}
            />
          ))}
        </motion.div>

        <motion.div className="gold-layer" style={{ y: yNear }} aria-hidden="true">
          {particles.map((orb) => (
            <span
              key={orb.id}
              className="gold-particle"
              style={{
                left: `${orb.left}%`,
                top: `${orb.top}%`,
                width: orb.size / 2.4,
                height: orb.size / 2.4,
                opacity: orb.opacity * 0.9,
                animationDelay: `${orb.delay + 0.4}s`,
                animationDuration: `${orb.duration + 2}s`,
              }}
            />
          ))}
        </motion.div>

        <div className="gold-hud gold-hud--tl" aria-hidden="true">SYS.GOLD // ACTIVE</div>
        <div className="gold-hud gold-hud--tr" aria-hidden="true">EST. 2026</div>
        <div className="gold-hud gold-hud--bl" aria-hidden="true">LAT: -12.0464°</div>
        <div className="gold-hud gold-hud--br" aria-hidden="true">∞ RECURSOS</div>

        <motion.div className="gold-hero-inner" style={{ y: heroContentY, opacity: heroFade }}>
          <nav className="breadcrumb" aria-label="Ruta de navegación">
            <button onClick={() => navigate("/")} aria-label="Volver al inicio">
              <Icon name="arrowLeft" size={15} /> Inicio
            </button>
            <span aria-hidden="true">/</span>
            <strong>Recursos Gold</strong>
          </nav>

          <div className="gold-index">★ RECURSOS GOLD · ACCESO VIP</div>
          <h1>
            Todo el oro
            <br />
            de la <em className="gold-word">preparación.</em>
          </h1>
          <p className="gold-lead">
            La selección dorada de CachimboUNI: canales, plataforma y comunidad con material
            teórico, pizarras de clases y simulacros. Sin buscadores, sin pasos extra:
            elige y estudia.
          </p>

          <div className="gold-hero-actions">
            <button className="gold-liquid-btn" onClick={scrollToList} aria-label="Bajar a la lista de recursos gold">
              <span className="gold-liquid-btn-shine" aria-hidden="true" />
              <span className="gold-liquid-btn-icon" aria-hidden="true">
                <Icon name="spark" size={18} />
              </span>
              Explorar recursos gold <Icon name="arrow" size={18} />
            </button>
            <button className="gold-ghost-btn" onClick={() => navigate("/recursos")} aria-label="Ir a la biblioteca de recursos">
              Biblioteca normal <Icon name="arrow" size={16} />
            </button>
          </div>
        </motion.div>

        <button className="scroll-cue gold-cue" onClick={scrollToList} aria-label="Bajar a la siguiente sección">
          <span>Desciende</span>
          <i />
        </button>
      </section>

      {/* ================= MARQUESINA INFINITA ================= */}
      <div className="gold-marquee" aria-hidden="true">
        <div className="gold-marquee-track">
          {[0, 1].map((dup) => (
            <div className="gold-marquee-group" key={dup}>
              {MARQUEE_WORDS.map((word) => (
                <span key={`${dup}-${word}`}>
                  {word} <b>✦</b>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ================= ESTADÍSTICAS CON CONTADORES ================= */}
      <section className="gold-stats">
        <div className="gold-stat">
          <strong>
            <CountUp to={5} />
          </strong>
          <span>canales y plataformas</span>
        </div>
        <div className="gold-stat">
          <strong>
            <CountUp to={100} suffix="%" />
          </strong>
          <span>acceso gratuito</span>
        </div>
        <div className="gold-stat">
          <strong>
            <CountUp to={24} suffix="/7" />
          </strong>
          <span>disponibles siempre</span>
        </div>
        <div className="gold-stat">
          <strong className="gold-stat-inf">∞</strong>
          <span>recursos por sumar</span>
        </div>
      </section>

      {/* ================= LISTA DE RECURSOS GOLD ================= */}
      <section className="gold-list-section" id="gold-list" ref={listRef}>
        <div className="gold-list-head">
          <div className="section-index gold-index">SELECCIÓN DORADA</div>
          <h2>
            Cinco accesos,
            <br />
            <em className="gold-word">un solo objetivo.</em>
          </h2>
          <p>
            Cada recurso abierto en una pestaña nueva. Guarda los que más uses y vuelve directo
            cuando necesites estudiar.
          </p>
        </div>

        <div className="gold-grid gold-grid--page">
          {GOLD_LINKS.map((link, idx) => (
            <GoldTiltCard key={link.id} link={link} index={idx} />
          ))}
        </div>

        <motion.div
          className="gold-note"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.55 }}
        >
          <Icon name="spark" size={16} />
          <p>
            Enlaces a plataformas y canales mantenidos por terceros, 100% gratuitos y sin registro.
            Si algún link deja de funcionar, avísame por TikTok para actualizarlo de inmediato.
          </p>
        </motion.div>
      </section>

      {/* ================= CÓMO USARLO ================= */}
      <section className="gold-steps">
        <div className="gold-steps-head">
          <div className="section-index gold-index">MÉTODO GOLD</div>
          <h2>
            Tres pasos
            <br />
            <em className="gold-word">sin perder el tiempo.</em>
          </h2>
        </div>
        <div className="gold-steps-grid">
          {STEPS.map((step, idx) => (
            <motion.div
              key={step.index}
              className="gold-step"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.55, delay: idx * 0.12 }}
            >
              <span className="gold-step-icon">
                <Icon name={step.icon as "spark" | "play" | "layers"} size={22} />
              </span>
              <span className="gold-step-index">{step.index}</span>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ================= CTA FINAL ================= */}
      <section className="gold-final">
        <div className="gold-final-ring" aria-hidden="true" />
        <motion.div
          initial={{ opacity: 0, y: 34 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6 }}
        >
          <div className="section-index gold-index">TU PREPARACIÓN, EN ORO</div>
          <h2>
            Elige uno y
            <br />
            <em className="gold-word">empieza hoy.</em>
          </h2>
          <button className="gold-liquid-btn" onClick={scrollToList} aria-label="Volver a la lista de recursos gold">
            <span className="gold-liquid-btn-shine" aria-hidden="true" />
            <span className="gold-liquid-btn-icon" aria-hidden="true">
              <Icon name="spark" size={18} />
            </span>
            Ver recursos gold <Icon name="arrow" size={18} />
          </button>
        </motion.div>
      </section>

      <SiteFooter navigate={navigate} />
    </div>
  );
}
