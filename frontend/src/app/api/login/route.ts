import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    // クライアントから送られてきた JSON ボディを取得
    const body = await req.json();

    // 環境変数から FastAPI URL を取得
    const backendUrl = process.env.BACKEND_URL;
    if (!backendUrl) {
      console.error('BACKEND_URL is not set in environment variables');
      return NextResponse.json({ detail: 'Server configuration error' }, { status: 500 });
    }
    console.log('Using backend URL:', backendUrl);

    // FastAPI に POST
    const backendRes = await fetch(`${backendUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const data = await backendRes.json();
    console.log('Backend response:', data);

    // FastAPI がエラーを返した場合はそのままステータスと detail を返す
    if (!backendRes.ok) {
      return NextResponse.json(data, { status: backendRes.status });
    }

    // 成功時のみ Cookie にトークンを保存
    const response = NextResponse.json({ user: data.user });

    response.cookies.set('access_token', data.access_token, {
      httpOnly: true,
      path: '/',
      maxAge: 3600, // 1時間
      sameSite: 'lax',
    });

    response.cookies.set('refresh_token', data.refresh_token, {
      httpOnly: true,
      path: '/',
      maxAge: 604800, // 7日
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
