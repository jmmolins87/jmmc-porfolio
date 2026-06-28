import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { eq } from 'drizzle-orm';
import * as schema from '@/db/schema';
import { posts, users } from '@/db/schema';
import { hashPassword } from '@/lib/auth';
import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql, { schema });

const coverImageMap: Record<string, string> = {
  'frontend-architecture': '/blog/frontend-architecture.jpg',
  'n8n-claude-automation': '/blog/n8n-claude-automation.jpg',
  'portfolio-astro-7': '/blog/portfolio-astro-7.jpg',
  'ai-transforming-dev': '/blog/ai-transforming-dev.jpg',
  'designer-to-fullstack': '/blog/designer-to-fullstack.jpg',
};

function parseFrontmatter(content: string) {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return null;

  const frontmatter: Record<string, string | string[]> = {};
  const lines = match[1].split('\n');
  let currentKey = '';
  let currentValue = '';
  let inMultiline = false;

  for (const line of lines) {
    if (inMultiline) {
      if (line.startsWith('  ') || line === '') {
        currentValue += (currentValue ? '\n' : '') + line.trimEnd();
        continue;
      } else {
        frontmatter[currentKey] = currentValue;
        inMultiline = false;
      }
    }

    const kvMatch = line.match(/^(\w+):\s*(.*)$/);
    if (kvMatch) {
      currentKey = kvMatch[1];
      const value = kvMatch[2].trim();
      if (value === '|') {
        currentValue = '';
        inMultiline = true;
      } else if (value.startsWith('[')) {
        frontmatter[currentKey] = value.slice(1, -1).split(',').map((s) => s.trim().replace(/^['"]|['"]$/g, ''));
        currentKey = '';
      } else {
        frontmatter[currentKey] = value.replace(/^['"]|['"]$/g, '');
        currentKey = '';
      }
    }
  }

  if (currentKey && inMultiline) {
    frontmatter[currentKey] = currentValue;
  }

  return frontmatter;
}

function calcReadTime(content: string): string {
  const words = content.split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(words / 200));
  return `${minutes} min`;
}

async function seed() {
  const existingAdmin = await db.query.users.findFirst({ where: eq(users.username, 'juanma') });
  if (!existingAdmin) {
    const passwordHash = await hashPassword('07870787!Jm');
    await db.insert(users).values({
      username: 'juanma',
      email: 'jmmolins87@gmail.com',
      passwordHash,
      role: 'admin',
    });
    console.log('✓ Admin user created (juanma)');
  } else {
    console.log('- Admin user already exists, skipping');
  }

  const blogDir = join(process.cwd(), 'src/content/blog');
  const files = readdirSync(blogDir).filter((f) => f.endsWith('.md'));

  console.log(`Migrating ${files.length} multilingual posts...`);

  for (const file of files) {
    const content = readFileSync(join(blogDir, file), 'utf-8');
    const fm = parseFrontmatter(content);
    if (!fm) {
      console.log(`  Skipping ${file} (parse error)`);
      continue;
    }

    const slug = file.replace('.md', '');
    const titleEs = String(fm.title_es ?? fm.title_en ?? slug);
    const titleEn = String(fm.title_en ?? fm.title_es ?? slug);
    const descriptionEs = fm.description_es ? String(fm.description_es) : null;
    const descriptionEn = fm.description_en ? String(fm.description_en) : null;
    const contentEs = String(fm.content_es ?? '');
    const contentEn = String(fm.content_en ?? '');
    const tags = fm.tags ?? '[]';
    const readTimeEs = fm.readTime_es ? String(fm.readTime_es) : calcReadTime(contentEs);
    const readTimeEn = fm.readTime_en ? String(fm.readTime_en) : calcReadTime(contentEn);
    const date = fm.date ? new Date(String(fm.date)) : new Date();

    const coverImage = coverImageMap[slug] ?? null;

    await db.insert(posts).values({
      slug,
      titleEs,
      titleEn,
      descriptionEs,
      descriptionEn,
      contentEs,
      contentEn,
      coverImage,
      tags: typeof tags === 'string'
        ? tags.replace(/[\[\]"']/g, '').split(',').map((s) => s.trim()).filter(Boolean)
        : tags,
      readTimeEs,
      readTimeEn,
      isPublished: true,
      publishedAt: date,
      updatedAt: new Date(),
    }).onConflictDoUpdate({
      target: posts.slug,
      set: { coverImage, updatedAt: new Date() },
    });

    console.log(`  ✓ ${slug}`);
  }

  console.log('Done!');
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seed error:', err);
  process.exit(1);
});
