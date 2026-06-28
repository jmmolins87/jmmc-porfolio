import type { APIRoute } from 'astro';

const BLOB_STORE_URL = 'https://zj1kuezzp5o6qx74.private.blob.vercel-storage.com';

export const GET: APIRoute = async ({ url }) => {
  const pathname = url.searchParams.get('pathname');
  const blobUrl = url.searchParams.get('url');

  const targetUrl = pathname
    ? `${BLOB_STORE_URL}/${pathname}`
    : blobUrl;

  if (!targetUrl) {
    return new Response('Missing pathname or url param', { status: 400 });
  }

  const token = (typeof import.meta !== 'undefined' && import.meta.env?.BLOB_READ_WRITE_TOKEN) ?? process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) {
    return new Response('Missing BLOB_READ_WRITE_TOKEN', { status: 500 });
  }

  try {
    const res = await fetch(targetUrl, {
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
