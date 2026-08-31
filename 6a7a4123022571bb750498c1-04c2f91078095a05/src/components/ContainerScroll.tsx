import { useEffect, useRef, useState } from "react";
import Icon from "./Icon";

type ContainerScrollProps = {
  title: React.ReactNode;
  subtitle: string;
  children: React.ReactNode;
};

export default function ContainerScroll({ title, subtitle, children }: ContainerScrollProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(6);
  const [scale, setScale] = useState(0.96);
  const [settled, setSettled] = useState(false);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) {
      setSettled(true);
      return;
    }

    let frame = 0;

    const handleScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const node = containerRef.current;
        if (!node) return;

        const rect = node.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        const start = windowHeight;
        const end = -rect.height;
        const progress = Math.max(0, Math.min(1, (start - rect.top) / (start - end)));

        // Una vez que el contenedor entra en cuadro, el panel queda totalmente plano.
        // Esto es clave: si el panel conserva rotación, el área clickeable de las
        // tarjetas deja de coincidir con lo que se ve en pantalla.
        if (progress >= 0.34) {
          setSettled(true);
          setRotateX(0);
          setScale(1);
          return;
        }

        setSettled(false);
        const eased = progress / 0.34;
        setRotateX(Number((6 - eased * 6).toFixed(2)));
        setScale(Number((0.96 + eased * 0.04).toFixed(3)));
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="scroll-container-wrapper" ref={containerRef}>
      <div className="scroll-header-section">
        <span className="scroll-kicker">{subtitle}</span>
        <h1 className="scroll-title">{title}</h1>
      </div>

      <div className="scroll-perspective-box">
        <div
          className={settled ? "scroll-3d-card is-settled" : "scroll-3d-card"}
          style={
            settled
              ? undefined
              : {
                  transform: `perspective(1200px) rotateX(${rotateX}deg) scale(${scale})`,
                }
          }
        >
          <div className="scroll-card-header">
            <div className="scroll-card-dots">
              <span className="dot dot--red" />
              <span className="dot dot--yellow" />
              <span className="dot dot--green" />
            </div>
            <div className="scroll-card-address">
              <Icon name="bookmark" size={12} />
              <span>cachimbouni.pe/guia-audiovisual</span>
            </div>
            <div className="scroll-card-actions">
              <span className="glow-bullet" />
              <span className="glow-text">LIVE</span>
            </div>
          </div>

          <div className="scroll-card-body">{children}</div>
        </div>
      </div>
    </div>
  );
}
