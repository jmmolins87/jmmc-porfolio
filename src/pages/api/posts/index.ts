import type { APIRoute } from 'astro';
import { db } from '@/db';
import { posts } from '@/db/schema';
import { eq, desc, and, sql } from 'drizzle-orm';
import { verifyToken } from '@/lib/auth';

export const GET: APIRoute = async ({ url }) => {
  try {
    const published = url.searchParams.get('published');
    const page = parseInt(url.searchParams.get('page') ?? '1');
    const limit = parseInt(url.searchParams.get('limit') ?? '50');
    const offset = (page - 1) * limit;

    const conditions = [];
    if (published !== null) conditions.push(eq(posts.isPublished, published === 'true'));

    const where = conditions.length > 0 ? and(...conditions) : undefined;

    const result = await db
      .select()
      .from(posts)
      .where(where)
      .orderBy(desc(posts.publishedAt))
      .limit(limit)
      .offset(offset);

    const [{ count }] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(posts)
      .where(where);

    return new Response(
      JSON.stringify({ posts: result, total: count, page, limit }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('[Posts GET] Error:', error);
    return new Response(
      JSON.stringify({ error: 'Error interno del servidor' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

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

    const data = await request.json();
    const {
      titleEs, titleEn,
      descriptionEs, descriptionEn,
      contentEs, contentEn,
      coverImage, tags,
      readTimeEs, readTimeEn,
      isPublished, publishedAt,
    } = data;

    if (!titleEs && !titleEn) {
      return new Response(
        JSON.stringify({ error: 'Al menos un título es obligatorio' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    if (!contentEs && !contentEn) {
      return new Response(
        JSON.stringify({ error: 'Al menos un contenido es obligatorio' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    let slug = (titleEs || titleEn || 'post')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

    const existing = await db.select().from(posts).where(eq(posts.slug, slug));
    if (existing.length > 0) {
      slug = `${slug}-${Date.now()}`;
    }

    const [newPost] = await db.insert(posts).values({
      slug,
      titleEs: titleEs || titleEn,
      titleEn: titleEn || titleEs,
      descriptionEs: descriptionEs ?? null,
      descriptionEn: descriptionEn ?? null,
      contentEs: contentEs || contentEn,
      contentEn: contentEn || contentEs,
      coverImage: coverImage ?? null,
      tags: tags ?? [],
      readTimeEs: readTimeEs ?? null,
      readTimeEn: readTimeEn ?? null,
      isPublished: isPublished ?? true,
      publishedAt: publishedAt ? new Date(publishedAt) : new Date(),
      updatedAt: new Date(),
    }).returning();

    return new Response(
      JSON.stringify({ post: newPost }),
      { status: 201, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('[Posts POST] Error:', error);
    return new Response(
      JSON.stringify({ error: 'Error interno del servidor' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

export const PATCH: APIRoute = async ({ request, params, cookies }) => {
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

    const id = params.id;
    if (!id) {
      return new Response(
        JSON.stringify({ error: 'ID requerido' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const data = await request.json();
    const [updated] = await db
      .update(posts)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(posts.id, id))
      .returning();

    if (!updated) {
      return new Response(
        JSON.stringify({ error: 'Post no encontrado' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ post: updated }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('[Posts PATCH] Error:', error);
    return new Response(
      JSON.stringify({ error: 'Error interno del servidor' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
