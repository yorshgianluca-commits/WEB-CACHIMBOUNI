import { useEffect, useRef, useState } from "react";
import Icon from "../components/Icon";
import ParticleField from "../components/ParticleField";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";
import GlareCard from "../components/GlareCard";
import { useSiteContent } from "../hooks/useSiteContent";
import { trackActivity } from "../lib/activity";
import type { CategoryId, ExternalLink } from "../lib/data";
import type { NavigateFn } from "../lib/router";

type ResourcesPageProps = {
  navigate: NavigateFn;
  path: string;
  category: CategoryId | null;
};

const USAGE_STEPS = [
  {
    index: "01",
    icon: "theory",
    title: "Elige un recuadro",
    text: "Teoría para entender, Exámenes para medirte y Libros para profundizar.",
  },
  {
    index: "02",
    icon: "filter",
    title: "Selecciona un enlace",
    text: "Navega en las carpetas Drive curadas con material específico.",
  },
  {
    index: "03",
    icon: "bookmark",
    title: "Estudia a tu ritmo",
    text: "Todos los recursos son de acceso libre y 100% gratuitos sin registro.",
  },
];

export default function ResourcesPage({ navigate, path, category }: ResourcesPageProps) {
  const { categories } = useSiteContent();
  const [activeCategory, setActiveCategory] = useState<CategoryId>(category ?? "teoria");
  const catalogRef = useRef<HTMLDivElement>(null);
  const firstRender = useRef(true);

  const getCategory = (id: CategoryId) =>
    categories.find((item) => item.id === id) ?? categories[0];

  useEffect(() => {
    if (category && category !== activeCategory) setActiveCategory(category);
  }, [category, activeCategory]);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      if (category) {
        trackActivity({
          page: "recursos",
          path: `/recursos/${category}`,
          action: "land_category",
          resourceId: category,
          label: categories.find((item) => item.id === category)?.name,
        });
        window.setTimeout(
          () => catalogRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }),
          260
        );
      }
    }
  }, [category, categories]);

  const chooseCategory = (id: CategoryId, scroll = true) => {
    setActiveCategory(id);
    const found = categories.find((item) => item.id === id);
    trackActivity({
      page: "recursos",
      path: `/recursos/${id}`,
      action: "open_category",
      resourceId: id,
      label: found?.name,
    });
    navigate(`/recursos/${id}`, { keepScroll: true });
    if (scroll) {
      window.setTimeout(
        () => catalogRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }),
        60
      );
    }
  };

  const currentCategory = getCategory(activeCategory);

  return (
    <div className="page resources-page">
      <SiteHeader navigate={navigate} path={path} variant="solid" />

      <section className="page-hero">
        <ParticleField density={70} parallax={16} className="particle-canvas page-hero-canvas" />
        <div className="page-hero-glow" aria-hidden="true" />
        <div className="page-hero-inner">
          <nav className="breadcrumb" aria-label="Ruta de navegación">
            <button onClick={() => navigate("/")} aria-label="Volver al inicio">
              <Icon name="arrowLeft" size={15} /> Inicio
            </button>
            <span aria-hidden="true">/</span>
            <strong>Recursos</strong>
          </nav>

          <p className="eyebrow">Biblioteca CachimboUNI</p>
          <h1>
            Todo el material
            <br />
            en <em>un solo lugar.</em>
          </h1>
          <p className="page-hero-text">
            Elige un recuadro y accede a teoría explicada, exámenes de admisión resueltos y libros
            recomendados para cada curso del examen de la UNI.
          </p>

          <div className="hero-stats">
            <div>
              <strong>18</strong>
              <span>Recursos curados</span>
            </div>
            <div>
              <strong>{categories.length}</strong>
              <span>categorías</span>
            </div>
            <div>
              <strong>5</strong>
              <span>cursos</span>
            </div>
            <div>
              <strong>100%</strong>
              <span>Libre y gratuito</span>
            </div>
          </div>
        </div>
        <div className="page-hero-glare">
          <GlareCard
            image="/images/resources-path.jpg"
            eyebrow="Biblioteca abierta"
            title="Encuentra tu camino"
            description="Teoría, exámenes y libros para iluminar la siguiente etapa."
            action="Ver carpetas"
            onClick={() => catalogRef.current?.scrollIntoView({ behavior: "smooth" })}
          />
        </div>
      </section>

      <section className="category-section">
        <div className="category-section-head">
          <div className="section-index">SELECCIONA UNA CATEGORÍA</div>
          <p>Cuatro puertas de entrada al mismo objetivo: ingresar a la UNI.</p>
        </div>

        <div className="category-boxes">
          {categories.map((item) => {
            const isActive = item.id === activeCategory;
            return (
              <article
                key={item.id}
                className={isActive ? "category-box is-active" : "category-box"}
              >
                <div className="category-box-head">
                  <span className="category-icon">
                    <Icon name={item.icon} size={26} />
                  </span>
                  <span className="category-index">{item.index}</span>
                </div>

                <h2>{item.name}</h2>
                <p className="category-tagline">{item.tagline}</p>
                <p className="category-desc">{item.description}</p>

                <ul className="category-bullets">
                  {item.bullets.map((bullet) => (
                    <li key={bullet}>
                      <Icon name="check" size={14} /> {bullet}
                    </li>
                  ))}
                </ul>

                <div className="category-foot">
                  <span>{item.externalCollection ? `${item.externalCollection.length} enlaces` : "0 enlaces"}</span>
                  <button onClick={() => chooseCategory(item.id)}>
                    {isActive ? "Explorando carpetas" : "Ver carpetas"} <Icon name="arrow" size={17} />
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="catalog" ref={catalogRef} id="catalogo">
        <div className="collection-view">
          <div className="catalog-head">
            <div>
              <div className="section-index">
                {currentCategory.index} / {currentCategory.name.toUpperCase()}
              </div>
              <h2>{currentCategory.tagline}</h2>
            </div>
          </div>

          <div className="catalog-tabs" role="tablist" aria-label="Categorías de recursos">
            {categories.map((item) => (
              <button
                key={item.id}
                role="tab"
                aria-selected={item.id === activeCategory}
                className={item.id === activeCategory ? "is-active" : ""}
                onClick={() => chooseCategory(item.id, false)}
              >
                <Icon name={item.icon} size={16} /> {item.name}
                {item.externalCollection && <em>{item.externalCollection.length}</em>}
              </button>
            ))}
          </div>

          <p className="collection-intro">{currentCategory.description}</p>

          <div className="collection-grid">
            {currentCategory.externalCollection?.map((link: ExternalLink, idx) => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noreferrer noopener"
                className="collection-box"
                onClick={() =>
                  trackActivity({
                    page: "recursos",
                    path: `/recursos/${activeCategory}`,
                    action: "click_collection",
                    resourceId: link.id,
                    label: link.title,
                  })
                }
              >
                <div className="collection-box-head">
                  <span className="collection-index">#{String(idx + 1).padStart(2, "0")}</span>
                  <span className={`collection-badge collection-badge--${link.type}`}>
                    {link.type === "playlist" ? "Playlist" : link.type === "blog" ? "Blog" : "Drive"}
                  </span>
                </div>
                <h3>{link.title}</h3>
                <p>{link.description}</p>
                <span className="collection-open">
                  {link.type === "playlist" ? "Ver playlist" : "Abrir recurso"}{" "}
                  <Icon name="external" size={15} />
                </span>
                <span className="collection-box-glow" aria-hidden="true" />
              </a>
            ))}
          </div>

          <div className="collection-note">
            <Icon name="spark" size={16} />
            <p>
              Estos enlaces conducen a carpetas y sitios mantenidos por terceros. Si un link deja
              de funcionar, avísame por TikTok para actualizarlo de inmediato.
            </p>
          </div>
        </div>
      </section>

      <section className="usage-section">
        <div className="usage-head">
          <div className="section-index">CÓMO USAR LA BIBLIOTECA</div>
          <h2>
            Tres pasos para
            <br />
            <em>no perder el tiempo.</em>
          </h2>
        </div>
        <div className="usage-grid">
          {USAGE_STEPS.map((step) => (
            <div className="usage-box" key={step.index}>
              <span className="usage-icon">
                <Icon name={step.icon} size={22} />
              </span>
              <span className="usage-index">{step.index}</span>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </div>
          ))}
        </div>
        <div className="usage-note">
          <Icon name="spark" size={18} />
          <p>
            El material es de uso educativo y gratuito. Consulta siempre el temario y las fechas en
            el portal oficial de{" "}
            <a href="https://admision.uni.edu.pe/" target="_blank" rel="noreferrer">
              admisión de la UNI
            </a>
            .
          </p>
        </div>
      </section>

      <SiteFooter navigate={navigate} />
    </div>
  );
}
