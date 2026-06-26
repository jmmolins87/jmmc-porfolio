import { useState, useEffect, useRef } from 'react';
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
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stored = localStorage.getItem('theme') as Theme | null;
    setTheme(stored ?? 'system');
    setMounted(true);
  }, []);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
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

  function selectTheme(t: Theme) {
    setTheme(t);
    localStorage.setItem('theme', t);
    applyTheme(t);
    setOpen(false);
  }

  if (!mounted) {
    return <div className="h-10 w-10" />;
  }

  const current = themes.find((t) => t.value === theme)!;

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          'flex h-10 w-10 items-center justify-center rounded-full transition-all duration-200',
          'hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
          'cursor-pointer'
        )}
        aria-label={`Theme: ${current.label}`}
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        <current.icon className="h-5 w-5" />
      </button>

      {open && (
        <div
          role="listbox"
          aria-label="Select theme"
          className={cn(
            'absolute right-0 top-full mt-2 w-36',
            'rounded-xl border border-border bg-card p-1.5',
            'shadow-lg backdrop-blur-xl'
          )}
        >
          {themes.map(({ value, icon: Icon, label }) => (
            <button
              key={value}
              role="option"
              aria-selected={theme === value}
              onClick={() => selectTheme(value)}
              className={cn(
                'flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors',
                'hover:bg-muted cursor-pointer',
                theme === value && 'bg-muted font-medium'
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
