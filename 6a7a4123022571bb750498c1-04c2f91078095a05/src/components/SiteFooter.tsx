import type { NavigateFn } from "../lib/router";
import ThemeToggle from "./ThemeToggle";

export default function SiteFooter({ navigate }: { navigate: NavigateFn }) {
  return (
    <footer>
      <a
        className="brand footer-brand"
        href="#/"
        onClick={(event) => {
          event.preventDefault();
          navigate("/");
        }}
      >
        <span className="brand-c">C</span>
        <span>CACHIMBO</span>
        <b>UNI</b>
      </a>
      <p>Hecho para los futuros ingenieros del Perú · Iniciativa educativa independiente.</p>
      <div>
        <a
          href="#/recursos"
          onClick={(event) => {
            event.preventDefault();
            navigate("/recursos");
          }}
        >
          Recursos
        </a>
        <a
          href="#/noticias"
          onClick={(event) => {
            event.preventDefault();
            navigate("/noticias");
          }}
        >
          Noticias
        </a>
        <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>Volver arriba</button>
        <ThemeToggle />
      </div>
    </footer>
  );
}
