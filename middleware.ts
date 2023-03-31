// export { default } from "next-auth/middleware"
import { Role } from "@prisma/client";
import { NextResponse } from "next/server";
import { withAuth } from "next-auth/middleware";

export default withAuth(
  function middleware(req) {    
    if(req.nextauth.token) {
      if (req.nextUrl.pathname === '/login' || req.nextUrl.pathname === '/register') {
        return NextResponse.redirect(new URL('/', req.url));
      }   
  
      if (req.nextUrl.pathname.includes('/admin') && 
          req.nextauth.token?.role !== Role.ADMIN) {
            return NextResponse.redirect(new URL('/', req.url));
          }
    }
  },
  {
    callbacks: {
      authorized: (params) => {
        const allowedRoute = params.req.nextUrl.pathname === '/login' || params.req.nextUrl.pathname === '/register'
        if (allowedRoute) return true;
        
        let {token} = params;
        return !!token
      }
    }
  }
)

export const config = {
  matcher: ["/login", "/register","/nexus-auth/:path*", "/admin/:path*"]
}