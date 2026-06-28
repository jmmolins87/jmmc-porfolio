import type { APIRoute } from 'astro';
import { getDownloadUrl } from '@vercel/blob';

export const GET: APIRoute = async ({ url }) => {
  const blobUrl = url.searchParams.get('url');
  if (!blobUrl) {
    return new Response('Missing url param', { status: 400 });
  }

  try {
    const downloadUrl = getDownloadUrl(blobUrl);
    return Response.redirect(downloadUrl, 302);
  } catch {
    return new Response('Error generating URL', { status: 500 });
  }
};
