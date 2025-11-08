// src/app/api/get-photo/route.ts
import { NextResponse } from "next/server";
import axios from "axios";

export async function GET(req: Request) {
  try {
    // クエリパラメータから card_id を取得
    const { searchParams } = new URL(req.url);
    const card_id = searchParams.get("card_id");

    if (!card_id) {
      return NextResponse.json(
        { error: "card_id が指定されていません" },
        { status: 400 }
      );
    }

    const res = await axios.get(`http://localhost:8000/api/cardlink/${card_id}/photo`);

    return NextResponse.json(res.data);
  } catch (err: any) {
    console.error("画像取得エラー:", err.response?.data || err.message);
    return NextResponse.json(
      { error: err.response?.data?.detail || "画像取得失敗" },
      { status: err.response?.status || 500 }
    );
  }
}
