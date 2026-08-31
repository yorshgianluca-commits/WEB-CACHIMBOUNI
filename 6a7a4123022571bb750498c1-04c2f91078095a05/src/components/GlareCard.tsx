import { useRef, type MouseEvent } from "react";
import Icon from "./Icon";

type Props = {
  image: string;
  eyebrow: string;
  title: string;
  description: string;
  action?: string;
  onClick?: () => void;
  href?: string;
  variant?: "portrait" | "landscape";
};

export default function GlareCard({
  image,
  eyebrow,
  title,
  description,
  action = "Explorar",
  onClick,
  href,
  variant = "portrait",
}: Props) {
  const cardRef = useRef<HTMLButtonElement>(null);

  const move = (event: MouseEvent<HTMLElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;
    const rotateY = (x - 0.5) * 17;
    const rotateX = (0.5 - y) * 15;
    card.style.setProperty("--glare-x", `${x * 100}%`);
    card.style.setProperty("--glare-y", `${y * 100}%`);
    card.style.setProperty("--glare-rx", `${rotateX}deg`);
    card.style.setProperty("--glare-ry", `${rotateY}deg`);
    card.style.setProperty("--glare-opacity", "1");
  };

  const leave = () => {
    const card = cardRef.current;
    if (!card) return;
    card.style.setProperty("--glare-rx", "0deg");
    card.style.setProperty("--glare-ry", "0deg");
    card.style.setProperty("--glare-opacity", "0");
  };

  const content = (
    <>
      <img className="glare-card-image" src={image} alt="" />
      <span className="glare-card-shade" aria-hidden="true" />
      <span className="glare-card-light" aria-hidden="true" />
      <span className="glare-card-rainbow" aria-hidden="true" />
      <span className="glare-card-border" aria-hidden="true" />
      <span className="glare-card-copy">
        <small>{eyebrow}</small>
        <strong>{title}</strong>
        <em>{description}</em>
        <span className="glare-card-action">
          {action} <Icon name={href ? "external" : "arrow"} size={15} />
        </span>
      </span>
    </>
  );

  return (
    <button
      ref={cardRef}
      className={`glare-card glare-card--${variant}`}
      onMouseMove={move}
      onMouseLeave={leave}
      style={{ ["--glare-image" as string]: `url("${image}")` }}
      type="button"
      onClick={() => {
        if (href) window.open(href, "_blank", "noopener,noreferrer");
        else onClick?.();
      }}
    >
      {content}
    </button>
  );
}