import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from './contact';

const mockFetch = vi.fn();

function createRequest(body: any, validJson = true) {
  return new Request('http://localhost/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: validJson ? JSON.stringify(body) : 'not-json',
  });
}

beforeEach(() => {
  vi.stubEnv('BREVO_API_KEY', 'test-key');
  mockFetch.mockReset();
  vi.stubGlobal('fetch', mockFetch);
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe('POST /api/contact', () => {
  it('returns 200 and sends email with valid data', async () => {
    mockFetch.mockResolvedValueOnce(new Response(null, { status: 200 }));

    const response = await POST({
      request: createRequest({ name: 'Juan', email: 'juan@test.com', message: 'Hello' }),
    } as any);

    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body).toEqual({ success: true });
    expect(mockFetch).toHaveBeenCalledTimes(1);
    expect(mockFetch).toHaveBeenCalledWith(
      'https://api.brevo.com/v3/smtp/email',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({ 'api-key': 'test-key' }),
      })
    );
  });

  it('returns 400 when name is missing', async () => {
    const response = await POST({
      request: createRequest({ email: 'juan@test.com', message: 'Hello' }),
    } as any);

    expect(response.status).toBe(400);
    const body = await response.json();
    expect(body.error).toBe('Todos los campos son obligatorios');
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it('returns 400 when email is missing', async () => {
    const response = await POST({
      request: createRequest({ name: 'Juan', message: 'Hello' }),
    } as any);

    expect(response.status).toBe(400);
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it('returns 400 when message is missing', async () => {
    const response = await POST({
      request: createRequest({ name: 'Juan', email: 'juan@test.com' }),
    } as any);

    expect(response.status).toBe(400);
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it('returns 400 with empty fields', async () => {
    const response = await POST({
      request: createRequest({ name: '', email: '', message: '' }),
    } as any);

    expect(response.status).toBe(400);
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it('returns 500 when Brevo responds with error', async () => {
    mockFetch.mockResolvedValueOnce(
      new Response('Unauthorized', { status: 401 })
    );

    const response = await POST({
      request: createRequest({ name: 'Juan', email: 'juan@test.com', message: 'Hello' }),
    } as any);

    expect(response.status).toBe(500);
    const body = await response.json();
    expect(body.error).toBe('Error al enviar el mensaje');
  });

  it('returns 500 when BREVO_API_KEY is missing', async () => {
    vi.stubEnv('BREVO_API_KEY', '');

    const response = await POST({
      request: createRequest({ name: 'Juan', email: 'juan@test.com', message: 'Hello' }),
    } as any);

    expect(response.status).toBe(500);
    const body = await response.json();
    expect(body.error).toBe('Error interno del servidor');
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it('returns 500 when JSON parsing fails', async () => {
    const response = await POST({
      request: createRequest(null, false),
    } as any);

    expect(response.status).toBe(500);
    const body = await response.json();
    expect(body.error).toBe('Error interno del servidor');
  });
});
