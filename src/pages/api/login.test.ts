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
    expect(mockCreateToken).toHaveBeenCalledWith('testuser', 'editor', '1');
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
