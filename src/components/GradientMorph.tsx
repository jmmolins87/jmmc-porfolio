import { useScroll, useTransform, motion } from 'motion/react';

const sectionColors = [
  'rgba(124, 58, 237, 0.12)',
  'rgba(59, 130, 246, 0.10)',
  'rgba(16, 185, 129, 0.10)',
  'rgba(124, 58, 237, 0.12)',
  'rgba(99, 102, 241, 0.10)',
  'rgba(139, 92, 246, 0.12)',
  'rgba(236, 72, 153, 0.10)',
  'rgba(124, 58, 237, 0.12)',
];

export default function GradientMorph() {
  const { scrollYProgress } = useScroll();
  const colorIndex = useTransform(scrollYProgress, [0, 1], [0, sectionColors.length - 1]);

  return (
    <motion.div
      className="fixed inset-0 pointer-events-none z-0 transition-colors duration-700"
      style={{
        background: useTransform(colorIndex, (v) => {
          const i = Math.floor(v);
          const next = Math.min(i + 1, sectionColors.length - 1);
          const t = v - i;
          return `radial-gradient(ellipse at 50% 50%, ${sectionColors[i]}, ${sectionColors[next]}), radial-gradient(ellipse at 80% 20%, rgba(167, 139, 250, 0.06), transparent)`;
        }),
      }}
    />
  );
}
