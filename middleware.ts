import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const secretKey = new TextEncoder().encode(
    process.env.JWT_SECRET || 'fallback-secret-key-for-cgfm-dev'
);

const PUBLIC_FILE = /\.(.*)$/;

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Ignore static files, api routes (except protected ones if needed), next internals
    if (
        pathname.startsWith('/_next') ||
        pathname.startsWith('/api') ||
        pathname.startsWith('/static') ||
        PUBLIC_FILE.test(pathname)
    ) {
        // Exclude specific protected API routes if needed, but for now we let API routes handle their own auth
        return NextResponse.next();
    }

    const token = request.cookies.get('token')?.value;

    // If no token and trying to access anything other than login, redirect to login
    if (!token && pathname !== '/login') {
        const loginUrl = new URL('/login', request.url);
        return NextResponse.redirect(loginUrl);
    }

    if (token) {
        try {
            const verified = await jwtVerify(token, secretKey);
            const role = verified.payload.role as string;

            // If already logged in and trying to access /login, redirect home
            if (pathname === '/login') {
                return NextResponse.redirect(new URL('/', request.url));
            }

            // Role-Based Access Control
            if (role === 'admin') {
                // Admins (broadcasters) cannot access /broadcasters (superadmin only)
                if (pathname.startsWith('/broadcasters')) {
                    return NextResponse.redirect(new URL('/', request.url));
                }
            }

        } catch (err) {
            // Invalid token
            const loginUrl = new URL('/login', request.url);
            // Clear the invalid cookie
            const response = NextResponse.redirect(loginUrl);
            response.cookies.delete('token');
            return response;
        }
    }

    return NextResponse.next();
}

// Specify the paths where this middleware should run
export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api/auth (auth endpoints)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!api/auth|_next/static|_next/image|favicon.ico).*)',
    ],
};
