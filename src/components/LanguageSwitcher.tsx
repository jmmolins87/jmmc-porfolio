import { useCallback } from 'react';
import type { Locale } from '@/lib/i18n';
import { cn } from '@/lib/utils';

interface Props {
  locale: Locale;
}

export default function LanguageSwitcher({ locale }: Props) {
  const toggle = useCallback(() => {
    const next = locale === 'es' ? 'en' : 'es';
    window.location.href = `/${next}/`;
  }, [locale]);

  const isActiveES = locale === 'es';
  const isActiveEN = locale === 'en';

  return (
    <button
      onClick={toggle}
      className={cn(
        'relative flex h-8 w-16 cursor-pointer items-center rounded-full border border-border bg-muted p-0.5',
        'transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary'
      )}
      role="switch"
      aria-checked={isActiveEN}
      aria-label={locale === 'es' ? 'Switch to English' : 'Cambiar a Español'}
    >
      <span
        className={cn(
          'absolute left-0.5 h-7 w-7 rounded-full bg-card shadow-sm border border-border transition-transform duration-200',
          isActiveEN && 'translate-x-8'
        )}
      />
      <span className="relative z-10 flex w-full items-center justify-between px-1.5">
        <span className={cn(
          'text-xs font-medium transition-colors duration-200',
          isActiveES ? 'text-foreground' : 'text-muted-foreground'
        )}>ES</span>
        <span className={cn(
          'text-xs font-medium transition-colors duration-200',
          isActiveEN ? 'text-foreground' : 'text-muted-foreground'
        )}>EN</span>
      </span>
    </button>
  );
}
