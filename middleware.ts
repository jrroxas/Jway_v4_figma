import { NextRequest, NextResponse } from 'next/server';

const ADMIN_ROOT_PATH = '/admin';
const ADMIN_LOGIN_PATH = '/admin/login';
const PAYLOAD_AUTH_COOKIE = 'payload-token';

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname !== ADMIN_ROOT_PATH) {
    return NextResponse.next();
  }

  const authToken = request.cookies.get(PAYLOAD_AUTH_COOKIE);

  if (authToken?.value) {
    return NextResponse.next();
  }

  const loginUrl = request.nextUrl.clone();
  loginUrl.pathname = ADMIN_LOGIN_PATH;
  loginUrl.searchParams.set('redirect', ADMIN_ROOT_PATH);

  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ['/admin'],
};
