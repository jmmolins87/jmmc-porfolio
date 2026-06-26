import { useEffect, useRef } from 'react';
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

function ParticlesBg() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = window.innerWidth < 768;
    const particleCount = prefersReducedMotion ? 0 : isMobile ? 20 : 50;

    let animId: number;
    const particles: { x: number; y: number; vx: number; vy: number; size: number; alpha: number }[] = [];

    function resize() {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2 + 1,
        alpha: Math.random() * 0.3 + 0.1,
      });
    }

    function animate() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(124, 58, 237, ${p.alpha})`;
        ctx.fill();
      }

      animId = requestAnimationFrame(animate);
    }

    if (!prefersReducedMotion) {
      animate();
    }

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" aria-label="Fondo animado de partículas" />;
}

function GradientOrbs() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute rounded-full opacity-20 blur-3xl bg-primary h-[600px] w-[600px] top-[10%] left-[15%] animate-pulse" />
      <div className="absolute rounded-full opacity-15 blur-3xl bg-accent h-[400px] w-[400px] top-[30%] right-[20%] animate-pulse" style={{ animationDelay: '2s' }} />
      <div className="absolute rounded-full opacity-10 blur-3xl bg-blue-500 h-[500px] w-[500px] bottom-[10%] left-[40%] animate-pulse" style={{ animationDelay: '4s' }} />
    </div>
  );
}

export default function Hero({ locale }: Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.95]);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springMouseX = useSpring(mouseX, { stiffness: 150, damping: 15 });
  const springMouseY = useSpring(mouseY, { stiffness: 150, damping: 15 });
  const rotateX = useTransform(springMouseY, [-0.5, 0.5], [8, -8]);
  const rotateY = useTransform(springMouseX, [-0.5, 0.5], [-8, 8]);

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
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{ perspective: '1200px' }}
    >
      <motion.div
        style={{ opacity }}
        className="absolute inset-0 z-0"
      >
        <GradientOrbs />
        <ParticlesBg />
      </motion.div>

      <motion.div
        style={{ opacity, y, scale, rotateX, rotateY, transformStyle: 'preserve-3d' }}
        className="relative z-10 section-container text-center max-w-4xl"
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
          className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8"
        >
          {t(locale, 'hero.description')}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="flex flex-wrap justify-center gap-4 mb-8"
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
          className="flex justify-center gap-4"
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
