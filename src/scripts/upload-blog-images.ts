/**
 * One-time script to upload blog images from public/blog/ to Vercel Blob
 * and update the DB with the new URLs.
 *
 * Usage: source .env && npx tsx src/scripts/upload-blog-images.ts
 * Requires: BLOB_READ_WRITE_TOKEN, DATABASE_URL env vars
 */

import { put } from '@vercel/blob';
import { readFileSync } from 'fs';
import { join } from 'path';
import { db } from '../db';
import { posts } from '../db/schema';
import { eq } from 'drizzle-orm';

const images = [
  { slug: 'frontend-architecture', file: 'frontend-architecture.jpg' },
  { slug: 'n8n-claude-automation', file: 'n8n-claude-automation.jpg' },
  { slug: 'portfolio-astro-7', file: 'portfolio-astro-7.jpg' },
  { slug: 'ai-transforming-dev', file: 'ai-transforming-dev.jpg' },
  { slug: 'designer-to-fullstack', file: 'designer-to-fullstack.jpg' },
];

async function main() {
  console.log('Uploading blog images to Vercel Blob...\n');

  for (const { slug, file } of images) {
    const filePath = join(process.cwd(), 'public', 'blog', file);
    const data = readFileSync(filePath);

    const blob = await put(`blog/${file}`, data, {
      access: 'private',
      contentType: 'image/jpeg',
    });

    console.log(`✓ ${slug} → ${blob.url}`);

    await db
      .update(posts)
      .set({ coverImage: blob.url })
      .where(eq(posts.slug, slug));
  }

  console.log('\nDone! All images uploaded and DB updated.');
}

main().catch((err) => {
  console.error('Error:', err);
  process.exit(1);
});
