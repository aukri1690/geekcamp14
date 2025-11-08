import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    // ✅ URLパラメータから card_id を取得
    const { searchParams } = new URL(req.url);
    const card_id = searchParams.get("card_id");

    if (!card_id) {
      return NextResponse.json(
        { error: "card_id が指定されていません" },
        { status: 400 }
      );
    }

    // ✅ Cookie を安全に取得
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "アクセストークンがありません" },
        { status: 401 }
      );
    }

    // ✅ フォームデータを受け取る
    const formData = await req.formData();

    // ✅ バックエンド (FastAPI) に転送
    const res = await fetch(
      `http://localhost:8000/api/cardlink/upload_photo/${card_id}/photo`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      }
    );

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(
        { error: data.detail || "アップロード失敗" },
        { status: res.status }
      );
    }

    return NextResponse.json(data);
  } catch (err: any) {
    console.error("アップロードエラー:", err);
    return NextResponse.json(
      { error: "サーバー通信エラー: " + err.message },
      { status: 500 }
    );
  }
}
