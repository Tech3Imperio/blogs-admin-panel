import { NextRequest, NextResponse } from "next/server";
import { decrypt, refreshSession } from "./lib/session";
// import { cookies } from "next/headers";

// 1. Specify protected and public routes
const protectedRoutes = ["/dashboard"];
const publicRoutes = ["/"];

export default async function middleware(req: NextRequest) {
  // 2. Check if the current route is protected or public
  const path = req.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.includes(path);
  const isPublicRoute = publicRoutes.includes(path);

  const response = NextResponse.next();

  const origin = req.headers.get("origin");
  const allowedOrigin =
    origin && new URL(origin).hostname.endsWith("vercel.app")
      ? origin
      : "https://blogs-admin-panel-ten.vercel.app";

  response.headers.set("Access-Control-Allow-Origin", allowedOrigin);
  response.headers.set(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  response.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );
  response.headers.set("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") {
    return new NextResponse(null, { status: 204, headers: response.headers });
  }

  // Only perform auth checks for protected or public routes
  if (!isProtectedRoute && !isPublicRoute) {
    return response;
  }

  console.log("Before Cookie await");

  try {
    const cookie = req.cookies.get("session")?.value;
    if (!cookie && isProtectedRoute) {
      return NextResponse.redirect(new URL("/", req.nextUrl));
    }
    console.log("We are getting cookie", cookie);
    const session = cookie ? await decrypt(cookie) : null;
    console.log(session);
    if (isProtectedRoute && !session?.userId) {
      return NextResponse.redirect(new URL("/", req.nextUrl));
    }
    if (
      isPublicRoute &&
      session?.userId
      // && (!req.nextUrl.pathname.startsWith('/dashboard'))
    ) {
      return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
    }
    if (cookie && session) {
      const refreshedToken = await refreshSession(cookie);
      if (refreshedToken && refreshedToken !== cookie) {
        // Update the cookie with the refreshed token
        response.cookies.set({
          name: "session",
          value: refreshedToken,
          httpOnly: true,
          path: "/",
          secure: process.env.NODE_ENV === "production",
          maxAge: 60 * 60 * 24 * 7, // 1 week
          sameSite: "lax",
        });
      }
    }
    return response;
  } catch (error) {
    console.error("Session verification failed:", error);

    // If there's an error with the session on a protected route, redirect to login
    if (isProtectedRoute) {
      return NextResponse.redirect(new URL("/", req.nextUrl));
    }

    // Otherwise, just continue
    return response;
  }

  // 3. Decrypt the session from the cookie

  // 4. Redirect to /login if the user is not authenticated

  // 5. Redirect to /dashboard if the user is authenticate

  // return NextResponse.next();
}

// Routes Middleware should not run on
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
