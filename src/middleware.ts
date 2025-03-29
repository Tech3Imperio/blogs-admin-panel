// import { NextRequest, NextResponse } from "next/server";
// import { decrypt } from "./lib/session";
// import { cookies } from "next/headers";

// // 1. Specify protected and public routes
// const protectedRoutes = ["/dashboard"];
// const publicRoutes = ["/"];

// export default async function middleware(req: NextRequest) {
//   // 2. Check if the current route is protected or public
//   const path = req.nextUrl.pathname;
//   const isProtectedRoute = protectedRoutes.includes(path);
//   const isPublicRoute = publicRoutes.includes(path);

//   console.log("Before Cookie await");

//   // 3. Decrypt the session from the cookie
//   const cookie = (await cookies()).get("session")?.value;
//   console.log("We are getting cookie", cookie);
//   const session = await decrypt(cookie);

//   // 4. Redirect to /login if the user is not authenticated
//   if (isProtectedRoute && !session?.userId) {
//     return NextResponse.redirect(new URL("/", req.nextUrl));
//   }

//   // 5. Redirect to /dashboard if the user is authenticated
//   if (
//     isPublicRoute &&
//     session?.userId
//     // && (!req.nextUrl.pathname.startsWith('/dashboard'))
//   ) {
//     return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
//   }

//   return NextResponse.next();
// }

// // Routes Middleware should not run on
// export const config = {
//   matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
// };

import { NextRequest, NextResponse } from "next/server";
import { decrypt } from "./lib/session";
import { cookies } from "next/headers";

// 1. Define protected and public routes
const protectedRoutes = ["/dashboard"];
const publicRoutes = ["/"];

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.includes(path);
  const isPublicRoute = publicRoutes.includes(path);

  console.log("Before Cookie await");

  // 2. Read and decrypt the session cookie
  const cookie = (await cookies()).get("session")?.value;
  console.log("We are getting cookie", cookie);
  const session = await decrypt(cookie);

  // 3. Handle authentication redirects
  if (isProtectedRoute && !session?.userId) {
    return NextResponse.redirect(new URL("/", req.nextUrl));
  }

  if (isPublicRoute && session?.userId) {
    return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
  }

  // 4. Handle CORS properly
  const res = NextResponse.next();
  const allowedOrigin = "https://blogs-admin-panel-ten.vercel.app"; // Your frontend domain

  res.headers.set("Access-Control-Allow-Origin", allowedOrigin);
  res.headers.set(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  res.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );
  res.headers.set("Access-Control-Allow-Credentials", "true"); // Allow cookies and sessions

  // 5. Properly handle preflight requests (OPTIONS)
  if (req.method === "OPTIONS") {
    return new NextResponse(null, { status: 204, headers: res.headers });
  }

  return res;
}

// Routes Middleware should not run on
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
