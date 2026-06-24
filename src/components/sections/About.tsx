import { useRef, useState, useEffect } from 'react';
import {
  motion,
  useScroll,
  useTransform,
} from 'motion/react';
import { MapPin } from 'lucide-react';
import type { Locale } from '../../lib/i18n';
import { t } from '../../lib/i18n';
import { staggerContainer } from '../../lib/animations';
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

  return (
    <div ref={ref} className="text-center">
      <span className="text-3xl md:text-4xl font-bold text-gradient block">
        {count}+
      </span>
      <span className="text-sm text-muted-foreground">{label}</span>
    </div>
  );
}

export default function About({ locale }: Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end end'],
  });
  const opacity = useTransform(scrollYProgress, [0, 0.5], [0, 1]);
  const x = useTransform(scrollYProgress, [0, 0.5], [60, 0]);

  return (
    <section id="about" ref={sectionRef} className="relative py-24 md:py-32">
      <div className="section-container">
        <motion.h2
          style={{ opacity, y: useTransform(scrollYProgress, [0, 0.3], [40, 0]) }}
          className="section-title"
        >
          {t(locale, 'about.title')}
        </motion.h2>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            style={{ opacity, x: useTransform(scrollYProgress, [0, 0.5], [-60, 0]) }}
            className="flex justify-center"
          >
            <div className={cn(
              'relative h-[300px] w-[300px] md:h-[400px] md:w-[400px]',
              'rounded-[32px] overflow-hidden',
              'border-2 border-primary/20',
              'bg-card'
            )}>
              <img
                src="/imgs/me.png"
                alt="Juanma MC"
                loading="lazy"
                width="400"
                height="400"
                className="h-full w-full object-cover"
              />
            </div>
          </motion.div>

          <motion.div
            style={{ opacity, x }}
            className="space-y-6"
          >
            <p className="text-lg leading-relaxed text-muted-foreground">
              {t(locale, 'about.bio')}
            </p>

            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="h-5 w-5 text-primary" />
              <span>{t(locale, 'about.location')}</span>
            </div>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-3 gap-6 pt-4"
            >
              <Counter value={18} label={t(locale, 'about.projects')} />
              <Counter value={6} label={t(locale, 'about.clients')} />
              <Counter value={7} label={t(locale, 'about.experience')} />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
