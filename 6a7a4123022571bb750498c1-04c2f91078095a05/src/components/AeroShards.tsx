import { useEffect, useRef } from "react";

/**
 * AeroShards — campo de esquirlas de cristal flotando en el aire.
 *
 * Implementación propia en canvas 2D (sin dependencias externas) que respeta
 * la API de props del componente original: color, flujo, material, densidad,
 * turbulencia, glow, bloom, grano, aberración cromática e interacción con el
 * puntero (repel / attract / gather al mantener pulsado).
 */

export type AeroShardsProps = {
  backgroundColor?: string;
  shardColor?: string;
  accentColor?: string;
  /** Cómo se reparten las esquirlas en el lienzo. */
  placement?: "full" | "left" | "right" | "center";
  /** Patrón de movimiento. */
  flow?: "stream" | "orbit" | "drift";
  /** Acabado del cristal. */
  material?: "pearl" | "glass" | "metal";
  /** Cantidad base de geometría. */
  detail?: "low" | "balanced" | "high";
  effect?: "none" | "pulse";
  scale?: number;
  spread?: number;
  depth?: number;
  speed?: number;
  spin?: number;
  interaction?: "none" | "repel" | "attract";
  density?: number;
  shardSize?: number;
  stretch?: number;
  turbulence?: number;
  glow?: number;
  edgeSoftness?: number;
  bloom?: number;
  grain?: number;
  chromaticAberration?: number;
  transitionDuration?: number;
  interactionRadius?: number;
  interactionStrength?: number;
  rippleIntensity?: number;
  holdToGather?: boolean;
  paused?: boolean;
  className?: string;
};

type Shard = {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  size: number;
  rot: number;
  vrot: number;
  sides: number;
  seed: number;
  accent: boolean;
  ox: number;
  oy: number;
};

const DETAIL_COUNT: Record<string, number> = { low: 34, balanced: 62, high: 96 };

function hexToRgb(hex: string): [number, number, number] {
  const clean = hex.replace("#", "");
  const full =
    clean.length === 3
      ? clean
          .split("")
          .map((c) => c + c)
          .join("")
      : clean;
  const int = parseInt(full, 16);
  return [(int >> 16) & 255, (int >> 8) & 255, int & 255];
}

export default function AeroShards({
  backgroundColor = "#0b0e10",
  shardColor = "#d8763e",
  accentColor = "#f3a066",
  placement = "full",
  flow = "stream",
  material = "pearl",
  detail = "balanced",
  effect = "none",
  scale = 1,
  spread = 1,
  depth = 1,
  speed = 1,
  spin = 1,
  interaction = "repel",
  density = 1.5,
  shardSize = 1.1,
  stretch = 1,
  turbulence = 1,
  glow = 1,
  edgeSoftness = 2,
  bloom = 0.5,
  grain = 0.05,
  chromaticAberration = 0.0075,
  transitionDuration = 1,
  interactionRadius = 1.5,
  interactionStrength = 0.5,
  rippleIntensity = 1,
  holdToGather = true,
  paused = false,
  className,
}: AeroShardsProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointer = useRef({ x: -9999, y: -9999, active: false, held: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const shardRgb = hexToRgb(shardColor);
    const accentRgb = hexToRgb(accentColor);

    let width = 0;
    let height = 0;
    let shards: Shard[] = [];
    let fade = 0; // fundido de entrada (transitionDuration)

    const placementBand = () => {
      switch (placement) {
        case "left":
          return [0, 0.55];
        case "right":
          return [0.45, 1];
        case "center":
          return [0.2, 0.8];
        default:
          return [0, 1];
      }
    };

    const build = () => {
      const [from, to] = placementBand();
      const count = Math.round(DETAIL_COUNT[detail] * density);
      const base = Math.min(width, height);
      shards = Array.from({ length: count }, () => {
        const z = 0.35 + Math.random() * depth;
        const x = width * (from + Math.random() * (to - from));
        const y = Math.random() * height;
        return {
          x,
          y,
          ox: x,
          oy: y,
          z,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          size: (base * 0.035 + Math.random() * base * 0.055) * shardSize * scale * z,
          rot: Math.random() * Math.PI * 2,
          vrot: (Math.random() - 0.5) * 0.01 * spin,
          sides: Math.random() > 0.55 ? 3 : 4,
          seed: Math.random() * 1000,
          accent: Math.random() < 0.22,
        };
      });
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      build();
    };

    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);

    // Textura de grano pre-renderizada (barata de repetir).
    const grainCanvas = document.createElement("canvas");
    grainCanvas.width = 160;
    grainCanvas.height = 160;
    const gctx = grainCanvas.getContext("2d");
    if (gctx) {
      const img = gctx.createImageData(160, 160);
      for (let i = 0; i < img.data.length; i += 4) {
        const v = Math.random() * 255;
        img.data[i] = v;
        img.data[i + 1] = v;
        img.data[i + 2] = v;
        img.data[i + 3] = 255;
      }
      gctx.putImageData(img, 0, 0);
    }

    const drawShard = (s: Shard, t: number, alphaMul: number) => {
      const rgb = s.accent ? accentRgb : shardRgb;
      const w = s.size * (1 + (stretch - 1) * 0.6);
      const h = s.size * 0.72;

      ctx.save();
      ctx.translate(s.x, s.y);
      ctx.rotate(s.rot);

      const pulse = effect === "pulse" ? 1 + Math.sin(t * 2 + s.seed) * 0.08 : 1;
      ctx.scale(pulse, pulse);

      // Silueta de la esquirla (triángulo o cuarzo de 4 caras).
      const path = new Path2D();
      if (s.sides === 3) {
        path.moveTo(0, -h);
        path.lineTo(w * 0.62, h * 0.75);
        path.lineTo(-w * 0.5, h * 0.6);
      } else {
        path.moveTo(0, -h);
        path.lineTo(w * 0.55, -h * 0.15);
        path.lineTo(w * 0.2, h);
        path.lineTo(-w * 0.5, h * 0.25);
      }
      path.closePath();

      const depthAlpha = (0.18 + s.z * 0.42) * alphaMul;

      // Relleno nacarado: degradado según el material elegido.
      const grad = ctx.createLinearGradient(-w, -h, w, h);
      if (material === "pearl") {
        grad.addColorStop(0, `rgba(255,255,255,${depthAlpha * 0.85})`);
        grad.addColorStop(0.45, `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${depthAlpha})`);
        grad.addColorStop(1, `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${depthAlpha * 0.18})`);
      } else if (material === "metal") {
        grad.addColorStop(0, `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${depthAlpha})`);
        grad.addColorStop(0.5, `rgba(255,255,255,${depthAlpha * 0.7})`);
        grad.addColorStop(1, `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${depthAlpha * 0.4})`);
      } else {
        grad.addColorStop(0, `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${depthAlpha * 0.55})`);
        grad.addColorStop(1, `rgba(255,255,255,${depthAlpha * 0.25})`);
      }

      // Glow / bloom alrededor de la esquirla.
      if (glow > 0) {
        ctx.shadowColor = `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${0.55 * glow * (0.5 + bloom)})`;
        ctx.shadowBlur = s.size * 0.9 * glow * (1 + bloom);
      }

      // Aberración cromática: dos copias desplazadas en R y B.
      if (chromaticAberration > 0) {
        const off = s.size * chromaticAberration * 12;
        ctx.globalCompositeOperation = "lighter";
        ctx.fillStyle = `rgba(140,31,54,${depthAlpha * 0.34})`;
        ctx.save();
        ctx.translate(-off, 0);
        ctx.fill(path);
        ctx.restore();
        ctx.fillStyle = `rgba(255,196,140,${depthAlpha * 0.3})`;
        ctx.save();
        ctx.translate(off, 0);
        ctx.fill(path);
        ctx.restore();
        ctx.globalCompositeOperation = "source-over";
      }

      ctx.fillStyle = grad;
      ctx.fill(path);

      ctx.shadowBlur = 0;

      // Filo brillante (edgeSoftness controla su nitidez).
      ctx.lineWidth = Math.max(0.4, 1.6 / Math.max(0.5, edgeSoftness));
      ctx.strokeStyle = `rgba(255,255,255,${depthAlpha * 1.15})`;
      ctx.stroke(path);

      ctx.restore();
    };

    let raf = 0;
    let t = 0;
    let last = performance.now();

    const frame = (now: number) => {
      const dt = Math.min(50, now - last) / 16.6667;
      last = now;

      if (!paused) t += 0.01 * speed * dt;
      fade = Math.min(1, fade + dt / (60 * Math.max(0.15, transitionDuration)));

      // Fondo
      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, width, height);

      // Halo de acento al fondo (bloom ambiental)
      if (bloom > 0) {
        const halo = ctx.createRadialGradient(
          width * 0.5,
          height * 0.45,
          0,
          width * 0.5,
          height * 0.45,
          Math.max(width, height) * 0.6
        );
        halo.addColorStop(0, `rgba(${accentRgb[0]},${accentRgb[1]},${accentRgb[2]},${0.16 * bloom})`);
        halo.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = halo;
        ctx.fillRect(0, 0, width, height);
      }

      const p = pointer.current;
      const radius = Math.min(width, height) * 0.35 * interactionRadius;

      // Orden por profundidad para una sensación 3D correcta.
      shards.sort((a, b) => a.z - b.z);

      for (const s of shards) {
        if (!paused && !reduce) {
          // Movimiento base según `flow`.
          if (flow === "stream") {
            s.vx += 0.012 * speed * s.z;
            s.vy += Math.sin(t * 1.3 + s.seed) * 0.006 * turbulence;
          } else if (flow === "orbit") {
            const ang = t * 0.5 + s.seed;
            s.vx += Math.cos(ang) * 0.01 * speed;
            s.vy += Math.sin(ang) * 0.01 * speed;
          } else {
            s.vx += Math.sin(t + s.seed) * 0.006 * turbulence;
            s.vy += Math.cos(t * 0.8 + s.seed) * 0.006 * turbulence;
          }

          // Interacción con el puntero.
          if (interaction !== "none" && p.active) {
            const dx = s.x - p.x;
            const dy = s.y - p.y;
            const dist = Math.hypot(dx, dy) || 1;
            if (dist < radius) {
              const force = (1 - dist / radius) * interactionStrength * 1.6;
              const gather = holdToGather && p.held;
              const dir = gather || interaction === "attract" ? -1 : 1;
              s.vx += (dx / dist) * force * dir;
              s.vy += (dy / dist) * force * dir;
              // Onda: acelera el giro cerca del cursor.
              s.vrot += (1 - dist / radius) * 0.004 * rippleIntensity * dir;
            }
          }

          s.vx *= 0.94;
          s.vy *= 0.94;
          s.x += s.vx * dt * spread;
          s.y += s.vy * dt * spread;
          s.rot += s.vrot * dt;
          s.vrot *= 0.985;

          // Reciclado por los bordes (bucle infinito).
          const m = s.size * 2;
          if (s.x > width + m) s.x = -m;
          if (s.x < -m) s.x = width + m;
          if (s.y > height + m) s.y = -m;
          if (s.y < -m) s.y = height + m;
        }

        drawShard(s, t, fade);
      }

      // Grano de película
      if (grain > 0 && gctx) {
        ctx.save();
        ctx.globalAlpha = grain * 1.6;
        ctx.globalCompositeOperation = "overlay";
        const pattern = ctx.createPattern(grainCanvas, "repeat");
        if (pattern) {
          ctx.fillStyle = pattern;
          ctx.fillRect(0, 0, width, height);
        }
        ctx.restore();
      }

      raf = requestAnimationFrame(frame);
    };

    raf = requestAnimationFrame(frame);

    // Puntero
    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.current.x = e.clientX - rect.left;
      pointer.current.y = e.clientY - rect.top;
      pointer.current.active = true;
    };
    const onLeave = () => {
      pointer.current.active = false;
      pointer.current.held = false;
    };
    const onDown = () => {
      pointer.current.held = true;
    };
    const onUp = () => {
      pointer.current.held = false;
    };

    const parent = canvas.parentElement ?? canvas;
    parent.addEventListener("pointermove", onMove);
    parent.addEventListener("pointerleave", onLeave);
    parent.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      parent.removeEventListener("pointermove", onMove);
      parent.removeEventListener("pointerleave", onLeave);
      parent.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
    };
  }, [
    backgroundColor,
    shardColor,
    accentColor,
    placement,
    flow,
    material,
    detail,
    effect,
    scale,
    spread,
    depth,
    speed,
    spin,
    interaction,
    density,
    shardSize,
    stretch,
    turbulence,
    glow,
    edgeSoftness,
    bloom,
    grain,
    chromaticAberration,
    transitionDuration,
    interactionRadius,
    interactionStrength,
    rippleIntensity,
    holdToGather,
    paused,
  ]);

  return <canvas ref={canvasRef} className={className ?? "aero-shards-canvas"} aria-hidden="true" />;
}
