import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const backendUrl = process.env.BACKEND_URL!;
    
    const backendRes = await fetch(`${backendUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const data = await backendRes.json();

    if (!backendRes.ok) {
      return NextResponse.json(data, { status: backendRes.status });
    }

    // Cookieに保存
    const response = NextResponse.json({
      user: data.user,
      has_card: data.has_card,
      card_id: data.card_id,
    });

    response.cookies.set('access_token', data.access_token, {
      httpOnly: true,
      path: '/',
      maxAge: 3600,
      sameSite: 'lax',
    });

    response.cookies.set('refresh_token', data.refresh_token, {
      httpOnly: true,
      path: '/',
      maxAge: 604800,
      sameSite: 'lax',
    });

    return response;
  } catch (err: any) {
    console.error('Route /api/login error:', err);
    return NextResponse.json(
      { detail: err.message || 'Login failed' },
      { status: 500 }
    );
  }
}
