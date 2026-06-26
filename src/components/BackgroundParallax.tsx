import { useScroll, useTransform, useSpring, motion } from 'motion/react';

export default function BackgroundParallax() {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ['-8%', '8%']);
  const springY = useSpring(y, { stiffness: 80, damping: 30 });
  const opacity = useTransform(scrollYProgress, [0, 0.1, 0.9, 1], [0.5, 0.7, 0.7, 0.5]);
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 15]);

  return (
    <motion.div
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
      style={{ opacity }}
    >
      <motion.div
        className="absolute -top-1/4 -left-32 w-[700px] h-[700px] rounded-full bg-gradient-to-br from-primary/6 via-accent/4 to-transparent blur-3xl"
        style={{ y: springY, rotate }}
      />
      <motion.div
        className="absolute -bottom-1/4 -right-32 w-[600px] h-[600px] rounded-full bg-gradient-to-tl from-primary/8 via-secondary/5 to-transparent blur-3xl"
        style={{ y: useSpring(useTransform(scrollYProgress, [0, 1], ['5%', '-5%']), { stiffness: 80, damping: 30 }) }}
      />
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-gradient-to-r from-accent/3 to-primary/3 blur-3xl"
        style={{
          y: useSpring(useTransform(scrollYProgress, [0, 1], ['-3%', '3%']), { stiffness: 80, damping: 30 }),
          scale: useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 0.8]),
        }}
      />
    </motion.div>
  );
}
