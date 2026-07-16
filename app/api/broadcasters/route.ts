import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { RowDataPacket } from 'mysql2';
import bcrypt from 'bcryptjs';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const query = searchParams.get('q');
        const all = searchParams.get('all') === 'true';
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const offset = (page - 1) * limit;

        let sql = 'SELECT id, broadcaster_code, broadcaster_name, allowed_pages, created_at, updated_at FROM Broadcasters_Info';
        let countSql = 'SELECT COUNT(*) as total FROM Broadcasters_Info';
        let values: any[] = [];

        if (query) {
            const whereClause = ' WHERE broadcaster_code LIKE ? OR broadcaster_name LIKE ?';
            sql += whereClause;
            countSql += whereClause;
            values = [`%${query}%`, `%${query}%`];
        }

        if (all) {
            sql += ' ORDER BY broadcaster_name ASC';
            const [rows] = await pool.query<RowDataPacket[]>(sql, values);
            // Parse JSON field
            const parsed = rows.map((r) => ({
                ...r,
                allowed_pages: r.allowed_pages
                    ? (typeof r.allowed_pages === 'string' ? JSON.parse(r.allowed_pages) : r.allowed_pages)
                    : [],
            }));
            return NextResponse.json({ data: parsed });
        }

        sql += ' ORDER BY broadcaster_name ASC LIMIT ? OFFSET ?';
        const finalValues = [...values, limit, offset];

        const [rows] = await pool.query<RowDataPacket[]>(sql, finalValues);
        const [countResult] = await pool.query<RowDataPacket[]>(countSql, values);
        const total = countResult[0].total;

        const parsed = rows.map((r) => ({
            ...r,
            allowed_pages: r.allowed_pages
                ? (typeof r.allowed_pages === 'string' ? JSON.parse(r.allowed_pages) : r.allowed_pages)
                : [],
        }));

        return NextResponse.json({
            data: parsed,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        });
    } catch (error: any) {
        console.error("GET Broadcasters error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { broadcaster_code, broadcaster_name, password, allowed_pages } = body;

        if (!broadcaster_code || !broadcaster_name || !password) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const allowedPagesJson = JSON.stringify(allowed_pages || []);

        const [result]: any = await pool.query(
            `INSERT INTO Broadcasters_Info (broadcaster_code, broadcaster_name, password, allowed_pages) VALUES (?, ?, ?, ?)`,
            [broadcaster_code, broadcaster_name, hashedPassword, allowedPagesJson]
        );

        return NextResponse.json({ success: true, id: result.insertId });
    } catch (error: any) {
        console.error("POST Broadcaster error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PATCH(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');
        const body = await request.json();
        const { broadcaster_code, broadcaster_name, password, allowed_pages } = body;

        if (!id) return NextResponse.json({ error: 'Missing ID' }, { status: 400 });

        const fields: string[] = [];
        const values: any[] = [];

        if (broadcaster_code !== undefined) { fields.push('broadcaster_code = ?'); values.push(broadcaster_code); }
        if (broadcaster_name !== undefined) { fields.push('broadcaster_name = ?'); values.push(broadcaster_name); }
        if (password !== undefined && password !== '') {
            const hashedPassword = await bcrypt.hash(password, 10);
            fields.push('password = ?');
            values.push(hashedPassword);
        }
        if (allowed_pages !== undefined) {
            fields.push('allowed_pages = ?');
            values.push(JSON.stringify(allowed_pages));
        }

        if (fields.length === 0) return NextResponse.json({ error: 'No fields to update' }, { status: 400 });

        values.push(id);
        await pool.query(`UPDATE Broadcasters_Info SET ${fields.join(', ')} WHERE id = ?`, values);

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("PATCH Broadcaster error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) return NextResponse.json({ error: 'Missing ID' }, { status: 400 });

        await pool.query('DELETE FROM Broadcasters_Info WHERE id = ?', [id]);

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("DELETE Broadcaster error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
