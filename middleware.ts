// export { default } from "next-auth/middleware"
import { Role } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "next-auth/middleware";
import { getToken } from "next-auth/jwt";
import { getSession } from "next-auth/react";


export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  const protectedPaths = ["/write","/admin","/library","/author-dashboard", "/nexus-auth"];
  const isPathProtected = protectedPaths?.some((path) => pathname.includes(path));
  const res = NextResponse.next();
  if (isPathProtected) {
    const token = await getToken({ req });
    if (!token) {
      const url = new URL(`/login`, req.url);
      url.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(url);
    }
  } 
  // Not protected rout
  else {
      const unprotectedRoutes = ["/login", "/register"];
      const isPathUnprotected = unprotectedRoutes?.some((path) => pathname == path);      
      const token = await getToken({ req });
      if (isPathUnprotected && token) {
        const url = new URL(`/`, req.url);
        return NextResponse.redirect(url);  
      }
  }

  return res;
}

// export default withAuth(function middleware(req) {
//   // Redirect if they don't have the appropriate role
  
//   console.log('Teste -> ', req, req.nextUrl.pathname, req.nextUrl.pathname.startsWith("/login"), req.nextauth)
//   if(
//     req.nextUrl.pathname.startsWith("/login") &&
//     req.nextauth.token 
//   ) {
//     return NextResponse.redirect(new URL("/", req.url));
//   }
  
  
//   if (
//     req.nextUrl.pathname.startsWith("/admin") &&
//     req.nextauth.token?.role !== Role.ADMIN
//   ) {
//     return NextResponse.redirect(new URL("/", req.url));
//   }
// });


// export const config = {
//   matcher: ["/write", "/admin/:path*"]
//   // matcher: ["/"]
// }