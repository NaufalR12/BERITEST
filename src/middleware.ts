import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const { pathname } = request.nextUrl;

  const isProtectedRoute = pathname.startsWith('/admin') || pathname.startsWith('/user');
  const isLoginPage = pathname === '/login';

  if (token) {
    try {
      // Decode payload JWT (bagian tengah dari token)
      const payload = JSON.parse(atob(token.split('.')[1]));
      const userRole = payload.role;

      // Proteksi: User TIDAK BOLEH masuk ke area /admin
      if (pathname.startsWith('/admin') && userRole !== 'Admin') {
        return NextResponse.redirect(new URL('/user', request.url));
      }
      
      // Proteksi opsional: Admin mungkin tidak boleh ke halaman /user
      if (pathname.startsWith('/user') && userRole === 'Admin') {
        return NextResponse.redirect(new URL('/admin/users', request.url));
      }

      // Jika user sudah login dan mencoba ke /login, arahkan sesuai role
      if (isLoginPage) {
        return NextResponse.redirect(
          new URL(userRole === 'Admin' ? '/admin/users' : '/user', request.url)
        );
      }
    } catch (e) {
      // Jika token korup atau tidak valid, redirect ke login
      if (isProtectedRoute) {
        return NextResponse.redirect(new URL('/login', request.url));
      }
    }
  } else if (isProtectedRoute) {
    // Jika tidak ada token dan mencoba akses area terproteksi
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/user/:path*',
    '/login',
  ],
};
