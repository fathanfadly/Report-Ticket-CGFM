import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';

const secretKey = new TextEncoder().encode(
    process.env.JWT_SECRET || 'fallback-secret-key-for-cgfm-dev'
);

export async function GET() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;

        if (!token) {
            return NextResponse.json({ authenticated: false }, { status: 401 });
        }

        const verified = await jwtVerify(token, secretKey);
        
        // For broadcasters: prefer broadcaster_name as display name, fall back to broadcaster_code
        const displayName = (verified.payload.broadcaster_name as string)
            || (verified.payload.username as string)
            || (verified.payload.broadcaster_code as string)
            || 'User';

        return NextResponse.json({ 
            authenticated: true, 
            role: verified.payload.role,
            username: displayName,
            allowed_pages: (verified.payload.allowed_pages as string[]) || null,
        });
    } catch (err) {
        return NextResponse.json({ authenticated: false }, { status: 401 });
    }
}
