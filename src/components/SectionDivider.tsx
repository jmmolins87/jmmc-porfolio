import { useScroll, useTransform, motion } from 'motion/react';

interface Props {
  variant?: 'wave' | 'peak' | 'sine' | 'curve';
}

const paths = {
  wave: 'M0,32 C48,64 96,0 144,32 C192,64 240,0 288,32 L288,64 L0,64 Z',
  peak: 'M0,40 L48,0 L96,40 L144,0 L192,40 L240,0 L288,40 L288,64 L0,64 Z',
  sine: 'M0,48 C72,16 144,80 216,32 C252,8 270,24 288,32 L288,64 L0,64 Z',
  curve: 'M0,64 Q72,0 144,32 T288,32 L288,64 L0,64 Z',
};

export default function SectionDivider({ variant = 'wave' }: Props) {
  const { scrollYProgress } = useScroll();
  const waveOffset = useTransform(scrollYProgress, [0, 1], [0, 60]);
  const opacity = useTransform(scrollYProgress, [0, 0.05, 0.15, 1], [0, 1, 1, 0.5]);

  return (
    <motion.div
      className="relative w-full h-16 overflow-hidden -mb-1 z-[1]"
      style={{ opacity }}
    >
      <motion.svg
        viewBox="0 0 288 64"
        preserveAspectRatio="none"
        className="w-full h-full"
        style={{ x: waveOffset }}
      >
        <defs>
          <linearGradient id="dividerGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="oklch(0.5 0.3 290)" stopOpacity="0.1" />
            <stop offset="50%" stopColor="oklch(0.5 0.3 290)" stopOpacity="0.3" />
            <stop offset="100%" stopColor="oklch(0.5 0.3 290)" stopOpacity="0.1" />
          </linearGradient>
        </defs>
        <motion.path
          d={paths[variant]}
          fill="url(#dividerGrad)"
          className="dark:opacity-60"
        />
      </motion.svg>
    </motion.div>
  );
}
