/**
 * Upload blog images from public/blog/ to Vercel Blob
 * and update the DB with the new URLs.
 *
 * Usage: npx tsx src/scripts/upload-blog-images.ts
 * Requires: BLOB_READ_WRITE_TOKEN, DATABASE_URL env vars
 *
 * Features:
 * - Retry with exponential backoff (3 attempts)
 * - Validates env vars and files before starting
 * - Skips already uploaded images (check DB for existing coverImage)
 * - Continues on individual image failure
 */

import { put } from '@vercel/blob';
import { existsSync, readFileSync, statSync } from 'fs';
import { join } from 'path';
import { db } from '../db';
import { posts } from '../db/schema';
import { eq } from 'drizzle-orm';

const BLOB_URL_PREFIX = 'https://';

const images = [
  { slug: 'frontend-architecture', file: 'frontend-architecture.jpg' },
  { slug: 'n8n-claude-automation', file: 'n8n-claude-automation.jpg' },
  { slug: 'portfolio-astro-7', file: 'portfolio-astro-7.jpg' },
  { slug: 'ai-transforming-dev', file: 'ai-transforming-dev.jpg' },
  { slug: 'designer-to-fullstack', file: 'designer-to-fullstack.jpg' },
];

const BLOG_DIR = join(process.cwd(), 'public', 'blog');

type ImageMeta = (typeof images)[number];

function validateEnv(): void {
  const missing: string[] = [];
  if (!process.env.BLOB_READ_WRITE_TOKEN) missing.push('BLOB_READ_WRITE_TOKEN');
  if (!process.env.DATABASE_URL) missing.push('DATABASE_URL');
  if (missing.length > 0) {
    console.error(`Missing required env vars: ${missing.join(', ')}`);
    console.error('Create a .env file or export them before running.');
    process.exit(1);
  }
}

function validateFiles(): ImageMeta[] {
  const valid: ImageMeta[] = [];
  for (const img of images) {
    const filePath = join(BLOG_DIR, img.file);
    if (!existsSync(filePath)) {
      console.warn(`⚠ File not found: ${img.file} — skipping ${img.slug}`);
      continue;
    }
    const size = statSync(filePath).size;
    if (size === 0) {
      console.warn(`⚠ Empty file: ${img.file} — skipping ${img.slug}`);
      continue;
    }
    valid.push(img);
  }
  return valid;
}

async function checkExisting(): Promise<Set<string>> {
  const existing = new Set<string>();
  for (const img of images) {
    const result = await db
      .select({ coverImage: posts.coverImage })
      .from(posts)
      .where(eq(posts.slug, img.slug))
      .limit(1);
    const url = result[0]?.coverImage;
    if (url && url.startsWith(BLOB_URL_PREFIX)) {
      existing.add(img.slug);
    }
  }
  return existing;
}

async function withRetry<T>(
  fn: () => Promise<T>,
  label: string,
  maxRetries = 3
): Promise<T> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      if (attempt === maxRetries) throw err;
      const delay = Math.min(1000 * 2 ** (attempt - 1), 8000);
      console.warn(`  ↻ ${label} failed (attempt ${attempt}/${maxRetries}), retrying in ${delay}ms...`);
      await new Promise((r) => setTimeout(r, delay));
    }
  }
  throw new Error(`Exhausted retries for ${label}`);
}

async function main() {
  console.log('🔍 Validating environment...');
  validateEnv();

  console.log('🔍 Checking image files...\n');
  const validImages = validateFiles();
  if (validImages.length === 0) {
    console.error('No valid image files found. Add images to public/blog/');
    console.error(`Expected path: ${BLOG_DIR}/`);
    process.exit(1);
  }
  console.log(`Found ${validImages.length}/${images.length} valid images\n`);

  console.log('🔍 Checking existing uploads in DB...');
  const alreadyUploaded = await checkExisting();
  const pending = validImages.filter((img) => !alreadyUploaded.has(img.slug));
  if (pending.length === 0) {
    console.log('✓ All images already uploaded to Blob and linked in DB.');
    process.exit(0);
  }
  console.log(`Will upload ${pending.length} new images, skipping ${validImages.length - pending.length} already uploaded.\n`);

  let successCount = 0;
  let failCount = 0;

  for (const img of pending) {
    const filePath = join(BLOG_DIR, img.file);
    console.log(`📤 Uploading ${img.file}...`);

    try {
      const data = readFileSync(filePath);
      const blob = await withRetry(
        () =>
          put(`blog/${img.file}`, data, {
            access: 'private',
            contentType: img.file.endsWith('.png') ? 'image/png' : 'image/jpeg',
          }),
        `put blog/${img.file}`
      );

      console.log(`  ✓ Uploaded → ${blob.url}`);

      await withRetry(
        () =>
          db
            .update(posts)
            .set({ coverImage: blob.url })
            .where(eq(posts.slug, img.slug)),
        `db update ${img.slug}`
      );

      console.log(`  ✓ DB updated for ${img.slug}`);
      successCount++;
    } catch (err) {
      console.error(`  ✗ Failed for ${img.slug}:`, err instanceof Error ? err.message : err);
      failCount++;
    }
  }

  console.log(`\n══════════════════════════════════`);
  console.log(`  ✅ Success: ${successCount}`);
  console.log(`  ❌ Failed:  ${failCount}`);
  console.log(`  ⏭ Skipped: ${validImages.length - pending.length}`);
  console.log(`══════════════════════════════════`);

  if (failCount > 0) process.exit(1);
}

main().catch((err) => {
  console.error('\nFatal error:', err instanceof Error ? err.message : err);
  process.exit(1);
});
