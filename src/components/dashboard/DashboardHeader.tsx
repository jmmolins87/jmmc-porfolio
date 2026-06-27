import { useState, useCallback } from 'react';
import { LogOut, LayoutDashboard, FileText, Plus, Menu, X } from 'lucide-react';
import type { Locale } from '../../lib/i18n';
import LanguageSwitcher from '../LanguageSwitcher';
import { Button } from '../ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle, SheetClose } from '../ui/sheet';
import { cn } from '../../lib/utils';

interface Props {
  locale: Locale;
}

export default function DashboardHeader({ locale }: Props) {
  const [open, setOpen] = useState(false);

  const handleLogout = useCallback(async () => {
    await fetch('/api/logout', { method: 'POST' });
    window.location.href = '/login';
  }, []);

  const navItems = [
    { href: '/dashboard', icon: LayoutDashboard, label: locale === 'es' ? 'Dashboard' : 'Dashboard' },
    { href: '/dashboard/blog', icon: FileText, label: 'Blog' },
    { href: '/dashboard/blog/new', icon: Plus, label: locale === 'es' ? 'Nuevo post' : 'New post' },
  ];

  return (
    <header className={cn(
      'fixed top-0 left-0 right-0 z-50',
      'px-3 pt-3 md:px-6'
    )}>
      <nav className={cn(
        'mx-auto flex h-16 max-w-7xl items-center justify-between',
        'rounded-full border border-border/60 px-4 glass md:px-6'
      )}>
        <a href="/dashboard" className="flex items-center gap-2">
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

        <div className="hidden md:flex items-center gap-1">
          {navItems.map(({ href, icon: Icon, label }) => (
            <a
              key={href}
              href={href}
              className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 hover:bg-muted"
            >
              <Icon className="h-4 w-4" />
              {label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <LanguageSwitcher locale={locale} />
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="hidden md:flex items-center gap-2"
          >
            <LogOut className="h-4 w-4" />
            {locale === 'es' ? 'Salir' : 'Logout'}
          </Button>

          <div className="md:hidden">
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Menu">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader className="flex flex-row items-center justify-between">
                  <SheetTitle>Dashboard</SheetTitle>
                  <SheetClose asChild>
                    <Button variant="ghost" size="icon" aria-label="Close menu">
                      <X className="h-5 w-5" />
                    </Button>
                  </SheetClose>
                </SheetHeader>
                <div className="mt-8 flex flex-col gap-2">
                  {navItems.map(({ href, icon: Icon, label }) => (
                    <a
                      key={href}
                      href={href}
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-3 w-full text-left px-4 py-3 rounded-xl text-sm font-medium hover:bg-muted transition-colors"
                    >
                      <Icon className="h-4 w-4" />
                      {label}
                    </a>
                  ))}
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full text-left px-4 py-3 rounded-xl text-sm font-medium hover:bg-destructive hover:text-destructive-foreground transition-colors cursor-pointer"
                  >
                    <LogOut className="h-4 w-4" />
                    {locale === 'es' ? 'Cerrar sesión' : 'Log out'}
                  </button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>
    </header>
  );
}
