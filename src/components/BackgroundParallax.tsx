import { useScroll, useTransform, useSpring, useAnimation, motion } from 'motion/react';
import { useEffect } from 'react';

const orbs = [
  { cx: '-10%', cy: '15%', size: 700, color: 'from-primary/8 via-accent/5 to-transparent', driftX: [-4, 4], driftY: [-6, 6], scale: [0.85, 1.1], dur: 12 },
  { cx: '80%', cy: '70%', size: 600, color: 'from-accent/6 via-secondary/4 to-transparent', driftX: [5, -5], driftY: [4, -4], scale: [1, 0.85], dur: 15 },
  { cx: '45%', cy: '45%', size: 500, color: 'from-secondary/4 via-primary/3 to-transparent', driftX: [-3, 3], driftY: [3, -3], scale: [0.9, 1.05], dur: 18 },
  { cx: '20%', cy: '80%', size: 450, color: 'from-primary/5 via-accent/3 to-transparent', driftX: [6, -6], driftY: [-5, 5], scale: [1.1, 0.9], dur: 14 },
  { cx: '75%', cy: '20%', size: 350, color: 'from-accent/4 via-primary/4 to-transparent', driftX: [-4, 4], driftY: [6, -6], scale: [0.95, 1.08], dur: 16 },
];

function Orb({ cx, cy, size, color, driftX, driftY, scale, dur }: typeof orbs[0]) {
  const anim = useAnimation();

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    anim.start({
      x: [driftX[0], driftX[1], driftX[0]],
      y: [driftY[0], driftY[1], driftY[0]],
      scale: [scale[0], scale[1], scale[0]],
      transition: { duration: dur, repeat: Infinity, ease: 'easeInOut' },
    });
  }, [anim, driftX, driftY, scale, dur]);

  return (
    <motion.div
      animate={anim}
      className="absolute rounded-full blur-3xl"
      style={{
        left: cx,
        top: cy,
        width: size,
        height: size,
        background: `linear-gradient(135deg, var(--tw-gradient-stops))`,
      }}
    >
      <div className={`w-full h-full rounded-full bg-gradient-to-br ${color}`} />
    </motion.div>
  );
}

export default function BackgroundParallax() {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ['-8%', '8%']);
  const springY = useSpring(y, { stiffness: 80, damping: 30 });
  const opacity = useTransform(scrollYProgress, [0, 0.1, 0.9, 1], [0.4, 0.6, 0.6, 0.4]);

  return (
    <motion.div
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
      style={{ opacity }}
    >
      {orbs.map((orb, i) => (
        <Orb key={i} {...orb} />
      ))}
      <motion.div
        style={{ y: springY }}
        className="absolute inset-0"
      >
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[400px] h-[400px] rounded-full bg-gradient-to-r from-primary/3 to-accent/3 blur-3xl" />
      </motion.div>
    </motion.div>
  );
}
