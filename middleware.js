import { auth } from '@/lib/auth';
import { NextResponse } from 'next/server';

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const isAdminRoute = req.nextUrl.pathname.startsWith('/admin');
  const isLoginPage = req.nextUrl.pathname === '/admin/login';
  const isApiAuthRoute = req.nextUrl.pathname.startsWith('/api/auth');

  // Allow API auth routes
  if (isApiAuthRoute) {
    return NextResponse.next();
  }

  // Admin routes protection
  if (isAdminRoute) {
    if (isLoginPage) {
      if (isLoggedIn) {
        return NextResponse.redirect(new URL('/admin/dashboard', req.url));
      }
      return NextResponse.next();
    }

    if (!isLoggedIn) {
      return NextResponse.redirect(new URL('/admin/login', req.url));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/admin/:path*'],
};
