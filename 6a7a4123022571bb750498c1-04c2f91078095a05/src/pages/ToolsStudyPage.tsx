import { useEffect, useMemo, useRef, useState } from "react";
import Icon from "../components/Icon";
import ParticleField from "../components/ParticleField";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";
import ToolLogo from "../components/ToolLogo";
import {
  PROJECT_TOOLS,
  STUDY_TOOLS,
  TOOL_CATEGORIES,
  type StudyTool,
  type ToolCategory,
} from "../lib/tools";
import type { NavigateFn } from "../lib/router";

type Props = {
  navigate: NavigateFn;
  path: string;
};

export default function ToolsStudyPage({ navigate, path }: Props) {
  const [toolGroup, setToolGroup] = useState<"stack" | "projects">("stack");
  const [filter, setFilter] = useState<ToolCategory | "Todas">("Todas");
  const [activeId, setActiveId] = useState(STUDY_TOOLS.find((t) => t.featured)?.id ?? STUDY_TOOLS[0].id);
  const showcaseRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const currentTools = toolGroup === "stack" ? STUDY_TOOLS : PROJECT_TOOLS;

  const filtered = useMemo(() => {
    const source = toolGroup === "stack" ? STUDY_TOOLS : PROJECT_TOOLS;
    return filter === "Todas" ? source : source.filter((tool) => tool.category === filter);
  }, [filter, toolGroup]);

  const active = currentTools.find((tool) => tool.id === activeId) ?? currentTools[0];

  useEffect(() => {
    if (!filtered.some((tool) => tool.id === activeId) && filtered[0]) {
      setActiveId(filtered[0].id);
    }
  }, [filtered, activeId]);

  const onMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width - 0.5;
    const py = (event.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: py * -10, y: px * 14 });
  };

  const onLeave = () => setTilt({ x: 0, y: 0 });

  const openGroup = (group: "stack" | "projects") => {
    const source = group === "stack" ? STUDY_TOOLS : PROJECT_TOOLS;
    setToolGroup(group);
    setFilter("Todas");
    setActiveId(source[0].id);
    window.setTimeout(
      () => document.getElementById("tools-showcase")?.scrollIntoView({ behavior: "smooth" }),
      40
    );
  };

  return (
    <div className="page tools-page">
      <SiteHeader navigate={navigate} path={path} variant="solid" />

      {/* WAITLIST HERO */}
      <section className="tools-hero">
        <ParticleField density={70} parallax={14} className="particle-canvas page-hero-canvas" />
        <div className="tools-hero-glow" aria-hidden="true" />
        <div className="tools-hero-orb tools-hero-orb--a" aria-hidden="true" />
        <div className="tools-hero-orb tools-hero-orb--b" aria-hidden="true" />

        <div className="tools-hero-inner">
          <div className="tools-announcement">
            <span className="tools-announcement-dot" />
            <span>Nuevo · Toolkit del postulante UNI</span>
            <em>{STUDY_TOOLS.length} herramientas</em>
          </div>

          <p className="eyebrow">Tools Study</p>
          <h1>
            Tu stack de
            <br />
            estudio, <em>listo.</em>
          </h1>
          <p className="tools-hero-text">
            Las apps y plataformas que sí sirven para preparar la UNI: memoria, notas, PDFs, IA,
            contenido y organización. Sin ruido. Solo lo esencial.
          </p>

          <div className="tools-hero-actions">
            <button className="primary-button tools-hero-cta" onClick={() => openGroup("stack")}>
              Tools Stack <Icon name="arrow" size={16} />
            </button>
            <button className="tools-projects-button" onClick={() => openGroup("projects")}>
              Tools Projects <Icon name="arrow" size={16} />
            </button>
          </div>

          <div className="tools-hero-meta">
            <div>
              <strong>{STUDY_TOOLS.filter((t) => t.free).length}</strong>
              <span>gratuitas</span>
            </div>
            <div>
              <strong>4</strong>
              <span>con IA</span>
            </div>
            <div>
              <strong>7</strong>
              <span>categorías</span>
            </div>
          </div>
        </div>

        <div className="tools-hero-visual" aria-label="Aplicaciones recomendadas">
          <div className="tools-visual-vignette" aria-hidden="true" />
          {STUDY_TOOLS.map((tool, index) => (
            <a
              key={tool.id}
              href={tool.url}
              target="_blank"
              rel="noreferrer noopener"
              className={`tools-floating-app tools-floating-app--${index + 1}`}
              title={tool.name}
              style={{ ["--float-color" as string]: tool.color }}
            >
              <ToolLogo tool={tool} size={index === 0 ? 48 : 34} />
              <span>{tool.name}</span>
            </a>
          ))}
          <button className="tools-visual-center" onClick={() => openGroup("stack")} aria-label="Abrir Tools Stack">
            <ToolLogo tool={STUDY_TOOLS[0]} size={44} />
            <span>Tu stack</span>
          </button>
          <button className="tools-visual-projects" onClick={() => openGroup("projects")} aria-label="Abrir Tools Projects">
            <Icon name="layers" size={26} />
            <span>Tools Projects</span>
          </button>
        </div>
      </section>

      {/* SPATIAL PRODUCT SHOWCASE */}
      <section className="tools-showcase section-pad" id="tools-showcase">
        <div className="tools-showcase-head">
          <div>
            <div className="section-index">01 / SHOWCASE ESPACIAL</div>
            <p className="eyebrow">Explora y elige</p>
            <h2>
              Herramientas que
              <br />
              <em>multiplican</em> tu tiempo.
            </h2>
          </div>
          <p className="tools-showcase-copy">
            Pasa el cursor sobre el panel central. Cada tool tiene su propósito real dentro de una
            preparación seria para la UNI.
          </p>
        </div>

        <div className="tools-group-switch" role="tablist" aria-label="Grupos de herramientas">
          <button
            role="tab"
            aria-selected={toolGroup === "stack"}
            className={toolGroup === "stack" ? "is-active" : ""}
            onClick={() => openGroup("stack")}
          >
            <span>01</span>
            <strong>Tools Stack</strong>
            <em>{STUDY_TOOLS.length} aplicaciones de estudio</em>
          </button>
          <button
            role="tab"
            aria-selected={toolGroup === "projects"}
            className={toolGroup === "projects" ? "is-active" : ""}
            onClick={() => openGroup("projects")}
          >
            <span>02</span>
            <strong>Tools Projects</strong>
            <em>{PROJECT_TOOLS.length} herramientas web</em>
          </button>
        </div>

        <div className="tools-filter-row" role="tablist" aria-label="Filtrar herramientas">
          {TOOL_CATEGORIES.map((item) => (
            (item === "Todas" || currentTools.some((tool) => tool.category === item)) &&
            <button
              key={item}
              role="tab"
              aria-selected={filter === item}
              className={filter === item ? "is-active" : ""}
              onClick={() => setFilter(item)}
            >
              {item}
            </button>
          ))}
        </div>

        <div className="tools-spatial">
          <div className="tools-spatial-list">
            {filtered.map((tool, index) => (
              <button
                key={tool.id}
                className={tool.id === active.id ? "tools-list-item is-active" : "tools-list-item"}
                onClick={() => setActiveId(tool.id)}
                onMouseEnter={() => setActiveId(tool.id)}
              >
                <span className="tools-list-index">{String(index + 1).padStart(2, "0")}</span>
                <span className="tools-list-icon" style={{ color: tool.color, background: `${tool.color}22` }}>
                  <ToolLogo tool={tool} size={24} />
                </span>
                <span className="tools-list-copy">
                  <strong>{tool.name}</strong>
                  <em>{tool.short}</em>
                </span>
                <Icon name="arrow" size={16} />
              </button>
            ))}
          </div>

          <div
            className="tools-spatial-stage"
            ref={showcaseRef}
            onMouseMove={onMove}
            onMouseLeave={onLeave}
          >
            <div className="tools-stage-floor" aria-hidden="true" />
            <div
              className="tools-stage-card"
              style={{
                transform: `perspective(1200px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
                borderColor: `${active.color}66`,
                boxShadow: `0 30px 80px rgba(0,0,0,.55), 0 0 0 1px ${active.color}22, 0 0 60px ${active.color}22`,
              }}
            >
              <div className="tools-stage-glow" style={{ background: `radial-gradient(circle, ${active.color}33, transparent 70%)` }} />
              <div className="tools-stage-top">
                <span className="tools-stage-badge" style={{ color: active.color, borderColor: `${active.color}66` }}>
                  {active.category}
                </span>
                {active.free ? <span className="tools-stage-free">Gratis</span> : <span className="tools-stage-paid">Pago / freemium</span>}
              </div>

              <div className="tools-stage-icon" style={{ color: active.color, background: `${active.color}18` }}>
                <ToolLogo tool={active} size={52} />
              </div>

              <h3>{active.name}</h3>
              <p className="tools-stage-short">{active.short}</p>
              <p className="tools-stage-desc">{active.description}</p>

              <div className="tools-stage-why">
                <Icon name="spark" size={15} />
                <span>{active.why}</span>
              </div>

              <a
                className="primary-button tools-stage-cta"
                href={active.url}
                target="_blank"
                rel="noreferrer noopener"
              >
                Abrir {active.name} <Icon name="external" size={16} />
              </a>
            </div>

            <div className="tools-orbit tools-orbit--a" aria-hidden="true" />
            <div className="tools-orbit tools-orbit--b" aria-hidden="true" />
          </div>
        </div>
      </section>

      {/* GRID COMPLETO */}
      <section className="tools-grid-section section-pad">
        <div className="tools-grid-head">
          <div className="section-index">02 / STACK COMPLETO</div>
          <h2>
            Las 12 tools
            <br />
            en un <em>vistazo.</em>
          </h2>
        </div>

        <div className="tools-grid">
          {STUDY_TOOLS.map((tool, index) => (
            <ToolCard key={tool.id} tool={tool} index={index} onFocus={() => setActiveId(tool.id)} />
          ))}
        </div>
      </section>

      <section className="tools-projects-section section-pad" id="tools-projects">
        <div className="tools-grid-head">
          <div className="section-index">03 / TOOLS PROJECTS</div>
          <p className="eyebrow">Calcula, visualiza y practica</p>
          <h2>
            Proyectos web para
            <br />
            <em>resolver mejor.</em>
          </h2>
          <p className="tools-projects-copy">
            Este grupo está separado del stack de aplicaciones: son páginas web que puedes abrir
            directamente para calcular, graficar, consultar y entrenar comprensión lectora.
          </p>
        </div>

        <div className="tools-grid tools-projects-grid">
          {PROJECT_TOOLS.map((tool, index) => (
            <ToolCard key={tool.id} tool={tool} index={index} onFocus={() => setActiveId(tool.id)} />
          ))}
        </div>
      </section>

      <section className="tools-note-section section-pad">
        <div className="disclaimer-card">
          <div className="disclaimer-icon">
            <Icon name="book" size={18} />
          </div>
          <div>
            <h4>Nota sobre las herramientas</h4>
            <p>
              CachimboUNI no es dueño ni afiliado oficial de estas aplicaciones. Los enlaces llevan
              a sus sitios oficiales. Úsalas con criterio: la herramienta no reemplaza la práctica
              diaria ni el esfuerzo. Si conoces otra app útil para el examen de la UNI, escríbeme a{" "}
              <a href="mailto:giankluccas@gmail.com">giankluccas@gmail.com</a>.
            </p>
          </div>
        </div>
      </section>

      <SiteFooter navigate={navigate} />
    </div>
  );
}

function ToolCard({
  tool,
  index,
  onFocus,
}: {
  tool: StudyTool;
  index: number;
  onFocus: () => void;
}) {
  return (
    <a
      href={tool.url}
      target="_blank"
      rel="noreferrer noopener"
      className={tool.featured ? "tool-card is-featured" : "tool-card"}
      onMouseEnter={onFocus}
      style={{ ["--tool-color" as string]: tool.color }}
    >
      <div className="tool-card-top">
        <span className="tool-card-index">#{String(index + 1).padStart(2, "0")}</span>
        <span className="tool-card-cat">{tool.category}</span>
      </div>
      <div className="tool-card-icon">
        <ToolLogo tool={tool} size={32} />
      </div>
      <h3>{tool.name}</h3>
      <p>{tool.description}</p>
      <div className="tool-card-foot">
        <span>{tool.free ? "Gratis" : "Pago / freemium"}</span>
        <span className="tool-card-open">
          Abrir <Icon name="external" size={14} />
        </span>
      </div>
    </a>
  );
}
