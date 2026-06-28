import { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface User {
  id: string;
  username: string;
  email: string;
  role: string;
  createdAt: string;
}

export default function UserList() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/users')
      .then((r) => r.json())
      .then((data) => { setUsers(data); setLoading(false); })
      .catch(() => { toast.error('Error al cargar usuarios'); setLoading(false); });
  }, []);

  async function handleDelete(id: string, username: string) {
    if (!confirm(`¿Eliminar usuario "${username}"?`)) return;
    try {
      const res = await fetch(`/api/users/${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('Usuario eliminado');
        setUsers((prev) => prev.filter((u) => u.id !== id));
      } else {
        const body = await res.json();
        toast.error(body.error || 'Error al eliminar');
      }
    } catch {
      toast.error('Error de conexión');
    }
  }

  if (loading) return <p className="text-muted-foreground">Cargando...</p>;

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left py-3 px-4 font-medium">Usuario</th>
            <th className="text-left py-3 px-4 font-medium">Email</th>
            <th className="text-left py-3 px-4 font-medium">Rol</th>
            <th className="text-left py-3 px-4 font-medium">Creado</th>
            <th className="text-right py-3 px-4 font-medium">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="border-b border-border/50">
              <td className="py-3 px-4">{user.username}</td>
              <td className="py-3 px-4">{user.email}</td>
              <td className="py-3 px-4">
                <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-primary/10 text-primary">
                  {user.role}
                </span>
              </td>
              <td className="py-3 px-4">{new Date(user.createdAt).toLocaleDateString()}</td>
              <td className="py-3 px-4 text-right">
                <button
                  onClick={() => handleDelete(user.id, user.username)}
                  className="text-destructive hover:text-destructive/80 text-xs cursor-pointer"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
