import { useState, type ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';
import { Menu, X } from 'lucide-react';
import { Button } from './button';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle, SheetClose } from './sheet';
import { cn } from '../../lib/utils';
import type { Locale } from '../../lib/i18n';

export interface NavItem {
  key: string;
  label: string;
  href?: string;
  icon?: LucideIcon;
  onClick?: () => void;
  className?: string;
}

interface HeaderProps {
  locale: Locale;
  navItems: NavItem[];
  actions?: ReactNode;
  logoHref?: string;
  className?: string;
}

export default function Header({ locale, navItems, actions, logoHref = '/', className }: HeaderProps) {
  const [open, setOpen] = useState(false);

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50',
        'px-3 pt-3 md:px-6',
        className
      )}
    >
      <nav
        className={cn(
          'mx-auto flex h-16 max-w-7xl items-center justify-between',
          'rounded-full border border-border/60 px-4 glass md:px-6'
        )}
      >
        <a href={logoHref} className="flex items-center gap-2">
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
        </a>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          {navItems.map((item) =>
            item.href ? (
              <a
                key={item.key}
                href={item.href}
                className={cn(
                  'flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 hover:bg-muted',
                  item.className
                )}
              >
                {item.icon && <item.icon className="h-4 w-4" />}
                {item.label}
              </a>
            ) : (
              <button
                key={item.key}
                onClick={item.onClick}
                className={cn(
                  'flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 hover:bg-muted cursor-pointer',
                  item.className
                )}
              >
                {item.icon && <item.icon className="h-4 w-4" />}
                {item.label}
              </button>
            )
          )}
        </div>

        {/* Actions + mobile menu */}
        <div className="flex items-center gap-1">
          {actions}

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
                  {navItems.map((item) =>
                    item.href ? (
                      <a
                        key={item.key}
                        href={item.href}
                        onClick={() => setOpen(false)}
                        className={cn(
                          'flex items-center gap-3 w-full text-left px-4 py-3 rounded-xl text-sm font-medium hover:bg-muted transition-colors',
                          item.className
                        )}
                      >
                        {item.icon && <item.icon className="h-4 w-4" />}
                        {item.label}
                      </a>
                    ) : (
                      <button
                        key={item.key}
                        onClick={() => { item.onClick?.(); setOpen(false); }}
                        className={cn(
                          'flex items-center gap-3 w-full text-left px-4 py-3 rounded-xl text-sm font-medium hover:bg-muted transition-colors cursor-pointer',
                          item.className
                        )}
                      >
                        {item.icon && <item.icon className="h-4 w-4" />}
                        {item.label}
                      </button>
                    )
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>
    </header>
  );
}
