import { SignJWT, jwtVerify } from 'jose';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import { db } from '@/db/index';
import { users } from '@/db/schema';

function getSecret(): Uint8Array {
  const secret = import.meta.env.JWT_SECRET ?? process.env.JWT_SECRET ?? 'dev-secret-change-in-production';
  return new TextEncoder().encode(secret);
}

const TOKEN_EXPIRY = '7d';
const BCRYPT_ROUNDS = 10;

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, BCRYPT_ROUNDS);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function createToken(username: string, role: string): Promise<string> {
  return new SignJWT({ username, role })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime(TOKEN_EXPIRY)
    .sign(getSecret());
}

export async function verifyToken(token: string): Promise<{ username: string; role: string } | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    return { username: payload.username as string, role: payload.role as string };
  } catch {
    return null;
  }
}

export async function validateCredentials(username: string, password: string): Promise<{ valid: boolean; user?: { id: string; username: string; role: string } }> {
  const user = await db.query.users.findFirst({ where: eq(users.username, username) });
  if (!user) return { valid: false };
  const match = await comparePassword(password, user.passwordHash);
  if (!match) return { valid: false };
  return { valid: true, user: { id: user.id, username: user.username, role: user.role } };
}
