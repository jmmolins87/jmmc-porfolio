import type { APIRoute } from 'astro';
import { db } from '../../../db';
import { posts } from '../../../db/schema';
import { eq } from 'drizzle-orm';

export const GET: APIRoute = async ({ params }) => {
  try {
    const slug = params.slug;
    if (!slug) {
      return new Response(
        JSON.stringify({ error: 'Slug requerido' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const [post] = await db.select().from(posts).where(eq(posts.slug, slug));

    if (!post) {
      return new Response(
        JSON.stringify({ error: 'Post no encontrado' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ post }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('[Post GET] Error:', error);
    return new Response(
      JSON.stringify({ error: 'Error interno del servidor' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
