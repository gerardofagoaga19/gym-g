import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export function proxy(req: NextRequest) {

  const { pathname } = req.nextUrl;

  // =============================
  // PROTEGER APIS (LO QUE YA TENÍAS)
  // =============================
  if (pathname.startsWith("/api") && !pathname.startsWith("/api/auth")) {

    if (req.nextUrl.pathname === "/api/register-gym") {
      return NextResponse.next();
    }

    const authHeader = req.headers.get("authorization");

    if (!authHeader) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];

    try {

      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET as string
      ) as any;

      const requestHeaders = new Headers(req.headers);
      requestHeaders.set("x-user-id", decoded.userId);
      requestHeaders.set("x-gym-id", decoded.gymId);

      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });

    } catch {
      return NextResponse.json({ error: "Token inválido" }, { status: 401 });
    }
  }

  // =============================
  // PROTEGER PÁGINAS DEL SISTEMA
  // =============================

  const token = req.cookies.get("token")?.value;

  const protectedPages = [
    "/dashboard",
    "/members",
    "/payments",
    "/settings",
    "/staff"
  ];

  const isProtectedPage = protectedPages.some((path) =>
    pathname.startsWith(path)
  );

  if (isProtectedPage && !token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/api/:path*",
    "/dashboard/:path*",
    "/members/:path*",
    "/payments/:path*",
    "/settings/:path*",
    "/staff/:path*"
  ],
};