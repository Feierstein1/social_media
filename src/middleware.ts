// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('authToken'); 
  const { pathname } = request.nextUrl;
  //console.log('Middleware running for path:', pathname);
  //console.log('Token found:', token);

  if ((pathname === '/' || pathname.startsWith('/auth')) && !token) {
    return NextResponse.redirect(new URL('/unauth/login', request.url));
  }

  if ((pathname === '/' || pathname.startsWith('/unauth')) && token) {
    return NextResponse.redirect(new URL('/auth/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};