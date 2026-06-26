import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import type { Locale } from '@/lib/i18n';
import { t } from '@/lib/i18n';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { fadeUp, staggerContainer, cardFling } from '@/lib/animations';
import { stopLenis, startLenis } from '@/lib/scroll';

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
  content?: string;
}

export default function Blog({ locale, posts = [] }: Props) {
  const [selected, setSelected] = useState<Post | null>(null);

  useEffect(() => {
    if (selected) {
      stopLenis();
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.documentElement.style.overflow = 'hidden';
      document.documentElement.style.paddingRight = `${scrollbarWidth}px`;
    }
    return () => {
      if (selected) {
        startLenis();
        document.documentElement.style.overflow = '';
        document.documentElement.style.paddingRight = '';
      }
    };
  }, [selected]);

  if (posts.length === 0) return null;

  return (
    <section id="blog" className="relative min-h-screen flex items-center justify-center">
      <div className="section-container">
        <motion.h2
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, margin: '-100px' }}
          className="section-title"
        >
          {t(locale, 'blog.title')}
        </motion.h2>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, margin: '-100px' }}
          className="max-w-3xl mx-auto space-y-6"
        >
          {posts.map((post) => (
            <motion.article
              key={post.id}
              variants={cardFling}
              className="group rounded-2xl border border-border bg-card p-6 hover:glow-sm transition-all duration-300 cursor-pointer"
              onClick={() => setSelected(post)}
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
          ))}
        </motion.div>
      </div>

      <Dialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto">
          {selected && (
            <>
              <DialogHeader className="mb-6">
                <DialogTitle className="text-2xl">{selected.title}</DialogTitle>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4" />
                    {selected.date}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-4 w-4" />
                    {selected.readTime} {t(locale, 'blog.minRead')}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {selected.tags.map((tag) => (
                    <Badge key={tag} variant="default" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </DialogHeader>
              <div
                className="text-muted-foreground leading-relaxed space-y-4 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-foreground [&_h2]:mt-6 [&_h2]:mb-3 [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-foreground [&_h3]:mt-4 [&_h3]:mb-2 [&_p]:mb-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-1 [&_li]:text-muted-foreground [&_strong]:text-foreground [&_code]:bg-muted [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-sm [&_code]:font-mono"
                dangerouslySetInnerHTML={{ __html: selected.content || '' }}
              />
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
