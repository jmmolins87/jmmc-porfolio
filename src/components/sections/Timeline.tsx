import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import type { Locale } from '../../lib/i18n';
import { t } from '../../lib/i18n';
import { fadeLeft, fadeRight, fadeUp, rippleNode } from '../../lib/animations';
import { cn } from '../../lib/utils';

interface Props {
  locale: Locale;
}

interface Experience {
  period: string;
  role: string;
  company: string;
  description: string;
  init: string;
}

const experiences: Experience[] = [
  {
    period: 'experience.period1',
    role: 'experience.role1',
    company: 'experience.company1',
    description: 'experience.desc1',
    init: 'experience.init1',
  },
  {
    period: 'experience.period2',
    role: 'experience.role2',
    company: 'experience.company2',
    description: 'experience.desc2',
    init: 'experience.init2',
  },
  {
    period: 'experience.period3',
    role: 'experience.role3',
    company: 'experience.company3',
    description: 'experience.desc3',
    init: 'experience.init3',
  },
  {
    period: 'experience.period4',
    role: 'experience.role4',
    company: 'experience.company4',
    description: 'experience.desc4',
    init: 'experience.init4',
  },
  {
    period: 'experience.period5',
    role: 'experience.role5',
    company: 'experience.company5',
    description: 'experience.desc5',
    init: 'experience.init5',
  },
  {
    period: 'experience.period6',
    role: 'experience.role6',
    company: 'experience.company6',
    description: 'experience.desc6',
    init: 'experience.init6',
  },
];

function TimelineMilestone({ exp, index, locale }: { exp: Experience; index: number; locale: Locale }) {
  const period = t(locale, exp.period);
  const company = t(locale, exp.company);

  return (
    <>
      {/* Mobile dot */}
      <motion.div
        variants={rippleNode}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
        className={cn(
          'md:hidden absolute w-4 h-4 rounded-full border-2 border-primary bg-background z-10',
          'left-[18px] -translate-x-1/2 -translate-y-1/2'
        )}
      >
        <motion.span
          className="absolute inset-0 rounded-full bg-primary/20"
          animate={{ scale: [1, 1.5, 1] }}
          transition={{ duration: 2, ease: 'easeInOut', delay: index * 0.3, repeat: Infinity }}
        />
      </motion.div>
      {/* Desktop pill */}
      <motion.div
        className={cn(
          'hidden md:flex flex-col items-center justify-center px-4 py-2',
          'rounded-xl border-2 border-primary bg-background',
          'absolute left-1/2 -translate-x-1/2 transform -translate-y-1/2 z-10'
        )}
        variants={rippleNode}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
      >
        <motion.span
          className="absolute inset-0 rounded-xl border-2 border-primary/50"
          initial={{ scale: 1, opacity: 1 }}
          whileInView={{ scale: 2.5, opacity: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, delay: index * 0.1 + 0.3, repeat: Infinity, repeatDelay: 2 }}
        />
        <motion.span
          className="absolute inset-0 rounded-xl bg-primary/5"
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut', delay: index * 0.3 }}
        />
        <span className="relative z-10 text-sm font-mono text-primary font-bold leading-tight whitespace-nowrap">
          {period}
        </span>
        <span className="relative z-10 text-xs text-foreground font-medium leading-tight whitespace-nowrap">
          {company}
        </span>
      </motion.div>
    </>
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
    <section id="experience" ref={sectionRef} className="relative pb-24 md:pb-32 noise-bg" style={{ background: 'var(--timeline-gradient)' }}>
      <div className="section-container flex flex-col gap-16 md:gap-20">
        <motion.h2
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
           viewport={{ once: true, margin: '-100px' }}
          className="section-title !mb-0"
        >
          {t(locale, 'experience.title')}
        </motion.h2>

        <div className="relative max-w-3xl mx-auto">
          <div className="absolute left-[18px] md:left-1/2 md:-translate-x-0.5 top-0 bottom-0 w-[2px] bg-border">
            <motion.div
              className="w-full bg-gradient-to-b from-primary via-accent to-secondary origin-top"
              style={{ height: lineHeight }}
            />
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="absolute left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-primary"
                style={{ boxShadow: '0 0 10px var(--color-primary)' }}
                initial={{ top: '0%', opacity: 0 }}
                animate={{
                  top: ['0%', '100%'],
                  opacity: [0, 1, 1, 0],
                }}
                transition={{
                  duration: 3 + i,
                  repeat: Infinity,
                  delay: i * 1.2,
                  ease: 'linear',
                }}
              />
            ))}
          </div>

    <div className="relative">
            {experiences.map((exp, i) => {
              const isEven = i % 2 === 0;

              return (
                <div key={i} className="relative pb-12 md:pb-24">
                  <TimelineMilestone exp={exp} index={i} locale={locale} />

                  <motion.div
                    variants={isEven ? fadeLeft : fadeRight}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-100px' }}
                    className={cn(
                      'ml-[54px] md:ml-0 md:w-1/2',
                      isEven ? 'md:ml-auto md:pl-12' : 'md:pr-12'
                    )}
                  >
                    <div className="rounded-2xl border border-border bg-card p-6 hover:glow-sm hover:border-primary/30 transition-all duration-300">
                      <div className="md:hidden flex items-center gap-2 mb-2 pb-2 border-b border-border">
                        <span className="text-xs font-mono text-primary font-bold">
                          {t(locale, exp.period)}
                        </span>
                        <span className="text-xs text-muted-foreground">·</span>
                        <span className="text-xs font-medium text-foreground">
                          {t(locale, exp.company)}
                        </span>
                      </div>
                      <h3 className="font-semibold text-lg mb-1">{t(locale, exp.role)}</h3>
                      <p className="text-sm text-muted-foreground">{t(locale, exp.description)}</p>
                    </div>
                  </motion.div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
