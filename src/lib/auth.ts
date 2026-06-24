import { SignJWT, jwtVerify } from 'jose';

function getSecret(): Uint8Array {
  const secret = import.meta.env.JWT_SECRET ?? process.env.JWT_SECRET ?? 'dev-secret-change-in-production';
  return new TextEncoder().encode(secret);
}

function getEnv(key: string, fallback: string): string {
  return import.meta.env[key] ?? process.env[key] ?? fallback;
}

const TOKEN_EXPIRY = '7d';

export async function createToken(username: string): Promise<string> {
  return new SignJWT({ username })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime(TOKEN_EXPIRY)
    .sign(getSecret());
}

export async function verifyToken(token: string): Promise<{ username: string } | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    return { username: payload.username as string };
  } catch {
    return null;
  }
}

export function validateCredentials(username: string, password: string): boolean {
  const validUser = getEnv('BLOG_USER', 'admin');
  const validPass = getEnv('BLOG_PASSWORD', 'admin');
  return username === validUser && password === validPass;
}
