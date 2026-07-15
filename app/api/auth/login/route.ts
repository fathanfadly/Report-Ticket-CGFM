import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { SignJWT } from 'jose';
import pool from '@/lib/db';
import { RowDataPacket } from 'mysql2';

// In-Memory Rate Limiter Map
// Tracks IP address -> { count: number, timestamp: number }
const rateLimitStore = new Map<string, { count: number, resetTime: number }>();

const RATE_LIMIT_MAX_ATTEMPTS = 5;
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes

const secretKey = new TextEncoder().encode(
    process.env.JWT_SECRET || 'fallback-secret-key-for-cgfm-dev'
);

export async function POST(req: Request) {
    try {
        // --- Rate Limiting Strategy (Anti-Bruteforce) ---
        // For Next.js App Router API, getting the client IP can be done via headers
        const ip = req.headers.get('x-forwarded-for') || 'unknown-ip';
        const now = Date.now();
        
        const rateLimitRecord = rateLimitStore.get(ip);
        if (rateLimitRecord) {
            if (now < rateLimitRecord.resetTime) {
                if (rateLimitRecord.count >= RATE_LIMIT_MAX_ATTEMPTS) {
                    return NextResponse.json(
                        { message: 'Too many login attempts. Please try again in 15 minutes.' },
                        { status: 429 }
                    );
                }
            } else {
                // Time window passed, reset limit naturally
                rateLimitStore.delete(ip);
            }
        }

        const body = await req.json();
        const { username, password } = body;

        if (!username || !password) {
            return NextResponse.json({ message: 'Username and password are required' }, { status: 400 });
        }

        // --- Step 1: Check Superadmin ---
        const [superAdminRows] = await pool.query<RowDataPacket[]>(
            'SELECT * FROM superadmins WHERE username = ? LIMIT 1',
            [username]
        );

        if (superAdminRows.length > 0) {
            const admin = superAdminRows[0];
            const isValidPassword = await bcrypt.compare(password, admin.password_hash);
            
            if (isValidPassword) {
                // Success: generate superadmin token
                const token = await new SignJWT({ 
                    id: admin.id, 
                    username: admin.username, 
                    role: 'superadmin' 
                })
                    .setProtectedHeader({ alg: 'HS256' })
                    .setIssuedAt()
                    .setExpirationTime('24h')
                    .sign(secretKey);

                const response = NextResponse.json({ message: 'Login successful', role: 'superadmin' });
                response.cookies.set('token', token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'lax',
                    maxAge: 60 * 60 * 24 // 1 day
                });
                
                // Clear rate limit on successful login
                rateLimitStore.delete(ip);
                return response;
            }
        }

        // --- Step 2: Check Admin (Broadcasters_Info) ---
        const [broadcasterRows] = await pool.query<RowDataPacket[]>(
            'SELECT * FROM Broadcasters_Info WHERE broadcaster_code = ? LIMIT 1',
            [username]
        );

        if (broadcasterRows.length > 0) {
            const broadcaster = broadcasterRows[0];
            let isValidPassword = false;

            // Backward compatibility for existing plaintext passwords
            if (!broadcaster.password.startsWith('$2a$') && !broadcaster.password.startsWith('$2b$')) {
                isValidPassword = (password === broadcaster.password);
            } else {
                isValidPassword = await bcrypt.compare(password, broadcaster.password);
            }

            if (isValidPassword) {
                // Success: generate admin token
                const token = await new SignJWT({ 
                    id: broadcaster.id, 
                    broadcaster_code: broadcaster.broadcaster_code,
                    role: 'admin' 
                })
                    .setProtectedHeader({ alg: 'HS256' })
                    .setIssuedAt()
                    .setExpirationTime('24h')
                    .sign(secretKey);

                const response = NextResponse.json({ message: 'Login successful', role: 'admin' });
                response.cookies.set('token', token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'lax',
                    maxAge: 60 * 60 * 24 // 1 day
                });

                rateLimitStore.delete(ip);
                return response;
            }
        }

        // --- Failed Login Handling ---
        // Increment rate limit counter
        const currentRecord = rateLimitStore.get(ip);
        if (currentRecord && now < currentRecord.resetTime) {
            currentRecord.count += 1;
            rateLimitStore.set(ip, currentRecord);
        } else {
            rateLimitStore.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
        }

        return NextResponse.json({ message: 'Invalid username or password' }, { status: 401 });

    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
