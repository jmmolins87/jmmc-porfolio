import { useState, useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  Code2,
  Database,
  Cloud,
  Brain,
  type LucideIcon,
} from 'lucide-react';
import type { Locale } from '../../lib/i18n';
import { t } from '../../lib/i18n';
import { fadeUp, staggerContainer, radialExplode, floatSlow, clipRevealUp } from '../../lib/animations';
import { cn } from '../../lib/utils';

interface Skill {
  name: string;
  icon: string;
  level: number;
}

interface Props {
  locale: Locale;
}

interface SkillCategory {
  titleKey: string;
  icon: LucideIcon;
  skills: Skill[];
}

function RadialSkill({ skill, index }: { skill: Skill; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [count, setCount] = useState(0);

  const radius = 42;
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;
    const duration = 800;
    const steps = 40;
    const increment = skill.level / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= skill.level) {
        setCount(skill.level);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [isVisible, skill.level]);

  const gradientId = `sg-${skill.name.replace(/[^a-zA-Z0-9]/g, '')}`;

  return (
    <motion.div
      custom={index}
      variants={radialExplode}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, margin: '-50px' }}
      className="bg-card border border-border rounded-2xl p-6 flex flex-col items-center gap-4"
    >
      <div ref={ref} className="relative w-[130px] h-[130px]">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="var(--color-primary)" />
              <stop offset="100%" stopColor="var(--color-accent)" />
            </linearGradient>
          </defs>
          <g transform="rotate(-90 50 50)">
            <circle cx="50" cy="50" r={radius} fill="none" stroke="var(--color-muted)" strokeWidth="6" />
            <motion.circle
              cx="50" cy="50" r={radius}
              fill="none"
              stroke={`url(#${gradientId})`}
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset: isVisible ? circumference * (1 - skill.level / 100) : circumference }}
              transition={{ type: 'spring', stiffness: 100, damping: 20, delay: index * 0.05 }}
            />
          </g>
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl mb-1">{skill.icon}</span>
          <span className="text-xl font-bold text-primary">{count}%</span>
        </div>
      </div>
      <span className="font-medium text-sm text-center text-foreground">{skill.name}</span>
    </motion.div>
  );
}

const categories: SkillCategory[] = [
  {
    titleKey: 'skills.frontend',
    icon: Code2,
    skills: [
      { name: 'React', icon: '⚛️', level: 90 },
      { name: 'Astro', icon: '🚀', level: 85 },
      { name: 'TypeScript', icon: '🔷', level: 95 },
      { name: 'Next.js', icon: '▲', level: 80 },
      { name: 'Tailwind', icon: '🌊', level: 95 },
      { name: 'Angular', icon: '🅰️', level: 85 },
      { name: 'Storybook', icon: '📖', level: 80 },
    ],
  },
  {
    titleKey: 'skills.backend',
    icon: Database,
    skills: [
      { name: 'Node.js', icon: '💚', level: 90 },
      { name: 'Python', icon: '🐍', level: 85 },
      { name: 'PostgreSQL', icon: '🐘', level: 80 },
      { name: 'GraphQL', icon: '◈', level: 75 },
      { name: 'Spring Boot', icon: '☕', level: 80 },
    ],
  },
  {
    titleKey: 'skills.devops',
    icon: Cloud,
    skills: [
      { name: 'Docker', icon: '🐳', level: 90 },
      { name: 'AWS', icon: '☁️', level: 85 },
      { name: 'Vercel', icon: '▲', level: 95 },
      { name: 'CI/CD', icon: '🔄', level: 90 },
    ],
  },
  {
    titleKey: 'skills.ai',
    icon: Brain,
    skills: [
      { name: 'OpenAI', icon: '🤖', level: 95 },
      { name: 'LangChain', icon: '⛓️', level: 85 },
      { name: 'RAG', icon: '📎', level: 80 },
      { name: 'n8n', icon: '⚡', level: 90 },
    ],
  },
];

export default function Skills({ locale }: Props) {
  const [activeCategory, setActiveCategory] = useState<string>(categories[0].titleKey);
  const active = categories.find((c) => c.titleKey === activeCategory) || categories[0];

  return (
    <section id="skills" className="relative min-h-screen flex items-center justify-center noise-bg" style={{ background: 'var(--skills-gradient)' }}>
      <div className="section-container">
        <motion.h2
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, margin: '-100px' }}
          className="section-title"
        >
          {t(locale, 'skills.title')}
        </motion.h2>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="flex flex-wrap gap-2 mb-12 justify-center"
        >
          {categories.map((cat) => (
            <motion.button
              key={cat.titleKey}
              variants={floatSlow}
              onClick={() => setActiveCategory(cat.titleKey)}
              className={cn(
                'cursor-pointer px-5 py-2.5 rounded-full text-sm font-medium transition-all',
                'focus-visible:ring-2 focus-visible:ring-primary/50',
                'active:scale-[0.95] hover:scale-110',
                'shadow-sm hover:shadow-md',
                cat.titleKey === activeCategory
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-card border border-border text-muted-foreground hover:bg-muted/50'
              )}
            >
              <span className="flex items-center gap-2">
                <cat.icon className="h-4 w-4" />
                {t(locale, cat.titleKey)}
              </span>
            </motion.button>
          ))}
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            variants={clipRevealUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, margin: '-50px' }}
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6"
          >
            {active.skills.map((skill, index) => (
              <RadialSkill key={skill.name} skill={skill} index={index} />
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
