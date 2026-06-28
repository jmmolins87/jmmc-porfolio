import { useCallback } from 'react';
import type { Locale } from '@/lib/i18n';
import Header from '@/components/ui/header';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { LayoutDashboard, FileText, Plus, LogOut } from 'lucide-react';

interface Props {
  locale: Locale;
}

export default function DashboardSiteHeader({ locale }: Props) {
  const handleLogout = useCallback(async () => {
    await fetch('/api/logout', { method: 'POST' });
    window.location.href = '/login';
  }, []);

  return (
    <Header
      locale={locale}
      navItems={[
        { key: 'dashboard', label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
        { key: 'blog', label: 'Blog', href: '/dashboard/blog', icon: FileText },
        { key: 'new', label: locale === 'es' ? 'Nuevo post' : 'New post', href: '/dashboard/blog/new', icon: Plus },
        { key: 'logout', label: locale === 'es' ? 'Salir' : 'Logout', onClick: handleLogout, icon: LogOut, className: 'hover:bg-destructive hover:text-destructive-foreground' },
      ]}
      actions={<LanguageSwitcher locale={locale} />}
    />
  );
}
