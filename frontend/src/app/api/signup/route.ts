import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const backendUrl = process.env.BACKEND_URL;

    if (!backendUrl) {
      console.error('BACKEND_URL is not set in environment variables');
      return NextResponse.json({ detail: 'Server configuration error' }, { status: 500 });
    }

    console.log('Using backend URL:', backendUrl);

    // FastAPI の signup エンドポイントに POST
    const backendRes = await fetch(`${backendUrl}/api/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const data = await backendRes.json();
    console.log('Backend response:', data);

    if (!backendRes.ok) {
      // FastAPI が返すエラーをそのまま返す
      return NextResponse.json(data, { status: backendRes.status });
    }

    // 成功時はメッセージだけ返す
    return NextResponse.json({ message: data.message });
  } catch (err: any) {
    console.error('Route /api/signup error:', err);
    return NextResponse.json({ detail: err.message || 'Sign-up failed' }, { status: 500 });
  }
}
