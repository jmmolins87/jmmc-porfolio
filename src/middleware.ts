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
