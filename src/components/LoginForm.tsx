import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';

interface Props {
  locale: 'es' | 'en';
}

export default function LoginForm({ locale }: Props) {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const strings = {
    username: locale === 'es' ? 'Usuario' : 'Username',
    password: locale === 'es' ? 'Contraseña' : 'Password',
    enter: locale === 'es' ? 'Entrar' : 'Sign in',
    entering: locale === 'es' ? 'Entrando...' : 'Signing in...',
    forgot: locale === 'es' ? '¿Has olvidado la contraseña?' : 'Forgot password?',
    forgotMessage: locale === 'es'
      ? 'Contacta conmigo en jmmolins87@gmail.com para restablecer tu contraseña.'
      : 'Contact me at jmmolins87@gmail.com to reset your password.',
    error: locale === 'es' ? 'Credenciales inválidas' : 'Invalid credentials',
    success: locale === 'es' ? '¡Bienvenido al dashboard!' : 'Welcome to the dashboard!',
    connectionError: locale === 'es'
      ? 'Error de conexión. Inténtalo de nuevo.'
      : 'Connection error. Please try again.',
    title: locale === 'es' ? 'Acceso al Dashboard' : 'Dashboard Access',
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        toast.success(strings.success);
        const params = new URLSearchParams(window.location.search);
        const redirect = params.get('redirect') || '/dashboard/blog';
        setTimeout(() => { window.location.href = redirect; }, 500);
      } else {
        toast.error(strings.error);
      }
    } catch {
      toast.error(strings.connectionError);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-sm mx-auto px-4">
      <div className="rounded-2xl border border-border bg-card p-8">
        <div className="text-center mb-8">
          <a href="/" className="text-2xl font-bold tracking-tight hover:text-primary transition-colors">JMMC</a>
          <p className="text-sm text-muted-foreground mt-2">{strings.title}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium mb-1 text-foreground">
              {strings.username}
            </label>
            <input
              id="username"
              name="username"
              type="text"
              required
              autoComplete="username"
              className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              placeholder={strings.username}
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-1 text-foreground">
              {strings.password}
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                required
                autoComplete="current-password"
                className="w-full rounded-xl border border-border bg-background px-4 py-2.5 pr-12 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder={strings.password}
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
              onClick={() => { toast.info(strings.forgotMessage); }}
              className="text-xs text-muted-foreground hover:text-primary transition-colors cursor-pointer"
            >
              {strings.forgot}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer"
          >
            {loading ? strings.entering : strings.enter}
          </button>
        </form>
      </div>
    </div>
  );
}
