import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import type { Locale } from '../../lib/i18n';
import { t } from '../../lib/i18n';
import { Badge } from '../ui/badge';
import { fadeUp, staggerContainer } from '../../lib/animations';
import { cn } from '../../lib/utils';

interface Props {
  locale: Locale;
}

interface Article {
  title: string;
  description: string;
  date: string;
  readTime: string;
  tags: string[];
  slug: string;
}

const articles: Article[] = [
  {
    title: 'Building Scalable Web Apps with Astro',
    description: 'How to leverage Astro\'s island architecture for performant web applications.',
    date: '2026-06-15',
    readTime: '8 min',
    tags: ['Astro', 'Architecture'],
    slug: 'building-scalable-web-apps-with-astro',
  },
  {
    title: 'AI Automation Workflows in 2026',
    description: 'A practical guide to setting up AI-driven automation pipelines.',
    date: '2026-05-20',
    readTime: '6 min',
    tags: ['AI', 'Automation'],
    slug: 'ai-automation-workflows-2026',
  },
  {
    title: 'TypeScript Best Practices for 2026',
    description: 'Modern TypeScript patterns and practices for cleaner code.',
    date: '2026-04-10',
    readTime: '10 min',
    tags: ['TypeScript', 'Best Practices'],
    slug: 'typescript-best-practices-2026',
  },
];

export default function Blog({ locale }: Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end end'],
  });

  return (
    <section id="blog" ref={sectionRef} className="relative py-24 md:py-32">
      <div className="section-container">
        <motion.h2
          style={{
            opacity: useTransform(scrollYProgress, [0, 0.15], [0, 1]),
            y: useTransform(scrollYProgress, [0, 0.15], [40, 0]),
          }}
          className="section-title"
        >
          {t(locale, 'blog.title')}
        </motion.h2>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="max-w-3xl mx-auto space-y-6"
        >
          {articles.map((article) => (
            <motion.article
              key={article.slug}
              variants={fadeUp}
              className={cn(
                'group rounded-2xl border border-border bg-card p-6',
                'hover:glow-sm transition-all duration-300 cursor-pointer'
              )}
            >
              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" />
                  {article.date}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4" />
                  {article.readTime} {t(locale, 'blog.minRead')}
                </span>
              </div>

              <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                {article.title}
              </h3>

              <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                {article.description}
              </p>

              <div className="flex items-center justify-between">
                <div className="flex flex-wrap gap-1.5">
                  {article.tags.map((tag) => (
                    <Badge key={tag} variant="default" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <span className="flex items-center gap-1 text-sm text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                  {t(locale, 'blog.readMore')}
                  <ArrowRight className="h-4 w-4" />
                </span>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
