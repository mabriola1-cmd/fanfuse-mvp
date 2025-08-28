import { NextResponse } from "next/server";

export async function POST(req) {
  const { password } = await req.json().catch(() => ({}));
  if (!password) {
    return NextResponse.json({ error: "Missing password" }, { status: 400 });
  }
  if (password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Invalid password" }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  // httpOnly cookie for admin session
  res.cookies.set("admin", "ok", {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    secure: true,
    maxAge: 60 * 60 * 8, // 8 hours
  });
  return res;
}
