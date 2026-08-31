import { useEffect, useState } from "react";

const TIKTOK_URL = "https://www.tiktok.com/@yorish_vuca?_r=1&_t=ZS-98frvF4F3ky";
const TELEGRAM_URL = "https://t.me/JLumk?text=Decime";

/* Logo oficial de TikTok (doble capa cian + rojo + blanco) */
function TikTokLogo() {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      width="22"
      height="22"
      aria-hidden="true"
    >
      {/* sombra roja */}
      <path
        d="M31 7h-5.5v23.5a5 5 0 1 1-5-5v-5.7A10.7 10.7 0 1 0 31 30.5V18.8a16.3 16.3 0 0 0 9.5 3V16a9.5 9.5 0 0 1-9.5-9Z"
        fill="#ff2b55"
        transform="translate(1.4, 0.7)"
        opacity="0.9"
      />
      {/* sombra cian */}
      <path
        d="M31 7h-5.5v23.5a5 5 0 1 1-5-5v-5.7A10.7 10.7 0 1 0 31 30.5V18.8a16.3 16.3 0 0 0 9.5 3V16a9.5 9.5 0 0 1-9.5-9Z"
        fill="#69c9d0"
        transform="translate(-1.4, -0.7)"
        opacity="0.9"
      />
      {/* capa blanca principal */}
      <path
        d="M31 7h-5.5v23.5a5 5 0 1 1-5-5v-5.7A10.7 10.7 0 1 0 31 30.5V18.8a16.3 16.3 0 0 0 9.5 3V16a9.5 9.5 0 0 1-9.5-9Z"
        fill="white"
      />
    </svg>
  );
}

function TelegramLogo() {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      width="23"
      height="23"
      aria-hidden="true"
    >
      <circle cx="24" cy="24" r="22" fill="#2AABEE" />
      <path
        d="M34.8 14.7 30.9 33c-.3 1.3-1.1 1.6-2.2 1l-6-4.4-2.9 2.8c-.3.3-.6.6-1.3.6l.5-6.1 11.2-10.1c.5-.4-.1-.7-.8-.3L15.6 25.2l-6-1.9c-1.3-.4-1.3-1.3.3-1.9l23.4-9c1.1-.4 2 .3 1.5 2.3Z"
        fill="white"
      />
    </svg>
  );
}

export default function TikTokFloat() {
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [telegramHovered, setTelegramHovered] = useState(false);

  /* aparece después de 800 ms para no interrumpir la entrada de la página */
  useEffect(() => {
    const timer = window.setTimeout(() => setVisible(true), 800);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <>
      <a
        href={TELEGRAM_URL}
        target="_blank"
        rel="noreferrer noopener"
        aria-label="Escríbeme por Telegram"
        className={`telegram-float${visible ? " is-visible" : ""}${telegramHovered ? " is-hovered" : ""}`}
        onMouseEnter={() => setTelegramHovered(true)}
        onMouseLeave={() => setTelegramHovered(false)}
        onFocus={() => setTelegramHovered(true)}
        onBlur={() => setTelegramHovered(false)}
      >
        <span className="tiktok-label" aria-hidden="true">
          <span className="tiktok-handle">@JLumk</span>
          <span className="tiktok-sub telegram-sub">Telegram</span>
        </span>

        <span className="tiktok-circle telegram-circle">
          <span className="tiktok-ring telegram-ring" aria-hidden="true" />
          <TelegramLogo />
        </span>
      </a>

      <a
        href={TIKTOK_URL}
        target="_blank"
        rel="noreferrer noopener"
        aria-label="Sígueme en TikTok @yorish_vuca"
        className={`tiktok-float${visible ? " is-visible" : ""}${hovered ? " is-hovered" : ""}`}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onFocus={() => setHovered(true)}
        onBlur={() => setHovered(false)}
      >
        <span className="tiktok-label" aria-hidden="true">
          <span className="tiktok-handle">@yorish_vuca</span>
          <span className="tiktok-sub">TikTok</span>
        </span>

        <span className="tiktok-circle">
          <span className="tiktok-ring" aria-hidden="true" />
          <TikTokLogo />
        </span>
      </a>
    </>
  );
}
