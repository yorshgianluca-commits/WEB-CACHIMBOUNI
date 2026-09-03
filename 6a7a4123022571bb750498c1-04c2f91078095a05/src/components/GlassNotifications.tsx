import { useCallback, useEffect, useState } from "react";
import Icon from "./Icon";

/**
 * Notificaciones flotantes estilo "cristal" (glassmorphism) para la página principal.
 * - Cada aviso muestra una VISTA PREVIA REAL: la tabla del horario CEPREUNI (turno
 *   mañana, ciclo 2027-I) o las fechas del cronograma académico, extraídas de los
 *   documentos oficiales de www.cepre.uni.edu.pe.
 * - Al hacer clic en la vista previa se amplía el PDF oficial embebido (Google Docs
 *   viewer) con fallback a "abrir en pestaña nueva".
 * - Los avisos cerrados se recuerdan en localStorage; la campana los reactiva.
 */

const STORAGE_KEY = "cachimbouni.notifsDismissed";

const HORARIO_PDF = "https://www.cepre.uni.edu.pe/assets/archivos/ciclo-pre/HORARIOCICLOPREUNIVERSITARIO-.pdf";
const CRONOGRAMA_PDF =
  "https://www.cepre.uni.edu.pe/assets/cronogramas/CRONOGRAMADEACTIVIDADESACAD%C3%89MICAS-ciclopreuniversitario2027-1.pdf";

const DAYS = ["LUN", "MAR", "MIÉ", "JUE", "VIE", "SÁB"];

/* Tabla replicada del horario oficial difundido por CEPREUNI (turno mañana 2027-I) */
const HORARIO_ROWS: { time: string; suffix?: string; cells: string[] | "descanso" }[] = [
  { time: "07:30 – 08:25", suffix: "AM", cells: ["Álgebra", "Geometría", "Álgebra", "Geometría", "Química", "Química"] },
  { time: "08:25 – 09:20", suffix: "AM", cells: ["Álgebra", "Geometría", "Álgebra", "Geometría", "Química", "Química"] },
  { time: "09:20 – 10:00", suffix: "AM", cells: ["Álgebra", "Geometría", "Álgebra", "Geometría", "Química", "Química"] },
  { time: "10:00 – 10:20", suffix: "AM", cells: "descanso" },
  { time: "10:20 – 11:00", suffix: "AM", cells: ["Trigonometría", "Física", "Aritmética", "Física", "Aritmética", "Trigonometría"] },
  { time: "11:00 – 11:55", suffix: "AM", cells: ["Trigonometría", "Física", "Aritmética", "Física", "Aritmética", "Trigonometría"] },
  { time: "11:55 – 12:50", suffix: "PM", cells: ["Trigonometría", "Física", "Aritmética", "Física", "Aritmética", "Trigonometría"] },
  { time: "12:50 – 01:45", suffix: "PM", cells: ["Humanidades", "Humanidades", "Humanidades", "Humanidades", "Humanidades", "Humanidades"] },
];

/* Hitos del cronograma oficial (PDF Ciclo Preuniversitario Admisión 2027-1) */
const CRONO_ROWS: { date: string; label: string; tag?: "parcial" | "final" }[] = [
  { date: "31 ago", label: "Inicio de clases (semana 01)" },
  { date: "13 set", label: "1.ª práctica calificada" },
  { date: "27 set", label: "2.ª práctica calificada" },
  { date: "11 oct", label: "1.er examen parcial", tag: "parcial" },
  { date: "25 oct", label: "3.ª práctica calificada" },
  { date: "29 nov", label: "2.º examen parcial", tag: "parcial" },
  { date: "10 ene", label: "6.ª práctica calificada" },
  { date: "6 feb", label: "Prueba de aptitud vocal" },
  { date: "7 feb", label: "Examen final presencial", tag: "final" },
];

type PreviewKind = "horario" | "cronograma";

export type GlassNotification = {
  id: string;
  badge: string;
  icon: string;
  title: string;
  text: string;
  ctaLabel: string;
  url: string;
  meta: string;
  preview: PreviewKind;
  previewCaption: string;
};

const NOTIFICATIONS: GlassNotification[] = [
  {
    id: "horario-2027-1",
    badge: "CEPREUNI · CICLO 2027-I",
    icon: "clock",
    title: "Horario CEPREUNI",
    text: "Ya salió el horario oficial del ciclo preuniversitario. Turnos: mañana 7:30 a. m. · tarde 2:25 p. m.",
    ctaLabel: "Abrir PDF del horario",
    url: HORARIO_PDF,
    meta: "Vista previa: turno mañana · Fuente: www.cepre.uni.edu.pe",
    preview: "horario",
    previewCaption: "Turno mañana · lunes a sábado",
  },
  {
    id: "cronograma-2027-1",
    badge: "CRONOGRAMA OFICIAL",
    icon: "layers",
    title: "Cronograma CEPREUNI 2027-I",
    text: "Prácticas, parciales y examen final del ciclo, todos con fecha. Descarga el PDF.",
    ctaLabel: "Abrir PDF del cronograma",
    url: CRONOGRAMA_PDF,
    meta: "20 semanas: del 31 ago al 7 feb · Fuente: www.cepre.uni.edu.pe",
    preview: "cronograma",
    previewCaption: "Actividades académicas · admisión 2027-1",
  },
];

function HorarioPreview({ zoom = false }: { zoom?: boolean }) {
  return (
    <div className={`gn-table${zoom ? " is-zoom" : ""}`} role="img" aria-label="Vista previa del horario de clases turno mañana: álgebra y geometría en las mañanas, trigonometría, física y aritmética en la segunda mitad, humanidades al cierre, de lunes a sábado.">
      <div className="gn-table-row gn-table-head">
        <span className="gn-table-time">HORA</span>
        {DAYS.map((d) => (
          <span key={d}>{d}</span>
        ))}
      </div>
      {HORARIO_ROWS.map((row) =>
        row.cells === "descanso" ? (
          <div className="gn-table-row is-break" key={row.time}>
            <span className="gn-table-time">{row.time.split(" – ")[0]}</span>
            <span className="gn-break-label">☕ D E S C A N S O ☕</span>
          </div>
        ) : (
          <div className="gn-table-row" key={row.time}>
            <span className="gn-table-time">
              {row.time}
              {zoom && <i>{row.suffix}</i>}
            </span>
            {row.cells.map((cell, i) => (
              <span key={i}>{cell}</span>
            ))}
          </div>
        )
      )}
    </div>
  );
}

function CronogramaPreview({ zoom = false }: { zoom?: boolean }) {
  return (
    <div className={`gn-timeline${zoom ? " is-zoom" : ""}`} role="img" aria-label="Vista previa del cronograma académico: inicio de clases el 31 de agosto, prácticas calificadas cada dos semanas, exámenes parciales el 11 de octubre y 29 de noviembre, y examen final el 7 de febrero.">
      {CRONO_ROWS.map((row) => (
        <div className={`gn-tl-row${row.tag ? ` is-${row.tag}` : ""}`} key={row.date}>
          <span className="gn-tl-dot" aria-hidden="true" />
          <strong>{row.date}</strong>
          <em>{row.label}</em>
        </div>
      ))}
    </div>
  );
}

function readDismissed(): string[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? (JSON.parse(raw) as unknown) : [];
    return Array.isArray(parsed) ? parsed.filter((v): v is string => typeof v === "string") : [];
  } catch {
    return [];
  }
}

export default function GlassNotifications() {
  const [dismissed, setDismissed] = useState<string[]>([]);
  const [collapsed, setCollapsed] = useState(false);
  const [entered, setEntered] = useState(false);
  const [leaving, setLeaving] = useState<string[]>([]);
  const [zoom, setZoom] = useState<GlassNotification | null>(null);

  useEffect(() => {
    setDismissed(readDismissed());
    const timer = window.setTimeout(() => setEntered(true), 650);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!zoom) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setZoom(null);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [zoom]);

  const dismiss = useCallback((id: string) => {
    setLeaving((prev) => (prev.includes(id) ? prev : [...prev, id]));
    window.setTimeout(() => {
      setLeaving((prev) => prev.filter((v) => v !== id));
      setDismissed((prev) => {
        const next = [...new Set([...prev, id])];
        try {
          window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        } catch {
          /* noop */
        }
        return next;
      });
    }, 360);
  }, []);

  const showAll = useCallback(() => {
    setCollapsed(false);
    setEntered(true);
    setDismissed([]);
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* noop */
    }
  }, []);

  const visible = NOTIFICATIONS.filter((n) => !dismissed.includes(n.id) || leaving.includes(n.id));
  const pending = NOTIFICATIONS.length - dismissed.length;
  const stackOpen = entered && !collapsed && visible.length > 0;

  return (
    <>
      <div
        className={`glass-notifs${stackOpen ? " is-open" : ""}`}
        role="region"
        aria-label="Avisos de CEPREUNI"
      >
        {stackOpen &&
          visible.map((notif, i) => {
            const isLeaving = leaving.includes(notif.id);
            return (
              <article
                key={notif.id}
                className={`glass-notif${isLeaving ? " is-leaving" : ""}`}
                style={{ animationDelay: `${i * 0.45}s` }}
                aria-live="polite"
              >
                <button
                  className="glass-notif-close"
                  onClick={() => dismiss(notif.id)}
                  aria-label={`Cerrar aviso: ${notif.title}`}
                >
                  <Icon name="close" size={14} strokeWidth={2} />
                </button>

                <button
                  className="glass-notif-media"
                  onClick={() => setZoom(notif)}
                  aria-label={`Ampliar vista previa: ${notif.title}`}
                  title="Clic para ver el PDF oficial"
                >
                  {notif.preview === "horario" ? <HorarioPreview /> : <CronogramaPreview />}
                  <span className="glass-notif-zoom">
                    <Icon name="search" size={12} /> PDF
                  </span>
                  <span className="glass-notif-shine" aria-hidden="true" />
                </button>

                <div className="glass-notif-body">
                  <span className="glass-notif-badge">
                    <Icon name={notif.icon} size={12} />
                    {notif.badge}
                  </span>
                  <h4>{notif.title}</h4>
                  <p>{notif.text}</p>
                  <div className="glass-notif-foot">
                    <a
                      className="glass-notif-cta"
                      href={notif.url}
                      target="_blank"
                      rel="noreferrer noopener"
                    >
                      {notif.ctaLabel} <Icon name="external" size={13} />
                    </a>
                    <button className="glass-notif-hide" onClick={() => setCollapsed(true)}>
                      Ocultar
                    </button>
                  </div>
                  <small className="glass-notif-meta">{notif.meta}</small>
                </div>

                <span className="glass-notif-edge" aria-hidden="true" />
              </article>
            );
          })}
      </div>

      <div className={`glass-notif-dock${entered ? " is-visible" : ""}`}>
        <button
          className={`glass-bell${pending > 0 && !collapsed ? " is-active" : ""}`}
          onClick={() => (pending === 0 || !stackOpen ? showAll() : setCollapsed(true))}
          aria-expanded={stackOpen}
          aria-label={
            pending > 0
              ? `Mostrar avisos de CEPREUNI (${pending} pendientes)`
              : "Volver a mostrar los avisos de CEPREUNI"
          }
        >
          <Icon name={pending > 0 && !collapsed ? "close" : "bell"} size={17} />
          <span>{pending > 0 ? `Avisos CEPREUNI · ${pending}` : "Volver a mostrar avisos"}</span>
          {pending > 0 && !collapsed && <em className="glass-bell-dot" aria-hidden="true" />}
        </button>
      </div>

      {zoom && (
        <div
          className="gn-zoom-overlay"
          role="dialog"
          aria-modal="true"
          aria-label={`${zoom.title} — vista previa ampliada`}
          onClick={(event) => {
            if (event.target === event.currentTarget) setZoom(null);
          }}
        >
          <div className="gn-zoom">
            <header className="gn-zoom-head">
              <div>
                <p className="gn-zoom-kicker">{zoom.badge}</p>
                <h3>{zoom.title}</h3>
              </div>
              <div className="gn-zoom-actions">
                <a className="gn-zoom-open" href={zoom.url} target="_blank" rel="noreferrer noopener">
                  Abrir PDF original <Icon name="external" size={14} />
                </a>
                <button className="gn-zoom-close" onClick={() => setZoom(null)} aria-label="Cerrar vista previa">
                  <Icon name="close" size={15} strokeWidth={2} />
                </button>
              </div>
            </header>

            <div className="gn-zoom-body">
              <iframe
                className="gn-zoom-frame"
                title={`Vista previa del PDF: ${zoom.title}`}
                src={`https://docs.google.com/viewer?url=${encodeURIComponent(zoom.url)}&embedded=true`}
                loading="lazy"
              />
            </div>

            <div className="gn-zoom-preview">
              <p className="gn-zoom-caption">{zoom.previewCaption}</p>
              {zoom.preview === "horario" ? <HorarioPreview zoom /> : <CronogramaPreview zoom />}
            </div>

            <footer className="gn-zoom-foot">
              <span>{zoom.meta}</span>
              <small>
                ¿La vista previa del PDF no carga? Ábrelo en una pestaña nueva o visita{" "}
                <a href="https://www.cepre.uni.edu.pe/ciclos/ciclo-preuniversitario" target="_blank" rel="noreferrer noopener">
                  www.cepre.uni.edu.pe <Icon name="external" size={11} />
                </a>
              </small>
            </footer>
          </div>
        </div>
      )}
    </>
  );
}
