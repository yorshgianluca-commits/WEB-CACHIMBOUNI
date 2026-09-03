export type Theme = "dark" | "light";

const STORAGE_KEY = "cachimbo-theme";
const THEME_EVENT = "cachimbo:theme";

/** El dark es el tema por defecto y el look original de la site. */
export function getInitialTheme(): Theme {
  if (typeof window === "undefined") return "dark";
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "light" || stored === "dark") return stored;
  } catch {
    /* storage bloqueado → dark */
  }
  return "dark";
}

export function currentTheme(): Theme {
  if (typeof document === "undefined") return "dark";
  return document.documentElement.dataset.theme === "light" ? "light" : "dark";
}

export function applyTheme(theme: Theme) {
  const root = document.documentElement;
  root.dataset.theme = theme;
  root.style.colorScheme = theme === "light" ? "light" : "dark";
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute("content", theme === "light" ? "#eef2f9" : "#080b0d");
  window.dispatchEvent(new CustomEvent(THEME_EVENT, { detail: theme }));
}

export function setTheme(theme: Theme) {
  try {
    window.localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    /* sin persistencia */
  }
  applyTheme(theme);
}

export function toggleTheme(): Theme {
  const next: Theme = currentTheme() === "light" ? "dark" : "light";
  setTheme(next);
  return next;
}

export function initTheme() {
  applyTheme(getInitialTheme());
}

/** Suscripción a cambios de tema. Devuelve la función para desuscribirse. */
export function onThemeChange(callback: (theme: Theme) => void): () => void {
  const handler = () => callback(currentTheme());
  window.addEventListener(THEME_EVENT, handler as EventListener);
  return () => window.removeEventListener(THEME_EVENT, handler as EventListener);
}

/**
 * Alterna el tema con una transición de vista circular que nace desde el
 * botón (cuando el navegador soporta View Transitions).
 */
export function toggleThemeWithTransition(origin?: HTMLElement | null) {
  const doc = document as Document & { startViewTransition?: (cb: () => void) => void };
  if (origin && typeof doc.startViewTransition === "function") {
    const rect = origin.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    document.documentElement.style.setProperty("--lx-xt", `${x}px`);
    document.documentElement.style.setProperty("--lx-yt", `${y}px`);
    doc.startViewTransition(() => toggleTheme());
    return;
  }
  toggleTheme();
}
