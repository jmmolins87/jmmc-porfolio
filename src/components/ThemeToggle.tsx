import { useState, useEffect } from 'react';
import { Moon, Sun, Monitor } from 'lucide-react';
import { cn } from '../lib/utils';

type Theme = 'light' | 'dark' | 'system';
const themes: { value: Theme; icon: typeof Sun; label: string }[] = [
  { value: 'light', icon: Sun, label: 'Light' },
  { value: 'dark', icon: Moon, label: 'Dark' },
  { value: 'system', icon: Monitor, label: 'System' },
];

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>('system');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('theme') as Theme | null;
    setTheme(stored ?? 'system');
    setMounted(true);
  }, []);

  function applyTheme(t: Theme) {
    const root = document.documentElement;
    const resolved =
      t === 'dark' || (t === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)
        ? 'dark'
        : 'light';
    root.classList.remove('light', 'dark');
    root.classList.add(resolved);
    root.style.colorScheme = resolved;
  }

  function cycleTheme() {
    const idx = themes.findIndex((t) => t.value === theme);
    const next = themes[(idx + 1) % themes.length].value;
    setTheme(next);
    localStorage.setItem('theme', next);
    applyTheme(next);
  }

  if (!mounted) {
    return <div className="h-10 w-10" />;
  }

  const current = themes.find((t) => t.value === theme)!;

  return (
    <button
      onClick={cycleTheme}
      className={cn(
        'flex h-10 w-10 items-center justify-center rounded-full transition-all duration-200',
        'hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
        'cursor-pointer'
      )}
      aria-label={`Theme: ${current.label}`}
      title={`Theme: ${current.label}`}
    >
      <current.icon className="h-5 w-5" />
    </button>
  );
}
