import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ url }) => {
  const blobUrl = url.searchParams.get('url');
  if (!blobUrl) {
    return new Response('Missing url param', { status: 400 });
  }

  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) {
    return new Response('Missing BLOB_READ_WRITE_TOKEN', { status: 500 });
  }

  try {
    const res = await fetch(blobUrl, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
      return new Response('Image not found', { status: 404 });
    }

    const contentType = res.headers.get('content-type') ?? 'image/jpeg';
    const cacheControl = res.headers.get('cache-control') ?? 'public, max-age=31536000, immutable';

    return new Response(res.body, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': cacheControl,
      },
    });
  } catch {
    return new Response('Error fetching image', { status: 500 });
  }
};
