import { ChevronUp, Mail, X } from 'lucide-react';
import { GithubIcon, LinkedInIcon } from '@/lib/icons';
import type { Locale } from '../../lib/i18n';
import { t } from '../../lib/i18n';
import { cn } from '../../lib/utils';

interface Props {
  locale: Locale;
}

const navLinks: { key: string; section: string }[] = [
  { key: 'about', section: 'about' },
  { key: 'projects', section: 'projects' },
  { key: 'services', section: 'services' },
  { key: 'blog', section: 'blog' },
  { key: 'contact', section: 'contact' },
];

export default function Footer({ locale }: Props) {
  function scrollToSection(section: string) {
    const el = document.getElementById(section);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }

  return (
    <footer className="relative">
      <div className="section-container">
        <div className="grid md:grid-cols-3 gap-10 mb-12">
          <div>
            <h3 className="font-semibold text-lg mb-3">Juanma MC</h3>
            <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
              {t(locale, 'hero.role')}
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-4 uppercase tracking-wider text-muted-foreground">
              {locale === 'es' ? 'Navegación' : 'Navigation'}
            </h4>
            <ul className="space-y-2">
              {navLinks.map(({ key, section }) => (
                <li key={key}>
                  <button
                    onClick={() => scrollToSection(section)}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer"
                  >
                    {t(locale, `nav.${key}`)}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-4 uppercase tracking-wider text-muted-foreground">
              {locale === 'es' ? 'Contacto' : 'Contact'}
            </h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="mailto:hello@jmmc.dev"
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  <Mail className="h-4 w-4" />
                  hello@jmmc.dev
                </a>
              </li>
              <li className="flex gap-3 pt-1">
                {[
                  { icon: GithubIcon, href: 'https://github.com/juanmamc', label: 'GitHub' },
                  { icon: LinkedInIcon, href: 'https://linkedin.com/in/juanmamc', label: 'LinkedIn' },
                  { icon: X, href: 'https://x.com/juanmamc', label: 'X' },
                ].map(({ icon: Icon, href, label }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card hover:bg-muted hover:text-primary transition-all"
                    aria-label={label}
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                ))}
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-8 border-t border-border">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className={cn(
              'flex h-10 w-10 items-center justify-center rounded-full',
              'border border-border bg-card hover:bg-muted transition-all duration-200',
              'hover:glow-sm cursor-pointer order-first md:order-none'
            )}
            aria-label={t(locale, 'footer.backToTop')}
          >
            <ChevronUp className="h-4 w-4" />
          </button>
          <p className="text-sm text-muted-foreground">
            {t(locale, 'footer.copyright')}
          </p>
        </div>
      </div>
    </footer>
  );
}
