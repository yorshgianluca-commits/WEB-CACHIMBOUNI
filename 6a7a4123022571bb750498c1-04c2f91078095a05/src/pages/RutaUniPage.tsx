import Icon from "../components/Icon";
import ParticleField from "../components/ParticleField";
import DitherWave from "../components/ui/dither-wave";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";
import type { NavigateFn } from "../lib/router";

type RutaUniPageProps = {
  navigate: NavigateFn;
  path: string;
};

const HOURS = [
  { day: "Lunes a viernes", time: "8:00 a.m. – 6:00 p.m." },
  { day: "Sábados", time: "9:00 a.m. – 2:00 p.m." },
];

const CONTACTS = [
  { label: "Dirección", value: "cepre@uni.edu.pe", href: "mailto:cepre@uni.edu.pe" },
  { label: "Coordinación General", value: "coord.gen.cepreuni@uni.edu.pe", href: "mailto:coord.gen.cepreuni@uni.edu.pe" },
  { label: "Informes", value: "imagen.cepreuni@uni.edu.pe", href: "mailto:imagen.cepreuni@uni.edu.pe" },
  { label: "Sede Central · Sector T, puerta 7", value: "(01) 481-1070 · Anexos 6901 / 6902", href: "tel:+5114811070" },
];

const FACULTIES = [
  { letter: "A", color: "#1f3b6e", name: "Facultad de Ingeniería Ambiental", short: "FIA" },
  { letter: "C", color: "#8b4b22", name: "Facultad de Ingeniería Química y Textil", short: "FIQT" },
  { letter: "D", color: "#8f2e33", name: "Facultad de Ingeniería Ambiental", short: "FIA" },
  { letter: "G", color: "#25494d", name: "Facultad de Ingeniería Civil", short: "FIC" },
  { letter: "H", color: "#0f705a", name: "Facultad de Arquitectura, Urbanismo y Artes", short: "FAUA" },
  { letter: "I", color: "#0e565c", name: "Ing. Geológica, Minera y Metalúrgica", short: "FIGMM" },
  { letter: "Q", color: "#2d2a72", name: "Facultad de Ingeniería Eléctrica y Electrónica", short: "FIEE" },
  { letter: "S", color: "#2f3d5b", name: "Facultad de Ingeniería Industrial y de Sistemas", short: "FIIS" },
  { letter: "T", color: "#d71b89", name: "CEPREUNI", short: "Centro Preuniversitario" },
];

const GATES = [
  { num: "3", note: "Ingreso peatonal", side: "Este" },
  { num: "4A", note: "Ingreso peatonal · CEPS UNI", side: "Este" },
  { num: "5", note: "Ingreso peatonal y vehicular", side: "Centro" },
  { num: "6", note: "Ingreso peatonal", side: "Suroeste" },
  { num: "7", note: "Ingreso peatonal y vehicular · CEPREUNI", side: "Oeste" },
];

export default function RutaUniPage({ navigate, path }: RutaUniPageProps) {
  return (
    <div className="page ruta-page">
      <SiteHeader navigate={navigate} path={path} variant="solid" />

      <section className="page-hero ruta-hero is-dither">
        <DitherWave
          className="dither-wave"
          background="#080b0d"
          color="#8c1f36"
          accent="#f3a066"
          pixelSize={3}
          speed={0.85}
          amplitude={1}
          scale={1}
        />
        <div className="dither-veil" aria-hidden="true" />
        <ParticleField density={40} parallax={12} className="particle-canvas page-hero-canvas" />
        <div className="page-hero-inner">
          <nav className="breadcrumb" aria-label="Ruta de navegación">
            <button onClick={() => navigate("/")} aria-label="Volver al inicio">
              <Icon name="arrowLeft" size={15} /> Inicio
            </button>
            <span aria-hidden="true">/</span>
            <strong>Ruta UNI</strong>
          </nav>

          <p className="eyebrow">Guía del postulante</p>
          <h1>
            Conoce la <em>UNI</em>.
            <br />
            Campus, puertas
            <br />y CEPREUNI.
          </h1>
          <p className="page-hero-text">
            Información esencial para ubicar la sede, reconocer el campus y saber por dónde ingresar
            el día del trámite, la clase o el examen.
          </p>

          <div className="hero-stats ruta-stats">
            <div>
              <strong>66 ha</strong>
              <span>área del campus</span>
            </div>
            <div>
              <strong>1876</strong>
              <span>año de fundación</span>
            </div>
            <div>
              <strong>5</strong>
              <span>puertas peatonales</span>
            </div>
          </div>
        </div>
        <button
          className="hero-scroll-cta"
          onClick={() => document.querySelector(".map-section")?.scrollIntoView({ behavior: "smooth" })}
        >
          Ver el mapa <Icon name="arrow" size={16} />
        </button>
      </section>

      <section className="info-split section-pad">
        <div>
          <div className="section-index">01 / CEPREUNI</div>
          <p className="eyebrow">Centro Preuniversitario UNI</p>
          <h2>
            Datos que
            <br />
            <em>sí importan.</em>
          </h2>
          <p className="lead">
            La CEPREUNI funciona en la sede central del campus UNI y es uno de los puntos clave que
            todo postulante reconoce. Anota la dirección y los horarios de atención antes de ir.
          </p>

          <div className="info-block">
            <div className="info-row">
              <span className="info-kicker">Dirección</span>
              <strong>
                Av. Túpac Amaru N° 210, Rímac
                <br />
                Puerta 7 · Sector T de la UNI.
              </strong>
            </div>
            <a
              className="map-link"
              href="https://www.google.com/maps/place/Universidad+Nacional+de+Ingenieria/@-12.0197,-77.0486,16z"
              target="_blank"
              rel="noreferrer noopener"
            >
              <Icon name="external" size={16} /> Ver en Google Maps
            </a>
          </div>

          <div className="info-block">
            <div className="info-row">
              <span className="info-kicker">Horarios de atención</span>
              <ul className="hours-list">
                {HOURS.map((item) => (
                  <li key={item.day}>
                    <span>{item.day}</span>
                    <strong>{item.time}</strong>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="info-block">
            <div className="info-row">
              <span className="info-kicker">Contacto</span>
              <ul className="contact-list">
                {CONTACTS.map((item) => (
                  <li key={item.label}>
                    <span>{item.label}</span>
                    <a href={item.href} target={item.href.startsWith("mailto") ? undefined : "_blank"} rel="noreferrer noopener">
                      {item.value}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <aside className="info-card" aria-label="Recomendaciones rápidas">
          <h3>Antes de ir</h3>
          <ul>
            <li><Icon name="check" size={14} /> Lleva tu DNI y carné de postulante si ya estás inscrito.</li>
            <li><Icon name="check" size={14} /> La puerta 7 es el ingreso más directo a CEPREUNI.</li>
            <li><Icon name="check" size={14} /> Revisa el portal oficial si habrá simulacro o examen ese día.</li>
            <li><Icon name="check" size={14} /> En hora punta, llega con al menos 45 minutos de margen.</li>
          </ul>
        </aside>
      </section>

      <section className="map-section">
        <div className="map-head section-pad">
          <div>
            <div className="section-index">02 / MAPA DEL CAMPUS</div>
            <p className="eyebrow">Plano referencial</p>
            <h2>
              Puertas, facultades
              <br />y <em>CEPREUNI.</em>
            </h2>
          </div>
          <p className="map-copy">
            El campus se extiende casi 2 km a lo largo de la Av. Túpac Amaru, en el límite con San
            Martín de Porres e Independencia. Identifica tu facultad y la puerta más cercana antes
            de salir de casa.
          </p>
        </div>

        <figure className="map-figure">
          <img src="/images/uni-campus-map.jpg" alt="Plano oficial del campus de la Universidad Nacional de Ingeniería con las puertas y facultades marcadas" />
          <figcaption>Plano referencial elaborado a partir del mapa oficial de la UNI.</figcaption>
        </figure>

        <div className="map-columns section-pad">
          <div>
            <h3>Puertas principales</h3>
            <ul className="gate-list">
              {GATES.map((gate) => (
                <li key={gate.num}>
                  <span className="gate-num">N° {gate.num}</span>
                  <div>
                    <strong>{gate.note}</strong>
                    <em>Sector {gate.side}</em>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3>Facultades y sedes</h3>
            <ul className="faculty-list">
              {FACULTIES.map((faculty) => (
                <li key={faculty.letter}>
                  <span className="faculty-letter" style={{ color: faculty.color, borderColor: faculty.color }}>{faculty.letter}</span>
                  <div>
                    <strong>{faculty.name}</strong>
                    <em>{faculty.short}</em>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="admission-cta section-pad">
        <div className="cta-grid" aria-hidden="true" />
        <div>
          <div className="section-index">03 / SIGUE TU PREPARACIÓN</div>
          <p className="eyebrow">Desde tu casa hasta la puerta 7</p>
          <h2>
            El camino a la
            <br />
            UNI empieza <em>un tema a la vez.</em>
          </h2>
        </div>
        <div className="cta-actions">
          <button className="primary-button" onClick={() => navigate("/recursos")}>
            Ir a los recursos <Icon name="arrow" />
          </button>
          <a
            className="inline-link"
            href="https://www.cepre.uni.edu.pe/contactanos"
            target="_blank"
            rel="noreferrer noopener"
          >
            Info oficial CEPREUNI <Icon name="external" size={16} />
          </a>
        </div>
      </section>

      <SiteFooter navigate={navigate} />
    </div>
  );
}
