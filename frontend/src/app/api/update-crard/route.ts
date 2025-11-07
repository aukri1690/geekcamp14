// src/app/api/update-card/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function PATCH(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const card_id = searchParams.get("card_id");
    if (!card_id) {
      return NextResponse.json({ error: "card_id が指定されていません" }, { status: 400 });
    }

    const body = await req.json();

    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;
    if (!token) {
      return NextResponse.json({ error: "アクセストークンがありません" }, { status: 401 });
    }

    const res = await fetch(`http://localhost:8000/cards/${card_id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    if (!res.ok) {
      return NextResponse.json({ error: data.detail || "FastAPI更新失敗" }, { status: res.status });
    }

    return NextResponse.json(data);
  } catch (err: any) {
    console.error("PATCH エラー:", err);
    return NextResponse.json({ error: err.message || "サーバー通信エラー" }, { status: 500 });
  }
}
