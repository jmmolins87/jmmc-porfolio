import { useRef, useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { MapPin } from 'lucide-react';
import type { Locale } from '../../lib/i18n';
import { t } from '../../lib/i18n';
import { fadeUp, fadeLeft, fadeRight, staggerContainer, portalReveal, wordFly, wordFlyLeft, wordFlyRight } from '../../lib/animations';
import { cn } from '../../lib/utils';

interface Props {
  locale: Locale;
}

function Counter({ value, label }: { value: number; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setStarted(true);
      },
      { threshold: 0 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;
    const duration = 1500;
    const steps = 60;
    const increment = value / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [started, value]);

  const done = count === value;

  return (
    <motion.div
      ref={ref}
      className="text-center"
      animate={done ? { scale: [1, 1.15, 1] } : {}}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      <span className="text-3xl md:text-4xl font-bold text-gradient block">
        {count}+
      </span>
      <span className="text-sm text-muted-foreground">{label}</span>
    </motion.div>
  );
}

export default function About({ locale }: Props) {
  return (
    <section id="about" className="relative pb-24 md:pb-32">
      <div className="section-container">
        <motion.h2
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="section-title !mb-0"
        >
          {t(locale, 'about.title')}
        </motion.h2>

        <div className="grid md:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
          <motion.div
            variants={fadeLeft}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            className="flex flex-col items-center gap-8"
          >
            <motion.div
              variants={portalReveal}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className={cn(
                'relative h-[300px] w-[300px] md:h-[400px] md:w-[400px]',
                'rounded-[32px] overflow-hidden',
                'border-2 border-primary/20',
                'bg-card'
              )}
            >
              <img
                src="/imgs/me.png"
                alt="Juanma MC"
                loading="lazy"
                width="400"
                height="400"
                className="h-full w-full object-cover"
              />
            </motion.div>

            <div className="flex items-center justify-center gap-2 text-muted-foreground">
              <MapPin className="h-5 w-5 text-primary" />
              <span>{t(locale, 'about.location')}</span>
            </div>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-3 gap-6 w-full max-w-sm"
            >
              <Counter value={18} label={t(locale, 'about.projects')} />
              <Counter value={6} label={t(locale, 'about.clients')} />
              <Counter value={7} label={t(locale, 'about.experience')} />
            </motion.div>
          </motion.div>

          <motion.div
            variants={fadeRight}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            className="space-y-6"
          >
            <motion.p
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ staggerChildren: 0.04 }}
              className="text-lg leading-relaxed text-muted-foreground"
            >
              {t(locale, 'about.bio').split(' ').map((word, i) => (
                <motion.span
                  key={i}
                  variants={i % 3 === 0 ? wordFly : i % 3 === 1 ? wordFlyLeft : wordFlyRight}
                  transition={{ duration: 0.3 }}
                  className="inline-block mr-[0.3em]"
                >
                  {word}
                </motion.span>
              ))}
            </motion.p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
