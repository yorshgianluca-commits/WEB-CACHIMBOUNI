import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useTransform } from "motion/react";
import { cn } from "@/utils/cn";

/**
 * SlideToUnlock — tarjeta de recompensa con "desliza para abrir el regalo".
 *
 * Se usa al completar el registro con Google: el usuario arrastra el handle
 * y se revela el regalo (link de SuperAcademyUNI) con confeti.
 *
 * Nota: el proyecto usa `motion` (sucesor oficial de framer-motion), por eso
 * el import es `motion/react` en vez de `framer-motion`. La API es la misma.
 */

interface SlideToUnlockProps {
  children: React.ReactNode;
  onUnlock: () => void;
  sliderText?: string;
  unlockedContent: React.ReactNode;
  className?: string;
  shimmer?: boolean;
}

export const SlideToUnlock = ({
  children,
  onUnlock,
  sliderText = "Desliza para abrir tu regalo",
  unlockedContent,
  className,
  shimmer = true,
}: SlideToUnlockProps) => {
  const [unlocked, setUnlocked] = useState(false);
  const [dragConstraint, setDragConstraint] = useState(0);
  const x = useMotionValue(0);

  const sliderRef = useRef<HTMLDivElement>(null);
  const handleRef = useRef<HTMLDivElement>(null);

  // Calcula el recorrido real del handle (y lo recalcula si cambia el ancho).
  useEffect(() => {
    const measure = () => {
      const sliderWidth = sliderRef.current?.offsetWidth || 0;
      const handleWidth = handleRef.current?.offsetWidth || 0;
      setDragConstraint(Math.max(0, sliderWidth - handleWidth));
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [unlocked]);

  const onDragEnd = (_event: unknown, info: { offset: { x: number } }) => {
    if (dragConstraint > 0 && info.offset.x > dragConstraint * 0.8) {
      setUnlocked(true);
      onUnlock();
    } else {
      x.set(0);
    }
  };

  const textOpacity = useTransform(x, [0, 50], [1, 0]);
  const fillWidth = useTransform(x, (value) => `${value + 56}px`);

  return (
    <div className={cn("reward-card", className)}>
      {children}
      <AnimatePresence mode="wait">
        {!unlocked ? (
          <motion.div
            key="slider"
            initial={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            className="reward-slider-wrap"
          >
            <div ref={sliderRef} className="reward-slider">
              <motion.span className="reward-slider-fill" style={{ width: fillWidth }} aria-hidden="true" />
              <motion.div
                ref={handleRef}
                drag="x"
                dragConstraints={{ left: 0, right: dragConstraint }}
                dragElastic={0.06}
                dragMomentum={false}
                style={{ x }}
                onDragEnd={onDragEnd}
                className="reward-slider-handle"
                role="slider"
                tabIndex={0}
                aria-label={sliderText}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={unlocked ? 100 : 0}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " " || event.key === "ArrowRight") {
                    event.preventDefault();
                    setUnlocked(true);
                    onUnlock();
                  }
                }}
              >
                <ChevronRightIcon className="reward-chevron" />
              </motion.div>
              <motion.span
                style={{ opacity: textOpacity }}
                className={cn("reward-slider-text", shimmer && "is-shimmer")}
              >
                {sliderText}
              </motion.span>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="unlocked"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {unlockedContent}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const ChevronRightIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="m9 18 6-6-6-6" />
  </svg>
);

export default SlideToUnlock;
