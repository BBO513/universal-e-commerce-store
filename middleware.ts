import { getToken } from 'next-auth/jwt';
import { NextResponse, NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/setup-wizard') ||
    pathname === '/favicon.ico'
  ) {
    return NextResponse.next();
  }

  const storeConfigured = req.cookies.get('store_configured');
  if (!storeConfigured) {
    return NextResponse.redirect(new URL('/setup-wizard', req.url));
  }

  if (pathname.startsWith('/admin')) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token) {
      return NextResponse.redirect(new URL('/login', req.url));
    }
    if (token.role !== 'admin') {
      return NextResponse.rewrite(new URL('/unauthorized', req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next|api|setup-wizard|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|ico|webp|woff2?|ttf|eot|css|js)$).*)',
  ],
};
