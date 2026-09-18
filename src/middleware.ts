import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Lightweight edge guard for the admin dashboard. The real authorization
// check still happens client-side (the dashboard reads the full staff
// record via cmsStore) and, for login itself, server-side against the
// database in /api/admin/login. This middleware only prevents someone
// from loading /admin with no session cookie at all — it redirects them
// straight to the login gate instead of letting the dashboard shell
// render first and bounce a moment later.
export function middleware(request: NextRequest) {
  const hasSession = request.cookies.has('aiml_admin_session');

  if (!hasSession) {
    const loginUrl = new URL('/admin-login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin', '/admin/:path*']
};
