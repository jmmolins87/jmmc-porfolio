import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from '@/db/schema';

const dbUrl = (typeof import.meta !== 'undefined' && import.meta.env?.DATABASE_URL) ?? process.env.DATABASE_URL!;
const sql = neon(dbUrl);

export const db = drizzle(sql, { schema });
