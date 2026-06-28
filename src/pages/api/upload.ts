import type { APIRoute } from 'astro';
import { put } from '@vercel/blob';
import { verifyToken } from '@/lib/auth';

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    const token = cookies.get('auth-token')?.value;
    if (!token) {
      return new Response(
        JSON.stringify({ error: 'No autenticado' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const payload = await verifyToken(token);
    if (!payload) {
      return new Response(
        JSON.stringify({ error: 'Token inválido' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return new Response(
        JSON.stringify({ error: 'Archivo requerido' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      return new Response(
        JSON.stringify({ error: 'Tipo de archivo no permitido. Usa JPG, PNG, WebP o GIF' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return new Response(
        JSON.stringify({ error: 'El archivo no puede superar 5MB' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const ext = file.name.split('.').pop() ?? 'jpg';
    const filename = `blog/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

    const blob = await put(filename, file, {
      access: 'public',
    });

    return new Response(
      JSON.stringify({ url: blob.url }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('[Upload] Error:', error);
    return new Response(
      JSON.stringify({ error: 'Error al subir el archivo' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
