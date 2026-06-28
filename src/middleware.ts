import { defineMiddleware } from 'astro/middleware';
import { verifyToken } from '@/lib/auth';

const protectedPagePaths = ['/dashboard', '/blog', '/es/blog', '/en/blog'];
const protectedApiPaths = ['/api/posts', '/api/upload'];

function isProtectedPage(pathname: string): boolean {
  return protectedPagePaths.some((p) => pathname === p || pathname.startsWith(p + '/'));
}

function isProtectedApiWrite(pathname: string, method: string): boolean {
  if (method === 'GET') return false;
  return protectedApiPaths.some((p) => pathname === p || pathname.startsWith(p + '/'));
}

export const onRequest = defineMiddleware(async (context, next) => {
  const { pathname } = context.url;
  const method = context.request.method;

  if (isProtectedPage(pathname) || isProtectedApiWrite(pathname, method)) {
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
  }

  return next();
});
