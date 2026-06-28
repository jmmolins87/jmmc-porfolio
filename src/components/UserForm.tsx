import { useState } from 'react';
import { toast } from 'sonner';

interface Props {
  onSuccess?: () => void;
}

export default function UserForm({ onSuccess }: Props) {
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const form = e.currentTarget;
    const formData = new FormData(form);
    const username = formData.get('username') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirmPassword') as string;

    if (password !== confirmPassword) {
      toast.error('Las contraseñas no coinciden');
      setLoading(false);
      return;
    }

    if (password.length < 8) {
      toast.error('Mínimo 8 caracteres');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });
      if (res.ok) {
        toast.success('Usuario creado');
        form.reset();
        if (onSuccess) onSuccess();
      } else {
        const body = await res.json();
        toast.error(body.error || 'Error al crear usuario');
      }
    } catch {
      toast.error('Error de conexión');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
      <div>
        <label htmlFor="username" className="block text-sm font-medium mb-1">Usuario</label>
        <input id="username" name="username" type="text" required className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm" />
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
        <input id="email" name="email" type="email" required className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm" />
      </div>
      <div>
        <label htmlFor="password" className="block text-sm font-medium mb-1">Contraseña</label>
        <input id="password" name="password" type="password" required minLength={8} className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm" />
      </div>
      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1">Repetir contraseña</label>
        <input id="confirmPassword" name="confirmPassword" type="password" required minLength={8} className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm" />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-full bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer"
      >
        {loading ? 'Creando...' : 'Crear usuario'}
      </button>
    </form>
  );
}
