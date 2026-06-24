import { motion } from 'motion/react';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import type { Locale } from '../../lib/i18n';
import { t } from '../../lib/i18n';
import { Badge } from '../ui/badge';
import { fadeUp, staggerContainer } from '../../lib/animations';
import { cn } from '../../lib/utils';

interface Props {
  locale: Locale;
  posts?: Post[];
}

interface Post {
  id: string;
  title: string;
  description: string;
  date: string;
  readTime: string;
  tags: string[];
}

export default function Blog({ locale, posts = [] }: Props) {
  if (posts.length === 0) return null;

  return (
    <section id="blog" className="relative py-24 md:py-32">
      <div className="section-container">
        <motion.h2
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
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
          {posts.map((post) => (
            <a
              key={post.id}
              href={`/blog/${post.id}`}
              className="block"
            >
              <motion.article
                variants={fadeUp}
                className={cn(
                  'group rounded-2xl border border-border bg-card p-6',
                  'hover:glow-sm transition-all duration-300 cursor-pointer'
                )}
              >
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4" />
                    {post.date}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-4 w-4" />
                    {post.readTime} {t(locale, 'blog.minRead')}
                  </span>
                </div>

                <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                  {post.title}
                </h3>

                <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                  {post.description}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap gap-1.5">
                    {post.tags.map((tag) => (
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
            </a>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
