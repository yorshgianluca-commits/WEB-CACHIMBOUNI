import React from "react";
import { motion, useScroll, useTransform, useSpring, type MotionValue } from "motion/react";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";
import Icon from "../components/Icon";
import type { NavigateFn } from "../lib/router";

type NoticiasProps = {
  navigate: NavigateFn;
  path: string;
};

type NewsItem = {
  title: string;
  link: string;
  thumbnail: string;
  category: string;
};

/**
 * Screenshot gratuito de cualquier sitio usando el servicio oficial de mshots de WordPress.
 * No requiere API key y devuelve una captura real de la homepage.
 */
const shot = (url: string, w = 900) =>
  `https://s.wordpress.com/mshots/v1/${encodeURIComponent(url)}?w=${w}&h=${Math.round(w * 0.66)}`;

const NEWS: NewsItem[] = [
  // Fila 1 (5) — Educación y matemática
  {
    title: "LoganMaths — Playlists de matemática UNI",
    link: "https://rumble.com/user/LoganMaths/playlists",
    thumbnail: shot("https://rumble.com/user/LoganMaths/playlists"),
    category: "Rumble · Matemática",
  },
  {
    title: "CEPREUNI — Sitio oficial · Ciclos y admisión",
    link: "https://www.cepre.uni.edu.pe/",
    thumbnail: shot("https://www.cepre.uni.edu.pe/"),
    category: "UNI · Oficial",
  },
  {
    title: "Trilce — Solucionarios UNI comentados",
    link: "https://www.trilce.edu.pe/academia/solucionarios-uni",
    thumbnail: shot("https://www.trilce.edu.pe/academia/solucionarios-uni"),
    category: "Academia · Solucionarios",
  },
  {
    title: "BBC Mundo — Ciencia y actualidad global",
    link: "https://www.bbc.com/mundo/topics/c7zp57yyz25t",
    thumbnail: shot("https://www.bbc.com/mundo/topics/c7zp57yyz25t"),
    category: "BBC · Mundo",
  },
  {
    title: "Gestión — Economía y educación superior",
    link: "https://gestion.pe/",
    thumbnail: shot("https://gestion.pe/"),
    category: "Gestión · Economía",
  },

  // Fila 2 (5)
  {
    title: "El Peruano — Normas y comunicados oficiales",
    link: "https://elperuano.pe/",
    thumbnail: shot("https://elperuano.pe/"),
    category: "Estado · Oficial",
  },
  {
    title: "Infobae Perú — Noticias nacionales al día",
    link: "https://www.infobae.com/peru/",
    thumbnail: shot("https://www.infobae.com/peru/"),
    category: "Infobae · Perú",
  },
  {
    title: "LoganMaths — Trucos rápidos de razonamiento",
    link: "https://rumble.com/user/LoganMaths/playlists",
    thumbnail: shot("https://rumble.com/user/LoganMaths/playlists", 1000),
    category: "Rumble · Trucos",
  },
  {
    title: "CEPREUNI — Simulacros y evaluaciones",
    link: "https://www.cepre.uni.edu.pe/",
    thumbnail: shot("https://www.cepre.uni.edu.pe/", 1000),
    category: "UNI · Simulacros",
  },
  {
    title: "Trilce — Claves y puntajes UNI recientes",
    link: "https://www.trilce.edu.pe/academia/solucionarios-uni",
    thumbnail: shot("https://www.trilce.edu.pe/academia/solucionarios-uni", 1000),
    category: "Trilce · Claves",
  },

  // Fila 3 (5)
  {
    title: "BBC Mundo — Tecnología e ingeniería",
    link: "https://www.bbc.com/mundo/topics/c7zp57yyz25t",
    thumbnail: shot("https://www.bbc.com/mundo/topics/c7zp57yyz25t", 1000),
    category: "BBC · Tecnología",
  },
  {
    title: "Gestión — Becas y programas preuniversitarios",
    link: "https://gestion.pe/",
    thumbnail: shot("https://gestion.pe/", 1000),
    category: "Gestión · Becas",
  },
  {
    title: "El Peruano — Fechas de exámenes de admisión",
    link: "https://elperuano.pe/",
    thumbnail: shot("https://elperuano.pe/", 1000),
    category: "Estado · Fechas",
  },
  {
    title: "Infobae — Historias de ingresantes UNI",
    link: "https://www.infobae.com/peru/",
    thumbnail: shot("https://www.infobae.com/peru/", 1000),
    category: "Infobae · Historias",
  },
  {
    title: "CachimboUNI — Vuelve a la biblioteca de recursos",
    link: "https://www.cepre.uni.edu.pe/",
    thumbnail: shot("https://www.cepre.uni.edu.pe/", 1100),
    category: "CachimboUNI · Selección",
  },
];

function ProductCard({
  product,
  translate,
}: {
  product: NewsItem;
  translate: MotionValue<number>;
}) {
  return (
    <motion.div
      style={{ x: translate }}
      whileHover={{ y: -14 }}
      className="group/product h-80 w-[26rem] md:h-96 md:w-[30rem] relative shrink-0"
    >
      <a
        href={product.link}
        target="_blank"
        rel="noreferrer"
        className="block group-hover/product:shadow-2xl overflow-hidden rounded-xl border border-white/10 bg-[#0b0e10]"
      >
        <img
          src={product.thumbnail}
          height={600}
          width={600}
          className="object-cover object-top absolute h-full w-full inset-0"
          alt={product.title}
          loading="lazy"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent opacity-90" />
        <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/65 backdrop-blur border border-white/15 text-[10px] tracking-[0.14em] uppercase font-semibold text-white/90">
          {product.category}
        </div>
      </a>
      <div className="absolute inset-0 h-full w-full opacity-0 group-hover/product:opacity-100 bg-black/45 pointer-events-none rounded-xl transition-opacity" />
      <div className="absolute bottom-0 left-0 right-0 p-4 opacity-0 group-hover/product:opacity-100 transition-opacity">
        <h3 className="text-white font-semibold text-[15px] leading-snug line-clamp-2 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
          {product.title}
        </h3>
        <span className="inline-flex items-center gap-1.5 mt-2 text-[11px] tracking-[0.12em] uppercase font-semibold text-[#f3a066]">
          Abrir <Icon name="external" size={13} />
        </span>
      </div>
    </motion.div>
  );
}

const HEADER_SOURCES = [
  { name: "CEPREUNI", tag: "UNI · Oficial" },
  { name: "Trilce", tag: "Solucionarios" },
  { name: "LoganMaths", tag: "Matemática" },
  { name: "BBC Mundo", tag: "Global" },
  { name: "Gestión", tag: "Economía" },
  { name: "El Peruano", tag: "Estado" },
  { name: "Infobae", tag: "Perú" },
];

function Header({ navigate }: { navigate: NavigateFn }) {
  return (
    <div className="relative mx-auto py-16 md:py-28 px-6 w-full max-w-[1400px]">
      <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-10 lg:gap-16 items-center">
        {/* Columna izquierda: título + descripción + CTAs */}
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.06] border border-white/10 backdrop-blur text-[11px] tracking-[0.18em] uppercase font-semibold text-white/70">
            <span className="w-2 h-2 rounded-full bg-[#f3a066] animate-pulse" />
            Noticias · Actualizado
          </div>
          <h1 className="text-[36px] md:text-[64px] font-bold tracking-[-0.04em] leading-[0.95] text-[#e8e7e1] uppercase mt-6" style={{ fontFamily: "Oswald, sans-serif" }}>
            Noticias que
            <br />
            <span className="text-[#f3a066]">te mantienen</span>
            <br />
            al día.
          </h1>
          <p className="max-w-xl text-[15px] md:text-[17px] leading-relaxed mt-6 text-white/65">
            Una selección de portales y recursos que reviso cada semana: solucionarios UNI, comunicados
            CEPREUNI, ciencia internacional y noticias nacionales. Abre, lee y vuelve a practicar.
          </p>
          <div className="flex flex-wrap gap-3 mt-8">
            <button
              onClick={() => document.getElementById("noticias-vitrine")?.scrollIntoView({ behavior: "smooth" })}
              className="inline-flex items-center gap-2 px-5 py-3 bg-[#d8763e] text-[#111] text-xs font-bold tracking-[0.12em] uppercase hover:bg-[#f3a066] transition-colors"
            >
              Explorar noticias <Icon name="arrow" size={16} />
            </button>
            <button
              onClick={() => navigate("/recursos")}
              className="inline-flex items-center gap-2 px-5 py-3 border border-white/15 text-white text-xs font-bold tracking-[0.12em] uppercase hover:bg-white/5 transition-colors"
            >
              Ir a recursos
            </button>
          </div>
        </div>

        {/* Columna derecha: panel decorativo con métricas + fuentes que llena el vacío */}
        <div className="relative">
          <div className="absolute -inset-4 rounded-[28px] bg-gradient-to-br from-[#f3a066]/15 via-transparent to-white/5 blur-2xl pointer-events-none" />
          <div className="relative rounded-2xl border border-white/12 bg-white/[0.04] backdrop-blur-xl p-6 md:p-8 overflow-hidden">
            {/* Grid decorativo */}
            <div
              className="absolute inset-0 opacity-[0.35] pointer-events-none"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(255,255,255,.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.04) 1px, transparent 1px)",
                backgroundSize: "40px 40px",
                maskImage: "radial-gradient(circle at 60% 30%, black, transparent 80%)",
              }}
            />

            <div className="relative">
              <div className="flex items-center justify-between">
                <span className="text-[10px] tracking-[0.22em] uppercase font-semibold text-white/50">
                  Panel de noticias
                </span>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[9px] tracking-[0.14em] uppercase font-bold text-emerald-400">Live</span>
                </div>
              </div>

              {/* Métricas grandes */}
              <div className="grid grid-cols-3 gap-4 mt-6 pb-6 border-b border-white/10">
                <div>
                  <div className="text-[36px] md:text-[44px] leading-none font-semibold text-[#f3a066]" style={{ fontFamily: "Oswald, sans-serif" }}>
                    15
                  </div>
                  <div className="text-[10px] tracking-[0.14em] uppercase text-white/50 mt-1.5">Titulares</div>
                </div>
                <div>
                  <div className="text-[36px] md:text-[44px] leading-none font-semibold text-white" style={{ fontFamily: "Oswald, sans-serif" }}>
                    7
                  </div>
                  <div className="text-[10px] tracking-[0.14em] uppercase text-white/50 mt-1.5">Fuentes</div>
                </div>
                <div>
                  <div className="text-[36px] md:text-[44px] leading-none font-semibold text-white" style={{ fontFamily: "Oswald, sans-serif" }}>
                    24/7
                  </div>
                  <div className="text-[10px] tracking-[0.14em] uppercase text-white/50 mt-1.5">Activo</div>
                </div>
              </div>

              {/* Lista de fuentes */}
              <div className="mt-5">
                <div className="text-[10px] tracking-[0.22em] uppercase font-semibold text-white/45 mb-3">
                  Fuentes incluidas
                </div>
                <div className="space-y-2">
                  {HEADER_SOURCES.map((src, index) => (
                    <div
                      key={src.name}
                      className="flex items-center justify-between py-2 px-3 rounded-lg bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06] transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="text-[10px] font-mono text-white/40 w-6">
                          0{index + 1}
                        </span>
                        <span className="text-[13px] font-medium text-white/85 truncate">{src.name}</span>
                      </div>
                      <span className="text-[9px] tracking-[0.14em] uppercase font-semibold text-[#f3a066]/80 shrink-0">
                        {src.tag}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Barra de progreso decorativa */}
              <div className="mt-5 pt-5 border-t border-white/10">
                <div className="flex items-center justify-between text-[10px] tracking-[0.14em] uppercase text-white/40 mb-2">
                  <span>Cobertura</span>
                  <span>92%</span>
                </div>
                <div className="h-1 rounded-full bg-white/10 overflow-hidden">
                  <div className="h-full w-[92%] bg-gradient-to-r from-[#d8763e] to-[#f3a066] rounded-full" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function HeroBackdrop() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* Fondo base con doble gradiente radial cobre */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(1200px 700px at 85% 10%, rgba(216,118,62,0.22), transparent 60%), radial-gradient(900px 600px at 15% 95%, rgba(140,31,54,0.18), transparent 65%), linear-gradient(180deg, #060809 0%, #050607 60%, #040506 100%)",
        }}
      />

      {/* Grilla completa que cubre todo el ancho */}
      <div
        className="absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.035) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
          maskImage: "radial-gradient(circle at 50% 0%, black 20%, transparent 85%)",
          WebkitMaskImage: "radial-gradient(circle at 50% 0%, black 20%, transparent 85%)",
        }}
      />

      {/* Ruido / puntos dispersos */}
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
          maskImage: "linear-gradient(180deg, transparent 0%, black 40%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(180deg, transparent 0%, black 40%, transparent 100%)",
        }}
      />

      {/* Tipografía gigante decorativa en el fondo derecho, llena el vacío */}
      <div
        className="absolute top-[8%] right-[-1.5%] select-none pointer-events-none leading-[0.82] tracking-[-0.06em] font-bold text-transparent"
        style={{
          fontFamily: "Oswald, sans-serif",
          fontSize: "clamp(180px, 22vw, 380px)",
          WebkitTextStroke: "1px rgba(255,255,255,0.05)",
          textAlign: "right",
        }}
        aria-hidden="true"
      >
        NEWS
      </div>

      {/* Línea horizontal decorativa alta */}
      <div
        className="absolute left-0 right-0 top-[38%] h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.08) 20%, rgba(243,160,102,0.28) 50%, rgba(255,255,255,0.08) 80%, transparent 100%)",
        }}
      />

      {/* Marcadores de bolsa/ticker flotantes en la esquina superior derecha */}
      <div className="absolute top-16 right-8 md:top-20 md:right-14 hidden lg:flex flex-col items-end gap-2">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/60 border border-white/10 backdrop-blur-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[10px] tracking-[0.18em] uppercase font-semibold text-white/70">
            Ingresa UNI 2026
          </span>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/60 border border-white/10 backdrop-blur-sm">
          <span className="text-[10px] tracking-[0.18em] uppercase font-semibold text-[#f3a066]">↑ 92%</span>
          <span className="text-[10px] tracking-[0.18em] uppercase font-semibold text-white/60">cobertura</span>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/60 border border-white/10 backdrop-blur-sm">
          <span className="text-[10px] tracking-[0.18em] uppercase font-semibold text-white/60">
            7 medios · Perú y global
          </span>
        </div>
      </div>

      {/* Puntitos naranjas flotantes tipo constelación */}
      <div className="absolute top-[15%] right-[35%] w-1.5 h-1.5 rounded-full bg-[#f3a066] shadow-[0_0_12px_rgba(243,160,102,0.8)]" />
      <div className="absolute top-[26%] right-[18%] w-1 h-1 rounded-full bg-white/60 shadow-[0_0_8px_rgba(255,255,255,0.6)]" />
      <div className="absolute top-[45%] right-[8%] w-2 h-2 rounded-full bg-[#f3a066]/70 shadow-[0_0_16px_rgba(243,160,102,0.6)]" />
      <div className="absolute top-[12%] right-[52%] w-1 h-1 rounded-full bg-white/40" />
      <div className="absolute top-[55%] right-[42%] w-1.5 h-1.5 rounded-full bg-[#f3a066]/50" />
      <div className="absolute top-[8%] left-[30%] w-1 h-1 rounded-full bg-white/50" />

      {/* Viñeta inferior para separar del contenido parallax */}
      <div
        className="absolute inset-x-0 bottom-0 h-32"
        style={{
          background: "linear-gradient(180deg, transparent 0%, rgba(5,6,7,0.9) 100%)",
        }}
      />
    </div>
  );
}

export function HeroParallax({ products, navigate }: { products: NewsItem[]; navigate: NavigateFn }) {
  const firstRow = products.slice(0, 5);
  const secondRow = products.slice(5, 10);
  const thirdRow = products.slice(10, 15);
  const ref = React.useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const springConfig = { stiffness: 300, damping: 30, bounce: 100 } as const;

  const translateX = useSpring(useTransform(scrollYProgress, [0, 1], [0, 1000]), springConfig);
  const translateXReverse = useSpring(useTransform(scrollYProgress, [0, 1], [0, -1000]), springConfig);
  const rotateX = useSpring(useTransform(scrollYProgress, [0, 0.2], [15, 0]), springConfig);
  const opacity = useSpring(useTransform(scrollYProgress, [0, 0.2], [0.2, 1]), springConfig);
  const rotateZ = useSpring(useTransform(scrollYProgress, [0, 0.2], [20, 0]), springConfig);
  const translateY = useSpring(useTransform(scrollYProgress, [0, 0.2], [-700, 500]), springConfig);

  return (
    <div
      ref={ref}
      className="h-[300vh] py-16 md:py-24 overflow-hidden antialiased relative flex flex-col self-auto [perspective:1000px] [transform-style:preserve-3d] bg-[#050607]"
    >
      <HeroBackdrop />
      <div className="relative z-10">
        <Header navigate={navigate} />
      </div>
      <motion.div
        id="noticias-vitrine"
        style={{ rotateX, rotateZ, translateY, opacity }}
        className="mt-6 relative z-10"
      >
        <motion.div className="flex flex-row-reverse space-x-reverse space-x-6 md:space-x-8 mb-6 md:mb-8">
          {firstRow.map((product) => (
            <ProductCard product={product} translate={translateX} key={product.title + product.link + "1"} />
          ))}
        </motion.div>
        <motion.div className="flex flex-row mb-6 md:mb-8 space-x-6 md:space-x-8">
          {secondRow.map((product) => (
            <ProductCard product={product} translate={translateXReverse} key={product.title + product.link + "2"} />
          ))}
        </motion.div>
        <motion.div className="flex flex-row-reverse space-x-reverse space-x-6 md:space-x-8">
          {thirdRow.map((product) => (
            <ProductCard product={product} translate={translateX} key={product.title + product.link + "3"} />
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}

export default function NoticiasPage({ navigate, path }: NoticiasProps) {
  return (
    <div className="page noticias-page">
      <SiteHeader navigate={navigate} path={path} variant="solid" />
      <HeroParallax products={NEWS} navigate={navigate} />
      <section className="section-pad bg-[#080b0d] border-t border-white/10">
        <div className="max-w-5xl mx-auto grid md:grid-cols-[1.1fr_0.9fr] gap-8 items-center">
          <div>
            <div className="section-index">Consejo</div>
            <h2
              className="text-[32px] md:text-[44px] uppercase leading-[0.95] tracking-[-0.03em] mt-3"
              style={{ fontFamily: "Oswald, sans-serif" }}
            >
              Lee 20 minutos
              <br />
              <em className="text-[#f3a066] not-italic">y vuelve a practicar.</em>
            </h2>
            <p className="text-white/60 leading-relaxed mt-4">
              Las noticias te dan contexto, pero el ingreso se gana resolviendo. Usa estos portales
              como pausa activa entre bloques de teoría, matemática y simulacros.
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <p className="text-xs tracking-[0.16em] uppercase font-semibold text-white/50">Fuentes incluidas</p>
            <ul className="mt-4 space-y-2.5 text-sm text-white/75">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#f3a066]" /> Rumble — LoganMaths
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#f3a066]" /> CEPREUNI · Trilce Solucionarios
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#f3a066]" /> BBC Mundo · Gestión · El Peruano · Infobae
              </li>
            </ul>
            <button
              onClick={() => navigate("/guia")}
              className="mt-6 inline-flex items-center gap-2 text-xs font-bold tracking-[0.12em] uppercase text-[#f3a066] hover:gap-3 transition-all"
            >
              Ver guía de canales <Icon name="arrow" size={14} />
            </button>
          </div>
        </div>
      </section>
      <SiteFooter navigate={navigate} />
    </div>
  );
}
