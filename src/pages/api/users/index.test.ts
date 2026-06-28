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
    mockVerifyToken.mockResolvedValue({ id: '2', username: 'user', role: 'editor' });
    const request = createRequestWithCookie('auth-token=test-token');
    const response = await GET({ request } as any);
    expect(response.status).toBe(401);
  });

  it('returns user list for admin', async () => {
    mockVerifyToken.mockResolvedValue({ id: '1', username: 'admin', role: 'admin' });
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
