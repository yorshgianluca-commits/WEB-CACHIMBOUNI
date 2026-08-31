import { useState } from "react";
import Icon from "../components/Icon";
import ParticleField from "../components/ParticleField";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";
import ContainerScroll from "../components/ContainerScroll";
import type { NavigateFn } from "../lib/router";

type GuiaPageProps = {
  navigate: NavigateFn;
  path: string;
};

type Channel = {
  id: string;
  handle: string;
  name: string;
  url: string;
  description: string;
  tag: string;
  color: string;
  avatar: string;
};

const CHANNELS: Channel[] = [
  { id: "fisicadepm", handle: "@fisicadepm", name: "Física de PM", url: "https://www.youtube.com/@fisicadepm", description: "Explicaciones de mecánica y problemas tipo admisión resueltos sin rodeos.", tag: "Física", color: "#1f6f8b", avatar: "https://yt3.googleusercontent.com/tbJHyPlFWetIeDPZAJ6zylSKoUkp73ca6TWOdLCozOCAB7qgJ8MEArKdvc5lU0pYfv5LZDtkEQ=s900-c-k-c0x00ffffff-no-rj" },
  { id: "lql", handle: "@LQLLuisQuímicaLeón", name: "LQL · Luis Química León", url: "https://www.youtube.com/@LQLLuisQu%C3%ADmicaLe%C3%B3n", description: "Teoría de química con ejemplos, mapas y trucos de nomenclatura.", tag: "Química", color: "#7a4a1f", avatar: "https://yt3.googleusercontent.com/ytc/AIdro_kWG4gtdjaumu_GkyYSkQe5jaqWRzPnDvhl1GsS7k5cn-ud=s900-c-k-c0x00ffffff-no-rj" },
  { id: "academiainternet", handle: "@AcademiaInternet", name: "Academia Internet", url: "https://www.youtube.com/@AcademiaInternet", description: "Matemática profunda con demostraciones claras, ideal para UNI.", tag: "Matemática", color: "#1f3b6e", avatar: "https://yt3.googleusercontent.com/ytc/AIdro_nEd7ZRl_ldDP1UY2j535jMD93XM-93VrcGpnP9ZcppTOQ=s900-c-k-c0x00ffffff-no-rj" },
  { id: "cachimbo_uni", handle: "@cachimbo_uni", name: "Cachimbo UNI", url: "https://www.youtube.com/@cachimbo_uni/featured", description: "Consejos de estudio, métodos y motivación de ingresantes reales.", tag: "Método", color: "#8c1f36", avatar: "https://yt3.googleusercontent.com/ejr0QBdgJ3pHenP8tVZYynRfn0Q8aeVVSUvIH2SBaX2s8UXObdeXa6A-Lc8_cSIMKqiGx3s3=s900-c-k-c0x00ffffff-no-rj" },
  { id: "memoriacademica", handle: "@memoriacademica", name: "Memoria Académica", url: "https://www.youtube.com/@memoriacademica", description: "Humanidades, historia y literatura contadas de forma memorable.", tag: "Humanidades", color: "#3a5a40", avatar: "https://yt3.googleusercontent.com/umbbPSj-xuhiC4PZkYJ8_lGnSNY22DGpET0cJcCW8tUaDbkUcMH3g9mNTenpO3amBoZ_7QH6=s900-c-k-c0x00ffffff-no-rj" },
  { id: "refuerzo", handle: "@REFUERZODENIVEL", name: "Refuerzo de Nivel", url: "https://www.youtube.com/@REFUERZODENIVEL/videos", description: "Prácticas intensivas y repasos rápidos antes de simulacros.", tag: "Repasa", color: "#5a3d8a", avatar: "https://yt3.googleusercontent.com/onfIjb_eVdrBkxrlOp_AWKvnSki69tkwWi8yeni02V6BhBuekCjWCBrDODqA499Us6ZvBXuF3VU=s900-c-k-c0x00ffffff-no-rj" },
  { id: "aseuni", handle: "@academia.aseuni", name: "Academia ASEUNI", url: "https://www.youtube.com/@academia.aseuni", description: "Clases completas con estilo de academia preuniversitaria tradicional.", tag: "Academia", color: "#8f2e33", avatar: "https://yt3.googleusercontent.com/AfFse6S5SEE50jYctUI0KxMLkKVQVSB3DhSi4U5MHJDDYHFSw8yV1xeavZnbddaG3QAFNIKhcg=s900-c-k-c0x00ffffff-no-rj" },
  { id: "alvaro", handle: "@ALVAROSENSEI", name: "Alvaro Sensei", url: "https://www.youtube.com/@ALVAROSENSEI", description: "Matemática razonada y trucos de olimpiada aplicables a UNI.", tag: "Matemática", color: "#0e565c", avatar: "https://yt3.googleusercontent.com/kiMonY4QCSimNX2QBvCOgjIhk9ANKbu5VYwshaXbqt7VIpqBk8815CPnxTH9wfAIxkjairnf-OM=s900-c-k-c0x00ffffff-no-rj" },
  { id: "michi", handle: "@elmichiciclero5545", name: "El Michi Ciclero", url: "https://www.youtube.com/@elmichiciclero5545", description: "Humor y academia mezclados, explica lo difícil de forma simple.", tag: "Divulgación", color: "#b5651d", avatar: "https://yt3.googleusercontent.com/Icqkmc-ACv7XqYkfOnQIskx1KmSv4wqM9yvRmZpUIz-GMqMGu1A9lye1jNcFqvMJIQgPus2d=s900-c-k-c0x00ffffff-no-rj" },
  { id: "bastet", handle: "@bastet1490", name: "Bastet", url: "https://www.youtube.com/@bastet1490", description: "Resúmenes de ciencias con animaciones y esquemas visuales.", tag: "Ciencias", color: "#6a4c93", avatar: "https://yt3.googleusercontent.com/HDwzN1FKCwSQ1ENVK8p8Vz8e1jwSjILNfZ-OhGXUT-ow935aTC2gAC7VGVSuUpsH1uVpal0j=s900-c-k-c0x00ffffff-no-rj" },
  { id: "gcu", handle: "@GCUfullcepre", name: "GCU Full Cepre", url: "https://www.youtube.com/@GCUfullcepre", description: "Ciclos completos grabados y maratones de problemas CEPREUNI.", tag: "CEPREUNI", color: "#2f3d5b", avatar: "https://yt3.googleusercontent.com/cPrZH2QIp4y5xVdX8TfmS-9B2bv6__OOQsaopW_4onrs4LAKggo4c54xcwoi01O6a7QHEKQb-A=s900-c-k-c0x00ffffff-no-rj" },
  { id: "machupicchu", handle: "@grupomachupicchu4827", name: "Grupo Machu Picchu", url: "https://www.youtube.com/@grupomachupicchu4827", description: "Clases extensas y material de repaso organizado por temas.", tag: "Academia", color: "#2d2a72", avatar: "https://yt3.googleusercontent.com/Znd2_lGhxlKxCt9FZW8hbYhEWeyOpy3oTXtxucHej3FzBZ9JpLB-ymJQfzH5rWwmJUCU6VG1VfA=s900-c-k-c0x00ffffff-no-rj" },
  { id: "daniel", handle: "@danielsalaschavez", name: "Daniel Salas Chávez", url: "https://www.youtube.com/@danielsalaschavez", description: "Física y matemática con enfoque conceptual, ideal para E3.", tag: "Física", color: "#0f705a", avatar: "https://yt3.googleusercontent.com/RDA9nz6iy6j5vak56CG5mnkvvIY1VH0x0vv_4aPGn5wdOW9wRIjIVmX9QeC0FIjnPpIZKy2mvCw=s900-c-k-c0x00ffffff-no-rj" },
  { id: "valencia", handle: "@valencianiveluni", name: "Valencia Nivel UNI", url: "https://www.youtube.com/@valencianiveluni", description: "Problemas nivel UNI con cronómetro y estrategia de examen.", tag: "Nivel UNI", color: "#d8763e", avatar: "https://yt3.googleusercontent.com/AitttOW3YUdQ8IxyXKXcUGfWwFmfVMD6g3Kvn-wYS8bYf0O6TP_PSwQE2u_jem9xxBYYysOS=s900-c-k-c0x00ffffff-no-rj" },
];

type Video = {
  id: string;
  title: string;
  url: string;
  description: string;
  tag: string;
};

const VIDEOS: Video[] = [
  {
    id: "gXAxRa7tBok",
    title: "Estrategia para ingresar a la UNI — lo que realmente importa",
    url: "https://www.youtube.com/watch?v=gXAxRa7tBok",
    description: "Un repaso sobre hábitos, enfoque y cómo ordenar tu preparación sin quemarte.",
    tag: "Motivación / Estrategia",
  },
  {
    id: "K_GFP1hcMq8",
    title: "Cómo resolver bajo presión — física y matemática aplicadas",
    url: "https://www.youtube.com/watch?v=K_GFP1hcMq8&t=936s",
    description: "Ejemplo de resolución cronometrada con explicación del porqué de cada paso.",
    tag: "Resolución comentada",
  },
];

export default function GuiaPage({ navigate, path }: GuiaPageProps) {
  const [activeTab, setActiveTab] = useState<"canales" | "videos">("canales");

  return (
    <div className="page guia-page">
      <SiteHeader navigate={navigate} path={path} variant="solid" />

      <section className="page-hero guia-hero">
        <ParticleField density={45} parallax={10} className="particle-canvas page-hero-canvas" />
        <div className="page-hero-glow guia-hero-glow" aria-hidden="true" />

        <div className="page-hero-inner">
          <nav className="breadcrumb" aria-label="Ruta de navegación">
            <button onClick={() => navigate("/")} aria-label="Volver al inicio">
              <Icon name="arrowLeft" size={15} /> Inicio
            </button>
            <span aria-hidden="true">/</span>
            <strong>Guía</strong>
          </nav>

          <p className="eyebrow">La videoteca del postulante</p>
          <h1>
            Aprende a tu
            <br />
            <em>propio ritmo.</em>
          </h1>
          <p className="page-hero-text">
            Desciende en la página para ver el contenedor interactivo en 3D con la selección de
            canales y videos que me sirvieron para ingresar.
          </p>

          <button
            className="scroll-cue"
            onClick={() => {
              document.getElementById("scroller")?.scrollIntoView({ behavior: "smooth" });
            }}
            aria-label="Bajar a la guía 3D"
          >
            <span>Bajar</span>
            <i />
          </button>
        </div>

        <div className="page-hero-glare">
          <div className="glare-card glare-card--portrait" style={{ perspective: "900px" }}>
            <img className="glare-card-image" src="/images/uni-campus-courtyard.jpg" alt="" />
            <span className="glare-card-shade" aria-hidden="true" />
            <span className="glare-card-copy">
              <small>Guía audiovisual</small>
              <strong>Aprende de quienes saben</strong>
              <em>Canales y videos seleccionados para estudiar con dirección.</em>
              <span className="glare-card-action">Abrir la guía <Icon name="arrow" size={15} /></span>
            </span>
          </div>
        </div>
      </section>

      <section className="guia-scroll-section" id="scroller">
        <ContainerScroll
          subtitle="Curaduría CachimboUNI"
          title={
            <>
              Canales y videos
              <br />
              <em>recomendados.</em>
            </>
          }
        >
          <div className="dashboard-layout">
            <div className="dashboard-sidebar">
              <div className="sidebar-group">
                <span className="sidebar-label">Menú rápido</span>
                <button
                  className={activeTab === "canales" ? "sidebar-link is-active" : "sidebar-link"}
                  onClick={() => setActiveTab("canales")}
                >
                  <Icon name="play" size={14} /> Canales recomendados
                </button>
                <button
                  className={activeTab === "videos" ? "sidebar-link is-active" : "sidebar-link"}
                  onClick={() => setActiveTab("videos")}
                >
                  <Icon name="bookmark" size={14} /> Videos esenciales
                </button>
              </div>

              <div className="sidebar-note">
                <Icon name="spark" size={14} />
                <p>Haz clic en cualquier tarjeta para abrir el recurso en YouTube.</p>
              </div>
            </div>

            <div className="dashboard-main">
              <div className="dashboard-tabs">
                <button
                  className={activeTab === "canales" ? "is-active" : ""}
                  onClick={() => setActiveTab("canales")}
                >
                  Canales recomendados ({CHANNELS.length})
                </button>
                <button
                  className={activeTab === "videos" ? "is-active" : ""}
                  onClick={() => setActiveTab("videos")}
                >
                  Videos esenciales ({VIDEOS.length})
                </button>
              </div>

              <div className="dashboard-content" aria-live="polite">
                {activeTab === "canales" ? (
                  <div className="channel-grid-large">
                    {CHANNELS.map((channel, idx) => (
                      <a
                        key={channel.id}
                        href={channel.url}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="channel-card-large"
                        aria-label={`Abrir el canal ${channel.name} en YouTube`}
                      >
                        <span className="channel-card-inner">
                          <span className="channel-large-top">
                            <span className="channel-index">#{String(idx + 1).padStart(2, "0")}</span>
                            <span
                              className="channel-tag-fixed"
                              style={{ borderColor: channel.color, color: channel.color }}
                            >
                              {channel.tag}
                            </span>
                          </span>

                          <span className="channel-large-head">
                            <img
                              className="channel-avatar"
                              src={channel.avatar}
                              alt=""
                              loading="lazy"
                              draggable={false}
                              referrerPolicy="no-referrer"
                            />
                            <span className="channel-large-id">
                              <strong>{channel.name}</strong>
                              <span className="channel-handle">{channel.handle}</span>
                            </span>
                          </span>

                          <span className="channel-large-desc">{channel.description}</span>

                          <span className="channel-open-large">
                            Ver canal <Icon name="external" size={13} />
                          </span>
                        </span>
                      </a>
                    ))}
                  </div>
                ) : (
                  <div className="video-mini-grid">
                    {VIDEOS.map((video) => (
                      <a
                        key={video.id}
                        href={video.url}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="video-card"
                      >
                        <div className="video-thumb">
                          <img
                            src={`https://img.youtube.com/vi/${video.id}/hqdefault.jpg`}
                            alt={`Miniatura del video ${video.title}`}
                            loading="lazy"
                          />
                          <span className="video-play">
                            <Icon name="play" size={14} />
                          </span>
                          <span className="video-badge">
                            <Icon name="spark" size={11} /> YouTube
                          </span>
                        </div>
                        <div className="video-info">
                          <span className="video-tag">{video.tag}</span>
                          <h3>{video.title}</h3>
                          <p>{video.description}</p>
                          <span className="video-open">
                            Ver en YouTube <Icon name="arrow" size={14} />
                          </span>
                        </div>
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </ContainerScroll>
      </section>

      <section className="guia-disclaimer section-pad">
        <div className="disclaimer-card">
          <div className="disclaimer-icon">
            <Icon name="book" size={18} />
          </div>
          <div>
            <h4>Aclaración importante — sobre derechos y créditos</h4>
            <p>
              Estos canales y videos <strong>no son míos</strong>. Todo el contenido enlazado pertenece a sus
              creadores originales en YouTube y se comparte aquí con fines <strong>educativos y de curaduría</strong>.
              CachimboUNI no reclama autoría, no descarga ni re-sube material protegido y no monetiza este listado.
              Si eres autor de alguno de estos videos y prefieres que retire el enlace, escríbeme por TikTok{" "}
              <a href="https://www.tiktok.com/@yorish_vuca?_r=1&_t=ZS-98frvF4F3ky" target="_blank" rel="noreferrer noopener">
                @yorish_vuca
              </a>{" "}
              y lo actualizo de inmediato. Respeta siempre los derechos de cada creador dándoles like,
              comentario y suscripción directamente en YouTube.
            </p>
          </div>
        </div>
      </section>

      <section className="guia-usage">
        <div className="guia-usage-inner section-pad">
          <div className="section-index">¿CÓMO USAR ESTA GUÍA?</div>
          <div className="guia-usage-grid">
            <div>
              <span>01</span>
              <h3>No maratonees</h3>
              <p>Mira un canal por día, pausa y resuelve tú antes de ver la solución completa.</p>
            </div>
            <div>
              <span>02</span>
              <h3>Anota método</h3>
              <p>Cada video deja una estrategia: diagramas, identidades, pasos. Guarda eso, no solo el resultado.</p>
            </div>
            <div>
              <span>03</span>
              <h3>Vuelve a la biblioteca</h3>
              <p>Después del video, valida lo aprendido con teoría y exámenes de tu carpeta de recursos.</p>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter navigate={navigate} />
    </div>
  );
}
