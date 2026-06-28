import type { APIRoute } from 'astro';
import { eq } from 'drizzle-orm';
import { db } from '@/db/index';
import { users } from '@/db/schema';
import { hashPassword } from '@/lib/auth';

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { username, newPassword } = body;

    if (!username || !newPassword) {
      return new Response(
        JSON.stringify({ error: 'Usuario y nueva contraseña requeridos' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (newPassword.length < 8) {
      return new Response(
        JSON.stringify({ error: 'La contraseña debe tener al menos 8 caracteres' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const user = await db.query.users.findFirst({ where: eq(users.username, username) });
    if (user) {
      const passwordHash = await hashPassword(newPassword);
      await db.update(users).set({ passwordHash, updatedAt: new Date() }).where(eq(users.id, user.id));
    }

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch {
    return new Response(
      JSON.stringify({ error: 'Error interno del servidor' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
