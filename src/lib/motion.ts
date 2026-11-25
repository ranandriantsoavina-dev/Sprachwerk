import { useReducedMotion } from 'motion/react';
import type { Transition, Variants } from 'motion/react';

export const MOTION_DURATION = {
  instant: 0.1,
  micro: 0.15,
  fast: 0.2,
  normal: 0.3,
  smooth: 0.4,
  emphasis: 0.55,
  celebration: 0.8,
} as const;

export const MOTION_EASE = {
  standard: [0.2, 0, 0, 1] as const,
  enter: [0, 0, 0.2, 1] as const,
  exit: [0.4, 0, 1, 1] as const,
  settle: [0.16, 1, 0.3, 1] as const,
  bounce: [0.34, 1.56, 0.64, 1] as const,
};

export const MOTION_SPRING = {
  snappy: {
    type: 'spring' as const,
    stiffness: 520,
    damping: 32,
    mass: 0.7,
  },
  standard: {
    type: 'spring' as const,
    stiffness: 380,
    damping: 28,
    mass: 0.85,
  },
  gentle: {
    type: 'spring' as const,
    stiffness: 260,
    damping: 26,
    mass: 1,
  },
  pop: {
    type: 'spring' as const,
    stiffness: 460,
    damping: 22,
    mass: 0.65,
  },
  celebration: {
    type: 'spring' as const,
    stiffness: 300,
    damping: 18,
    mass: 0.9,
  },
} as const;

/**
 * Combines OS `prefers-reduced-motion` and the app's `<MotionConfig reducedMotion>`
 * (which binds to `user?.reducedMotion`).
 */
export function useMotionPreference(): boolean {
  return Boolean(useReducedMotion());
}

export const fadeVariants: Variants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: { duration: MOTION_DURATION.fast, ease: MOTION_EASE.enter },
  },
  exit: {
    opacity: 0,
    transition: { duration: MOTION_DURATION.micro, ease: MOTION_EASE.exit },
  },
};

export function createPageVariants(isMobile = false, reduced = false): Variants {
  if (reduced) {
    return {
      initial: { opacity: 0 },
      animate: { opacity: 1, transition: { duration: MOTION_DURATION.instant } },
      exit: { opacity: 0, transition: { duration: MOTION_DURATION.instant } },
    };
  }
  const enterY = isMobile ? 6 : 10;
  const exitY = isMobile ? -4 : -6;
  return {
    initial: { opacity: 0, y: enterY },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: isMobile ? MOTION_DURATION.fast : MOTION_DURATION.normal,
        ease: MOTION_EASE.settle,
      },
    },
    exit: {
      opacity: 0,
      y: exitY,
      transition: {
        duration: MOTION_DURATION.micro,
        ease: MOTION_EASE.exit,
      },
    },
  };
}

export function createSlideDirectionVariants(reduced = false, distance = 18): Variants {
  if (reduced) {
    return {
      initial: { opacity: 0 },
      animate: { opacity: 1, transition: { duration: MOTION_DURATION.instant } },
      exit: { opacity: 0, transition: { duration: MOTION_DURATION.instant } },
    };
  }
  return {
    initial: (direction = 1) => ({
      opacity: 0,
      x: direction >= 0 ? distance : -distance,
    }),
    animate: {
      opacity: 1,
      x: 0,
      transition: { duration: MOTION_DURATION.fast, ease: MOTION_EASE.settle },
    },
    exit: (direction = 1) => ({
      opacity: 0,
      x: direction >= 0 ? -Math.round(distance * 0.6) : Math.round(distance * 0.6),
      transition: { duration: MOTION_DURATION.micro, ease: MOTION_EASE.exit },
    }),
  };
}

export function createSlideUpVariants(reduced = false, y = 10, duration: number = MOTION_DURATION.normal): Variants {
  if (reduced) {
    return {
      initial: { opacity: 0 },
      animate: { opacity: 1, transition: { duration: MOTION_DURATION.instant } },
      exit: { opacity: 0, transition: { duration: MOTION_DURATION.instant } },
    };
  }
  return {
    initial: { opacity: 0, y },
    animate: {
      opacity: 1,
      y: 0,
      transition: { duration, ease: MOTION_EASE.settle },
    },
    exit: {
      opacity: 0,
      y: -Math.round(y * 0.5),
      transition: { duration: MOTION_DURATION.micro, ease: MOTION_EASE.exit },
    },
  };
}

export const scalePopVariants: Variants = {
  initial: { opacity: 0, scale: 0.94 },
  animate: {
    opacity: 1,
    scale: 1,
    transition: MOTION_SPRING.snappy,
  },
  exit: {
    opacity: 0,
    scale: 0.96,
    transition: { duration: MOTION_DURATION.micro, ease: MOTION_EASE.exit },
  },
};

export const springPopVariants: Variants = {
  initial: { opacity: 0, scale: 0.84 },
  animate: {
    opacity: 1,
    scale: 1,
    transition: MOTION_SPRING.pop,
  },
  exit: {
    opacity: 0,
    scale: 0.9,
    transition: { duration: MOTION_DURATION.micro, ease: MOTION_EASE.exit },
  },
};

export const modalBackdropVariants: Variants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: { duration: MOTION_DURATION.fast, ease: MOTION_EASE.enter },
  },
  exit: {
    opacity: 0,
    transition: { duration: MOTION_DURATION.micro, ease: MOTION_EASE.exit },
  },
};

export function createModalPanelVariants(reduced = false, bottomSheet = false): Variants {
  if (reduced) {
    return fadeVariants;
  }
  if (bottomSheet) {
    return {
      initial: { opacity: 0, y: 36 },
      animate: {
        opacity: 1,
        y: 0,
        transition: { duration: MOTION_DURATION.normal, ease: MOTION_EASE.settle },
      },
      exit: {
        opacity: 0,
        y: 28,
        transition: { duration: MOTION_DURATION.fast, ease: MOTION_EASE.exit },
      },
    };
  }
  return {
    initial: { opacity: 0, scale: 0.96, y: 10 },
    animate: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { duration: MOTION_DURATION.normal, ease: MOTION_EASE.settle },
    },
    exit: {
      opacity: 0,
      scale: 0.97,
      y: 6,
      transition: { duration: MOTION_DURATION.micro, ease: MOTION_EASE.exit },
    },
  };
}

export const accordionVariants: Variants = {
  initial: { opacity: 0, height: 0 },
  animate: {
    opacity: 1,
    height: 'auto',
    transition: {
      height: { duration: MOTION_DURATION.normal, ease: MOTION_EASE.standard },
      opacity: { duration: MOTION_DURATION.fast, delay: 0.04 },
    },
  },
  exit: {
    opacity: 0,
    height: 0,
    transition: {
      height: { duration: MOTION_DURATION.fast, ease: MOTION_EASE.exit },
      opacity: { duration: MOTION_DURATION.instant },
    },
  },
};

export function createStaggerContainerVariants(
  staggerChildren = 0.045,
  delayChildren = 0.02
): Variants {
  return {
    initial: {},
    animate: {
      transition: {
        staggerChildren,
        delayChildren,
      },
    },
  };
}

export function createStaggerItemVariants(reduced = false, y = 10): Variants {
  if (reduced) {
    return {
      initial: { opacity: 0 },
      animate: { opacity: 1, transition: { duration: MOTION_DURATION.instant } },
    };
  }
  return {
    initial: { opacity: 0, y },
    animate: {
      opacity: 1,
      y: 0,
      transition: { duration: MOTION_DURATION.normal, ease: MOTION_EASE.settle },
    },
  };
}

export const SHAKE_KEYFRAMES = [0, -6, 6, -4, 4, 0];

export const shakeTransition: Transition = {
  duration: 0.36,
  ease: MOTION_EASE.standard,
};

export const pulseTransition: Transition = {
  duration: 0.3,
  ease: MOTION_EASE.bounce,
};
