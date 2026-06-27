import type { APIRoute } from 'astro';
import { db } from '../../db';
import { posts } from '../../db/schema';
import { eq, desc, and, sql } from 'drizzle-orm';
import { verifyToken } from '../../lib/auth';
import { calcReadTime, slugify } from '../../lib/markdown';

export const GET: APIRoute = async ({ url }) => {
  try {
    const lang = url.searchParams.get('lang');
    const published = url.searchParams.get('published');
    const page = parseInt(url.searchParams.get('page') ?? '1');
    const limit = parseInt(url.searchParams.get('limit') ?? '50');
    const offset = (page - 1) * limit;

    const conditions = [];
    if (lang) conditions.push(eq(posts.lang, lang as 'es' | 'en'));
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
    const { title, description, content, coverImage, tags, lang, isPublished, publishedAt } = data;

    if (!title || !content) {
      return new Response(
        JSON.stringify({ error: 'Título y contenido son obligatorios' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    let slug = slugify(title);
    const existing = await db.select().from(posts).where(eq(posts.slug, slug));
    if (existing.length > 0) {
      slug = `${slug}-${Date.now()}`;
    }

    const readTime = calcReadTime(content);

    const [newPost] = await db.insert(posts).values({
      slug,
      title,
      description: description ?? null,
      content,
      coverImage: coverImage ?? null,
      tags: tags ?? [],
      readTime,
      lang: lang ?? 'es',
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
