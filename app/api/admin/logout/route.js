import { NextResponse } from "next/server";

export function POST() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set("admin", "", { path: "/", maxAge: 0 });
  return res;
}
