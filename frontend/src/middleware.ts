import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token =
    request.cookies.get('token')?.value ||
    request.headers.get('authorization')?.replace('Bearer ', '');

  const isAuthenticated = !!token;
  const path = request.nextUrl.pathname;

  if (path === '/') {
    return NextResponse.next();
  }

  const isAuthPage = path.startsWith('/auth/login');
  const isDashboard = path.startsWith('/dashboard');

  if (!isAuthenticated && isDashboard) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  if (isAuthenticated && isAuthPage) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
