import { NextRequest, NextResponse } from 'next/server';
import { getPayload } from 'payload';
import config from '@/payload.config';

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get('content-type') || '';
    const wantsJSON = contentType.includes('application/json');
    const input = contentType.includes('application/json')
      ? await request.json()
      : Object.fromEntries((await request.formData()).entries());

    const payload = await getPayload({ config });
    const result = await payload.login({
      collection: 'users',
      data: {
        email: String(input.email || '').trim(),
        password: String(input.password || ''),
      },
    });

    if (wantsJSON) {
      const response = NextResponse.json({
        message: 'Auth Passed',
        user: result.user,
        token: result.token,
      });
      if (result.token) {
        response.cookies.set('payload-token', result.token, {
          path: '/',
          httpOnly: true,
          sameSite: 'lax',
          secure: process.env.NODE_ENV === 'production',
        });
      }
      return response;
    }

    const destination = new URL('/jway_administrator', request.url);
    const response = NextResponse.redirect(destination, 303);
    if (result.token) {
      response.cookies.set('payload-token', result.token, {
        path: '/',
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
      });
    }
    return response;
  } catch (err) {
    console.error('Admin Login Auth Error:', err);
    const contentType = request.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      return NextResponse.json({ error: 'The email or password provided is incorrect.' }, { status: 400 });
    }
    return NextResponse.redirect(new URL('/jway_administrator/login?error=1', request.url), 303);
  }
}
