import { motion } from 'motion/react';
import {
  Code2,
  Database,
  Cloud,
  Brain,
  type LucideIcon,
} from 'lucide-react';
import type { Locale } from '../../lib/i18n';
import { t } from '../../lib/i18n';
import { fadeUp, staggerContainer } from '../../lib/animations';
import { cn } from '../../lib/utils';

interface Skill {
  name: string;
  icon: string;
}

interface Props {
  locale: Locale;
}

interface SkillCategory {
  titleKey: string;
  icon: LucideIcon;
  skills: Skill[];
}

const categories: SkillCategory[] = [
  {
    titleKey: 'skills.frontend',
    icon: Code2,
    skills: [
      { name: 'React', icon: '⚛️' },
      { name: 'Astro', icon: '🚀' },
      { name: 'TypeScript', icon: '🔷' },
      { name: 'Next.js', icon: '▲' },
      { name: 'Tailwind', icon: '🌊' },
    ],
  },
  {
    titleKey: 'skills.backend',
    icon: Database,
    skills: [
      { name: 'Node.js', icon: '💚' },
      { name: 'Python', icon: '🐍' },
      { name: 'PostgreSQL', icon: '🐘' },
      { name: 'GraphQL', icon: '◈' },
    ],
  },
  {
    titleKey: 'skills.devops',
    icon: Cloud,
    skills: [
      { name: 'Docker', icon: '🐳' },
      { name: 'AWS', icon: '☁️' },
      { name: 'Vercel', icon: '▲' },
      { name: 'CI/CD', icon: '🔄' },
    ],
  },
  {
    titleKey: 'skills.ai',
    icon: Brain,
    skills: [
      { name: 'OpenAI', icon: '🤖' },
      { name: 'LangChain', icon: '⛓️' },
      { name: 'RAG', icon: '📎' },
      { name: 'n8n', icon: '⚡' },
    ],
  },
];

function SkillCard({ category, locale }: { category: SkillCategory; locale: Locale }) {
  return (
    <motion.div
      variants={fadeUp}
      className={cn(
        'rounded-2xl border border-border bg-card p-6',
        'hover:glow-sm transition-all duration-300'
      )}
    >
      <div className="flex items-center gap-3 mb-4">
        <category.icon className="h-5 w-5 text-primary" />
        <h3 className="font-semibold">{t(locale, category.titleKey)}</h3>
      </div>
      <div className="flex flex-wrap gap-2">
        {category.skills.map((skill) => (
          <span
            key={skill.name}
            className={cn(
              'inline-flex items-center gap-1.5 rounded-full px-3 py-1.5',
              'text-sm font-medium bg-muted text-muted-foreground',
              'hover:bg-primary/10 hover:text-primary transition-colors'
            )}
          >
            <span>{skill.icon}</span>
            {skill.name}
          </span>
        ))}
      </div>
    </motion.div>
  );
}

export default function Skills({ locale }: Props) {
  return (
    <section id="skills" className="relative py-24 md:py-32">
      <div className="section-container">
        <motion.h2
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="section-title"
        >
          {t(locale, 'skills.title')}
        </motion.h2>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {categories.map((cat) => (
            <SkillCard key={cat.titleKey} category={cat} locale={locale} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
