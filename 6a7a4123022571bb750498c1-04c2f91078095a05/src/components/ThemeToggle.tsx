import { useEffect, useRef, useState } from "react";
import { currentTheme, onThemeChange, toggleThemeWithTransition } from "../lib/theme";

export default function ThemeToggle() {
  const [theme, setTheme] = useState(currentTheme());
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => onThemeChange(setTheme), []);

  const isLight = theme === "light";

  return (
    <button
      ref={buttonRef}
      type="button"
      className={`theme-toggle${isLight ? " is-light" : ""}`}
      role="switch"
      aria-checked={isLight}
      aria-label={isLight ? "Cambiar a modo oscuro" : "Cambiar a modo claro"}
      title={isLight ? "Cambiar a modo oscuro" : "Cambiar a modo claro"}
      onClick={() => toggleThemeWithTransition(buttonRef.current)}
    >
      <span className="theme-toggle-track" aria-hidden="true">
        <svg className="theme-toggle-icon theme-toggle-icon--sun" viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
          <circle cx="12" cy="12" r="4.2" />
          <path d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5 5l1.6 1.6M17.4 17.4 19 19M19 5l-1.6 1.6M6.6 17.4 5 19" />
        </svg>
        <svg className="theme-toggle-icon theme-toggle-icon--moon" viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20.4 14.2A8.5 8.5 0 0 1 9.8 3.6a8.5 8.5 0 1 0 10.6 10.6Z" />
        </svg>
        <span className="theme-toggle-knob" />
      </span>
    </button>
  );
}
