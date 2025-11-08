import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: Request) {
  try {
    // 🍪 Cookieからアクセストークンを取得
    const cookieHeader = req.headers.get("cookie") || "";
    const accessTokenMatch = cookieHeader.match(/access_token=([^;]+)/);
    const token = accessTokenMatch ? accessTokenMatch[1] : null;

    if (!token) {
      return NextResponse.json(
        { error: "アクセストークンが見つかりません" },
        { status: 401 }
      );
    }

    // 🟢 FastAPI側の /logout にリクエスト送信
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
    await axios.post(
      `${apiUrl}/api/auth/logout`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      }
    );

    // 🧹 Cookie削除（Next.js側でも念のため）
    const res = NextResponse.json({ message: "ログアウトしました" });
    res.cookies.set("access_token", "", { maxAge: 0, path: "/" });
    res.cookies.set("refresh_token", "", { maxAge: 0, path: "/" });

    return res;
  } catch (err: any) {
    console.error("Logout failed:", err.response?.data || err.message);
    return NextResponse.json(
      { error: "ログアウトに失敗しました" },
      { status: 500 }
    );
  }
}
