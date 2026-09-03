import { useEffect, useState } from "react";
import { onThemeChange, currentTheme } from "../lib/theme";

/* =============================================================
 * LightFX — efectos EXCLUSIVOS del modo claro.
 * En dark no renderiza nada y no modifica el layout original.
 * ============================================================= */

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  hue: number;
  alpha: number;
};

const RING_COLORS = ["#7c5cff", "#22d3ee", "#ff6ec7"];
const REVEAL_SELECTOR = [
  ".section-index",
  ".eyebrow",
  ".manifesto-copy",
  ".method-step",
  ".metodo-highlight",
  ".subject-visual",
  ".subject-copy",
  ".teaser-head",
  ".teaser-box",
  ".teaser-stats",
  ".home-guia-inner",
  ".home-tools-inner",
  ".commitment-copy",
  ".uni-mark",
  ".final-cta > div",
  ".contact-cta",
  ".page-hero-inner",
  ".category-section-head",
  ".category-box",
  ".catalog-head",
  ".search-box",
  ".catalog-tabs",
  ".filter-bar",
  ".resource-box",
  ".collection-box",
  ".usage-box",
  ".usage-note",
  ".info-card",
  ".map-head",
  ".map-figure",
  ".map-columns",
  ".admission-cta > *",
  ".camino-hero-content",
  ".camino-card",
  ".camino-note",
  ".camino-cta-final > *",
  ".tools-hero-inner",
  ".tools-hero-visual",
  ".tools-showcase-head",
  ".tools-social-link",
  ".tools-filter-row",
  ".tools-list-item",
  ".tools-stage-card",
  ".tools-grid-head",
  ".tool-card",
  ".tools-projects-section > *",
  ".guia-hero-inner",
  ".glare-card",
  ".dashboard-layout",
  ".disclaimer-card",
  ".guia-usage-grid > div",
  ".video-card",
  ".faq-item",
  ".faq-footer",
  ".gold-head",
  ".gold-liquid-btn",
  ".gold-card",
  ".gold-note",
  ".gold-stat",
  ".gold-step",
  ".gold-final > *",
  ".map-copy",
].join(",");

export default function LightFX() {
  const [isLight, setIsLight] = useState(currentTheme() === "light");
  const [canHover] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(hover: hover) and (pointer: fine)").matches
  );

  useEffect(() => onThemeChange((theme) => setIsLight(theme === "light")), []);

  if (!isLight) return null;

  return (
    <>
      {/* Fondo aurora animado */}
      <div className="lx-aurora" aria-hidden="true">
        <i className="lx-blob lx-blob--a" />
        <i className="lx-blob lx-blob--b" />
        <i className="lx-blob lx-blob--c" />
        <i className="lx-grid" />
      </div>

      <ParticleNetworkFX />
      {canHover && <CursorAura />}
      <RevealFX />
    </>
  );
}

/* Red de partículas flotantes con conexiones y atracción al cursor */
function ParticleNetworkFX() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    const canvas = document.createElement("canvas");
    canvas.className = "lx-network lx-fx";
    canvas.setAttribute("aria-hidden", "true");
    document.body.appendChild(canvas);

    const ctx = canvas.getContext("2d");
    if (!ctx) return () => canvas.remove();

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    let width = 0;
    let height = 0;
    let raf = 0;
    let mouse = { x: -9999, y: -9999 };
    let particles: Particle[] = [];

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * ratio);
      canvas.height = Math.floor(height * ratio);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      const count = Math.min(70, Math.max(28, Math.floor((width * height) / 26000)));
      particles = Array.from({ length: count }, (_, i) => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.22,
        vy: (Math.random() - 0.5) * 0.22,
        r: Math.random() * 1.7 + 0.7,
        hue: [0, 1, 2][i % 3],
        alpha: Math.random() * 0.5 + 0.25,
      }));
    };

    const onMove = (event: PointerEvent) => {
      mouse.x = event.clientX;
      mouse.y = event.clientY;
    };
    const onLeave = () => {
      mouse.x = -9999;
      mouse.y = -9999;
    };

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      for (const p of particles) {
        if (!reduceMotion) {
          p.x += p.vx;
          p.y += p.vy;
          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const dist = Math.hypot(dx, dy);
          if (dist < 160 && dist > 0.01) {
            const force = (160 - dist) / 160;
            p.x -= (dx / dist) * force * 1.4;
            p.y -= (dy / dist) * force * 1.4;
          }
          if (p.x < -20) p.x = width + 20;
          if (p.x > width + 20) p.x = -20;
          if (p.y < -20) p.y = height + 20;
          if (p.y > height + 20) p.y = -20;
        }
        ctx.beginPath();
        ctx.fillStyle = RING_COLORS[p.hue];
        ctx.globalAlpha = p.alpha;
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }

      // líneas de conexión
      ctx.globalAlpha = 1;
      for (let i = 0; i < particles.length; i += 1) {
        for (let j = i + 1; j < particles.length; j += 1) {
          const a = particles[i];
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist2 = dx * dx + dy * dy;
          if (dist2 < 120 * 120) {
            const opacity = (1 - Math.sqrt(dist2) / 120) * 0.16;
            ctx.strokeStyle = `rgba(124, 92, 255, ${opacity})`;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      if (!reduceMotion) raf = requestAnimationFrame(render);
    };

    resize();
    render();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerleave", onLeave);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
      canvas.remove();
    };
  }, []);

  return null;
}

/* Halo luminoso que sigue al cursor */
function CursorAura() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const aura = document.createElement("div");
    aura.className = "lx-cursor-aura lx-fx";
    aura.setAttribute("aria-hidden", "true");
    document.body.appendChild(aura);

    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let tx = x;
    let ty = y;
    let scale = 1;
    let targetScale = 1;
    let raf = 0;

    const onMove = (event: PointerEvent) => {
      tx = event.clientX;
      ty = event.clientY;
      aura.style.opacity = "1";
    };
    const onOver = (event: PointerEvent) => {
      const el = event.target as Element | null;
      targetScale = el?.closest("a, button, [role='button']") ? 2.1 : 1;
    };

    const tick = () => {
      x += (tx - x) * 0.14;
      y += (ty - y) * 0.14;
      scale += (targetScale - scale) * 0.12;
      aura.style.transform = `translate3d(${x - 170 * scale}px, ${y - 170 * scale}px, 0) scale(${scale})`;
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerover", onOver, { passive: true });
    tick();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerover", onOver);
      aura.remove();
    };
  }, []);

  return null;
}

/* Reveal al hacer scroll con stagger */
function RevealFX() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const revealed = new WeakSet<HTMLElement>();

    const finishReveal = (el: HTMLElement) => {
      // Tras la animación quitamos las clases para no pisar transforms
      // propios de las tarjetas (tilt 3D, hover, etc.)
      el.classList.add("lx-reveal-in");
      const done = () => {
        el.classList.remove("lx-reveal", "lx-reveal-in");
      };
      el.addEventListener("transitionend", done, { once: true });
      window.setTimeout(done, 1600);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            finishReveal(entry.target as HTMLElement);
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
    );

    const scan = () => {
      const els = Array.from(document.querySelectorAll<HTMLElement>(REVEAL_SELECTOR));
      els.forEach((el) => {
        if (revealed.has(el) || el.classList.contains("lx-reveal")) return;
        revealed.add(el);
        el.classList.add("lx-reveal");
        const siblings = Array.from(el.parentElement?.children ?? []);
        const index = siblings.indexOf(el);
        const delay = Math.min(index, 6) * 70;
        el.style.setProperty("--lx-d", `${delay}ms`);
        observer.observe(el);
      });
    };

    // re-escanea cuando el router SPA cambia de página
    const domObserver = new MutationObserver(scan);
    domObserver.observe(document.body, { childList: true, subtree: true });

    scan();
    return () => {
      observer.disconnect();
      domObserver.disconnect();
    };
  }, []);

  return null;
}
