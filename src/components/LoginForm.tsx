import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { t } from '@/lib/i18n';
import type { Locale } from '@/lib/i18n';

interface Props {
  locale: Locale;
}

export default function LoginForm({ locale }: Props) {
  const [view, setView] = useState<'login' | 'forgot'>('login');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const s = {
    username: t(locale, 'login.username'),
    password: t(locale, 'login.password'),
    enter: t(locale, 'login.enter'),
    entering: t(locale, 'login.entering'),
    forgot: t(locale, 'login.forgot'),
    error: t(locale, 'login.error'),
    success: t(locale, 'login.success'),
    connectionError: t(locale, 'login.connectionError'),
    title: t(locale, 'login.access'),
    forgotTitle: t(locale, 'login.forgotTitle'),
    newPassword: t(locale, 'login.newPassword'),
    confirmPassword: t(locale, 'login.confirmPassword'),
    forgotSuccess: t(locale, 'login.forgotSuccess'),
    forgotError: t(locale, 'login.forgotError'),
    passwordMismatch: t(locale, 'login.passwordMismatch'),
    passwordTooShort: t(locale, 'login.passwordTooShort'),
    backToLogin: t(locale, 'login.backToLogin'),
  };

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      const res = await fetch('/api/login', { method: 'POST', body: formData });
      if (res.ok) {
        toast.success(s.success);
        const params = new URLSearchParams(window.location.search);
        const redirect = params.get('redirect') || '/dashboard/blog';
        setTimeout(() => { window.location.href = redirect; }, 500);
      } else {
        toast.error(s.error);
      }
    } catch {
      toast.error(s.connectionError);
    } finally {
      setLoading(false);
    }
  }

  async function handleForgotPassword(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const form = e.currentTarget;
    const formData = new FormData(form);
    const username = formData.get('username') as string;
    const newPassword = formData.get('newPassword') as string;
    const confirmPassword = formData.get('confirmPassword') as string;

    if (newPassword.length < 8) {
      toast.error(s.passwordTooShort);
      setLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error(s.passwordMismatch);
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, newPassword }),
      });
      if (res.ok) {
        toast.success(s.forgotSuccess);
        setView('login');
      } else {
        toast.error(s.forgotError);
      }
    } catch {
      toast.error(s.connectionError);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-sm mx-auto px-4">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold tracking-tight">JMMC</h1>
      </div>

      <div className="rounded-2xl border border-border bg-card p-8">
        <div className="text-center mb-8">
          <p className="text-sm text-muted-foreground">{view === 'login' ? s.title : s.forgotTitle}</p>
        </div>

        {view === 'login' ? (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium mb-1 text-foreground">{s.username}</label>
              <input
                id="username"
                name="username"
                type="text"
                required
                autoComplete="username"
                className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder={s.username}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-1 text-foreground">{s.password}</label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  className="w-full rounded-xl border border-border bg-background px-4 py-2.5 pr-12 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder={s.password}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                  aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setView('forgot')}
                className="text-xs text-muted-foreground hover:text-primary transition-colors cursor-pointer"
              >
                {s.forgot}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer"
            >
              {loading ? s.entering : s.enter}
            </button>
          </form>
        ) : (
          <form onSubmit={handleForgotPassword} className="space-y-4">
            <div>
              <label htmlFor="forgot-username" className="block text-sm font-medium mb-1 text-foreground">{s.username}</label>
              <input
                id="forgot-username"
                name="username"
                type="text"
                required
                autoComplete="username"
                className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder={s.username}
              />
            </div>

            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium mb-1 text-foreground">{s.newPassword}</label>
              <div className="relative">
                <input
                  id="newPassword"
                  name="newPassword"
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={8}
                  className="w-full rounded-xl border border-border bg-background px-4 py-2.5 pr-12 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder={s.newPassword}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1 text-foreground">{s.confirmPassword}</label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showPassword ? 'text' : 'password'}
                required
                minLength={8}
                className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder={s.confirmPassword}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer"
            >
              {loading ? s.entering : s.forgotTitle}
            </button>

            <button
              type="button"
              onClick={() => setView('login')}
              className="w-full text-center text-xs text-muted-foreground hover:text-primary transition-colors cursor-pointer"
            >
              {s.backToLogin}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
