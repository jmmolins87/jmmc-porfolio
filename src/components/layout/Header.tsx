import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import type { Locale } from '../../lib/i18n';
import { t } from '../../lib/i18n';
import ThemeToggle from '../ThemeToggle';
import LanguageSwitcher from '../LanguageSwitcher';
import { Button } from '../ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle, SheetClose } from '../ui/sheet';
import { cn } from '../../lib/utils';
import { scrollTo } from '../../lib/scroll';

interface Props {
  locale: Locale;
}

const navKeys: { key: string; section: string }[] = [
  { key: 'about', section: 'about' },
  { key: 'skills', section: 'skills' },
  { key: 'experience', section: 'experience' },
  { key: 'projects', section: 'projects' },
  { key: 'services', section: 'services' },
  { key: 'blog', section: 'blog' },
  { key: 'contact', section: 'contact' },
];

export default function Header({ locale }: Props) {
  const [open, setOpen] = useState(false);

  function handleNav(section: string) {
    scrollTo(section);
    setOpen(false);
  }

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50',
        'px-3 pt-3 md:px-6'
      )}
    >
      <nav
        className={cn(
          'mx-auto flex h-16 max-w-7xl items-center justify-between',
          'rounded-full border border-border/60 px-4 glass md:px-6'
        )}
      >
        <button
          onClick={() => handleNav('hero')}
          className="flex items-center cursor-pointer"
        >
          <img
            src="/legacy/logo/jmmc_logo_negro.png"
            alt="JMMC"
            height="28"
            className="dark:hidden"
          />
          <img
            src="/legacy/logo/jmmc_logo_blanco.png"
            alt="JMMC"
            height="28"
            className="hidden dark:block"
          />
        </button>

        <div className="hidden md:flex items-center gap-1">
          {navKeys.map(({ key, section }) => (
            <button
              key={key}
              onClick={() => handleNav(section)}
              className={cn(
                'px-4 py-2 rounded-full text-sm font-medium transition-all duration-200',
                'hover:bg-muted cursor-pointer'
              )}
            >
              {t(locale, `nav.${key}`)}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1">
          <ThemeToggle />
          <LanguageSwitcher locale={locale} />

          <div className="md:hidden">
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Menu">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader className="flex flex-row items-center justify-between">
                  <SheetTitle>JMMC</SheetTitle>
                  <SheetClose asChild>
                    <Button variant="ghost" size="icon" aria-label={locale === 'es' ? 'Cerrar menú' : 'Close menu'}>
                      <X className="h-5 w-5" />
                    </Button>
                  </SheetClose>
                </SheetHeader>
                <div className="mt-8 flex flex-col gap-2">
                  {navKeys.map(({ key, section }) => (
                    <button
                      key={key}
                      onClick={() => handleNav(section)}
                      className="w-full text-left px-4 py-3 rounded-xl text-sm font-medium hover:bg-muted transition-colors cursor-pointer"
                    >
                      {t(locale, `nav.${key}`)}
                    </button>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>
    </header>
  );
}
