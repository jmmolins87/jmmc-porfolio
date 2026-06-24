import { defineMiddleware } from 'astro/middleware';
import { verifyToken } from './lib/auth';

const protectedPaths = ['/blog', '/es/blog', '/en/blog'];

function isProtected(pathname: string): boolean {
  return protectedPaths.some((p) => pathname === p || pathname.startsWith(p + '/'));
}

export const onRequest = defineMiddleware(async (context, next) => {
  if (isProtected(context.url.pathname)) {
    const token = context.cookies.get('auth-token')?.value;
    if (!token) {
      return context.redirect('/login');
    }
    const payload = await verifyToken(token);
    if (!payload) {
      context.cookies.delete('auth-token', { path: '/' });
      return context.redirect('/login');
    }
  }

  return next();
});
