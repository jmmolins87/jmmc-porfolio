# User Authentication System Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace single-user env-var auth with multi-user DB-backed auth, add forgot password flow, and user management dashboard.

**Architecture:** Neon Postgres + Drizzle ORM for DB, bcryptjs for password hashing, jose for JWT. New `users` table, updated auth lib, new API endpoints, updated LoginForm with forgot-password view, new dashboard user management pages.

**Tech Stack:** Astro, React, Drizzle ORM, Neon, jose, bcryptjs, Vitest

---

## Task 1: Install bcryptjs dependency

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Install bcryptjs**

Run: `npm install bcryptjs`
Expected: Package added to dependencies

- [ ] **Step 2: Install types**

Run: `npm install -D @types/bcryptjs`
Expected: Types added to devDependencies

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: add bcryptjs for password hashing"
```

---

## Task 2: Add users table to DB schema

**Files:**
- Modify: `src/db/schema.ts`

- [ ] **Step 1: Add users table to schema**

Add at the end of `src/db/schema.ts`:

```typescript
export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  username: text('username').unique().notNull(),
  email: text('email').unique().notNull(),
  passwordHash: text('password_hash').notNull(),
  role: text('role', { enum: ['admin', 'editor'] }).default('editor').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
```

- [ ] **Step 2: Generate migration**

Run: `npx drizzle-kit generate`
Expected: New migration file created in `drizzle/` directory

- [ ] **Step 3: Apply migration**

Run: `npx drizzle-kit push`
Expected: `users` table created in Neon database

- [ ] **Step 4: Commit**

```bash
git add src/db/schema.ts drizzle/
git commit -m "feat(db): add users table with username, email, password_hash, role"
```

---

## Task 3: Update auth library for DB-based auth

**Files:**
- Modify: `src/lib/auth.ts`

- [ ] **Step 1: Rewrite auth.ts with DB queries and bcrypt**

Replace entire content of `src/lib/auth.ts`:

```typescript
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
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add src/lib/auth.ts
git commit -m "feat(auth): migrate to DB-based auth with bcrypt password hashing"
```

---

## Task 4: Update login API for DB-based auth

**Files:**
- Modify: `src/pages/api/login.ts`

- [ ] **Step 1: Update login API to use async validateCredentials**

Replace entire content of `src/pages/api/login.ts`:

```typescript
import type { APIRoute } from 'astro';
import { createToken, validateCredentials } from '@/lib/auth';

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    const formData = await request.formData();
    const username = formData.get('username') as string;
    const password = formData.get('password') as string;

    if (!username || !password) {
      return new Response(
        JSON.stringify({ error: 'Usuario y contraseña requeridos' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const result = await validateCredentials(username, password);
    if (!result.valid || !result.user) {
      return new Response(
        JSON.stringify({ error: 'Credenciales inválidas' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const token = await createToken(result.user.username, result.user.role);

    cookies.set('auth-token', token, {
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
    });

    return new Response(
      JSON.stringify({ success: true, role: result.user.role }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch {
    return new Response(
      JSON.stringify({ error: 'Error interno del servidor' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
```

- [ ] **Step 2: Update login tests**

Replace entire content of `src/pages/api/login.test.ts`:

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockCreateToken = vi.hoisted(() => vi.fn());
const mockValidateCredentials = vi.hoisted(() => vi.fn());

vi.mock('@/lib/auth', () => ({
  createToken: mockCreateToken,
  validateCredentials: mockValidateCredentials,
}));

import { POST } from '@/pages/api/login';

function createFormData(username?: string, password?: string): string {
  const params = new URLSearchParams();
  if (username) params.set('username', username);
  if (password) params.set('password', password);
  return params.toString();
}

function createMockCookies() {
  return {
    get: vi.fn(),
    set: vi.fn(),
    delete: vi.fn(),
  };
}

beforeEach(() => {
  vi.clearAllMocks();
  mockCreateToken.mockResolvedValue('test-jwt-token');
  mockValidateCredentials.mockResolvedValue({ valid: true, user: { id: '1', username: 'testuser', role: 'editor' } });
});

describe('POST /api/login', () => {
  it('returns 200 with valid credentials', async () => {
    const cookies = createMockCookies();
    const request = new Request('http://localhost/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: createFormData('testuser', 'testpass'),
    });

    const response = await POST({ request, cookies, redirect: vi.fn() } as any);
    expect(response.status).toBe(200);

    const body = await response.json();
    expect(body).toEqual({ success: true, role: 'editor' });
  });

  it('sets auth-token cookie on success', async () => {
    const cookies = createMockCookies();
    const request = new Request('http://localhost/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: createFormData('testuser', 'testpass'),
    });

    await POST({ request, cookies } as any);
    expect(cookies.set).toHaveBeenCalledWith(
      'auth-token',
      'test-jwt-token',
      expect.objectContaining({
        path: '/',
        httpOnly: true,
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7,
      }),
    );
  });

  it('validates credentials with the auth module', async () => {
    const cookies = createMockCookies();
    const request = new Request('http://localhost/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: createFormData('myuser', 'mypass'),
    });

    await POST({ request, cookies } as any);
    expect(mockValidateCredentials).toHaveBeenCalledWith('myuser', 'mypass');
    expect(mockCreateToken).toHaveBeenCalledWith('testuser', 'editor');
  });

  it('returns 401 when credentials are invalid', async () => {
    mockValidateCredentials.mockResolvedValue({ valid: false });

    const cookies = createMockCookies();
    const request = new Request('http://localhost/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: createFormData('testuser', 'wrongpass'),
    });

    const response = await POST({ request, cookies } as any);
    expect(response.status).toBe(401);

    const body = await response.json();
    expect(body.error).toBe('Credenciales inválidas');
  });

  it('returns 400 when username is missing', async () => {
    const cookies = createMockCookies();
    const request = new Request('http://localhost/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: createFormData(undefined, 'testpass'),
    });

    const response = await POST({ request, cookies } as any);
    expect(response.status).toBe(400);
  });

  it('returns 400 when password is missing', async () => {
    const cookies = createMockCookies();
    const request = new Request('http://localhost/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: createFormData('testuser', undefined),
    });

    const response = await POST({ request, cookies } as any);
    expect(response.status).toBe(400);
  });

  it('returns 500 when FormData parsing throws', async () => {
    const cookies = createMockCookies();
    const badRequest = new Request('http://localhost/api/login', {
      method: 'POST',
      body: null as any,
    });

    const response = await POST({ request: badRequest, cookies } as any);
    expect(response.status).toBe(500);
  });
});
```

- [ ] **Step 3: Run tests**

Run: `npx vitest run src/pages/api/login.test.ts`
Expected: All tests pass

- [ ] **Step 4: Commit**

```bash
git add src/pages/api/login.ts src/pages/api/login.test.ts
git commit -m "feat(api): update login endpoint for DB-based auth with role in token"
```

---

## Task 5: Create forgot-password API

**Files:**
- Create: `src/pages/api/forgot-password.ts`

- [ ] **Step 1: Create forgot-password API endpoint**

Create `src/pages/api/forgot-password.ts`:

```typescript
import type { APIRoute } from 'astro';
import { eq } from 'drizzle-orm';
import { db } from '@/db/index';
import { users } from '@/db/schema';
import { hashPassword } from '@/lib/auth';

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { username, newPassword } = body;

    if (!username || !newPassword) {
      return new Response(
        JSON.stringify({ error: 'Usuario y nueva contraseña requeridos' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (newPassword.length < 8) {
      return new Response(
        JSON.stringify({ error: 'La contraseña debe tener al menos 8 caracteres' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const user = await db.query.users.findFirst({ where: eq(users.username, username) });
    if (user) {
      const passwordHash = await hashPassword(newPassword);
      await db.update(users).set({ passwordHash, updatedAt: new Date() }).where(eq(users.id, user.id));
    }

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch {
    return new Response(
      JSON.stringify({ error: 'Error interno del servidor' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
```

- [ ] **Step 2: Create forgot-password tests**

Create `src/pages/api/forgot-password.test.ts`:

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockHashPassword = vi.hoisted(() => vi.fn());
const mockDb = vi.hoisted(() => ({
  query: { users: { findFirst: vi.fn() } },
  update: vi.fn(() => ({ set: vi.fn(() => ({ where: vi.fn() })) })),
}));

vi.mock('@/lib/auth', () => ({ hashPassword: mockHashPassword }));
vi.mock('@/db/index', () => ({ db: mockDb }));

import { POST } from '@/pages/api/forgot-password';

beforeEach(() => {
  vi.clearAllMocks();
  mockHashPassword.mockResolvedValue('hashed-password');
  mockDb.query.users.findFirst.mockResolvedValue(null);
});

describe('POST /api/forgot-password', () => {
  it('returns 200 even when user does not exist', async () => {
    const request = new Request('http://localhost/api/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'nonexistent', newPassword: 'newpass123' }),
    });

    const response = await POST({ request } as any);
    expect(response.status).toBe(200);
  });

  it('returns 400 when username is missing', async () => {
    const request = new Request('http://localhost/api/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ newPassword: 'newpass123' }),
    });

    const response = await POST({ request } as any);
    expect(response.status).toBe(400);
  });

  it('returns 400 when newPassword is missing', async () => {
    const request = new Request('http://localhost/api/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'testuser' }),
    });

    const response = await POST({ request } as any);
    expect(response.status).toBe(400);
  });

  it('returns 400 when password is too short', async () => {
    const request = new Request('http://localhost/api/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'testuser', newPassword: 'short' }),
    });

    const response = await POST({ request } as any);
    expect(response.status).toBe(400);
  });

  it('updates password when user exists', async () => {
    mockDb.query.users.findFirst.mockResolvedValue({ id: '1', username: 'testuser' });

    const request = new Request('http://localhost/api/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'testuser', newPassword: 'newpass123' }),
    });

    const response = await POST({ request } as any);
    expect(response.status).toBe(200);
    expect(mockHashPassword).toHaveBeenCalledWith('newpass123');
  });
});
```

- [ ] **Step 3: Run tests**

Run: `npx vitest run src/pages/api/forgot-password.test.ts`
Expected: All tests pass

- [ ] **Step 4: Commit**

```bash
git add src/pages/api/forgot-password.ts src/pages/api/forgot-password.test.ts
git commit -m "feat(api): add forgot-password endpoint with username enumeration protection"
```

---

## Task 6: Create users API endpoints

**Files:**
- Create: `src/pages/api/users/index.ts`
- Create: `src/pages/api/users/[id].ts`
- Create: `src/pages/api/users/index.test.ts`

- [ ] **Step 1: Create GET/POST /api/users endpoint**

Create `src/pages/api/users/index.ts`:

```typescript
import type { APIRoute } from 'astro';
import { eq } from 'drizzle-orm';
import { db } from '@/db/index';
import { users } from '@/db/schema';
import { hashPassword, verifyToken } from '@/lib/auth';

async function getAdminUser(request: Request): Promise<{ id: string; username: string; role: string } | null> {
  const cookieHeader = request.headers.get('cookie') || '';
  const tokenMatch = cookieHeader.match(/auth-token=([^;]+)/);
  if (!tokenMatch) return null;
  const payload = await verifyToken(tokenMatch[1]);
  if (!payload || payload.role !== 'admin') return null;
  return payload as any;
}

export const GET: APIRoute = async ({ request }) => {
  const admin = await getAdminUser(request);
  if (!admin) {
    return new Response(
      JSON.stringify({ error: 'No autorizado' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const allUsers = await db.query.users.findMany({
    columns: { id: true, username: true, email: true, role: true, createdAt: true },
  });

  return new Response(JSON.stringify(allUsers), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};

export const POST: APIRoute = async ({ request }) => {
  const admin = await getAdminUser(request);
  if (!admin) {
    return new Response(
      JSON.stringify({ error: 'No autorizado' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    const body = await request.json();
    const { username, email, password } = body;

    if (!username || !email || !password) {
      return new Response(
        JSON.stringify({ error: 'Usuario, email y contraseña requeridos' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (password.length < 8) {
      return new Response(
        JSON.stringify({ error: 'La contraseña debe tener al menos 8 caracteres' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const existingUser = await db.query.users.findFirst({
      where: eq(users.username, username),
    });
    if (existingUser) {
      return new Response(
        JSON.stringify({ error: 'El nombre de usuario ya existe' }),
        { status: 409, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const existingEmail = await db.query.users.findFirst({
      where: eq(users.email, email),
    });
    if (existingEmail) {
      return new Response(
        JSON.stringify({ error: 'El email ya está registrado' }),
        { status: 409, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const passwordHash = await hashPassword(password);
    const [newUser] = await db.insert(users).values({
      username,
      email,
      passwordHash,
      role: 'editor',
    }).returning({ id: users.id, username: users.username, email: users.email, role: users.role });

    return new Response(JSON.stringify(newUser), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch {
    return new Response(
      JSON.stringify({ error: 'Error interno del servidor' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
```

- [ ] **Step 2: Create DELETE /api/users/[id] endpoint**

Create `src/pages/api/users/[id].ts`:

```typescript
import type { APIRoute } from 'astro';
import { eq } from 'drizzle-orm';
import { db } from '@/db/index';
import { users } from '@/db/schema';
import { verifyToken } from '@/lib/auth';

async function getAdminUser(request: Request): Promise<{ id: string; username: string; role: string } | null> {
  const cookieHeader = request.headers.get('cookie') || '';
  const tokenMatch = cookieHeader.match(/auth-token=([^;]+)/);
  if (!tokenMatch) return null;
  const payload = await verifyToken(tokenMatch[1]);
  if (!payload || payload.role !== 'admin') return null;
  return payload as any;
}

export const DELETE: APIRoute = async ({ request, params }) => {
  const admin = await getAdminUser(request);
  if (!admin) {
    return new Response(
      JSON.stringify({ error: 'No autorizado' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const { id } = params;
  if (!id) {
    return new Response(
      JSON.stringify({ error: 'ID requerido' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  if (id === admin.id) {
    return new Response(
      JSON.stringify({ error: 'No puedes eliminar tu propio usuario' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  await db.delete(users).where(eq(users.id, id));

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};
```

- [ ] **Step 3: Create users API tests**

Create `src/pages/api/users/index.test.ts`:

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockVerifyToken = vi.hoisted(() => vi.fn());
const mockHashPassword = vi.hoisted(() => vi.fn());
const mockDb = vi.hoisted(() => ({
  query: { users: { findFirst: vi.fn(), findMany: vi.fn() } },
  insert: vi.fn(() => ({ values: vi.fn(() => ({ returning: vi.fn().mockResolvedValue([{ id: '1', username: 'newuser', email: 'new@test.com', role: 'editor' }]) })) })),
  delete: vi.fn(() => ({ where: vi.fn() })),
}));

vi.mock('@/lib/auth', () => ({ verifyToken: mockVerifyToken, hashPassword: mockHashPassword }));
vi.mock('@/db/index', () => ({ db: mockDb }));

import { GET, POST } from '@/pages/api/users/index';

function createRequestWithCookie(cookie: string) {
  return new Request('http://localhost/api/users', {
    method: 'GET',
    headers: { Cookie: cookie },
  });
}

beforeEach(() => {
  vi.clearAllMocks();
  mockHashPassword.mockResolvedValue('hashed-password');
});

describe('GET /api/users', () => {
  it('returns 401 without auth token', async () => {
    const request = new Request('http://localhost/api/users');
    const response = await GET({ request } as any);
    expect(response.status).toBe(401);
  });

  it('returns 401 with non-admin token', async () => {
    mockVerifyToken.mockResolvedValue({ username: 'user', role: 'editor' });
    const request = createRequestWithCookie('auth-token=test-token');
    const response = await GET({ request } as any);
    expect(response.status).toBe(401);
  });

  it('returns user list for admin', async () => {
    mockVerifyToken.mockResolvedValue({ username: 'admin', role: 'admin' });
    mockDb.query.users.findMany.mockResolvedValue([{ id: '1', username: 'admin', email: 'admin@test.com', role: 'admin' }]);
    const request = createRequestWithCookie('auth-token=test-token');
    const response = await GET({ request } as any);
    expect(response.status).toBe(200);
  });
});

describe('POST /api/users', () => {
  it('returns 401 without admin token', async () => {
    const request = new Request('http://localhost/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'new', email: 'new@test.com', password: 'pass12345' }),
    });
    const response = await POST({ request } as any);
    expect(response.status).toBe(401);
  });
});
```

- [ ] **Step 4: Run tests**

Run: `npx vitest run src/pages/api/users/`
Expected: All tests pass

- [ ] **Step 5: Commit**

```bash
git add src/pages/api/users/
git commit -m "feat(api): add users CRUD endpoints (GET, POST, DELETE) with admin-only access"
```

---

## Task 7: Update middleware for role-based protection

**Files:**
- Modify: `src/middleware.ts`

- [ ] **Step 1: Add admin-only route protection**

Replace entire content of `src/middleware.ts`:

```typescript
import { defineMiddleware } from 'astro/middleware';
import { verifyToken } from '@/lib/auth';

const protectedPagePaths = ['/dashboard', '/blog', '/es/blog', '/en/blog'];
const adminPagePaths = ['/dashboard/users'];
const protectedApiPaths = ['/api/posts', '/api/upload'];
const adminApiPaths = ['/api/users'];

function isProtectedPage(pathname: string): boolean {
  return protectedPagePaths.some((p) => pathname === p || pathname.startsWith(p + '/'));
}

function isAdminPage(pathname: string): boolean {
  return adminPagePaths.some((p) => pathname === p || pathname.startsWith(p + '/'));
}

function isProtectedApiWrite(pathname: string, method: string): boolean {
  if (method === 'GET') return false;
  return protectedApiPaths.some((p) => pathname === p || pathname.startsWith(p + '/'));
}

function isAdminApi(pathname: string, method: string): boolean {
  return adminApiPaths.some((p) => pathname === p || pathname.startsWith(p + '/'));
}

export const onRequest = defineMiddleware(async (context, next) => {
  const { pathname } = context.url;
  const method = context.request.method;

  const needsAuth = isProtectedPage(pathname) || isProtectedApiWrite(pathname, method);
  const needsAdmin = isAdminPage(pathname) || isAdminApi(pathname, method);

  if (needsAuth || needsAdmin) {
    const token = context.cookies.get('auth-token')?.value;
    if (!token) {
      if (pathname.startsWith('/api/')) {
        return new Response(
          JSON.stringify({ error: 'No autenticado' }),
          { status: 401, headers: { 'Content-Type': 'application/json' } }
        );
      }
      return context.redirect('/login');
    }
    const payload = await verifyToken(token);
    if (!payload) {
      context.cookies.delete('auth-token', { path: '/' });
      if (pathname.startsWith('/api/')) {
        return new Response(
          JSON.stringify({ error: 'Token inválido' }),
          { status: 401, headers: { 'Content-Type': 'application/json' } }
        );
      }
      return context.redirect('/login');
    }

    if (needsAdmin && payload.role !== 'admin') {
      if (pathname.startsWith('/api/')) {
        return new Response(
          JSON.stringify({ error: 'No autorizado' }),
          { status: 403, headers: { 'Content-Type': 'application/json' } }
        );
      }
      return context.redirect('/dashboard');
    }
  }

  return next();
});
```

- [ ] **Step 2: Update middleware tests**

Read existing `src/middleware.test.ts` and update to test admin role check.

- [ ] **Step 3: Run tests**

Run: `npx vitest run src/middleware.test.ts`
Expected: All tests pass

- [ ] **Step 4: Commit**

```bash
git add src/middleware.ts src/middleware.test.ts
git commit -m "feat(middleware): add admin-only route protection with role check"
```

---

## Task 8: Update LoginForm with forgot password flow

**Files:**
- Modify: `src/components/LoginForm.tsx`
- Modify: `src/content/i18n/es.json`
- Modify: `src/content/i18n/en.json`

- [ ] **Step 1: Add i18n keys for forgot password**

Add to `src/content/i18n/es.json`:

```json
"login.forgotTitle": "Restablecer contraseña",
"login.newPassword": "Nueva contraseña",
"login.confirmPassword": "Repetir contraseña",
"login.forgotSuccess": "Contraseña actualizada correctamente",
"login.forgotError": "Error al actualizar la contraseña",
"login.passwordMismatch": "Las contraseñas no coinciden",
"login.passwordTooShort": "Mínimo 8 caracteres",
"login.backToLogin": "Volver al login"
```

Add to `src/content/i18n/en.json`:

```json
"login.forgotTitle": "Reset password",
"login.newPassword": "New password",
"login.confirmPassword": "Confirm password",
"login.forgotSuccess": "Password updated successfully",
"login.forgotError": "Error updating password",
"login.passwordMismatch": "Passwords don't match",
"login.passwordTooShort": "Minimum 8 characters",
"login.backToLogin": "Back to login"
```

- [ ] **Step 2: Rewrite LoginForm.tsx with login/forgot views**

Replace entire content of `src/components/LoginForm.tsx`:

```tsx
import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { t } from '@/lib/i18n';
import type { Locale } from '@/lib/i18n';

interface Props {
  locale: Locale;
}

export default function LoginForm({ locale }: Props) {
  const [view, setView] = useState<'login' | 'forgot'>('login');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const s = {
    username: t(locale, 'login.username'),
    password: t(locale, 'login.password'),
    enter: t(locale, 'login.enter'),
    entering: t(locale, 'login.entering'),
    forgot: t(locale, 'login.forgot'),
    error: t(locale, 'login.error'),
    success: t(locale, 'login.success'),
    connectionError: t(locale, 'login.connectionError'),
    title: t(locale, 'login.access'),
    forgotTitle: t(locale, 'login.forgotTitle'),
    newPassword: t(locale, 'login.newPassword'),
    confirmPassword: t(locale, 'login.confirmPassword'),
    forgotSuccess: t(locale, 'login.forgotSuccess'),
    forgotError: t(locale, 'login.forgotError'),
    passwordMismatch: t(locale, 'login.passwordMismatch'),
    passwordTooShort: t(locale, 'login.passwordTooShort'),
    backToLogin: t(locale, 'login.backToLogin'),
  };

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      const res = await fetch('/api/login', { method: 'POST', body: formData });
      if (res.ok) {
        toast.success(s.success);
        const params = new URLSearchParams(window.location.search);
        const redirect = params.get('redirect') || '/dashboard/blog';
        setTimeout(() => { window.location.href = redirect; }, 500);
      } else {
        toast.error(s.error);
      }
    } catch {
      toast.error(s.connectionError);
    } finally {
      setLoading(false);
    }
  }

  async function handleForgotPassword(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const form = e.currentTarget;
    const formData = new FormData(form);
    const username = formData.get('username') as string;
    const newPassword = formData.get('newPassword') as string;
    const confirmPassword = formData.get('confirmPassword') as string;

    if (newPassword.length < 8) {
      toast.error(s.passwordTooShort);
      setLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error(s.passwordMismatch);
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, newPassword }),
      });
      if (res.ok) {
        toast.success(s.forgotSuccess);
        setView('login');
      } else {
        toast.error(s.forgotError);
      }
    } catch {
      toast.error(s.connectionError);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-sm mx-auto px-4">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold tracking-tight">JMMC</h1>
      </div>

      <div className="rounded-2xl border border-border bg-card p-8">
        <div className="text-center mb-8">
          <p className="text-sm text-muted-foreground">{view === 'login' ? s.title : s.forgotTitle}</p>
        </div>

        {view === 'login' ? (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium mb-1 text-foreground">{s.username}</label>
              <input
                id="username"
                name="username"
                type="text"
                required
                autoComplete="username"
                className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder={s.username}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-1 text-foreground">{s.password}</label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  className="w-full rounded-xl border border-border bg-background px-4 py-2.5 pr-12 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder={s.password}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                  aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setView('forgot')}
                className="text-xs text-muted-foreground hover:text-primary transition-colors cursor-pointer"
              >
                {s.forgot}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer"
            >
              {loading ? s.entering : s.enter}
            </button>
          </form>
        ) : (
          <form onSubmit={handleForgotPassword} className="space-y-4">
            <div>
              <label htmlFor="forgot-username" className="block text-sm font-medium mb-1 text-foreground">{s.username}</label>
              <input
                id="forgot-username"
                name="username"
                type="text"
                required
                autoComplete="username"
                className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder={s.username}
              />
            </div>

            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium mb-1 text-foreground">{s.newPassword}</label>
              <div className="relative">
                <input
                  id="newPassword"
                  name="newPassword"
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={8}
                  className="w-full rounded-xl border border-border bg-background px-4 py-2.5 pr-12 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder={s.newPassword}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1 text-foreground">{s.confirmPassword}</label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showPassword ? 'text' : 'password'}
                required
                minLength={8}
                className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder={s.confirmPassword}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer"
            >
              {loading ? s.entering : s.forgotTitle}
            </button>

            <button
              type="button"
              onClick={() => setView('login')}
              className="w-full text-center text-xs text-muted-foreground hover:text-primary transition-colors cursor-pointer"
            >
              {s.backToLogin}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 4: Commit**

```bash
git add src/components/LoginForm.tsx src/content/i18n/es.json src/content/i18n/en.json
git commit -m "feat(login): add forgot password flow with logo and two-view form"
```

---

## Task 9: Update seed script for admin user

**Files:**
- Modify: `src/db/seed.ts`

- [ ] **Step 1: Add admin user seed to seed.ts**

Add before the blog seeding code in `src/db/seed.ts`:

```typescript
import { users } from '@/db/schema';
import { hashPassword } from '@/lib/auth';

// ... existing seed function starts here ...

async function seed() {
  // Seed admin user
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

  // ... existing blog seeding code ...
```

Also add `import { eq } from 'drizzle-orm';` at the top.

- [ ] **Step 2: Run seed**

Run: `npx tsx src/db/seed.ts`
Expected: Admin user created message

- [ ] **Step 3: Commit**

```bash
git add src/db/seed.ts
git commit -m "feat(seed): add admin user seeding with bcrypt hash"
```

---

## Task 10: Create dashboard user management pages

**Files:**
- Create: `src/pages/dashboard/users/index.astro`
- Create: `src/pages/dashboard/users/new.astro`
- Create: `src/components/UserList.tsx`
- Create: `src/components/UserForm.tsx`
- Modify: `src/pages/dashboard/index.astro`

- [ ] **Step 1: Create UserList component**

Create `src/components/UserList.tsx`:

```tsx
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface User {
  id: string;
  username: string;
  email: string;
  role: string;
  createdAt: string;
}

export default function UserList() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/users')
      .then((r) => r.json())
      .then((data) => { setUsers(data); setLoading(false); })
      .catch(() => { toast.error('Error al cargar usuarios'); setLoading(false); });
  }, []);

  async function handleDelete(id: string, username: string) {
    if (!confirm(`¿Eliminar usuario "${username}"?`)) return;
    try {
      const res = await fetch(`/api/users/${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('Usuario eliminado');
        setUsers((prev) => prev.filter((u) => u.id !== id));
      } else {
        const body = await res.json();
        toast.error(body.error || 'Error al eliminar');
      }
    } catch {
      toast.error('Error de conexión');
    }
  }

  if (loading) return <p className="text-muted-foreground">Cargando...</p>;

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left py-3 px-4 font-medium">Usuario</th>
            <th className="text-left py-3 px-4 font-medium">Email</th>
            <th className="text-left py-3 px-4 font-medium">Rol</th>
            <th className="text-left py-3 px-4 font-medium">Creado</th>
            <th className="text-right py-3 px-4 font-medium">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="border-b border-border/50">
              <td className="py-3 px-4">{user.username}</td>
              <td className="py-3 px-4">{user.email}</td>
              <td className="py-3 px-4">
                <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-primary/10 text-primary">
                  {user.role}
                </span>
              </td>
              <td className="py-3 px-4">{new Date(user.createdAt).toLocaleDateString()}</td>
              <td className="py-3 px-4 text-right">
                <button
                  onClick={() => handleDelete(user.id, user.username)}
                  className="text-destructive hover:text-destructive/80 text-xs cursor-pointer"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

- [ ] **Step 2: Create UserForm component**

Create `src/components/UserForm.tsx`:

```tsx
import { useState } from 'react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export default function UserForm() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const form = e.currentTarget;
    const formData = new FormData(form);
    const username = formData.get('username') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirmPassword') as string;

    if (password !== confirmPassword) {
      toast.error('Las contraseñas no coinciden');
      setLoading(false);
      return;
    }

    if (password.length < 8) {
      toast.error('Mínimo 8 caracteres');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });
      if (res.ok) {
        toast.success('Usuario creado');
        router.push('/dashboard/users');
      } else {
        const body = await res.json();
        toast.error(body.error || 'Error al crear usuario');
      }
    } catch {
      toast.error('Error de conexión');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
      <div>
        <label htmlFor="username" className="block text-sm font-medium mb-1">Usuario</label>
        <input id="username" name="username" type="text" required className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm" />
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
        <input id="email" name="email" type="email" required className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm" />
      </div>
      <div>
        <label htmlFor="password" className="block text-sm font-medium mb-1">Contraseña</label>
        <input id="password" name="password" type="password" required minLength={8} className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm" />
      </div>
      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1">Repetir contraseña</label>
        <input id="confirmPassword" name="confirmPassword" type="password" required minLength={8} className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm" />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-full bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer"
      >
        {loading ? 'Creando...' : 'Crear usuario'}
      </button>
    </form>
  );
}
```

- [ ] **Step 3: Create users list page**

Create `src/pages/dashboard/users/index.astro`:

```astro
---
import DashboardLayout from '@/layouts/DashboardLayout.astro';
import UserList from '@/components/UserList';
---

<DashboardLayout title="Usuarios">
  <div class="section-container">
    <div class="flex items-center justify-between mb-8">
      <h1 class="section-title">Usuarios</h1>
      <a
        href="/dashboard/users/new"
        class="rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity"
      >
        Añadir usuario
      </a>
    </div>
    <UserList client:load />
  </div>
</DashboardLayout>
```

- [ ] **Step 4: Create new user page**

Create `src/pages/dashboard/users/new.astro`:

```astro
---
import DashboardLayout from '@/layouts/DashboardLayout.astro';
import UserForm from '@/components/UserForm';
---

<DashboardLayout title="Nuevo usuario">
  <div class="section-container">
    <h1 class="section-title mb-8">Nuevo usuario</h1>
    <UserForm client:load />
  </div>
</DashboardLayout>
```

- [ ] **Step 5: Update dashboard index with users card**

Update `src/pages/dashboard/index.astro`:

```astro
---
import DashboardLayout from '@/layouts/DashboardLayout.astro';
import { verifyToken } from '@/lib/auth';

const token = Astro.cookies.get('auth-token')?.value;
let isAdmin = false;
if (token) {
  const payload = await verifyToken(token);
  isAdmin = payload?.role === 'admin';
}
---

<DashboardLayout title="Dashboard">
  <main class="pt-24 pb-24">
    <div class="section-container">
      <h1 class="section-title mb-8">Dashboard</h1>
      <div class="grid gap-4 md:grid-cols-2 max-w-2xl">
        <a
          href="/dashboard/blog"
          class="block p-6 rounded-2xl border border-border bg-card hover:border-primary/30 hover:glow-sm transition-all"
        >
          <h2 class="text-lg font-semibold mb-2">Blog</h2>
          <p class="text-sm text-muted-foreground">Crear y gestionar artículos del blog</p>
        </a>
        {isAdmin && (
          <a
            href="/dashboard/users"
            class="block p-6 rounded-2xl border border-border bg-card hover:border-primary/30 hover:glow-sm transition-all"
          >
            <h2 class="text-lg font-semibold mb-2">Usuarios</h2>
            <p class="text-sm text-muted-foreground">Gestionar usuarios del sistema</p>
          </a>
        )}
      </div>
    </div>
  </main>
</DashboardLayout>
```

- [ ] **Step 6: Add /api/users to middleware protected paths**

The middleware already handles `/api/users` via `adminApiPaths`. Verify by checking that `src/middleware.ts` has `const adminApiPaths = ['/api/users'];`.

- [ ] **Step 7: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 8: Commit**

```bash
git add src/pages/dashboard/users/ src/components/UserList.tsx src/components/UserForm.tsx src/pages/dashboard/index.astro
git commit -m "feat(dashboard): add user management pages with list and create forms"
```

---

## Task 11: Run full test suite and fix any issues

**Files:**
- All modified files

- [ ] **Step 1: Run all tests**

Run: `npx vitest run`
Expected: All tests pass

- [ ] **Step 2: Run TypeScript check**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 3: Run build**

Run: `npx astro build`
Expected: Build succeeds

- [ ] **Step 4: Fix any issues found**

Address any test failures, type errors, or build errors.

- [ ] **Step 5: Final commit**

```bash
git add -A
git commit -m "fix: resolve test and type issues for user auth system"
```

---

## Task 12: Seed admin user in production

**Files:**
- None (manual step)

- [ ] **Step 1: Run seed in production**

After deploy, run: `npx tsx src/db/seed.ts` with production DATABASE_URL
Or trigger via Vercel dashboard → Functions → seed

- [ ] **Step 2: Verify login works**

Navigate to `https://www.jmmcdevsign.es/login` and test with credentials:
- Username: `juanma`
- Password: `07870787!Jm`

- [ ] **Step 3: Verify forgot password flow**

Click "¿Olvidaste tu contraseña?" and test the reset flow.

- [ ] **Step 4: Verify dashboard user management**

Login as admin, navigate to `/dashboard/users`, test creating a new user.
