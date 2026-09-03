import { useEffect } from "react";
import HomePage from "./pages/HomePage";
import ResourcesPage from "./pages/ResourcesPage";
import RecursosGoldPage from "./pages/RecursosGoldPage";
import RutaUniPage from "./pages/RutaUniPage";
import GuiaPage from "./pages/GuiaPage";
import CaminoRapidoPage from "./pages/CaminoRapidoPage";
import ToolsStudyPage from "./pages/ToolsStudyPage";
import AyudaPage from "./pages/AyudaPage";
import NoticiasPage from "./pages/NoticiasPage";
import TikTokFloat from "./components/TikTokFloat";
import AuthGate from "./components/AuthGate";
import { AuthProvider, useAuth } from "./hooks/useAuth";
import { useHashRoute } from "./lib/router";
import type { CategoryId } from "./lib/data";

const VALID_CATEGORIES: CategoryId[] = ["teoria", "examenes", "libros", "videos"];

function AppShell() {
  const { path, navigate } = useHashRoute();
  const { loading, session } = useAuth();

  useEffect(() => {
    if (!window.location.hash) window.location.replace("#/");
  }, []);

  useEffect(() => {
    if (path.startsWith("/recursos-gold")) document.title = "Recursos Gold · CachimboUNI";
    else if (path.startsWith("/recursos")) document.title = "Recursos · CachimboUNI";
    else if (path.startsWith("/ruta-uni")) document.title = "Ruta UNI · CachimboUNI";
    else if (path.startsWith("/guia")) document.title = "Guía · Canales y Videos · CachimboUNI";
    else if (path.startsWith("/camino-rapido")) document.title = "El camino más rápido · CachimboUNI";
    else if (path.startsWith("/tools-study")) document.title = "Tools Study · CachimboUNI";
    else if (path.startsWith("/ayuda")) document.title = "Ayuda y Preguntas · CachimboUNI";
    else if (path.startsWith("/noticias")) document.title = "Noticias · CachimboUNI";
    else document.title = "CachimboUNI | Ingreso rápido a la UNI";
  }, [path]);

  // Mientras comprobamos la sesión, mostramos una pantalla de carga minimalista.
  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          background: "#080b0d",
          color: "#e8e7e1",
          fontFamily: "'Inter', sans-serif",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              width: 46,
              height: 46,
              margin: "0 auto 14px",
              border: "3px solid rgba(255,255,255,.18)",
              borderTopColor: "#f3a066",
              borderRadius: "50%",
              animation: "spin 0.9s linear infinite",
            }}
          />
          <p style={{ fontSize: 13, color: "#8b918e" }}>Cargando…</p>
        </div>
      </div>
    );
  }

  // Si no hay sesión activa, pedimos entrar con Google o como invitado.
  if (!session) {
    return <AuthGate />;
  }

  if (path.startsWith("/recursos-gold")) {
    return (
      <>
        <RecursosGoldPage navigate={navigate} path={path} />
        <TikTokFloat />
      </>
    );
  }

  if (path.startsWith("/recursos")) {
    const segment = path.split("/")[2] as CategoryId | undefined;
    const category = segment && VALID_CATEGORIES.includes(segment) ? segment : null;
    return (
      <>
        <ResourcesPage navigate={navigate} path={path} category={category} />
        <TikTokFloat />
      </>
    );
  }

  if (path.startsWith("/ruta-uni")) {
    return (
      <>
        <RutaUniPage navigate={navigate} path={path} />
        <TikTokFloat />
      </>
    );
  }

  if (path.startsWith("/guia")) {
    return (
      <>
        <GuiaPage navigate={navigate} path={path} />
        <TikTokFloat />
      </>
    );
  }

  if (path.startsWith("/camino-rapido")) {
    return (
      <>
        <CaminoRapidoPage navigate={navigate} path={path} />
        <TikTokFloat />
      </>
    );
  }

  if (path.startsWith("/tools-study")) {
    return (
      <>
        <ToolsStudyPage navigate={navigate} path={path} />
        <TikTokFloat />
      </>
    );
  }

  if (path.startsWith("/ayuda")) {
    return (
      <>
        <AyudaPage navigate={navigate} path={path} />
        <TikTokFloat />
      </>
    );
  }

  if (path.startsWith("/noticias")) {
    return (
      <>
        <NoticiasPage navigate={navigate} path={path} />
        <TikTokFloat />
      </>
    );
  }

  return (
    <>
      <HomePage navigate={navigate} path={path} />
      <TikTokFloat />
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppShell />
    </AuthProvider>
  );
}
