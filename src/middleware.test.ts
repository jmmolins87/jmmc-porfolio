import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('astro/middleware', () => ({
  defineMiddleware: (handler: any) => handler,
}));

const mockVerifyToken = vi.hoisted(() => vi.fn());

vi.mock('@/lib/auth', () => ({
  verifyToken: mockVerifyToken,
}));

import { onRequest } from '@/middleware';

function createContext(pathname: string, token?: string) {
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
    request: new Request(`http://localhost${pathname}`),
  };
}

const next = vi.fn(() => new Response(null, { status: 200 }));

beforeEach(() => {
  vi.clearAllMocks();
  mockVerifyToken.mockResolvedValue({ username: 'testuser' });
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
    mockVerifyToken.mockResolvedValue({ username: 'testuser' });

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
});
