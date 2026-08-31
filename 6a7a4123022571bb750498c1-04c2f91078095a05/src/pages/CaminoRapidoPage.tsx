import { useEffect, useRef } from "react";
import Icon from "../components/Icon";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";
import type { NavigateFn } from "../lib/router";

type Props = { navigate: NavigateFn; path: string };

export default function CaminoRapidoPage({ navigate, path }: Props) {
  const heroRef = useRef<HTMLDivElement>(null);
  const parallaxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const hero = heroRef.current;
    const parallax = parallaxRef.current;
    if (!hero || !parallax) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const y = window.scrollY;
        // Parallax: hero image moves slower, content fades
        const heroImg = hero.querySelector<HTMLElement>(".camino-hero-img");
        const heroContent = hero.querySelector<HTMLElement>(".camino-hero-content");
        if (heroImg) {
          heroImg.style.transform = `translateY(${y * 0.35}px) scale(${1 + y * 0.00012})`;
          heroImg.style.willChange = "transform";
        }
        if (heroContent) {
          const opacity = Math.max(0, 1 - y / 700);
          const translate = y * 0.18;
          heroContent.style.opacity = String(opacity);
          heroContent.style.transform = `translateY(${translate}px)`;
        }
        // parallax-section image
        const rect = parallax.getBoundingClientRect();
        const pImg = parallax.querySelector<HTMLElement>(".parallax-img");
        if (pImg) {
          // progress -1 to 1 when in viewport
          const progress = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
          const clamped = Math.max(0, Math.min(1, progress));
          const offset = (clamped - 0.5) * 80; // -40 to 40
          pImg.style.transform = `translateY(${offset}px) scale(1.08)`;
        }
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <div className="page camino-page">
      <SiteHeader navigate={navigate} path={path} variant="solid" />

      {/* PARALLAX HERO con foto del frontis */}
      <section className="camino-hero" ref={heroRef}>
        <div className="camino-hero-img" aria-hidden="true" />
        <div className="camino-hero-shade" aria-hidden="true" />
        <div className="camino-hero-grid" aria-hidden="true" />
        <div className="camino-hero-content">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <button onClick={() => navigate("/")}> <Icon name="arrowLeft" size={14} /> Inicio</button>
            <span>/</span><button onClick={() => navigate("/#metodo")}>Método</button>
            <span>/</span><strong>Camino rápido</strong>
          </nav>
          <p className="eyebrow">El camino más rápido para ingresar</p>
          <h1>LA RUTA QUE<br/><em>SÍ FUNCIONA.</em></h1>
          <p className="camino-hero-desc">
            No necesitas hacerlo todo a la vez. Esta es la combinación que recomiendo para avanzar sin perder meses:
            anual, intensivo y prácticas constantes. Elige por dónde empezar hoy.
          </p>
          <div className="camino-hero-actions">
            <a className="primary-button" href="#anual">Empezar por el anual <Icon name="arrow" size={16} /></a>
            <span className="camino-hero-hint">Desplaza para ver las 3 etapas ↓</span>
          </div>
        </div>
        <div className="camino-hero-badge" aria-hidden="true">
          <span>UNI</span><em>Rímac · Av. Túpac Amaru 210</em>
        </div>
      </section>

      {/* PARALLAX COMPARISON SECTION — imagen que se mueve más lento */}
      <section className="parallax-section" ref={parallaxRef}>
        <div className="parallax-sticky">
          <div className="parallax-img-wrap">
            <div className="parallax-img" aria-hidden="true" />
            <div className="parallax-overlay" aria-hidden="true" />
          </div>
          <div className="parallax-label">
            <span>FRONTIS UNI · FACHADA PRINCIPAL</span>
            <strong>Donde todo empieza y donde volverás como cachimbo</strong>
          </div>
        </div>
        <div className="parallax-text">
          <div className="section-index">Propósito</div>
          <h2>Estudiar con<br/>dirección, <em>no a ciegas.</em></h2>
          <p>
            La mayoría se pierde saltando de tema en tema. Tú no. Sigue esta secuencia en orden:
            base sólida, aceleración y simulación real. Cada etapa tiene su propio ritmo.
          </p>
          <ul className="parallax-bullets">
            <li><span>01</span> Base anual — todo el temario sin huecos</li>
            <li><span>02</span> Intensivo CEPREUNI — nivel examen, a fondo</li>
            <li><span>03</span> Prácticas y exámenes — cronómetro y estrategia</li>
          </ul>
        </div>
      </section>

      {/* 3 TARJETAS DE RUTA */}
      <section className="camino-steps section-pad">
        <div className="section-index">Elige tu siguiente paso</div>

        <div className="camino-grid">
          {/* ANUAL */}
          <a
            id="anual"
            href="https://www.youtube.com/@williamlozano4112/videos"
            target="_blank"
            rel="noreferrer noopener"
            className="camino-card camino-card--anual"
          >
            <div className="camino-card-top">
              <span className="camino-num">01</span>
              <span className="camino-tag">Anual · Desde cero</span>
            </div>
            <h3>Anual completo</h3>
            <p>Todo el temario explicado con paciencia. Ideal si empiezas y quieres cubrir huecos sin apuros. El canal de William Lozano ordena cada curso paso a paso.</p>
            <ul>
              <li><Icon name="check" size={12} /> Álgebra, geometría, trigonometría desde lo básico</li>
              <li><Icon name="check" size={12} /> Física y química con ejemplos tipo UNI</li>
              <li><Icon name="check" size={12} /> Videos largos para entender, no solo memorizar</li>
            </ul>
            <span className="camino-cta">Ver canal en YouTube <Icon name="external" size={14} /></span>
          </a>

          {/* INTENSIVO */}
          <a
            href="https://drive.google.com/drive/folders/1xji4_EXTsWbluFEKcjY39-WYFJ8TXCk6"
            target="_blank"
            rel="noreferrer noopener"
            className="camino-card camino-card--intensivo"
          >
            <div className="camino-card-top">
              <span className="camino-num">02</span>
              <span className="camino-tag camino-tag--dark">Intensivo CEPREUNI</span>
            </div>
            <h3>Intensivo CEPREUNI</h3>
            <p>Nivel real: lo que verás en el examen. Material del intensivo para acelerar ritmo y corregir errores frecuentes bajo presión.</p>
            <ul>
              <li><Icon name="check" size={12} /> Separatas y prácticas nivel admisión</li>
              <li><Icon name="check" size={12} /> Enfoque en los temas que más pesan</li>
              <li><Icon name="check" size={12} /> Carpeta Drive con todo organizado</li>
            </ul>
            <span className="camino-cta">Abrir Drive <Icon name="external" size={14} /></span>
          </a>

          {/* PRACTICAS */}
          <button
            onClick={() => navigate("/guia")}
            className="camino-card camino-card--guia"
          >
            <div className="camino-card-top">
              <span className="camino-num">03</span>
              <span className="camino-tag">Prácticas & Exámenes</span>
            </div>
            <h3>Prácticas y exámenes</h3>
            <p>Aquí es donde se gana el ingreso: simulacros cronometrados, exámenes pasados y análisis de errores. Lo encuentras curado en la Guía.</p>
            <ul>
              <li><Icon name="check" size={12} /> Bancos por curso y simulacros completos</li>
              <li><Icon name="check" size={12} /> Claves y estrategias de tiempo</li>
              <li><Icon name="check" size={12} /> Vive la presión real antes del día D</li>
            </ul>
            <span className="camino-cta">Ir a la Guía <Icon name="arrow" size={14} /></span>
          </button>
        </div>

        <div className="camino-note">
          <Icon name="spark" size={16} />
          <p>Consejo: no hagas los tres a la vez. Completa el anual, pasa al intensivo y cierra cada semana con un simulacro cronometrado de la Guía.</p>
        </div>
      </section>

      <section className="camino-cta-final section-pad">
        <div className="cta-grid" aria-hidden="true" />
        <div>
          <p className="eyebrow">¿Listo para empezar?</p>
          <h2>Empieza hoy,<br/>ingresas <em>mañana.</em></h2>
        </div>
        <div className="camino-final-actions">
          <a className="primary-button" href="https://www.youtube.com/@williamlozano4112/videos" target="_blank" rel="noreferrer noopener">Ir al anual <Icon name="external" size={14} /></a>
          <button className="ghost-button ghost-button--light" onClick={() => navigate("/recursos")}>Ver todos los recursos</button>
        </div>
      </section>

      <SiteFooter navigate={navigate} />
    </div>
  );
}
