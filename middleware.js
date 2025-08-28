import { NextResponse } from "next/server";

export function middleware(req) {
  const { pathname } = req.nextUrl;

  // only guard /admin routes
  if (!pathname.startsWith("/admin")) return NextResponse.next();

  // allow the login page itself
  if (pathname === "/admin/login") return NextResponse.next();

  // check cookie
  const cookie = req.cookies.get("admin")?.value;
  if (cookie === "ok") return NextResponse.next();

  // not logged in → redirect to /admin/login?next=/admin/whatever
  const url = req.nextUrl.clone();
  url.pathname = "/admin/login";
  url.searchParams.set("next", pathname);
  return NextResponse.redirect(url);
}

// enable only for /admin paths
export const config = {
  matcher: ["/admin/:path*"],
};
