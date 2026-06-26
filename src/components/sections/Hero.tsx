import { useRef } from 'react';
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'motion/react';
import { ArrowDown, X } from 'lucide-react';
import { GithubIcon, LinkedInIcon } from '@/lib/icons';
import type { Locale } from '@/lib/i18n';
import { t } from '@/lib/i18n';
import { Button } from '@/components/ui';
import { cn } from '@/lib/utils';
import { scrollTo } from '@/lib/scroll';

interface Props {
  locale: Locale;
}

export default function Hero({ locale }: Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const y = useTransform(scrollYProgress, [0, 1], [0, 150]);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springMouseX = useSpring(mouseX, { stiffness: 150, damping: 15 });
  const springMouseY = useSpring(mouseY, { stiffness: 150, damping: 15 });
  const rotateX = useTransform(springMouseY, [-0.5, 0.5], [6, -6]);
  const rotateY = useTransform(springMouseX, [-0.5, 0.5], [-6, 6]);

  function handleMouseMove(e: React.MouseEvent) {
    const rect = sectionRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  }

  function handleMouseLeave() {
    mouseX.set(0);
    mouseY.set(0);
  }

  const name = t(locale, 'hero.name');

  return (
    <section
      id="hero"
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative min-h-screen flex items-center overflow-hidden"
      style={{ perspective: '1200px', background: 'linear-gradient(to bottom, var(--color-background), color-mix(in srgb, var(--color-primary) 8%, transparent), var(--color-background))' }}
    >
      <motion.div
        style={{ opacity, y }}
        className="relative z-10 w-full"
      >
        <div className="section-container grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <motion.div
            style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
            className="text-center lg:text-left"
          >
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-lg text-muted-foreground mb-4"
            >
              {t(locale, 'hero.greeting')}
            </motion.p>

            <div className="overflow-hidden mb-6">
              <motion.h1
                initial={{ clipPath: 'inset(0 100% 0 0)' }}
                animate={{ clipPath: 'inset(0 0% 0 0)' }}
                transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
                className="text-5xl md:text-7xl lg:text-8xl font-bold leading-[1.1]"
                style={{ fontFamily: "'Dancing Script', cursive" }}
              >
                {name}
              </motion.h1>
            </div>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="text-2xl md:text-3xl font-semibold text-gradient mb-4"
            >
              {t(locale, 'hero.role')}
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="text-lg text-muted-foreground max-w-xl mb-8"
            >
              {t(locale, 'hero.description')}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.9 }}
              className="flex flex-wrap gap-4 mb-8 justify-center lg:justify-start"
            >
              <Button
                size="lg"
                onClick={() => scrollTo('projects')}
              >
                {t(locale, 'hero.cta.projects')}
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => scrollTo('contact')}
              >
                {t(locale, 'hero.cta.contact')}
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 1.1 }}
              className="flex gap-4 justify-center lg:justify-start"
            >
              {[
                { icon: GithubIcon, href: 'https://github.com/juanmamc', label: 'GitHub' },
                { icon: LinkedInIcon, href: 'https://linkedin.com/in/juanmamc', label: 'LinkedIn' },
                { icon: X, href: 'https://x.com/juanmamc', label: 'X' },
              ].map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    'flex h-12 w-12 items-center justify-center rounded-2xl',
                    'border border-border bg-card hover:bg-muted transition-all duration-200',
                    'hover:glow-sm hover:-translate-y-1'
                  )}
                  aria-label={label}
                >
                  <Icon className="h-5 w-5" />
                </a>
              ))}
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="hidden lg:flex justify-center items-center"
          >
            <div className={cn(
              'relative h-[400px] w-[400px] xl:h-[500px] xl:w-[500px]',
              'rounded-[32px] overflow-hidden',
              'border-2 border-primary/20',
              'bg-card shadow-2xl'
            )}>
              <img
                src="/imgs/me.png"
                alt="Juanma MC"
                width="500"
                height="500"
                className="h-full w-full object-cover"
              />
            </div>
          </motion.div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 8, 0] }}
        transition={{ opacity: { delay: 1.5 }, y: { duration: 2, repeat: Infinity } }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10"
      >
        <button
          onClick={() => scrollTo('about')}
          className="flex flex-col items-center gap-2 text-muted-foreground hover:text-primary transition-colors cursor-pointer"
          aria-label={t(locale, 'hero.scroll')}
        >
          <span className="text-xs font-medium">{t(locale, 'hero.scroll')}</span>
          <ArrowDown className="h-5 w-5" />
        </button>
      </motion.div>
    </section>
  );
}
