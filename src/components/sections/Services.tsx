import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { Code, Bot, Lightbulb, type LucideIcon } from 'lucide-react';
import type { Locale } from '../../lib/i18n';
import { t } from '../../lib/i18n';
import { fadeUp, staggerContainer } from '../../lib/animations';
import { cn } from '../../lib/utils';

interface Props {
  locale: Locale;
}

interface ServiceItem {
  titleKey: string;
  descKey: string;
  icon: LucideIcon;
}

const services: ServiceItem[] = [
  {
    titleKey: 'services.web.title',
    descKey: 'services.web.desc',
    icon: Code,
  },
  {
    titleKey: 'services.ai.title',
    descKey: 'services.ai.desc',
    icon: Bot,
  },
  {
    titleKey: 'services.consulting.title',
    descKey: 'services.consulting.desc',
    icon: Lightbulb,
  },
];

function ServiceCard({ service, locale }: { service: ServiceItem; locale: Locale }) {
  const cardRef = useRef<HTMLDivElement>(null);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = (y - centerY) / 20;
    const rotateY = (centerX - x) / 20;
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
  }

  function handleMouseLeave() {
    const card = cardRef.current;
    if (!card) return;
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
  }

  return (
    <motion.div
      variants={fadeUp}
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={cn(
        'rounded-2xl border border-border bg-card p-8',
        'transition-all duration-200 ease-out cursor-default',
        'hover:glow-sm'
      )}
      style={{ transformStyle: 'preserve-3d' }}
    >
      <div
        className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 mb-6"
        style={{ transform: 'translateZ(20px)' }}
      >
        <service.icon className="h-7 w-7 text-primary" />
      </div>
      <h3
        className="text-xl font-semibold mb-3"
        style={{ transform: 'translateZ(30px)' }}
      >
        {t(locale, service.titleKey)}
      </h3>
      <p
        className="text-muted-foreground leading-relaxed"
        style={{ transform: 'translateZ(10px)' }}
      >
        {t(locale, service.descKey)}
      </p>
    </motion.div>
  );
}

export default function Services({ locale }: Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end end'],
  });

  return (
    <section id="services" ref={sectionRef} className="relative py-24 md:py-32">
      <div className="section-container">
        <motion.h2
          style={{
            opacity: useTransform(scrollYProgress, [0, 0.15], [0, 1]),
            y: useTransform(scrollYProgress, [0, 0.15], [40, 0]),
          }}
          className="section-title"
        >
          {t(locale, 'services.title')}
        </motion.h2>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid md:grid-cols-3 gap-8"
        >
          {services.map((service, i) => (
            <ServiceCard key={i} service={service} locale={locale} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
