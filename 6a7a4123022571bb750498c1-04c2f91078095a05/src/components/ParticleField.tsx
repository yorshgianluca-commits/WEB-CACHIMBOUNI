import { useEffect, useRef } from "react";

type ParticleFieldProps = {
  density?: number;
  parallax?: number;
  className?: string;
};

type Particle = {
  x: number;
  y: number;
  radius: number;
  speed: number;
  drift: number;
  alpha: number;
  warm: boolean;
  twinkle: number;
};

export default function ParticleField({
  density = 100,
  parallax = 22,
  className = "particle-canvas",
}: ParticleFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const total = reduceMotion ? Math.round(density * 0.35) : density;

    let frame = 0;
    let width = 0;
    let height = 0;
    let pointerX = 0;
    let pointerY = 0;
    let targetX = 0;
    let targetY = 0;
    let tick = 0;

    const particles: Particle[] = Array.from({ length: total }, (_, index) => ({
      x: Math.random(),
      y: Math.random(),
      radius: Math.random() * 1.5 + 0.25,
      speed: Math.random() * 0.0002 + 0.00004,
      drift: (Math.random() - 0.5) * 0.00015,
      alpha: Math.random() * 0.65 + 0.2,
      warm: index % 5 === 0,
      twinkle: Math.random() * Math.PI * 2,
    }));

    const resize = () => {
      const parent = canvas.parentElement;
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      width = parent?.clientWidth ?? window.innerWidth;
      height = parent?.clientHeight ?? window.innerHeight;
      canvas.width = Math.max(1, Math.floor(width * ratio));
      canvas.height = Math.max(1, Math.floor(height * ratio));
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    };

    const onPointerMove = (event: PointerEvent) => {
      targetX = event.clientX / window.innerWidth - 0.5;
      targetY = event.clientY / window.innerHeight - 0.5;
    };

    const render = () => {
      tick += 0.01;
      pointerX += (targetX - pointerX) * 0.05;
      pointerY += (targetY - pointerY) * 0.05;
      ctx.clearRect(0, 0, width, height);

      for (let index = 0; index < particles.length; index += 1) {
        const particle = particles[index];
        if (!reduceMotion) {
          particle.y -= particle.speed;
          particle.x += particle.drift;
          if (particle.y < -0.03) particle.y = 1.03;
          if (particle.x < -0.03) particle.x = 1.03;
          if (particle.x > 1.03) particle.x = -0.03;
        }

        const depth = (index % 7) / 7 + 0.25;
        const flicker = reduceMotion ? 1 : 0.75 + Math.sin(tick * 2 + particle.twinkle) * 0.25;
        const x = particle.x * width + pointerX * parallax * depth;
        const y = particle.y * height + pointerY * (parallax * 0.65) * depth;

        ctx.beginPath();
        ctx.fillStyle = particle.warm
          ? `rgba(236, 141, 75, ${particle.alpha * flicker})`
          : `rgba(230, 237, 238, ${particle.alpha * flicker})`;
        ctx.arc(x, y, particle.radius * depth, 0, Math.PI * 2);
        ctx.fill();
      }

      if (!reduceMotion) frame = requestAnimationFrame(render);
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    render();

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointerMove);
    };
  }, [density, parallax]);

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
}
