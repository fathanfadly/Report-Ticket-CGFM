import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import pool from './db';

const jwtSecretEnv = process.env.JWT_SECRET;
if (process.env.NODE_ENV === 'production' && !jwtSecretEnv) {
    console.error("CRITICAL: JWT_SECRET is not set in production. This is a severe security vulnerability.");
    // In a strict environment, you might want to throw an error here to prevent the app from starting:
    // throw new Error("JWT_SECRET is required in production");
}

const secretKey = new TextEncoder().encode(
    jwtSecretEnv || 'fallback-secret-key-for-cgfm-dev'
);

export interface AuthenticatedUser {
    created_by_name: string;
    created_by_code: string;
    user_role: 'superadmin' | 'broadcaster' | 'system';
}

export async function getAuthenticatedUser(): Promise<AuthenticatedUser> {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;
        if (!token) {
            return {
                created_by_name: 'System',
                created_by_code: 'system',
                user_role: 'system'
            };
        }

        const verified = await jwtVerify(token, secretKey);
        const payload = verified.payload;

        let created_by_name = 'Superadmin';
        let created_by_code = 'admin';
        let user_role: 'superadmin' | 'broadcaster' | 'system' = 'superadmin';

        if (payload.role === 'admin') {
            user_role = 'broadcaster';
            created_by_code = (payload.broadcaster_code as string) || 'BC001';
            
            // Lookup broadcaster name from database
            try {
                const [bRows]: any = await pool.query(
                    'SELECT broadcaster_name FROM broadcasters_info WHERE broadcaster_code = ? LIMIT 1',
                    [created_by_code]
                );
                if (bRows && bRows.length > 0) {
                    created_by_name = bRows[0].broadcaster_name;
                } else {
                    created_by_name = `Broadcaster ${created_by_code}`;
                }
            } catch (e) {
                created_by_name = `Broadcaster ${created_by_code}`;
            }
        } else if (payload.username) {
            created_by_code = payload.username as string;
            created_by_name = 'Superadmin';
            user_role = 'superadmin';
        }

        return { created_by_name, created_by_code, user_role };
    } catch (err) {
        return {
            created_by_name: 'System',
            created_by_code: 'system',
            user_role: 'system'
        };
    }
}
