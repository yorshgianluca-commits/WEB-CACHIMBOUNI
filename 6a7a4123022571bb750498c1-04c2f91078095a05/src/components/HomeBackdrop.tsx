import { useEffect, useRef } from "react";

/**
 * HomeBackdrop — "cámara continua" de la home.
 *
 * En vez de que cada sección tenga su propio fondo, existe UN solo sistema de
 * geometría fijo detrás de toda la página. Es siempre el mismo objeto: unas
 * hebras de puntos que se transforman según dónde estés en el scroll.
 *
 *   Escena 1 · vórtice      → las hebras forman el hiperboloide (01 · Método)
 *   Escena 2 · esquirlas    → se rompen en cristales flotantes (02 · La Ruta)
 *   Escena 3 · rejilla      → se ordenan en celdas (03 · Biblioteca)
 *   Escena 4 · constelación → se dispersan en puntos con líneas (05/06)
 *
 * Como la geometría nunca se destruye —solo cambia de forma— el paso de una
 * sección a otra se ve como un movimiento continuo y no como un corte.
 */

const STRANDS = 110; // hebras
const NODES = 6; // puntos por hebra

type Scene = "vortex" | "shards" | "grid" | "constellation";

const SCENES: { at: number; scene: Scene }[] = [
  { at: 0.0, scene: "vortex" },
  { at: 0.26, scene: "shards" },
  { at: 0.52, scene: "grid" },
  { at: 0.78, scene: "constellation" },
];

const smoothstep = (a: number, b: number, x: number) => {
  const t = Math.max(0, Math.min(1, (x - a) / Math.max(0.0001, b - a)));
  return t * t * (3 - 2 * t);
};

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

type Pt = { x: number; y: number };

export default function HomeBackdrop({ targetId = "home-flow" }: { targetId?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const progressRef = useRef(0);
  const smoothProgress = useRef(0);
  /** 0 mientras se ve el hero, 1 cuando la cámara ya debe estar en pantalla. */
  const visibilityRef = useRef(0);
  const smoothVisibility = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let width = 0;
    let height = 0;

    const resize = () => {
      // El canvas es sticky dentro de .home-flow: se mide por su caja real.
      const rect = canvas.getBoundingClientRect();
      width = rect.width || window.innerWidth;
      height = rect.height || window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    // Semillas estables por hebra (para que cada una tenga su carácter propio).
    const seeds = Array.from({ length: STRANDS }, () => ({
      a: Math.random(),
      b: Math.random(),
      c: Math.random(),
      d: Math.random(),
    }));

    const onScroll = () => {
      const host = document.getElementById(targetId);
      if (!host) return;
      const rect = host.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      progressRef.current = Math.max(0, Math.min(1, -rect.top / Math.max(1, total)));

      // El lienzo es fixed, así que también se vería sobre el hero. Solo aparece
      // cuando la sección 01 empieza a entrar, y se va al salir por abajo.
      const vh = window.innerHeight;
      const entering = smoothstep(vh * 0.92, vh * 0.35, rect.top);
      const leaving = smoothstep(0, vh * 0.5, rect.bottom);
      visibilityRef.current = Math.min(entering, leaving);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    onScroll();

    // ---- Posición de cada punto en cada escena ----
    const posVortex = (s: number, k: number, t: number): Pt => {
      const cx = width / 2;
      const cy = height / 2;
      const rx = Math.min(width * 0.42, 560);
      const halfH = height * 0.52;
      const u = k / (NODES - 1); // 0..1 de arriba a abajo
      const base = (s / STRANDS) * Math.PI * 2 + t * 0.18;
      const ang = base + u * 2.15; // torsión que crea el talle
      // Perfil de hiperboloide: estrecho en el centro, ancho en los extremos.
      const profile = 0.34 + Math.abs(u - 0.5) * 2 * 0.66;
      return {
        x: cx + Math.cos(ang) * rx * profile,
        y: cy + (u - 0.5) * 2 * halfH + Math.sin(ang) * rx * 0.16 * profile,
      };
    };

    const posShards = (s: number, k: number, t: number): Pt => {
      const sd = seeds[s];
      // Cada hebra es ahora una esquirla flotante.
      const driftX = ((sd.a * 1.6 + t * 0.06 * (0.4 + sd.b)) % 1.6) - 0.3;
      const cx = driftX * width;
      const cy = (sd.b * 1.1 - 0.05) * height + Math.sin(t * 0.5 + sd.c * 6.28) * height * 0.05;
      const size = (14 + sd.c * 34) * (width < 700 ? 0.7 : 1);
      const rot = t * 0.25 * (sd.d > 0.5 ? 1 : -1) + sd.d * 6.28;
      // Los puntos se reparten sobre el contorno de un cristal alargado.
      const ang = (k / NODES) * Math.PI * 2 + rot;
      const r = k % 2 === 0 ? size : size * 0.42;
      return { x: cx + Math.cos(ang) * r * 1.5, y: cy + Math.sin(ang) * r };
    };

    const posGrid = (s: number, k: number, t: number): Pt => {
      const cols = width < 700 ? 6 : 11;
      const rows = Math.ceil(STRANDS / cols);
      const col = s % cols;
      const row = Math.floor(s / cols);
      const gw = width / cols;
      const gh = (height * 0.92) / rows;
      const cx = gw * (col + 0.5);
      const cy = height * 0.04 + gh * (row + 0.5) + Math.sin(t * 0.6 + s) * 3;
      const cell = Math.min(gw, gh) * 0.3;
      // Los puntos forman un pequeño cuadrado (celda).
      const ang = (k / NODES) * Math.PI * 2 + Math.PI / 4;
      return { x: cx + Math.cos(ang) * cell, y: cy + Math.sin(ang) * cell };
    };

    const posConstellation = (s: number, k: number, t: number): Pt => {
      const sd = seeds[s];
      const cx = (sd.a * 1.05 - 0.02) * width + Math.sin(t * 0.3 + sd.c * 6.28) * 22;
      const cy = (sd.c * 1.05 - 0.02) * height + Math.cos(t * 0.26 + sd.a * 6.28) * 22;
      // Casi colapsadas: puntos muy juntos, como estrellas.
      const r = 1.6 + sd.d * 3;
      const ang = (k / NODES) * Math.PI * 2;
      return { x: cx + Math.cos(ang) * r, y: cy + Math.sin(ang) * r };
    };

    const posFor = (scene: Scene, s: number, k: number, t: number): Pt => {
      switch (scene) {
        case "vortex":
          return posVortex(s, k, t);
        case "shards":
          return posShards(s, k, t);
        case "grid":
          return posGrid(s, k, t);
        default:
          return posConstellation(s, k, t);
      }
    };

    let raf = 0;
    let t = 0;

    const frame = () => {
      t += reduce ? 0 : 0.016;

      // Suavizado del scroll: la cámara "persigue" tu posición, nunca salta.
      smoothProgress.current += (progressRef.current - smoothProgress.current) * 0.07;
      const p = smoothProgress.current;

      // Aparición/desaparición suave para no invadir el hero.
      smoothVisibility.current += (visibilityRef.current - smoothVisibility.current) * 0.1;
      const vis = smoothVisibility.current;
      canvas.style.opacity = vis.toFixed(3);
      if (vis < 0.01) {
        ctx.clearRect(0, 0, width, height);
        raf = requestAnimationFrame(frame);
        return;
      }

      // Escena actual y siguiente + mezcla entre ambas.
      let idx = 0;
      for (let i = 0; i < SCENES.length; i += 1) if (p >= SCENES[i].at) idx = i;
      const cur = SCENES[idx];
      const nxt = SCENES[Math.min(SCENES.length - 1, idx + 1)];
      const span = (nxt.at || 1) - cur.at;
      const mix = idx === SCENES.length - 1 ? 0 : smoothstep(0, 1, (p - cur.at) / Math.max(0.0001, span));

      ctx.clearRect(0, 0, width, height);

      // Intensidad del trazo: más presente arriba, más sutil al final.
      const globalAlpha = lerp(1, 0.55, smoothstep(0.55, 1, p)) * vis;

      for (let s = 0; s < STRANDS; s += 1) {
        const pts: Pt[] = [];
        for (let k = 0; k < NODES; k += 1) {
          const a = posFor(cur.scene, s, k, t);
          const b = posFor(nxt.scene, s, k, t);
          pts.push({ x: lerp(a.x, b.x, mix), y: lerp(a.y, b.y, mix) });
        }

        const sd = seeds[s];
        const depth = 0.35 + sd.b * 0.65;
        const alpha = (0.06 + depth * 0.2) * globalAlpha;

        // Degradado de la paleta del sitio: vino → naranja → durazno.
        const grad = ctx.createLinearGradient(pts[0].x, pts[0].y, pts[NODES - 1].x, pts[NODES - 1].y);
        grad.addColorStop(0, `rgba(140,31,54,${alpha * 1.1})`);
        grad.addColorStop(0.5, `rgba(216,118,62,${alpha * 1.35})`);
        grad.addColorStop(1, `rgba(243,160,102,${alpha})`);

        ctx.beginPath();
        ctx.moveTo(pts[0].x, pts[0].y);
        for (let k = 1; k < NODES; k += 1) {
          const prev = pts[k - 1];
          const p2 = pts[k];
          ctx.quadraticCurveTo(prev.x, prev.y, (prev.x + p2.x) / 2, (prev.y + p2.y) / 2);
        }
        ctx.lineTo(pts[NODES - 1].x, pts[NODES - 1].y);
        ctx.strokeStyle = grad;
        ctx.lineWidth = lerp(0.7, 1.1, depth);
        ctx.stroke();

        // Nodo luminoso en la punta de cada hebra.
        if (sd.d > 0.72) {
          const tip = pts[NODES - 1];
          ctx.beginPath();
          ctx.arc(tip.x, tip.y, 1.2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(243,160,102,${alpha * 3})`;
          ctx.fill();
        }
      }

      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [targetId]);

  return <canvas ref={canvasRef} className="home-backdrop" aria-hidden="true" />;
}
