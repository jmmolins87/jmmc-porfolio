import es from '../content/i18n/es.json';
import en from '../content/i18n/en.json';

export type Locale = 'es' | 'en';

const translations: Record<Locale, Record<string, string>> = { es, en };

export function t(locale: Locale, key: string): string {
  return translations[locale]?.[key] ?? key;
}

export function detectLocale(acceptLanguage: string): Locale {
  if (acceptLanguage.startsWith('en')) return 'en';
  return 'es';
}

export function getLocaleFromPath(pathname: string): Locale {
  if (pathname.startsWith('/en')) return 'en';
  return 'es';
}

export const locales: Locale[] = ['es', 'en'];
export const localeLabels: Record<Locale, string> = { es: 'ES', en: 'EN' };
