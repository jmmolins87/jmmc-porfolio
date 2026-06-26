import type { Variants } from 'motion/react';

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' },
  },
};

export const fadeLeft: Variants = {
  hidden: { opacity: 0, x: -40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: 'easeOut' },
  },
};

export const fadeRight: Variants = {
  hidden: { opacity: 0, x: 40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: 'easeOut' },
  },
};

export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
};

export const skillBar: Variants = {
  hidden: { opacity: 0, width: 0 },
  visible: {
    opacity: 1,
    width: 'var(--skill-width)',
    transition: { duration: 1, ease: 'easeOut' },
  },
};

export const staggerLetters: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.03,
      delayChildren: 0.2,
    },
  },
};

export const textReveal: Variants = {
  hidden: { opacity: 0, y: 20, rotateX: -90 },
  visible: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export const portalReveal: Variants = {
  hidden: {
    clipPath: 'circle(0% at 50% 50%)',
    opacity: 0,
  },
  visible: {
    clipPath: 'circle(100% at 50% 50%)',
    opacity: 1,
    transition: {
      duration: 1.2,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export const wordFly: Variants = {
  hidden: { opacity: 0, y: 80, rotateZ: 10, scale: 0.8 },
  visible: {
    opacity: 1,
    y: 0,
    rotateZ: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export const wordFlyLeft: Variants = {
  hidden: { opacity: 0, x: -120, rotateZ: -8, scale: 0.7 },
  visible: {
    opacity: 1,
    x: 0,
    rotateZ: 0,
    scale: 1,
    transition: {
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export const wordFlyRight: Variants = {
  hidden: { opacity: 0, x: 120, rotateZ: 8, scale: 0.7 },
  visible: {
    opacity: 1,
    x: 0,
    rotateZ: 0,
    scale: 1,
    transition: {
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export const cardFling: Variants = {
  hidden: { opacity: 0, y: 400, rotateX: 15 },
  visible: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: {
      type: 'spring',
      stiffness: 120,
      damping: 12,
      mass: 0.8,
    },
  },
};

export const radialExplode: Variants = {
  hidden: { opacity: 0, scale: 0, x: 0, y: 0 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    x: 0,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 150 + i * 20,
      damping: 15,
      mass: 0.5,
      delay: i * 0.06,
    },
  }),
};

export const scaleInSpring: Variants = {
  hidden: { opacity: 0, scale: 0 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { type: 'spring', stiffness: 200, damping: 15 },
  },
};

export const rippleNode: Variants = {
  hidden: { scale: 0, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 15,
    },
  },
};

export const clipRevealUp: Variants = {
  hidden: {
    clipPath: 'inset(100% 0 0 0)',
    opacity: 0,
  },
  visible: {
    clipPath: 'inset(0% 0 0 0)',
    opacity: 1,
    transition: {
      duration: 1,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export const floatSlow: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: 'easeOut' },
  },
};

export const slideUp: Variants = {
  hidden: { opacity: 0, y: 60 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};
