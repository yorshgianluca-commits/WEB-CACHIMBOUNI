import { useEffect, useRef } from "react";

/**
 * DitherWave — onda animada con tramado retro (dithering Bayer 8×8).
 *
 * Equivalente propio del componente "Dither Wave" de React Bits Pro, que
 * requiere licencia. Se calcula un campo de ondas superpuestas y se cuantiza
 * con una matriz de Bayer, lo que produce el patrón de puntos característico
 * de los gráficos de 8/16 bits en lugar de un degradado suave.
 */

export type DitherWaveProps = {
  /** Color de fondo (zonas apagadas). */
  background?: string;
  /** Color de la cresta de la onda. */
  color?: string;
  /** Color de acento para los picos más altos. */
  accent?: string;
  /** Tamaño del "píxel" del tramado. Más alto = más retro. */
  pixelSize?: number;
  /** Velocidad de la animación. */
  speed?: number;
  /** Amplitud/contraste de la onda. */
  amplitude?: number;
  /** Escala de la onda (frecuencia). */
  scale?: number;
  className?: string;
};

/** Matriz de Bayer 8×8 normalizada: el umbral de cada píxel del tramado. */
const BAYER = [
  [0, 32, 8, 40, 2, 34, 10, 42],
  [48, 16, 56, 24, 50, 18, 58, 26],
  [12, 44, 4, 36, 14, 46, 6, 38],
  [60, 28, 52, 20, 62, 30, 54, 22],
  [3, 35, 11, 43, 1, 33, 9, 41],
  [51, 19, 59, 27, 49, 17, 57, 25],
  [15, 47, 7, 39, 13, 45, 5, 37],
  [63, 31, 55, 23, 61, 29, 53, 21],
].map((row) => row.map((v) => (v + 0.5) / 64));

const hexToRgb = (hex: string): [number, number, number] => {
  const c = hex.replace("#", "");
  const full = c.length === 3 ? c.split("").map((x) => x + x).join("") : c;
  const n = parseInt(full, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};

export default function DitherWave({
  background = "#080b0d",
  color = "#d8763e",
  accent = "#f3a066",
  pixelSize = 3,
  speed = 1,
  amplitude = 1,
  scale = 1,
  className,
}: DitherWaveProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const bg = hexToRgb(background);
    const mid = hexToRgb(color);
    const hi = hexToRgb(accent);

    // Se renderiza a baja resolución y se escala: así el "píxel" es grande y
    // el coste de cálculo se mantiene bajo.
    let cols = 0;
    let rows = 0;
    let image: ImageData | null = null;

    const buffer = document.createElement("canvas");
    const bctx = buffer.getContext("2d");

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const w = Math.max(1, Math.floor(rect.width));
      const h = Math.max(1, Math.floor(rect.height));
      cols = Math.max(1, Math.ceil(w / pixelSize));
      rows = Math.max(1, Math.ceil(h / pixelSize));
      buffer.width = cols;
      buffer.height = rows;
      canvas.width = w;
      canvas.height = h;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      image = bctx?.createImageData(cols, rows) ?? null;
      // Sin suavizado: los píxeles deben verse duros.
      ctx.imageSmoothingEnabled = false;
    };
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);

    let raf = 0;
    let t = 0;

    const frame = () => {
      if (!image || !bctx) {
        raf = requestAnimationFrame(frame);
        return;
      }

      if (!reduce) t += 0.016 * speed;

      const data = image.data;
      const fx = (2.6 * scale) / cols;
      const fy = (3.4 * scale) / rows;

      for (let y = 0; y < rows; y += 1) {
        const by = BAYER[y & 7];
        for (let x = 0; x < cols; x += 1) {
          // Suma de ondas: da un campo orgánico en movimiento.
          const nx = x * fx;
          const ny = y * fy;
          let v =
            Math.sin(nx * 2.0 + t * 1.1) * 0.5 +
            Math.sin(ny * 1.7 - t * 0.8) * 0.35 +
            Math.sin((nx + ny) * 1.3 + t * 0.6) * 0.4 +
            Math.sin(Math.hypot(nx - 1.4, ny - 1.1) * 2.4 - t * 1.4) * 0.45;

          // Normalizado a 0..1 y con caída vertical (más denso abajo).
          v = v / 1.7;
          v = (v + 1) * 0.5;
          v *= 0.45 + (y / rows) * 0.85;
          v = Math.max(0, Math.min(1, v * amplitude));

          // Tramado: se compara contra el umbral de Bayer y se cuantiza a
          // tres niveles (fondo, color, acento).
          const threshold = by[x & 7];
          let r: number;
          let g: number;
          let b: number;

          if (v > threshold * 0.62 + 0.52) {
            [r, g, b] = hi;
          } else if (v > threshold * 0.85) {
            [r, g, b] = mid;
          } else {
            [r, g, b] = bg;
          }

          const i = (y * cols + x) * 4;
          data[i] = r;
          data[i + 1] = g;
          data[i + 2] = b;
          data[i + 3] = 255;
        }
      }

      bctx.putImageData(image, 0, 0);
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(buffer, 0, 0, cols, rows, 0, 0, canvas.width, canvas.height);

      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
    };
  }, [background, color, accent, pixelSize, speed, amplitude, scale]);

  return <canvas ref={canvasRef} className={className ?? "dither-wave"} aria-hidden="true" />;
}
