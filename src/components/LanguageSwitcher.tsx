import { useCallback } from 'react';
import type { Locale } from '../lib/i18n';
import { cn } from '../lib/utils';

interface Props {
  locale: Locale;
}

export default function LanguageSwitcher({ locale }: Props) {
  const toggle = useCallback(() => {
    const next = locale === 'es' ? 'en' : 'es';
    window.location.href = `/${next}/`;
  }, [locale]);

  return (
    <button
      onClick={toggle}
      className={cn(
        'flex h-10 w-10 items-center justify-center rounded-full text-sm font-medium transition-all duration-200',
        'hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
        'cursor-pointer'
      )}
      aria-label={locale === 'es' ? 'Switch to English' : 'Cambiar a Español'}
    >
      {locale === 'es' ? 'EN' : 'ES'}
    </button>
  );
}
