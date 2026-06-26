import { useRef } from 'react';
import { motion } from 'motion/react';
import { Code, Bot, Lightbulb, type LucideIcon } from 'lucide-react';
import type { Locale } from '@/lib/i18n';
import { t } from '@/lib/i18n';
import { fadeUp, fadeLeft, fadeRight } from '@/lib/animations';
import { cn } from '@/lib/utils';

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

const entries = [fadeLeft, fadeUp, fadeRight];

function ServiceCard({ service, locale, index }: { service: ServiceItem; locale: Locale; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = (y - centerY) / 15;
    const rotateY = (centerX - x) / 15;
    card.style.transform = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
    card.style.boxShadow = `0 20px 60px color-mix(in srgb, var(--color-primary) 25%, transparent)`;
  }

  function handleMouseLeave() {
    const card = cardRef.current;
    if (!card) return;
    card.style.transform = 'perspective(1200px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    card.style.boxShadow = '';
  }

  return (
    <motion.div
      variants={entries[index % entries.length]}
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
  return (
    <section id="services" className="relative min-h-screen flex items-center justify-center">
      <div className="section-container">
        <motion.h2
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, margin: '-100px' }}
          className="section-title"
        >
          {t(locale, 'services.title')}
        </motion.h2>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, margin: '-100px' }}
          className="grid md:grid-cols-3 gap-8"
        >
          {services.map((service, i) => (
            <ServiceCard key={i} service={service} locale={locale} index={i} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
