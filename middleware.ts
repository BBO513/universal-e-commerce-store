
import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    // Redirect if not admin
    if (req.nextUrl.pathname.startsWith('/admin') && req.nextauth.token?.role !== 'admin') {
      return NextResponse.rewrite(new URL('/unauthorized', req.url));
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token, // Only allow authenticated users
    },
  }
);

export const config = {
  matcher: ['/admin/:path*'], // Protect all routes under /admin
};
