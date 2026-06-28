import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('astro/middleware', () => ({
  defineMiddleware: (handler: any) => handler,
}));

const mockVerifyToken = vi.hoisted(() => vi.fn());

vi.mock('@/lib/auth', () => ({
  verifyToken: mockVerifyToken,
}));

import { onRequest } from '@/middleware';

function createContext(pathname: string, token?: string, method = 'GET') {
  const cookieMock = {
    get: vi.fn((_name: string) => token ? { value: token } : undefined),
    delete: vi.fn(),
    set: vi.fn(),
  };

  return {
    url: new URL(`http://localhost${pathname}`),
    cookies: cookieMock,
    redirect: vi.fn((path: string) => new Response(null, {
      status: 302,
      headers: { Location: path },
    })),
    request: new Request(`http://localhost${pathname}`, { method }),
  };
}

const next = vi.fn(() => new Response(null, { status: 200 }));

beforeEach(() => {
  vi.clearAllMocks();
  mockVerifyToken.mockResolvedValue({ username: 'testuser', role: 'user' });
});

describe('middleware', () => {
  it('allows non-protected paths', async () => {
    const ctx = createContext('/');
    await onRequest(ctx, next);
    expect(next).toHaveBeenCalled();
    expect(ctx.redirect).not.toHaveBeenCalled();
  });

  it('allows non-matching paths like /about', async () => {
    const ctx = createContext('/about');
    await onRequest(ctx, next);
    expect(next).toHaveBeenCalled();
  });

  it('redirects to /login for /blog without token', async () => {
    const ctx = createContext('/blog');
    await onRequest(ctx, next);
    expect(ctx.redirect).toHaveBeenCalledWith('/login');
    expect(next).not.toHaveBeenCalled();
  });

  it('redirects to /login for /es/blog without token', async () => {
    const ctx = createContext('/es/blog');
    await onRequest(ctx, next);
    expect(ctx.redirect).toHaveBeenCalledWith('/login');
  });

  it('redirects to /login for /en/blog without token', async () => {
    const ctx = createContext('/en/blog');
    await onRequest(ctx, next);
    expect(ctx.redirect).toHaveBeenCalledWith('/login');
  });

  it('protects /blog subpaths', async () => {
    const ctx = createContext('/blog/my-post');
    await onRequest(ctx, next);
    expect(ctx.redirect).toHaveBeenCalledWith('/login');
  });

  it('allows access with valid token', async () => {
    const ctx = createContext('/blog', 'valid-token');
    mockVerifyToken.mockResolvedValue({ username: 'testuser', role: 'user' });

    await onRequest(ctx, next);
    expect(next).toHaveBeenCalled();
    expect(ctx.redirect).not.toHaveBeenCalled();
  });

  it('redirects and deletes cookie when token is invalid', async () => {
    const ctx = createContext('/blog', 'invalid-token');
    mockVerifyToken.mockResolvedValue(null);

    await onRequest(ctx, next);
    expect(ctx.redirect).toHaveBeenCalledWith('/login');
    expect(ctx.cookies.delete).toHaveBeenCalledWith('auth-token', { path: '/' });
    expect(next).not.toHaveBeenCalled();
  });

  describe('admin page protection', () => {
    it('redirects non-admin user from /dashboard/users to /dashboard', async () => {
      const ctx = createContext('/dashboard/users', 'valid-token');
      mockVerifyToken.mockResolvedValue({ username: 'testuser', role: 'user' });

      await onRequest(ctx, next);
      expect(ctx.redirect).toHaveBeenCalledWith('/dashboard');
      expect(next).not.toHaveBeenCalled();
    });

    it('allows admin user to access /dashboard/users', async () => {
      const ctx = createContext('/dashboard/users', 'valid-token');
      mockVerifyToken.mockResolvedValue({ username: 'admin', role: 'admin' });

      await onRequest(ctx, next);
      expect(next).toHaveBeenCalled();
      expect(ctx.redirect).not.toHaveBeenCalled();
    });

    it('redirects non-admin from /dashboard/users/123 to /dashboard', async () => {
      const ctx = createContext('/dashboard/users/123', 'valid-token');
      mockVerifyToken.mockResolvedValue({ username: 'testuser', role: 'user' });

      await onRequest(ctx, next);
      expect(ctx.redirect).toHaveBeenCalledWith('/dashboard');
      expect(next).not.toHaveBeenCalled();
    });

    it('redirects non-admin from /dashboard/users to /login when no token', async () => {
      const ctx = createContext('/dashboard/users');
      await onRequest(ctx, next);
      expect(ctx.redirect).toHaveBeenCalledWith('/login');
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe('admin API protection', () => {
    it('returns 403 for non-admin user on /api/users', async () => {
      const ctx = createContext('/api/users', 'valid-token', 'GET');
      mockVerifyToken.mockResolvedValue({ username: 'testuser', role: 'user' });

      const response = await onRequest(ctx, next);
      expect(response).toBeInstanceOf(Response);
      expect(response!.status).toBe(403);
      const body = await response!.json();
      expect(body.error).toBe('No autorizado');
      expect(next).not.toHaveBeenCalled();
    });

    it('allows admin user to access /api/users', async () => {
      const ctx = createContext('/api/users', 'valid-token', 'GET');
      mockVerifyToken.mockResolvedValue({ username: 'admin', role: 'admin' });

      await onRequest(ctx, next);
      expect(next).toHaveBeenCalled();
    });

    it('returns 401 for /api/users without token', async () => {
      const ctx = createContext('/api/users', undefined, 'GET');

      const response = await onRequest(ctx, next);
      expect(response).toBeInstanceOf(Response);
      expect(response!.status).toBe(401);
      const body = await response!.json();
      expect(body.error).toBe('No autenticado');
    });

    it('returns 401 for /api/users with invalid token', async () => {
      const ctx = createContext('/api/users', 'bad-token', 'GET');
      mockVerifyToken.mockResolvedValue(null);

      const response = await onRequest(ctx, next);
      expect(response).toBeInstanceOf(Response);
      expect(response!.status).toBe(401);
      const body = await response!.json();
      expect(body.error).toBe('Token inválido');
      expect(ctx.cookies.delete).toHaveBeenCalledWith('auth-token', { path: '/' });
    });
  });

  describe('protected API write protection', () => {
    it('allows GET to /api/posts without auth', async () => {
      const ctx = createContext('/api/posts', undefined, 'GET');
      await onRequest(ctx, next);
      expect(next).toHaveBeenCalled();
    });

    it('returns 401 for POST to /api/posts without token', async () => {
      const ctx = createContext('/api/posts', undefined, 'POST');

      const response = await onRequest(ctx, next);
      expect(response!.status).toBe(401);
      const body = await response!.json();
      expect(body.error).toBe('No autenticado');
    });

    it('allows authenticated POST to /api/posts', async () => {
      const ctx = createContext('/api/posts', 'valid-token', 'POST');
      mockVerifyToken.mockResolvedValue({ username: 'testuser', role: 'user' });

      await onRequest(ctx, next);
      expect(next).toHaveBeenCalled();
    });
  });
});
