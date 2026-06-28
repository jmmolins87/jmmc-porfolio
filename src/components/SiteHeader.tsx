import type { Locale } from '@/lib/i18n';
import { t } from '@/lib/i18n';
import Header from '@/components/ui/header';
import ThemeToggle from '@/components/ThemeToggle';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { scrollTo } from '@/lib/scroll';
import { useActiveSection } from '@/hooks/useActiveSection';

interface Props {
  locale: Locale;
}

const navKeys = ['about', 'skills', 'experience', 'projects', 'services', 'blog', 'contact'] as const;

export default function SiteHeader({ locale }: Props) {
  const activeSection = useActiveSection();

  return (
    <Header
      locale={locale}
      activeSection={activeSection}
      navItems={navKeys.map((key) => ({
        key,
        label: t(locale, `nav.${key}`),
        onClick: () => scrollTo(key === 'about' ? 'about' : key),
      }))}
      actions={
        <>
          <ThemeToggle />
          <LanguageSwitcher locale={locale} />
        </>
      }
    />
  );
}
