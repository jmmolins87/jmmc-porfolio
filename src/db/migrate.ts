import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

async function migrate() {
  console.log('Starting migration...');

  // Step 1: Add new columns
  console.log('Adding new columns...');
  await sql`ALTER TABLE posts ADD COLUMN IF NOT EXISTS title_es text`;
  await sql`ALTER TABLE posts ADD COLUMN IF NOT EXISTS title_en text`;
  await sql`ALTER TABLE posts ADD COLUMN IF NOT EXISTS description_es text`;
  await sql`ALTER TABLE posts ADD COLUMN IF NOT EXISTS description_en text`;
  await sql`ALTER TABLE posts ADD COLUMN IF NOT EXISTS content_es text`;
  await sql`ALTER TABLE posts ADD COLUMN IF NOT EXISTS content_en text`;
  await sql`ALTER TABLE posts ADD COLUMN IF NOT EXISTS read_time_es text`;
  await sql`ALTER TABLE posts ADD COLUMN IF NOT EXISTS read_time_en text`;

  // Step 2: Migrate existing data (merge ES/EN pairs into single rows)
  console.log('Migrating existing data...');

  // First, populate new columns from existing data for ES posts
  await sql`
    UPDATE posts SET
      title_es = title,
      description_es = description,
      content_es = content,
      read_time_es = read_time
    WHERE lang = 'es' AND title_es IS NULL
  `;

  // Populate new columns from existing data for EN posts
  await sql`
    UPDATE posts SET
      title_en = title,
      description_en = description,
      content_en = content,
      read_time_en = read_time
    WHERE lang = 'en' AND title_en IS NULL
  `;

  // Step 3: Merge EN data into ES rows (using group_key to match pairs)
  console.log('Merging language pairs...');
  await sql`
    UPDATE posts es SET
      title_en = en.title,
      description_en = en.description,
      content_en = en.content,
      read_time_en = en.read_time
    FROM posts en
    WHERE es.group_key = en.group_key
      AND es.lang = 'es' AND en.lang = 'en'
      AND es.title_en IS NULL
  `;

  // Step 4: Delete EN posts (they've been merged into ES rows)
  console.log('Deleting duplicate EN posts...');
  await sql`DELETE FROM posts WHERE lang = 'en'`;

  // Step 5: Make new columns NOT NULL
  console.log('Setting NOT NULL constraints...');
  await sql`ALTER TABLE posts ALTER COLUMN title_es SET NOT NULL`;
  await sql`ALTER TABLE posts ALTER COLUMN title_en SET NOT NULL`;
  await sql`ALTER TABLE posts ALTER COLUMN content_es SET NOT NULL`;
  await sql`ALTER TABLE posts ALTER COLUMN content_en SET NOT NULL`;

  // Step 6: Drop old columns
  console.log('Dropping old columns...');
  await sql`ALTER TABLE posts DROP COLUMN IF EXISTS lang`;
  await sql`ALTER TABLE posts DROP COLUMN IF EXISTS group_key`;
  await sql`ALTER TABLE posts DROP COLUMN IF EXISTS title`;
  await sql`ALTER TABLE posts DROP COLUMN IF EXISTS description`;
  await sql`ALTER TABLE posts DROP COLUMN IF EXISTS content`;
  await sql`ALTER TABLE posts DROP COLUMN IF EXISTS read_time`;

  // Step 7: Drop old enum
  console.log('Dropping old enum...');
  await sql`DROP TYPE IF EXISTS lang`;

  console.log('Migration complete!');
  process.exit(0);
}

migrate().catch((err) => {
  console.error('Migration error:', err);
  process.exit(1);
});
