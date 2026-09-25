import { NextResponse } from 'next/server';

export function middleware(request) {
  // Check if trying to access the dashboard
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    const authCookie = request.cookies.get('auth');
    
    // If not authenticated, redirect to the hidden secure admin page
    if (!authCookie || authCookie.value !== 'admin') {
      const loginUrl = new URL('/admin-secure', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }
  
  // If already logged in and visiting admin-secure, redirect to dashboard
  if (request.nextUrl.pathname === '/admin-secure') {
    const authCookie = request.cookies.get('auth');
    if (authCookie && authCookie.value === 'admin') {
      const dashboardUrl = new URL('/dashboard', request.url);
      return NextResponse.redirect(dashboardUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/admin-secure'],
};
