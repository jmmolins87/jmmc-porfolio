import type { APIRoute } from 'astro';
import { eq } from 'drizzle-orm';
import { db } from '@/db/index';
import { users } from '@/db/schema';
import { hashPassword, verifyToken } from '@/lib/auth';

async function getAdminUser(request: Request): Promise<{ id: string; username: string; role: string } | null> {
  const cookieHeader = request.headers.get('cookie') || '';
  const tokenMatch = cookieHeader.match(/auth-token=([^;]+)/);
  if (!tokenMatch) return null;
  const payload = await verifyToken(tokenMatch[1]);
  if (!payload || payload.role !== 'admin') return null;
  return { id: payload.id, username: payload.username, role: payload.role };
}

export const GET: APIRoute = async ({ request }) => {
  const admin = await getAdminUser(request);
  if (!admin) {
    return new Response(
      JSON.stringify({ error: 'No autorizado' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const allUsers = await db.query.users.findMany({
    columns: { id: true, username: true, email: true, role: true, createdAt: true },
  });

  return new Response(JSON.stringify(allUsers), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};

export const POST: APIRoute = async ({ request }) => {
  const admin = await getAdminUser(request);
  if (!admin) {
    return new Response(
      JSON.stringify({ error: 'No autorizado' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    const body = await request.json();
    const { username, email, password } = body;

    if (!username || !email || !password) {
      return new Response(
        JSON.stringify({ error: 'Usuario, email y contraseña requeridos' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (password.length < 8) {
      return new Response(
        JSON.stringify({ error: 'La contraseña debe tener al menos 8 caracteres' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const existingUser = await db.query.users.findFirst({
      where: eq(users.username, username),
    });
    if (existingUser) {
      return new Response(
        JSON.stringify({ error: 'El nombre de usuario ya existe' }),
        { status: 409, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const existingEmail = await db.query.users.findFirst({
      where: eq(users.email, email),
    });
    if (existingEmail) {
      return new Response(
        JSON.stringify({ error: 'El email ya está registrado' }),
        { status: 409, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const passwordHash = await hashPassword(password);
    const [newUser] = await db.insert(users).values({
      username,
      email,
      passwordHash,
      role: 'editor',
    }).returning({ id: users.id, username: users.username, email: users.email, role: users.role });

    return new Response(JSON.stringify(newUser), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch {
    return new Response(
      JSON.stringify({ error: 'Error interno del servidor' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
