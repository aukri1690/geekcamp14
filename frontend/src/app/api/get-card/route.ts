// src/app/api/get-card/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;
    if (!token) {
      return NextResponse.json({ error: "アクセストークンがありません" }, { status: 401 });
    }

    // FastAPI 側からカードデータを取得
    const res = await fetch("http://localhost:8000/cards/me", {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();
    if (!res.ok) {
      return NextResponse.json({ error: data.detail || "FastAPIカード取得失敗" }, { status: res.status });
    }

    return NextResponse.json(data);
  } catch (err: any) {
    console.error("GET /api/get-card エラー:", err);
    return NextResponse.json({ error: err.message || "サーバー通信エラー" }, { status: 500 });
  }
}
