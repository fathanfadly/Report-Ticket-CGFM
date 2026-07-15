import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const secretKey = new TextEncoder().encode(
    process.env.JWT_SECRET || 'fallback-secret-key-for-cgfm-dev'
);

const PUBLIC_FILE = /\.(.*)$/;

export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Ignore static files, next internals
    if (
        pathname.startsWith('/_next') ||
        pathname.startsWith('/static') ||
        PUBLIC_FILE.test(pathname)
    ) {
        return NextResponse.next();
    }

    const isApiRoute = pathname.startsWith('/api');
    const token = request.cookies.get('token')?.value;

    // 1. Unauthenticated users handling
    if (!token && pathname !== '/login') {
        if (isApiRoute) {
            // Unauthenticated API request
            return new NextResponse(
                JSON.stringify({ error: 'Unauthorized. Token missing or invalid.' }),
                { status: 401, headers: { 'content-type': 'application/json' } }
            );
        } else {
            // Unauthenticated Page request
            const loginUrl = new URL('/login', request.url);
            return NextResponse.redirect(loginUrl);
        }
    }

    // 2. Authenticated users handling
    if (token) {
        try {
            const verified = await jwtVerify(token, secretKey);
            const role = verified.payload.role as string;

            // If already logged in and trying to access /login, redirect home
            if (pathname === '/login') {
                return NextResponse.redirect(new URL('/', request.url));
            }

            // Role-Based Access Control (RBAC)
            if (role === 'admin') {
                // Admins (broadcasters) cannot access /broadcasters page
                if (pathname.startsWith('/broadcasters')) {
                    return NextResponse.redirect(new URL('/', request.url));
                }
                
                // Admins (broadcasters) cannot access /api/broadcasters (except maybe GET, but for now we block all)
                if (pathname.startsWith('/api/broadcasters')) {
                    return new NextResponse(
                        JSON.stringify({ error: 'Forbidden. Superadmin access required.' }),
                        { status: 403, headers: { 'content-type': 'application/json' } }
                    );
                }
            }

        } catch (err) {
            // Invalid token
            const response = isApiRoute 
                ? new NextResponse(JSON.stringify({ error: 'Unauthorized. Token invalid or expired.' }), { status: 401, headers: { 'content-type': 'application/json' } })
                : NextResponse.redirect(new URL('/login', request.url));
            
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
         * - api/auth/login (public auth endpoint)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!api/auth/login|_next/static|_next/image|favicon.ico).*)',
    ],
};
