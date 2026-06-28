import { describe, it, expect } from 'vitest';
import { t, detectLocale, getLocaleFromPath, locales, localeLabels } from '@/lib/i18n';

describe('t', () => {
  it('returns correct ES translation for a known key', () => {
    expect(t('es', 'nav.about')).toBe('Sobre mí');
    expect(t('es', 'hero.greeting')).toBe('Hola, soy');
    expect(t('es', 'about.title')).toBe('Sobre mí');
  });

  it('returns correct EN translation for a known key', () => {
    expect(t('en', 'nav.about')).toBe('About');
    expect(t('en', 'hero.greeting')).toBe("Hi, I'm");
    expect(t('en', 'about.title')).toBe('About Me');
  });

  it('returns the key itself for an unknown key', () => {
    expect(t('es', 'nonexistent.key')).toBe('nonexistent.key');
    expect(t('en', 'nonexistent.key')).toBe('nonexistent.key');
  });

  it('returns the same role value for both locales (identical text)', () => {
    expect(t('es', 'hero.role')).toBe('Fullstack Developer, AI & Automation Builder');
    expect(t('en', 'hero.role')).toBe('Fullstack Developer, AI & Automation Builder');
  });
});

describe('detectLocale', () => {
  it('returns en for English Accept-Language', () => {
    expect(detectLocale('en-US,en;q=0.9')).toBe('en');
    expect(detectLocale('en-GB,en;q=0.8')).toBe('en');
    expect(detectLocale('en')).toBe('en');
  });

  it('returns es for Spanish Accept-Language', () => {
    expect(detectLocale('es-ES,es;q=0.9')).toBe('es');
    expect(detectLocale('es-MX,es;q=0.8')).toBe('es');
    expect(detectLocale('es')).toBe('es');
  });

  it('returns es for unknown locale', () => {
    expect(detectLocale('fr-FR,fr;q=0.9')).toBe('es');
    expect(detectLocale('de-DE,de;q=0.9')).toBe('es');
  });

  it('returns es for empty string', () => {
    expect(detectLocale('')).toBe('es');
  });

  it('is case sensitive (EN != en) and returns es for uppercase', () => {
    expect(detectLocale('EN')).toBe('es');
  });
});

describe('getLocaleFromPath', () => {
  it('returns en for /en/* paths', () => {
    expect(getLocaleFromPath('/en')).toBe('en');
    expect(getLocaleFromPath('/en/blog')).toBe('en');
    expect(getLocaleFromPath('/en/about')).toBe('en');
  });

  it('returns es for /es/* paths', () => {
    expect(getLocaleFromPath('/es')).toBe('es');
    expect(getLocaleFromPath('/es/blog')).toBe('es');
    expect(getLocaleFromPath('/es/about')).toBe('es');
  });

  it('returns es for root path', () => {
    expect(getLocaleFromPath('/')).toBe('es');
  });

  it('returns es for unknown paths', () => {
    expect(getLocaleFromPath('/about')).toBe('es');
    expect(getLocaleFromPath('/blog')).toBe('es');
  });

  it('handles empty pathname', () => {
    expect(getLocaleFromPath('')).toBe('es');
  });
});

describe('locales', () => {
  it('contains es and en', () => {
    expect(locales).toContain('es');
    expect(locales).toContain('en');
    expect(locales).toHaveLength(2);
  });
});

describe('localeLabels', () => {
  it('maps locales to uppercase labels', () => {
    expect(localeLabels.es).toBe('ES');
    expect(localeLabels.en).toBe('EN');
  });
});
