import { useEffect, useState } from "react";
import Icon from "./Icon";
import { useAuth } from "../lib/auth";
import type { NavigateFn } from "../lib/router";

type SiteHeaderProps = {
  navigate: NavigateFn;
  path: string;
  variant?: "overlay" | "solid";
};

export default function SiteHeader({ navigate, path, variant = "overlay" }: SiteHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const onResourcesPage = path.startsWith("/recursos");
  const { user, openAuth } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [path]);

  const goHomeSection = (id: string) => {
    setMenuOpen(false);
    if (path !== "/") {
      navigate("/");
      window.setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      }, 120);
      return;
    }
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const classes = [
    "site-header",
    variant === "solid" ? "is-solid" : "",
    scrolled ? "is-scrolled" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <header className={classes}>
      <a
        className="brand"
        href="#/"
        aria-label="CachimboUNI, ir al inicio"
        onClick={(event) => {
          event.preventDefault();
          navigate("/");
        }}
      >
        <span className="brand-c">C</span>
        <span>CACHIMBO</span>
        <b>UNI</b>
      </a>

      <nav className={menuOpen ? "nav-links is-open" : "nav-links"} aria-label="Navegación principal">
        <button onClick={() => goHomeSection("metodo")}>Método</button>
        <button
          className={onResourcesPage ? "is-active" : ""}
          onClick={() => {
            setMenuOpen(false);
            navigate("/recursos");
          }}
        >
          Recursos
        </button>
        <button
          className={path === "/ruta-uni" ? "is-active" : ""}
          onClick={() => {
            setMenuOpen(false);
            navigate("/ruta-uni");
          }}
        >
          Ruta UNI
        </button>
        <button
          className={path.startsWith("/guia") ? "is-active" : ""}
          onClick={() => {
            setMenuOpen(false);
            navigate("/guia");
          }}
        >
          Guía
        </button>
        <button
          className={path.startsWith("/tools-study") ? "is-active" : ""}
          onClick={() => {
            setMenuOpen(false);
            navigate("/tools-study");
          }}
        >
          Tools
        </button>
        <button
          className={path.startsWith("/noticias") ? "is-active" : ""}
          onClick={() => {
            setMenuOpen(false);
            navigate("/noticias");
          }}
        >
          Noticias
        </button>
        <button
          className={path.startsWith("/ayuda") ? "is-active" : ""}
          onClick={() => {
            setMenuOpen(false);
            navigate("/ayuda");
          }}
        >
          Ayuda
        </button>
        <button
          className={path.startsWith("/recursos-gold") ? "is-active nav-gold" : "nav-gold"}
          onClick={() => {
            setMenuOpen(false);
            navigate("/recursos-gold");
          }}
        >
          Recursos Gold
        </button>
        <button
          className="nav-register"
          onClick={() => {
            setMenuOpen(false);
            openAuth();
          }}
        >
          {user ? `Hola, ${user.name.split(" ")[0]}` : "Registrarse"}
        </button>
      </nav>

      <div className="header-actions">
        <button
          className={`header-auth${user ? " is-logged" : ""}`}
          onClick={() => openAuth()}
          aria-label={user ? `Abrir cuenta de ${user.name}` : "Registrarse en CachimboUNI"}
        >
          {user ? (
            <>
              <span className="header-auth-avatar" aria-hidden="true">
                {user.name.charAt(0).toUpperCase()}
              </span>
              <span>{user.name.split(" ")[0]}</span>
            </>
          ) : (
            <>
              <Icon name="check" size={14} />
              <span>Registrarse</span>
            </>
          )}
        </button>

        <button className="header-cta" onClick={() => navigate("/recursos")}>
          {onResourcesPage ? "Ver biblioteca" : "Empezar ahora"} <Icon name="arrow" size={17} />
        </button>
      </div>

      <button
        className="menu-button"
        onClick={() => setMenuOpen((open) => !open)}
        aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
        aria-expanded={menuOpen}
      >
        <Icon name={menuOpen ? "close" : "menu"} />
      </button>
    </header>
  );
}
