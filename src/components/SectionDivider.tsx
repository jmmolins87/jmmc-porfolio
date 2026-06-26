import { motion } from 'motion/react';

interface Props {
  variant?: 'wave' | 'sine' | 'curve';
}

const paths = {
  wave: 'M0,32 C48,64 96,0 144,32 C192,64 240,0 288,32 L288,64 L0,64 Z',
  sine: 'M0,48 C72,16 144,80 216,32 C252,8 270,24 288,32 L288,64 L0,64 Z',
  curve: 'M0,64 Q72,0 144,32 T288,32 L288,64 L0,64 Z',
};

export default function SectionDivider({ variant = 'wave' }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className="relative w-full h-16 overflow-hidden -mb-1 z-[1]"
    >
      <svg
        viewBox="0 0 288 64"
        preserveAspectRatio="none"
        className="w-full h-full"
      >
        <defs>
          <linearGradient id="dividerGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="oklch(0.5 0.3 290)" stopOpacity="0.1" />
            <stop offset="50%" stopColor="oklch(0.5 0.3 290)" stopOpacity="0.3" />
            <stop offset="100%" stopColor="oklch(0.5 0.3 290)" stopOpacity="0.1" />
          </linearGradient>
        </defs>
        <path
          d={paths[variant]}
          fill="url(#dividerGrad)"
          className="dark:opacity-60"
        />
      </svg>
    </motion.div>
  );
}
