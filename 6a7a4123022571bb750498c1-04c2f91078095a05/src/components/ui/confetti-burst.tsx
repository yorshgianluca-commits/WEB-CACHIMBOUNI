import { useEffect, useRef } from "react";

/**
 * Confeti ligero en canvas (sin dependencias externas: evita react-confetti +
 * react-use). Se dispara una sola vez cuando `fire` pasa a true.
 */

type ConfettiBurstProps = {
  fire: boolean;
  pieces?: number;
  gravity?: number;
  colors?: string[];
};

type Piece = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  w: number;
  h: number;
  rot: number;
  vrot: number;
  color: string;
};

export default function ConfettiBurst({
  fire,
  pieces = 220,
  gravity = 0.12,
  colors = ["#f3a066", "#d8763e", "#8c1f36", "#e8e7e1", "#58d699", "#ffd479"],
}: ConfettiBurstProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const started = useRef(false);

  useEffect(() => {
    if (!fire || started.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    started.current = true;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const width = window.innerWidth;
    const height = window.innerHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.scale(dpr, dpr);

    const items: Piece[] = Array.from({ length: pieces }, () => ({
      x: width / 2 + (Math.random() - 0.5) * width * 0.5,
      y: height * 0.35 + (Math.random() - 0.5) * 60,
      vx: (Math.random() - 0.5) * 9,
      vy: Math.random() * -9 - 2,
      w: 5 + Math.random() * 6,
      h: 8 + Math.random() * 8,
      rot: Math.random() * Math.PI,
      vrot: (Math.random() - 0.5) * 0.25,
      color: colors[Math.floor(Math.random() * colors.length)],
    }));

    let raf = 0;
    let frames = 0;

    const tick = () => {
      frames += 1;
      ctx.clearRect(0, 0, width, height);
      let alive = false;
      for (const p of items) {
        p.vy += gravity;
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.995;
        p.rot += p.vrot;
        if (p.y < height + 40) alive = true;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0, 1 - frames / 320);
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
      }
      if (alive && frames < 320) {
        raf = requestAnimationFrame(tick);
      } else {
        ctx.clearRect(0, 0, width, height);
      }
    };
    raf = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(raf);
  }, [fire, pieces, gravity, colors]);

  if (!fire) return null;
  return <canvas ref={canvasRef} className="confetti-canvas" aria-hidden="true" />;
}
