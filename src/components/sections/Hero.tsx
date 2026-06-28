import { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'motion/react';
import { ArrowDown } from 'lucide-react';
import { GithubIcon, LinkedInIcon } from '@/lib/icons';
import type { Locale } from '@/lib/i18n';
import { t } from '@/lib/i18n';
import { Button } from '@/components/ui';
import { cn } from '@/lib/utils';
import { scrollTo, stopLenis, startLenis, isProgrammaticScroll } from '@/lib/scroll';

interface Props {
  locale: Locale;
}

function Particles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    const isMobile = window.innerWidth < 768;
    const particleCount = isMobile ? 20 : 40;

    const particles: {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      opacity: number;
    }[] = [];

    function resize() {
      canvas!.width = window.innerWidth;
      canvas!.height = window.innerHeight;
    }

    function createParticles() {
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas!.width,
          y: Math.random() * canvas!.height,
          size: Math.random() * 3 + 1,
          speedX: (Math.random() - 0.5) * 0.5,
          speedY: -(Math.random() * 0.5 + 0.2),
          opacity: Math.random() * 0.4 + 0.1,
        });
      }
    }

    function animate() {
      ctx!.clearRect(0, 0, canvas!.width, canvas!.height);

      for (const p of particles) {
        p.x += p.speedX;
        p.y += p.speedY;

        if (p.y < -10) {
          p.y = canvas!.height + 10;
          p.x = Math.random() * canvas!.width;
        }
        if (p.x < -10) p.x = canvas!.width + 10;
        if (p.x > canvas!.width + 10) p.x = -10;

        ctx!.beginPath();
        ctx!.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(14, 165, 233, ${p.opacity})`;
        ctx!.fill();
      }

      animationId = requestAnimationFrame(animate);
    }

    resize();
    createParticles();
    animate();

    window.addEventListener('resize', resize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-0"
    />
  );
}

export default function Hero({ locale }: Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoStarted, setVideoStarted] = useState(false);
  const [videoEnded, setVideoEnded] = useState(false);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const y = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const videoScale = useTransform(scrollYProgress, [0, 0.5], [1, 0.85]);
  const videoOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0.3]);

  useEffect(() => {
    let triggered = false;
    const onScroll = async () => {
      if (triggered || videoStarted || isProgrammaticScroll()) return;
      triggered = true;
      const video = videoRef.current;
      if (!video) return;
      if (video.readyState < 3) {
        await new Promise<void>(resolve => {
          video.addEventListener('canplay', () => resolve(), { once: true });
        });
      }
      stopLenis();
      setVideoStarted(true);
      try { await video.play(); } catch { startLenis(); }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [videoStarted]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !videoStarted) return;
    const onEnded = () => {
      setVideoEnded(true);
      startLenis();
    };
    video.addEventListener('ended', onEnded);
    return () => video.removeEventListener('ended', onEnded);
  }, [videoStarted]);

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
      className={cn('min-h-screen flex items-center overflow-hidden', videoStarted && !videoEnded ? 'sticky top-0 z-10' : 'relative')}
      style={{ perspective: '1200px', background: 'linear-gradient(to bottom, var(--color-background), color-mix(in srgb, var(--color-primary) 8%, transparent), var(--color-background))' }}
    >
      <Particles />

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

            <div className="mb-6">
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
            <motion.div
              style={{ scale: videoScale, opacity: videoOpacity }}
              className={cn(
                'relative h-[400px] w-[400px] xl:h-[500px] xl:w-[500px]',
                'rounded-[32px] overflow-hidden',
                'border-2 border-primary/20',
                'bg-card shadow-2xl'
              )}
            >
              <video
                ref={videoRef}
                src="/videos/me-greeting-edit.mp4"
                muted
                playsInline
                width="500"
                height="500"
                className="h-full w-full object-cover"
              />
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={videoStarted
          ? (videoEnded ? { opacity: 1, y: [0, 8, 0] } : { opacity: 0.5 })
          : { opacity: 0 }
        }
        transition={videoEnded ? { opacity: { delay: 0 }, y: { duration: 2, repeat: Infinity } } : { duration: 0.6 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10"
      >
        <button
          onClick={() => videoEnded && scrollTo('about')}
          disabled={!videoEnded}
          className={cn(
            'flex flex-col items-center gap-2 transition-colors',
            videoEnded ? 'text-muted-foreground hover:text-primary cursor-pointer' : 'text-muted-foreground/30 cursor-default'
          )}
          aria-label={t(locale, 'hero.scroll')}
        >
          <span className="text-xs font-medium">{t(locale, 'hero.scroll')}</span>
          <ArrowDown className="h-5 w-5" />
        </button>
      </motion.div>
    </section>
  );
}
