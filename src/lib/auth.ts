import { SignJWT, jwtVerify } from 'jose';
import { timingSafeEqual } from 'node:crypto';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET ?? 'dev-secret-change-in-production');
const TOKEN_EXPIRY = '7d';

export async function createToken(username: string): Promise<string> {
  return new SignJWT({ username })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime(TOKEN_EXPIRY)
    .sign(JWT_SECRET);
}

export async function verifyToken(token: string): Promise<{ username: string } | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return { username: payload.username as string };
  } catch {
    return null;
  }
}

export function validateCredentials(username: string, password: string): boolean {
  const validUser = Buffer.from(process.env.BLOG_USER ?? 'admin');
  const validPass = Buffer.from(process.env.BLOG_PASSWORD ?? 'admin');
  const inputUser = Buffer.from(username);
  const inputPass = Buffer.from(password);

  if (validUser.length !== inputUser.length || validPass.length !== inputPass.length) {
    return false;
  }

  return timingSafeEqual(validUser, inputUser) && timingSafeEqual(validPass, inputPass);
}
