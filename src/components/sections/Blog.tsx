import { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'motion/react';
import { Calendar, Clock, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import type { Locale } from '@/lib/i18n';
import { t } from '@/lib/i18n';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { fadeUp } from '@/lib/animations';
import { stopLenis, startLenis } from '@/lib/scroll';
import { cn } from '@/lib/utils';

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
  coverImage?: string;
}

export default function Blog({ locale, posts = [] }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [selected, setSelected] = useState<Post | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  cardsRef.current = cardsRef.current.slice(0, posts.length);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const index = Number(entry.target.getAttribute('data-index'));
            setActiveIndex(index);
          }
        }
      },
      { root: container, threshold: 0.7 }
    );

    for (const card of cardsRef.current) {
      if (card) observer.observe(card);
    }

    return () => observer.disconnect();
  }, [posts]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (activeIndex < posts.length - 1) {
        goNext();
      } else {
        scrollToCard(0);
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [activeIndex, posts.length]);

  const scrollToCard = useCallback((index: number) => {
    const container = containerRef.current;
    const card = cardsRef.current[index];
    if (!container || !card) return;

    setActiveIndex(index);

    const targetLeft = card.offsetLeft + (card.offsetWidth / 2) - (container.clientWidth / 2);
    const maxLeft = container.scrollWidth - container.clientWidth;
    const clampedLeft = Math.max(0, Math.min(targetLeft, maxLeft));

    container.scrollTo({
      left: clampedLeft,
      behavior: 'smooth',
    });
  }, []);

  function goNext() {
    scrollToCard(Math.min(activeIndex + 1, posts.length - 1));
  }

  function goPrev() {
    scrollToCard(Math.max(activeIndex - 1, 0));
  }

  function openPost(post: Post) {
    stopLenis();
    setSelected(post);
  }

  function closePost() {
    startLenis();
    setSelected(null);
  }

  if (posts.length === 0) return null;

  return (
    <section id="blog" className="relative py-20">
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

        <div className="relative flex items-center">
          <button
            onClick={goPrev}
            disabled={activeIndex === 0}
            className={cn(
              'hidden md:flex shrink-0 mr-4 h-10 w-10 items-center justify-center rounded-full z-10',
              'border border-border bg-background/80 backdrop-blur-sm shadow-sm',
              'hover:bg-muted transition-all cursor-pointer',
              activeIndex === 0 && 'opacity-30 pointer-events-none'
            )}
            aria-label={locale === 'es' ? 'Anterior' : 'Previous'}
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <div
            ref={containerRef}
            className="flex-1 max-w-[1200px] mx-auto flex gap-3 overflow-x-auto snap-x snap-mandatory scroll-smooth px-0 py-2 [&::-webkit-scrollbar]:hidden"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {posts.map((post, i) => (
              <div
                key={post.id}
                ref={(el) => { cardsRef.current[i] = el; }}
                data-index={i}
                className="snap-center shrink-0 w-[87.5%]"
              >
                <article
                  onClick={() => openPost(post)}
                  className="group rounded-2xl border border-border bg-card p-6 hover:glow-sm hover:border-primary/30 transition-all duration-300 cursor-pointer h-full flex flex-col"
                >
                  {post.coverImage && (
                    <img
                      src={post.coverImage}
                      alt={post.title}
                      className="w-full h-48 object-cover rounded-xl mb-4"
                      loading="lazy"
                    />
                  )}
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

                  <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                    {post.title}
                  </h3>

                  <p className="text-muted-foreground text-sm mb-4 line-clamp-3 flex-grow">
                    {post.description}
                  </p>

                  <div className="flex flex-col gap-3 mt-auto">
                    <div className="flex flex-wrap gap-1.5">
                      {post.tags.map((tag) => (
                        <Badge key={tag} variant="default" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <span className="flex items-center gap-1 text-sm text-primary font-medium self-end">
                      {t(locale, 'blog.readMore')}
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  </div>
                </article>
              </div>
            ))}
          </div>

          <button
            onClick={goNext}
            disabled={activeIndex === posts.length - 1}
            className={cn(
              'hidden md:flex shrink-0 ml-4 h-10 w-10 items-center justify-center rounded-full z-10',
              'border border-border bg-background/80 backdrop-blur-sm shadow-sm',
              'hover:bg-muted transition-all cursor-pointer',
              activeIndex === posts.length - 1 && 'opacity-30 pointer-events-none'
            )}
            aria-label={locale === 'es' ? 'Siguiente' : 'Next'}
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="flex justify-center gap-2 mt-8">
        {posts.map((_, i) => (
          <button
            key={i}
            onClick={() => scrollToCard(i)}
            className={cn(
              'h-2 rounded-full transition-all duration-300 cursor-pointer',
              i === activeIndex
                ? 'w-8 bg-primary'
                : 'w-2 bg-border hover:bg-muted-foreground/50'
            )}
            aria-label={`${locale === 'es' ? 'Ir a' : 'Go to'} ${t(locale, 'blog.title')} ${i + 1}`}
          />
        ))}
      </div>

      <Dialog open={!!selected} onOpenChange={(open) => { if (!open) closePost(); }}>
        <DialogContent className="sm:max-w-2xl overflow-y-auto max-h-[85vh]">
          {selected && (
            <>
              <DialogHeader>
                {selected.coverImage && (
                  <img
                    src={selected.coverImage}
                    alt={selected.title}
                    className="w-full h-56 object-cover rounded-xl mb-4"
                  />
                )}
                <DialogTitle className="text-2xl">{selected.title}</DialogTitle>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4" />
                    {selected.date}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-4 w-4" />
                    {selected.readTime} {t(locale, 'blog.minRead')}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
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
