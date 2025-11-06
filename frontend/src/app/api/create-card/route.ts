import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Cookie文字列を取得
    const cookieHeader = req.headers.get("cookie") || "";

    // access_token= の部分を正規表現で抽出
    const match = cookieHeader.match(/access_token=([^;]+)/);
    const token = match ? match[1] : null;

    if (!token) {
      return NextResponse.json({ error: "アクセストークンがありません" }, { status: 401 });
    }

    const res = await fetch("http://localhost:8000/api/cardlink/cards_create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json({ error: data.detail || "作成失敗" }, { status: res.status });
    }

    return NextResponse.json(data);
  } catch (err: any) {
    console.error("カード作成エラー:", err);
    return NextResponse.json({ error: "サーバー通信エラー: " + err.message }, { status: 500 });
  }
}
