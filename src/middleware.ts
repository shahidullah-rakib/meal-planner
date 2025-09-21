import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
    const protectedRoutes = ["/control-panel", "/dashboard"];

    if (protectedRoutes.some((path) => req.nextUrl.pathname.startsWith(path))) {
        // Check the NextAuth token
        const token = await getToken({
            req,
            secret: process.env.NEXTAUTH_SECRET,
        });

        if (!token) {
            // Not logged in, redirect to login
            return NextResponse.redirect(new URL("/login", req.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/control-panel/:path*", "/dashboard/:path*"],
};
