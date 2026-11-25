import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  MOTION_DURATION,
  MOTION_EASE,
  MOTION_SPRING,
  createModalPanelVariants,
  createPageVariants,
  modalBackdropVariants,
  useMotionPreference,
} from '../../lib/motion';

export function useIsMobileViewport(maxWidthPx = 640): boolean {
  const [isMobile, setIsMobile] = useState<boolean>(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return false;
    return window.matchMedia(`(max-width: ${maxWidthPx - 1}px)`).matches;
  });

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mq = window.matchMedia(`(max-width: ${maxWidthPx - 1}px)`);
    const update = () => setIsMobile(mq.matches);
    update();
    if (mq.addEventListener) {
      mq.addEventListener('change', update);
      return () => mq.removeEventListener('change', update);
    }
    mq.addListener(update);
    return () => mq.removeListener(update);
  }, [maxWidthPx]);

  return isMobile;
}

/**
 * Smoothly interpolates from previous value to target value (supports both counting up & down).
 */
export function useAnimatedNumber(target: number, durationMs = 550): number {
  const reduced = useMotionPreference();
  const [display, setDisplay] = useState(target);
  const currentRef = useRef(target);

  useEffect(() => {
    const startVal = currentRef.current;
    if (reduced || startVal === target) {
      currentRef.current = target;
      setDisplay(target);
      return;
    }

    let rafId = 0;
    const start = performance.now();
    const diff = target - startVal;

    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / durationMs);
      const eased = 1 - Math.pow(1 - progress, 3);
      const nextVal = Math.round(startVal + diff * eased);
      currentRef.current = nextVal;
      setDisplay(nextVal);
      if (progress < 1) {
        rafId = requestAnimationFrame(tick);
      } else {
        currentRef.current = target;
        setDisplay(target);
      }
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [target, durationMs, reduced]);

  return display;
}

interface AnimatedNumberProps {
  value: number;
  durationMs?: number;
  format?: (val: number) => string;
  className?: string;
}

export const AnimatedNumber: React.FC<AnimatedNumberProps> = ({
  value,
  durationMs = 550,
  format,
  className = '',
}) => {
  const animated = useAnimatedNumber(value, durationMs);
  return <span className={className}>{format ? format(animated) : animated}</span>;
};

interface AnimatedProgressBarProps {
  value: number;
  max?: number;
  trackClassName?: string;
  barClassName?: string;
  glowOnIncrease?: boolean;
  ariaLabel?: string;
}

export const AnimatedProgressBar: React.FC<AnimatedProgressBarProps> = ({
  value,
  max = 100,
  trackClassName = 'w-full h-2.5 rounded-full bg-neutral-100 dark:bg-neutral-800 overflow-hidden',
  barClassName = 'h-full w-full rounded-full bg-[#DD0000]',
  glowOnIncrease = false,
  ariaLabel,
}) => {
  const reduced = useMotionPreference();
  const safeMax = max <= 0 ? 1 : max;
  const ratio = Math.max(0, Math.min(1, value / safeMax));
  const prevRatioRef = useRef(ratio);
  const [pulseGleam, setPulseGleam] = useState(false);

  useEffect(() => {
    if (glowOnIncrease && ratio > prevRatioRef.current + 0.001 && !reduced) {
      setPulseGleam(true);
      const timer = setTimeout(() => setPulseGleam(false), 750);
      prevRatioRef.current = ratio;
      return () => clearTimeout(timer);
    }
    prevRatioRef.current = ratio;
  }, [ratio, glowOnIncrease, reduced]);

  return (
    <div
      className={`relative ${trackClassName}`}
      role={ariaLabel ? 'progressbar' : undefined}
      aria-label={ariaLabel}
      aria-valuenow={ariaLabel ? Math.round(ratio * 100) : undefined}
      aria-valuemin={ariaLabel ? 0 : undefined}
      aria-valuemax={ariaLabel ? 100 : undefined}
    >
      <motion.div
        className={`relative overflow-hidden ${barClassName}`}
        style={{ transformOrigin: 'left center' }}
        initial={reduced ? { scaleX: ratio } : { scaleX: Math.max(0, prevRatioRef.current) }}
        animate={{ scaleX: ratio }}
        transition={
          reduced
            ? { duration: 0.01 }
            : { duration: MOTION_DURATION.smooth, ease: MOTION_EASE.settle }
        }
      >
        {pulseGleam && (
          <motion.span
            aria-hidden="true"
            initial={{ x: '-100%', opacity: 0.8 }}
            animate={{ x: '180%', opacity: 0 }}
            transition={{ duration: 0.7, ease: MOTION_EASE.standard }}
            className="absolute inset-y-0 w-1/2 bg-gradient-to-r from-transparent via-white/55 to-transparent pointer-events-none"
          />
        )}
      </motion.div>
    </div>
  );
};

interface MotionPageTransitionProps {
  pageKey: string;
  children: React.ReactNode;
  className?: string;
}

export const MotionPageTransition: React.FC<MotionPageTransitionProps> = ({
  pageKey,
  children,
  className = '',
}) => {
  const reduced = useMotionPreference();
  const isMobile = useIsMobileViewport(768);
  const variants = createPageVariants(isMobile, reduced);

  return (
    <motion.div
      key={pageKey}
      variants={variants}
      initial="initial"
      animate="animate"
      exit="exit"
      className={className}
    >
      {children}
    </motion.div>
  );
};

interface MotionModalProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  maxWidthClass?: string;
  mobileBottomSheet?: boolean;
  zIndexClass?: string;
  panelClassName?: string;
  ariaLabel?: string;
  closeOnBackdrop?: boolean;
}

export const MotionModal: React.FC<MotionModalProps> = ({
  open,
  onClose,
  children,
  maxWidthClass = 'max-w-md',
  mobileBottomSheet = false,
  zIndexClass = 'z-50',
  panelClassName = '',
  ariaLabel,
  closeOnBackdrop = true,
}) => {
  const reduced = useMotionPreference();
  const isMobile = useIsMobileViewport(640);
  const useSheet = mobileBottomSheet && isMobile;
  const panelVariants = createModalPanelVariants(reduced, useSheet);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={ariaLabel}
          variants={modalBackdropVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          onClick={closeOnBackdrop ? onClose : undefined}
          className={`fixed inset-0 ${zIndexClass} flex ${
            useSheet ? 'items-end sm:items-center justify-center p-0 sm:p-4' : 'items-center justify-center p-4'
          } bg-black/60 backdrop-blur-[2px]`}
        >
          <motion.div
            variants={panelVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
            className={`w-full ${maxWidthClass} ${
              useSheet ? 'rounded-t-2xl sm:rounded-2xl max-h-[88vh] overflow-y-auto' : 'rounded-2xl max-h-[90vh] overflow-y-auto'
            } border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#12141A] shadow-2xl ${panelClassName}`}
          >
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

interface RewardFloatingBadgeProps {
  show: boolean;
  label: string;
  tone?: 'xp' | 'coins' | 'streak' | 'success';
  className?: string;
}

export const RewardFloatingBadge: React.FC<RewardFloatingBadgeProps> = ({
  show,
  label,
  tone = 'xp',
  className = '',
}) => {
  const reduced = useMotionPreference();
  const toneClasses =
    tone === 'coins'
      ? 'bg-amber-500 text-black border-amber-300'
      : tone === 'streak'
      ? 'bg-[#DD0000] text-white border-red-400'
      : tone === 'success'
      ? 'bg-emerald-600 text-white border-emerald-400'
      : 'bg-black text-[#FFCE00] dark:bg-[#FFCE00] dark:text-black border-[#FFCE00]/40';

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          aria-live="polite"
          initial={reduced ? { opacity: 0 } : { opacity: 0, y: 8, scale: 0.88 }}
          animate={
            reduced
              ? { opacity: 1 }
              : { opacity: [0, 1, 1, 0], y: [8, -14, -22, -28], scale: [0.88, 1.06, 1, 0.96] }
          }
          exit={{ opacity: 0 }}
          transition={
            reduced
              ? { duration: MOTION_DURATION.micro }
              : { duration: 1.05, times: [0, 0.2, 0.72, 1], ease: MOTION_EASE.settle }
          }
          className={`pointer-events-none select-none inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border text-xs font-mono-tabular font-bold shadow-md ${toneClasses} ${className}`}
        >
          {label}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const SPARKLE_PARTICLES = [
  { angle: -80, dist: 44, size: 6, color: '#FFCE00', delay: 0 },
  { angle: -42, dist: 56, size: 5, color: '#DD0000', delay: 0.03 },
  { angle: -12, dist: 48, size: 6, color: '#10B981', delay: 0.05 },
  { angle: 24, dist: 54, size: 5, color: '#FFCE00', delay: 0.02 },
  { angle: 65, dist: 42, size: 6, color: '#DD0000', delay: 0.06 },
  { angle: 112, dist: 48, size: 5, color: '#FFCE00', delay: 0.04 },
  { angle: 150, dist: 52, size: 6, color: '#10B981', delay: 0.01 },
  { angle: -145, dist: 46, size: 5, color: '#FFCE00', delay: 0.05 },
  { angle: -115, dist: 54, size: 6, color: '#DD0000', delay: 0.03 },
];

export const CelebrationBurst: React.FC<{ active: boolean; className?: string }> = ({
  active,
  className = '',
}) => {
  const reduced = useMotionPreference();
  if (!active || reduced) return null;

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 flex items-center justify-center overflow-visible ${className}`}
    >
      {SPARKLE_PARTICLES.map((p, idx) => {
        const rad = (p.angle * Math.PI) / 180;
        const tx = Math.cos(rad) * p.dist;
        const ty = Math.sin(rad) * p.dist;
        return (
          <motion.span
            key={idx}
            initial={{ opacity: 0, x: 0, y: 0, scale: 0.3 }}
            animate={{
              opacity: [0, 1, 1, 0],
              x: [0, tx * 0.65, tx * 0.92, tx],
              y: [0, ty * 0.65, ty * 0.92, ty],
              scale: [0.3, 1.15, 0.9, 0.4],
            }}
            transition={{
              duration: MOTION_DURATION.celebration,
              delay: p.delay,
              times: [0, 0.25, 0.7, 1],
              ease: MOTION_EASE.settle,
            }}
            style={{
              width: p.size,
              height: p.size,
              backgroundColor: p.color,
            }}
            className="absolute rounded-full"
          />
        );
      })}
    </div>
  );
};

interface TactileCardProps {
  children: React.ReactNode;
  className?: string;
  interactive?: boolean;
  onClick?: () => void;
}

export const TactileCard: React.FC<TactileCardProps> = ({
  children,
  className = '',
  interactive = false,
  onClick,
}) => {
  const reduced = useMotionPreference();
  if (!interactive) {
    return <div className={className}>{children}</div>;
  }
  return (
    <motion.div
      onClick={onClick}
      whileHover={reduced ? undefined : { y: -2 }}
      whileTap={reduced ? undefined : { scale: 0.985 }}
      transition={MOTION_SPRING.snappy}
      className={className}
    >
      {children}
    </motion.div>
  );
};
