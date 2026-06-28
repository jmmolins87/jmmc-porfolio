import { db } from '@/db';
import { posts } from '@/db/schema';
import { eq } from 'drizzle-orm';

const SLUGS = [
  'ai-transforming-dev',
  'designer-to-fullstack',
  'frontend-architecture',
  'n8n-claude-automation',
  'portfolio-astro-7',
];

async function main() {
  console.log('Setting proxy URLs for blog images in DB...\n');

  for (const slug of SLUGS) {
    const pathname = `blog/${slug}.jpg`;
    const proxyUrl = `/api/blog-image?pathname=${encodeURIComponent(pathname)}`;

    await db
      .update(posts)
      .set({ coverImage: proxyUrl })
      .where(eq(posts.slug, slug));

    console.log(`  ✓ ${slug} → ${proxyUrl}`);
  }

  console.log('\nDone!');
}

main().catch((err) => {
  console.error('Fatal:', err instanceof Error ? err.message : err);
  process.exit(1);
});
