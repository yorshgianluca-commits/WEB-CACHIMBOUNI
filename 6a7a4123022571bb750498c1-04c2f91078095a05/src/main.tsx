import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { getSupabaseConfig } from "./lib/supabase";

// Mensaje de diagnóstico: solo aparece al abrir F12 → Console.
const config = getSupabaseConfig();
if (config.configured) {
  console.info(
    "✅ Supabase configurado. La web intentará leer el contenido desde la base de datos."
  );
} else {
  console.info(
    "⚠️ Supabase NO configurado. La web está usando los datos estáticos del código (src/lib/data.ts)."
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
