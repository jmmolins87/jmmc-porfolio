import type { APIRoute } from 'astro';
import { eq } from 'drizzle-orm';
import { db } from '@/db/index';
import { users } from '@/db/schema';
import { verifyToken } from '@/lib/auth';

async function getAdminUser(request: Request): Promise<{ id: string; username: string; role: string } | null> {
  const cookieHeader = request.headers.get('cookie') || '';
  const tokenMatch = cookieHeader.match(/auth-token=([^;]+)/);
  if (!tokenMatch) return null;
  const payload = await verifyToken(tokenMatch[1]);
  if (!payload || payload.role !== 'admin') return null;
  return payload as any;
}

export const DELETE: APIRoute = async ({ request, params }) => {
  const admin = await getAdminUser(request);
  if (!admin) {
    return new Response(
      JSON.stringify({ error: 'No autorizado' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const { id } = params;
  if (!id) {
    return new Response(
      JSON.stringify({ error: 'ID requerido' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  if (id === admin.id) {
    return new Response(
      JSON.stringify({ error: 'No puedes eliminar tu propio usuario' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  await db.delete(users).where(eq(users.id, id));

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};
