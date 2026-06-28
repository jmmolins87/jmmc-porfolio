import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';
import { posts } from './schema';
import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql, { schema });

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

    await db.insert(posts).values({
      slug,
      titleEs,
      titleEn,
      descriptionEs,
      descriptionEn,
      contentEs,
      contentEn,
      tags: typeof tags === 'string'
        ? tags.replace(/[\[\]"']/g, '').split(',').map((s) => s.trim()).filter(Boolean)
        : tags,
      readTimeEs,
      readTimeEn,
      isPublished: true,
      publishedAt: date,
      updatedAt: new Date(),
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
