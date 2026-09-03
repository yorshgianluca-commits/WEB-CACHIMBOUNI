import * as React from "react";
import { useEffect, useRef, useState } from "react";

/**
 * FrameSequenceHero — sección con "scrollytelling": una secuencia de imágenes
 * avanza cuadro a cuadro conforme haces scroll, mientras las tarjetas de cada
 * paso entran y salen.
 *
 * Adaptado del componente original (pensado para ser el hero superior de la
 * página) para poder vivir a mitad del documento: el progreso se calcula con
 * `getBoundingClientRect()` del contenedor en vez de `window.scrollY`, y el
 * escenario se fija con `position: sticky` en lugar de `fixed`.
 */

export type FrameSequenceStep = {
  from: number;
  to: number;
  color: string;
  num: string;
  total: string;
  icon?: React.ReactNode;
  title: string;
  description: string;
  label: string;
};

export type FrameSequenceHeroProps = {
  frameCount: number;
  framePath: (i: number) => string;
  eagerCount?: number;
  scrollHeight?: string;
  kicker?: React.ReactNode;
  title: React.ReactNode;
  subtitle?: string;
  steps: FrameSequenceStep[];
  ctaLabel?: string;
  onCta?: () => void;
  className?: string;
};

const cx = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(" ");

export function FrameSequenceHero({
  frameCount,
  framePath,
  eagerCount = 24,
  scrollHeight = "420vh",
  kicker,
  title,
  subtitle,
  steps,
  ctaLabel,
  onCta,
  className,
}: FrameSequenceHeroProps) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const spacerRef = useRef<HTMLDivElement | null>(null);

  const cacheRef = useRef<HTMLImageElement[]>(new Array(frameCount));
  const loadedRef = useRef(0);
  const targetFrameRef = useRef(0);
  const displayFrameRef = useRef(0);
  const lastShownRef = useRef(-1);
  const rafActiveRef = useRef(false);

  const [loadPct, setLoadPct] = useState(0);
  const [loaderDone, setLoaderDone] = useState(false);
  const [subHidden, setSubHidden] = useState(false);
  const [activeIdx, setActiveIdx] = useState<number>(-1);
  const [progress, setProgress] = useState(0);
  const [stepLocal, setStepLocal] = useState(0);
  const [currentSrc, setCurrentSrc] = useState<string>(() => framePath(1));

  // --- Precarga de la secuencia ---
  useEffect(() => {
    const eager = Math.min(eagerCount, frameCount);
    let cancelled = false;

    const loadOne = (i: number) => {
      const img = new Image();
      img.decoding = "async";
      img.src = framePath(i + 1);
      const onSettle = () => {
        if (cancelled) return;
        loadedRef.current += 1;
        setLoadPct(Math.round((loadedRef.current / frameCount) * 100));
        if (loadedRef.current === eager) {
          setLoaderDone(true);
          for (let j = eager; j < frameCount; j += 1) loadOne(j);
        }
      };
      img.onload = onSettle;
      img.onerror = onSettle;
      cacheRef.current[i] = img;
    };

    for (let i = 0; i < eager; i += 1) loadOne(i);
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [frameCount, eagerCount]);

  // --- Scroll → frame ---
  useEffect(() => {
    const showFrame = (i: number) => {
      if (i === lastShownRef.current) return;
      setCurrentSrc(framePath(i + 1));
      lastShownRef.current = i;
    };

    const loop = () => {
      if (rafActiveRef.current) return;
      rafActiveRef.current = true;
      const tick = () => {
        const diff = targetFrameRef.current - displayFrameRef.current;
        if (Math.abs(diff) < 0.08) displayFrameRef.current = targetFrameRef.current;
        else displayFrameRef.current += diff * 0.28;
        const idx = Math.max(0, Math.min(frameCount - 1, Math.round(displayFrameRef.current)));
        if (idx !== lastShownRef.current) showFrame(idx);
        if (displayFrameRef.current !== targetFrameRef.current) requestAnimationFrame(tick);
        else rafActiveRef.current = false;
      };
      requestAnimationFrame(tick);
    };

    const onScroll = () => {
      const spacer = spacerRef.current;
      if (!spacer) return;
      // Progreso relativo a la propia sección (funciona a mitad de página).
      const rect = spacer.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      const p = Math.max(0, Math.min(1, -rect.top / Math.max(1, total)));

      targetFrameRef.current = p * (frameCount - 1);
      loop();
      setProgress(p);
      setSubHidden(p > 0.02);

      let idx = -1;
      let local = 0;
      for (let i = 0; i < steps.length; i += 1) {
        const s = steps[i];
        if (p >= s.from && p < s.to) {
          idx = i;
          local = (p - s.from) / (s.to - s.from);
          break;
        }
      }
      setActiveIdx(idx);
      setStepLocal(Math.max(0, Math.min(1, local)));
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [steps, frameCount]);

  return (
    <div className={cx("fsh-root", className)} ref={rootRef}>
      <div ref={spacerRef} className="fsh-spacer" style={{ height: scrollHeight }}>
        <div className="fsh-stage">
          <div className="fsh-canvas-wrap">
            <img src={currentSrc} alt="" className="fsh-canvas" draggable={false} />
            <span className="fsh-canvas-veil" aria-hidden="true" />
            <span className="fsh-canvas-grain" aria-hidden="true" />
          </div>

          <div
            aria-hidden="true"
            className={cx("fsh-loader", loaderDone && "fsh-loader-done")}
          >
            <div className="fsh-loader-text">
              {loadPct < 100 ? `Cargando · ${loadPct}%` : "Listo"}
            </div>
            <div className="fsh-loader-track">
              <span className="fsh-loader-fill" style={{ width: `${loadPct}%` }} />
            </div>
          </div>

          <div className="fsh-copy">
            {kicker && <div className="fsh-kicker">{kicker}</div>}
            <h2 className="fsh-title">{title}</h2>
            {subtitle && (
              <p className={cx("fsh-sub", subHidden && "fsh-sub-hidden")}>{subtitle}</p>
            )}
            {ctaLabel && (
              <button
                type="button"
                className={cx("fsh-cta", subHidden && "fsh-sub-hidden")}
                onClick={onCta}
              >
                {ctaLabel}
              </button>
            )}
          </div>

          <div className="fsh-cards">
            {steps.map((s, i) => {
              const isActive = activeIdx === i;
              const isPrev = activeIdx >= 0 && i < activeIdx;
              return (
                <article
                  key={s.num}
                  style={{ ["--c" as string]: s.color } as React.CSSProperties}
                  className={cx("fsh-card", isActive && "fsh-card-active", isPrev && "fsh-card-prev")}
                >
                  <div className="fsh-card-inner">
                    <span aria-hidden="true" className="fsh-card-glow" />
                    <div className="fsh-card-head">
                      <span className="fsh-card-num">
                        <strong>{s.num}</strong> / {s.total}
                      </span>
                      <span aria-hidden="true" className="fsh-card-icon">
                        {s.icon ?? "✦"}
                      </span>
                    </div>
                    <h3 className="fsh-card-title">{s.title}</h3>
                    <p className="fsh-card-desc">{s.description}</p>
                    <div className="fsh-card-foot">
                      <div className="fsh-ticks">
                        {steps.map((tickStep, j) => {
                          const done = j < activeIdx;
                          const cur = j === activeIdx;
                          return (
                            <i key={tickStep.num} className="fsh-tick">
                              <span
                                style={{
                                  transform: `scaleX(${done ? 1 : cur ? stepLocal : 0})`,
                                  transition: done ? "none" : "transform 160ms linear",
                                }}
                              />
                            </i>
                          );
                        })}
                      </div>
                      <span className="fsh-card-label">{s.label}</span>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          <div className="fsh-progress">
            <span className="fsh-progress-fill" style={{ width: `${progress * 100}%` }} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default FrameSequenceHero;
