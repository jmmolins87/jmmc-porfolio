import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

const TEST_SECRET = 'test-secret-123456789012345678901234567890';

beforeEach(() => {
  vi.stubEnv('JWT_SECRET', TEST_SECRET);
  vi.stubEnv('BLOG_USER', 'testuser');
  vi.stubEnv('BLOG_PASSWORD', 'testpass');
});

afterEach(() => {
  vi.unstubAllEnvs();
});

describe('validateCredentials', () => {
  it('returns true for valid credentials', async () => {
    const { validateCredentials } = await import('./auth');
    expect(validateCredentials('testuser', 'testpass')).toBe(true);
  });

  it('returns false for invalid password', async () => {
    const { validateCredentials } = await import('./auth');
    expect(validateCredentials('testuser', 'wrongpass')).toBe(false);
  });

  it('returns false for invalid username', async () => {
    const { validateCredentials } = await import('./auth');
    expect(validateCredentials('wronguser', 'testpass')).toBe(false);
  });

  it('returns false for empty credentials', async () => {
    const { validateCredentials } = await import('./auth');
    expect(validateCredentials('', '')).toBe(false);
    expect(validateCredentials('', 'testpass')).toBe(false);
    expect(validateCredentials('testuser', '')).toBe(false);
  });

  it('uses default fallback credentials when env vars are not set', async () => {
    vi.unstubAllEnvs();
    const { validateCredentials } = await import('./auth');
    expect(validateCredentials('admin', 'admin')).toBe(true);
  });
});

describe('getSecret fallback', () => {
  it('uses the hardcoded fallback secret when no env vars are set', async () => {
    vi.unstubAllEnvs();
    const { createToken, verifyToken } = await import('./auth');
    const token = await createToken('testuser');
    expect(token).toBeTruthy();
    expect(token.split('.')).toHaveLength(3);
    const payload = await verifyToken(token);
    expect(payload).toEqual({ username: 'testuser' });
  });

  it('falls back to process.env when import.meta.env is not set', async () => {
    vi.unstubAllEnvs();
    process.env.JWT_SECRET = 'process-secret-key-12345678901234567890';
    process.env.BLOG_USER = 'process_user';
    process.env.BLOG_PASSWORD = 'process_pass';
    const { createToken, verifyToken, validateCredentials } = await import('./auth');
    const token = await createToken('process_user');
    const payload = await verifyToken(token);
    expect(payload).toEqual({ username: 'process_user' });
    expect(validateCredentials('process_user', 'process_pass')).toBe(true);
    delete process.env.JWT_SECRET;
    delete process.env.BLOG_USER;
    delete process.env.BLOG_PASSWORD;
  });
});

describe('createToken', () => {
  it('creates a JWT string with three parts', async () => {
    const { createToken } = await import('./auth');
    const token = await createToken('testuser');
    expect(token).toBeTruthy();
    expect(token.split('.')).toHaveLength(3);
  });

  it('creates different tokens for different usernames', async () => {
    const { createToken } = await import('./auth');
    const [token1, token2] = await Promise.all([
      createToken('user1'),
      createToken('user2'),
    ]);
    expect(token1).not.toBe(token2);
  });

  it('produces a verifiable token', async () => {
    const { createToken, verifyToken } = await import('./auth');
    const token = await createToken('testuser');
    const payload = await verifyToken(token);
    expect(payload).toEqual({ username: 'testuser' });
  });
});

describe('verifyToken', () => {
  it('returns payload for a valid token', async () => {
    const { createToken, verifyToken } = await import('./auth');
    const token = await createToken('testuser');
    const result = await verifyToken(token);
    expect(result).toEqual({ username: 'testuser' });
  });

  it('returns null for a tampered token', async () => {
    const { createToken, verifyToken } = await import('./auth');
    const token = await createToken('testuser');
    const tampered = token.slice(0, -4) + 'xxxx';
    const result = await verifyToken(tampered);
    expect(result).toBeNull();
  });

  it('returns null for a random string', async () => {
    const { verifyToken } = await import('./auth');
    const result = await verifyToken('not-a-valid-jwt-token');
    expect(result).toBeNull();
  });

  it('returns null for an empty string', async () => {
    const { verifyToken } = await import('./auth');
    const result = await verifyToken('');
    expect(result).toBeNull();
  });

  it('returns null when secret does not match', async () => {
    const { createToken, verifyToken } = await import('./auth');
    const token = await createToken('testuser');

    vi.unstubAllEnvs();
    vi.stubEnv('JWT_SECRET', 'different-secret-for-testing-purposes-only!!');

    const { verifyToken: verifyWithDifferentSecret } = await import('./auth');
    const result = await verifyWithDifferentSecret(token);
    expect(result).toBeNull();
  });
});
