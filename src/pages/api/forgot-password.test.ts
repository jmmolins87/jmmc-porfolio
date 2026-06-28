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
