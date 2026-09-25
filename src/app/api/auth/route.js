import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { loginUser } from '@/data/auth';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    const body = await request.json();
    const action = body.action || 'login';

    if (action === 'logout') {
      const cookieStore = await cookies();
      cookieStore.set('auth', '', {
        path: '/',
        maxAge: 0,
        expires: new Date(0),
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production'
      });
      cookieStore.set('auth_token', '', {
        path: '/',
        maxAge: 0,
        expires: new Date(0),
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production'
      });

      return NextResponse.json({ success: true, message: 'Logged out successfully' });
    }

    if (action === 'check') {
      const cookieStore = await cookies();
      const auth = cookieStore.get('auth');
      const isValid = auth && auth.value === 'admin';
      return NextResponse.json({ authenticated: Boolean(isValid) });
    }

    // Default: Login
    const { email, password } = body;
    const result = loginUser(email, password);

    if (!result.success) {
      return NextResponse.json(
        { success: false, message: result.message || 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Set secure authentication cookie
    const cookieStore = await cookies();
    cookieStore.set('auth', 'admin', {
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days session
      sameSite: 'lax',
      httpOnly: false, // accessible to client check
      secure: process.env.NODE_ENV === 'production'
    });

    cookieStore.set('auth_token', 'r24_sec_' + Buffer.from(email).toString('base64'), {
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
      sameSite: 'lax',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production'
    });

    return NextResponse.json({
      success: true,
      user: result.user,
      message: 'Authentication successful'
    });

  } catch (error) {
    console.error('Auth API error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal authentication error' },
      { status: 500 }
    );
  }
}
