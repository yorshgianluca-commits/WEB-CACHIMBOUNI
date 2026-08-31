import { useMemo } from "react";
import { motion } from "motion/react";
import Icon from "./Icon";
import type { NavigateFn } from "../lib/router";

export type GoldLink = {
  id: string;
  url: string;
  icon: "spark" | "book" | "theory" | "play" | "layers" | "exam" | "target" | "filter" | "external";
  badge: string;
  title: string;
  text: string;
};

export const GOLD_LINKS: GoldLink[] = [
  {
    id: "universe-channel",
    url: "https://www.whatsapp.com/channel/0029VbBKG4SAojYveJl8MJ0T",
    icon: "spark",
    badge: "Canal WhatsApp · Universe",
    title: "Material exclusivo y avisos",
    text: "Canal oficial de la comunidad Universe: avisos, fechas y contenido extra que no se publica en otro lado.",
  },
  {
    id: "universe-to-study",
    url: "https://universetostudy.com/",
    icon: "book",
    badge: "Plataforma · Universe to Study",
    title: "Temarios, simulacros y clases",
    text: "Tu ruta de ingreso a la UNI: temarios organizados, simulacros cronometrados, calculadora CEPREUNI y comunidad UNITALK.",
  },
  {
    id: "material-teorico",
    url: "https://www.whatsapp.com/channel/0029Vb6ClnaGehEKWzedhp1b",
    icon: "theory",
    badge: "Canal WhatsApp · Teoría",
    title: "Material teórico",
    text: "Teoría organizada por cursos para estudiar directo desde tu WhatsApp, sin buscar entre mil enlaces.",
  },
  {
    id: "pizarras-clases",
    url: "https://whatsapp.com/channel/0029VbBWHuo002T7HUDElT3P",
    icon: "play",
    badge: "Canal WhatsApp · Clases",
    title: "Pizarras de clases",
    text: "Clases explicadas en pizarra, paso a paso, para entender el método y no solo copiar la respuesta.",
  },
  {
    id: "grupo-estudio",
    url: "https://chat.whatsapp.com/E6ZZDq4RYt49ykNRvdfjdo",
    icon: "layers",
    badge: "Grupo · Comunidad",
    title: "Grupo de estudio",
    text: "Únete a la comunidad, pregunta, comparte recursos y resuelve dudas con otros postulantes a la UNI.",
  },
];

/* Orbes dorados flotantes con posiciones pseudoaleatorias estables entre renders. */
function useOrbs(count: number) {
  return useMemo(
    () =>
      Array.from({ length: count }).map((_, i) => ({
        id: i,
        left: (i * 37 + 11) % 100,
        top: (i * 53 + 7) % 100,
        size: 10 + ((i * 29) % 34),
        delay: (i % 6) * 0.7,
        duration: 7 + (i % 5) * 2,
        opacity: 0.25 + ((i * 13) % 40) / 100,
      })),
    [count]
  );
}

type Props = {
  navigate: NavigateFn;
};

export default function GoldResources({ navigate }: Props) {
  const orbsFar = useOrbs(6);
  const orbsNear = useOrbs(8);

  return (
    <section className="gold-teaser" id="recursos-gold">
      <div className="gold-grid-bg" aria-hidden="true" />

      <motion.div className="gold-teaser-ghost" aria-hidden="true" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 1 }}>
        GOLD
      </motion.div>

      <div className="gold-layer" aria-hidden="true">
        {orbsFar.map((orb) => (
          <span
            key={orb.id}
            className="gold-orb"
            style={{
              left: `${orb.left}%`,
              top: `${orb.top}%`,
              width: orb.size,
              height: orb.size,
              opacity: orb.opacity,
              animationDelay: `${orb.delay}s`,
              animationDuration: `${orb.duration}s`,
            }}
          />
        ))}
      </div>

      <div className="gold-layer" aria-hidden="true">
        {orbsNear.map((orb) => (
          <span
            key={orb.id}
            className="gold-particle"
            style={{
              left: `${orb.left}%`,
              top: `${orb.top}%`,
              width: orb.size / 2.6,
              height: orb.size / 2.6,
              opacity: orb.opacity * 0.9,
              animationDelay: `${orb.delay + 0.4}s`,
              animationDuration: `${orb.duration + 2}s`,
            }}
          />
        ))}
      </div>

      <motion.div
        className="gold-teaser-inner"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }}
      >
        <div className="gold-teaser-copy">
          <div className="section-index gold-index">★ RECURSOS GOLD · ACCESO VIP</div>
          <h2>
            Recursos
            <br />
            <em className="gold-word">Gold.</em>
          </h2>
          <p className="gold-lead">
            Material teórico, pizarras de clases, simulacros y comunidad: la selección dorada con
            su propia página y efectos al hacer scroll.
          </p>
          <button
            className="gold-liquid-btn"
            onClick={() => navigate("/recursos-gold")}
            aria-label="Abrir la página de Recursos Gold"
          >
            <span className="gold-liquid-btn-shine" aria-hidden="true" />
            <span className="gold-liquid-btn-icon" aria-hidden="true">
              <Icon name="spark" size={18} />
            </span>
            Entrar a Recursos Gold <Icon name="arrow" size={18} />
          </button>
        </div>

        <div className="gold-teaser-tags" aria-hidden="true">
          {GOLD_LINKS.map((link, idx) => (
            <motion.span
              key={link.id}
              className="gold-teaser-tag"
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.45, delay: 0.15 + idx * 0.07 }}
            >
              <Icon name={link.icon} size={14} />
              {link.badge.replace("Canal WhatsApp · ", "").replace("Plataforma · ", "").replace("Grupo · ", "")}
            </motion.span>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
