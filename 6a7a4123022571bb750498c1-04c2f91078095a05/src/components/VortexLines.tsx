import { useEffect, useRef } from "react";

/**
 * Fondo "vórtice": hiperboloide dibujado con líneas finas que giran lentamente,
 * al estilo del hero de referencia. Canvas puro, sin dependencias.
 */

type VortexLinesProps = {
  /** Número de hebras del hiperboloide. */
  strands?: number;
  /** Velocidad de giro. */
  speed?: number;
  className?: string;
};

export default function VortexLines({ strands = 150, speed = 0.12, className }: VortexLinesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let width = 0;
    let height = 0;
    let dpr = 1;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const observer = new ResizeObserver(resize);
    observer.observe(canvas);

    let raf = 0;
    let t = 0;

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;
      const rx = Math.min(width * 0.42, 620);
      const ry = rx * 0.2; // aplanado de la elipse (perspectiva)
      const halfH = height * 0.52;
      const twist = 2.15; // apertura del hiperboloide

      for (let i = 0; i < strands; i += 1) {
        const base = (i / strands) * Math.PI * 2 + t;
        const topX = cx + Math.cos(base) * rx;
        const topY = cy - halfH + Math.sin(base) * ry;
        const botAngle = base + twist;
        const botX = cx + Math.cos(botAngle) * rx;
        const botY = cy + halfH + Math.sin(botAngle) * ry * 1.9;

        // Profundidad: las hebras "de atrás" se ven más tenues.
        const depth = (Math.sin(base + twist / 2) + 1) / 2;
        const alpha = 0.05 + depth * 0.32;

        // Paleta del sitio: vino en los extremos, naranja encendido en el talle.
        const gradient = ctx.createLinearGradient(topX, topY, botX, botY);
        gradient.addColorStop(0, `rgba(140,31,54,${alpha * 0.55})`);
        gradient.addColorStop(0.35, `rgba(216,118,62,${alpha * 0.8})`);
        gradient.addColorStop(0.5, `rgba(243,160,102,${alpha})`);
        gradient.addColorStop(0.65, `rgba(216,118,62,${alpha * 0.8})`);
        gradient.addColorStop(1, `rgba(140,31,54,${alpha * 0.5})`);

        ctx.beginPath();
        ctx.moveTo(topX, topY);
        // Curva suave que estrecha el talle en el centro.
        ctx.quadraticCurveTo(cx + (topX + botX - 2 * cx) * 0.16, cy, botX, botY);
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 0.65;
        ctx.stroke();
      }

      if (!reduce) {
        t += speed * 0.004;
        raf = requestAnimationFrame(draw);
      }
    };

    draw();

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
    };
  }, [strands, speed]);

  return <canvas ref={canvasRef} className={className ?? "vortex-canvas"} aria-hidden="true" />;
}
