import { useScroll, useTransform, useAnimation, motion } from 'motion/react';
import { useEffect, useState } from 'react';

const sectionColors = [
  'rgba(14, 165, 233, 0.08)',
  'rgba(6, 182, 212, 0.06)',
  'rgba(59, 130, 246, 0.07)',
  'rgba(14, 165, 233, 0.08)',
  'rgba(14, 165, 233, 0.05)',
  'rgba(6, 182, 212, 0.07)',
  'rgba(59, 130, 246, 0.06)',
  'rgba(14, 165, 233, 0.08)',
];

export default function GradientMorph() {
  const { scrollYProgress } = useScroll();
  const colorIndex = useTransform(scrollYProgress, [0, 1], [0, sectionColors.length - 1]);
  const [timePhase, setTimePhase] = useState(0);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    let frame: number;
    let start = performance.now();
    const cycleDuration = 20000; // 20 seconds per full cycle

    function loop(now: number) {
      const elapsed = now - start;
      const progress = (elapsed % cycleDuration) / cycleDuration;
      setTimePhase(progress * (sectionColors.length - 1));
      frame = requestAnimationFrame(loop);
    }

    frame = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <motion.div
      className="fixed inset-0 pointer-events-none z-0 transition-colors duration-700"
      style={{
        background: useTransform(colorIndex, (scrollVal) => {
          const combined = scrollVal * 0.7 + timePhase * 0.3;
          const i = Math.floor(combined) % sectionColors.length;
          const next = (i + 1) % sectionColors.length;
          const t = combined - Math.floor(combined);
          const cx = 50 + Math.sin(timePhase * 0.8) * 15;
          const cy = 50 + Math.cos(timePhase * 0.6) * 15;
          return `radial-gradient(ellipse at ${cx}% ${cy}%, ${sectionColors[i]}, ${sectionColors[next]}), radial-gradient(ellipse at ${100 - cx}% ${100 - cy}%, rgba(14, 165, 233, 0.04), transparent)`;
        }),
      }}
    />
  );
}
