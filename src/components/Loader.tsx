import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export default function Loader() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem('loader-seen')) return;

    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    setVisible(true);

    const timer = setTimeout(() => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      sessionStorage.setItem('loader-seen', 'true');
      setVisible(false);
    }, 4000);

    return () => {
      clearTimeout(timer);
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background"
        >
          {/* Outer glow pulse */}
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: [0, 0.6, 1, 0], scale: [0, 1, 1.4, 2] }}
            transition={{ duration: 3.5, times: [0, 0.2, 0.65, 1], ease: 'easeOut' }}
            className="absolute w-[300px] h-[300px] rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(14,165,233,0.25) 0%, rgba(6,182,212,0.12) 40%, transparent 70%)',
            }}
          />

          {/* Inner glow */}
          <motion.div
            initial={{ opacity: 0, scale: 0.3 }}
            animate={{ opacity: [0, 1, 1, 0], scale: [0.3, 1, 1.5, 2.5] }}
            transition={{ duration: 3.5, times: [0, 0.15, 0.65, 1], ease: 'easeOut' }}
            className="absolute w-[120px] h-[120px] rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(14,165,233,0.5) 0%, rgba(56,189,248,0.25) 50%, transparent 80%)',
              filter: 'blur(1px)',
            }}
          />

          {/* Text */}
          <motion.h1
            initial={{ opacity: 0, scale: 0.8, filter: 'blur(12px)' }}
            animate={{
              opacity: [0, 1, 1, 0],
              scale: [0.8, 1, 1, 1.05],
              filter: ['blur(12px)', 'blur(0px)', 'blur(0px)', 'blur(6px)'],
            }}
            transition={{ duration: 3.5, times: [0, 0.3, 0.7, 1], ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 text-7xl sm:text-8xl md:text-9xl font-bold tracking-tight"
            style={{
              fontFamily: "'Dancing Script', cursive",
              background: 'linear-gradient(135deg, #0ea5e9, #06b6d4, #38bdf8)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            JMMC
          </motion.h1>

          {/* Underline */}
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: [0, 1, 0.5, 0], scaleX: [0, 1, 1.3, 1.5] }}
            transition={{ duration: 3.5, times: [0, 0.25, 0.7, 1], ease: 'easeOut' }}
            className="absolute bottom-[38%] sm:bottom-[36%] md:bottom-[34%] h-[2px] w-24 origin-center rounded-full"
            style={{
              background: 'linear-gradient(90deg, transparent, #0ea5e9, transparent)',
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
