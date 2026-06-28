import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

const TEST_SECRET = 'test-secret-123456789012345678901234567890';

vi.mock('@/db/index', () => ({
  db: {
    query: {
      users: {
        findFirst: vi.fn(),
      },
    },
  },
}));

vi.mock('bcryptjs', () => ({
  default: {
    hash: vi.fn(async (pw: string) => `hashed-${pw}`),
    compare: vi.fn(async (pw: string, hash: string) => hash === `hashed-${pw}`),
  },
}));

beforeEach(() => {
  vi.stubEnv('JWT_SECRET', TEST_SECRET);
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.clearAllMocks();
});

describe('validateCredentials', () => {
  it('returns user for valid credentials', async () => {
    const { db } = await import('@/db/index');
    const mockUser = { id: '1', username: 'testuser', role: 'admin', passwordHash: 'hashed-testpass' };
    (db.query.users.findFirst as ReturnType<typeof vi.fn>).mockResolvedValue(mockUser);

    const { validateCredentials } = await import('@/lib/auth');
    const result = await validateCredentials('testuser', 'testpass');
    expect(result.valid).toBe(true);
    expect(result.user).toEqual({ id: '1', username: 'testuser', role: 'admin' });
  });

  it('returns false for invalid password', async () => {
    const { db } = await import('@/db/index');
    const mockUser = { id: '1', username: 'testuser', role: 'admin', passwordHash: 'hashed-testpass' };
    (db.query.users.findFirst as ReturnType<typeof vi.fn>).mockResolvedValue(mockUser);

    const { validateCredentials } = await import('@/lib/auth');
    const result = await validateCredentials('testuser', 'wrongpass');
    expect(result.valid).toBe(false);
  });

  it('returns false for invalid username', async () => {
    const { db } = await import('@/db/index');
    (db.query.users.findFirst as ReturnType<typeof vi.fn>).mockResolvedValue(null);

    const { validateCredentials } = await import('@/lib/auth');
    const result = await validateCredentials('wronguser', 'testpass');
    expect(result.valid).toBe(false);
  });

  it('returns false for empty credentials', async () => {
    const { db } = await import('@/db/index');
    (db.query.users.findFirst as ReturnType<typeof vi.fn>).mockResolvedValue(null);

    const { validateCredentials } = await import('@/lib/auth');
    const result = await validateCredentials('', '');
    expect(result.valid).toBe(false);
  });
});

describe('createToken', () => {
  it('creates a JWT string with three parts', async () => {
    const { createToken } = await import('@/lib/auth');
    const token = await createToken('testuser', 'admin');
    expect(token).toBeTruthy();
    expect(token.split('.')).toHaveLength(3);
  });

  it('creates different tokens for different usernames', async () => {
    const { createToken } = await import('@/lib/auth');
    const [token1, token2] = await Promise.all([
      createToken('user1', 'user'),
      createToken('user2', 'user'),
    ]);
    expect(token1).not.toBe(token2);
  });

  it('produces a verifiable token with role', async () => {
    const { createToken, verifyToken } = await import('@/lib/auth');
    const token = await createToken('testuser', 'editor');
    const payload = await verifyToken(token);
    expect(payload).toEqual({ username: 'testuser', role: 'editor' });
  });
});

describe('verifyToken', () => {
  it('returns payload for a valid token', async () => {
    const { createToken, verifyToken } = await import('@/lib/auth');
    const token = await createToken('testuser', 'admin');
    const result = await verifyToken(token);
    expect(result).toEqual({ username: 'testuser', role: 'admin' });
  });

  it('returns null for a tampered token', async () => {
    const { createToken, verifyToken } = await import('@/lib/auth');
    const token = await createToken('testuser', 'admin');
    const tampered = token.slice(0, -4) + 'xxxx';
    const result = await verifyToken(tampered);
    expect(result).toBeNull();
  });

  it('returns null for a random string', async () => {
    const { verifyToken } = await import('@/lib/auth');
    const result = await verifyToken('not-a-valid-jwt-token');
    expect(result).toBeNull();
  });

  it('returns null for an empty string', async () => {
    const { verifyToken } = await import('@/lib/auth');
    const result = await verifyToken('');
    expect(result).toBeNull();
  });

  it('returns null when secret does not match', async () => {
    const { createToken } = await import('@/lib/auth');
    const token = await createToken('testuser', 'admin');

    vi.unstubAllEnvs();
    vi.stubEnv('JWT_SECRET', 'different-secret-for-testing-purposes-only!!');

    const { verifyToken: verifyWithDifferentSecret } = await import('@/lib/auth');
    const result = await verifyWithDifferentSecret(token);
    expect(result).toBeNull();
  });
});

describe('hashPassword and comparePassword', () => {
  it('hashPassword returns a hashed string', async () => {
    const { hashPassword } = await import('@/lib/auth');
    const hash = await hashPassword('mypassword');
    expect(hash).toBe('hashed-mypassword');
  });

  it('comparePassword returns true for matching password', async () => {
    const { hashPassword, comparePassword } = await import('@/lib/auth');
    const hash = await hashPassword('mypassword');
    const result = await comparePassword('mypassword', hash);
    expect(result).toBe(true);
  });

  it('comparePassword returns false for wrong password', async () => {
    const { hashPassword, comparePassword } = await import('@/lib/auth');
    const hash = await hashPassword('mypassword');
    const result = await comparePassword('wrongpassword', hash);
    expect(result).toBe(false);
  });
});
