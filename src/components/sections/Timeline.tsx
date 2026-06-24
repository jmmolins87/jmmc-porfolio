import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import type { Locale } from '../../lib/i18n';
import { t } from '../../lib/i18n';
import { fadeLeft, fadeRight, fadeUp, staggerContainer } from '../../lib/animations';
import { cn } from '../../lib/utils';

interface Props {
  locale: Locale;
}

interface Experience {
  period: string;
  role: string;
  company: string;
  description: string;
}

const experiences: Experience[] = [
  {
    period: 'experience.period1',
    role: 'experience.role1',
    company: 'experience.company1',
    description: 'experience.desc1',
  },
  {
    period: 'experience.period2',
    role: 'experience.role2',
    company: 'experience.company2',
    description: 'experience.desc2',
  },
  {
    period: 'experience.period3',
    role: 'experience.role3',
    company: 'experience.company3',
    description: 'experience.desc3',
  },
  {
    period: 'experience.period4',
    role: 'experience.role4',
    company: 'experience.company4',
    description: 'experience.desc4',
  },
  {
    period: 'experience.period5',
    role: 'experience.role5',
    company: 'experience.company5',
    description: 'experience.desc5',
  },
  {
    period: 'experience.period6',
    role: 'experience.role6',
    company: 'experience.company6',
    description: 'experience.desc6',
  },
];

function TimelineEntry({ exp, index, locale }: { exp: Experience; index: number; locale: Locale }) {
  const isEven = index % 2 === 0;

  return (
    <motion.div
      variants={isEven ? fadeLeft : fadeRight}
      className={cn(
        'relative flex items-start gap-6 pb-12',
        'md:flex-row flex-col'
      )}
    >
      <div className={cn(
        'flex-shrink-0 md:w-1/3',
        isEven ? 'md:text-right' : 'md:text-left md:order-2'
      )}>
        <span className="text-sm font-mono text-primary">{t(locale, exp.period)}</span>
      </div>

      <div className="flex-shrink-0 relative flex justify-center">
        <div className="h-4 w-4 rounded-full border-2 border-primary bg-background z-10" />
      </div>

      <div className={cn(
        'flex-1',
        isEven ? 'md:order-3' : 'md:order-1'
      )}>
        <div className="rounded-2xl border border-border bg-card p-6 hover:glow-sm transition-all duration-300">
          <h3 className="font-semibold text-lg">{t(locale, exp.role)}</h3>
          <p className="text-sm text-primary font-medium mb-2">{t(locale, exp.company)}</p>
          <p className="text-sm text-muted-foreground">{t(locale, exp.description)}</p>
        </div>
      </div>
    </motion.div>
  );
}

export default function Timeline({ locale }: Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end end'],
  });

  const lineHeight = useTransform(scrollYProgress, [0, 0.6], ['0%', '100%']);

  return (
    <section id="experience" ref={sectionRef} className="relative py-24 md:py-32 overflow-hidden">
      <div className="section-container">
        <motion.h2
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="section-title"
        >
          {t(locale, 'experience.title')}
        </motion.h2>

        <div className="relative max-w-3xl mx-auto">
          <div className="absolute left-[18px] md:left-1/2 md:-translate-x-0.5 top-0 bottom-0 w-[2px] bg-border">
            <motion.div
              className="w-full bg-primary origin-top"
              style={{ height: lineHeight }}
            />
          </div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
          >
            {experiences.map((exp, i) => (
              <TimelineEntry key={i} exp={exp} index={i} locale={locale} />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
