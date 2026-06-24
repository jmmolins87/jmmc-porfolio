import { ChevronUp } from 'lucide-react';
import { motion, useScroll, useSpring } from 'motion/react';
import type { Locale } from '../../lib/i18n';
import { t } from '../../lib/i18n';
import { cn } from '../../lib/utils';

interface Props {
  locale: Locale;
}

export default function Footer({ locale }: Props) {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  return (
    <footer className="relative">
      <motion.div
        className="fixed top-0 left-0 right-0 h-[2px] bg-primary origin-left z-[60]"
        style={{ scaleX }}
      />

      <div className="section-container text-center">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className={cn(
            'mx-auto mb-8 flex h-12 w-12 items-center justify-center rounded-full',
            'border border-border bg-card hover:bg-muted transition-all duration-200',
            'hover:glow-sm cursor-pointer'
          )}
          aria-label={t(locale, 'footer.backToTop')}
        >
          <ChevronUp className="h-5 w-5" />
        </button>

        <div className="flex justify-center gap-6 mb-6">
          {[
            { label: 'GitHub', href: 'https://github.com/juanmamc' },
            { label: 'LinkedIn', href: 'https://linkedin.com/in/juanmamc' },
            { label: 'Twitter', href: 'https://twitter.com/juanmamc' },
          ].map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>

        <p className="text-sm text-muted-foreground">
          {t(locale, 'footer.copyright')}
        </p>
      </div>
    </footer>
  );
}
