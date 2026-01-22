import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { RowDataPacket } from 'mysql2';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const query = searchParams.get('q');
        const all = searchParams.get('all') === 'true';
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const offset = (page - 1) * limit;

        let sql = 'SELECT * FROM Reporters_Info';
        let countSql = 'SELECT COUNT(*) as total FROM Reporters_Info';
        let values: any[] = [];

        if (query) {
            const whereClause = ' WHERE nama LIKE ? OR nomor_telepon LIKE ?';
            sql += whereClause;
            countSql += whereClause;
            values = [`%${query}%`, `%${query}%`];
        }

        if (all) {
            sql += ' ORDER BY nama ASC';
            const [rows] = await pool.query<RowDataPacket[]>(sql, values);
            return NextResponse.json({ data: rows });
        }

        sql += ' ORDER BY nama ASC LIMIT ? OFFSET ?';
        const finalValues = [...values, limit, offset];

        const [rows] = await pool.query<RowDataPacket[]>(sql, finalValues);
        const [countResult] = await pool.query<RowDataPacket[]>(countSql, values);
        const total = countResult[0].total;

        return NextResponse.json({
            data: rows,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        });
    } catch (error: any) {
        console.error("GET Reporters error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PATCH(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');
        const body = await request.json();
        const { name, type, phone, job, address } = body;

        if (!id) return NextResponse.json({ error: 'Missing ID' }, { status: 400 });

        const fields: string[] = [];
        const values: any[] = [];

        if (name !== undefined) { fields.push('nama = ?'); values.push(name); }
        if (type !== undefined) { fields.push('tipe_pelapor = ?'); values.push(type); }
        if (phone !== undefined) { fields.push('nomor_telepon = ?'); values.push(phone); }
        if (job !== undefined) { fields.push('pekerjaan = ?'); values.push(job); }
        if (address !== undefined) { fields.push('alamat = ?'); values.push(address); }

        if (fields.length === 0) return NextResponse.json({ error: 'No fields to update' }, { status: 400 });

        values.push(id);
        await pool.query(`UPDATE Reporters_Info SET ${fields.join(', ')} WHERE id = ?`, values);

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("PATCH Reporter error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) return NextResponse.json({ error: 'Missing ID' }, { status: 400 });

        // Note: This might fail if there are foreign key constraints in tickets.
        // We should handle that or allow deleting if tickets are deleted first.
        await pool.query('DELETE FROM Reporters_Info WHERE id = ?', [id]);

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("DELETE Reporter error:", error);
        // Better error message for foreign key constraint
        if (error.code === 'ER_ROW_IS_REFERENCED_2') {
            return NextResponse.json({ error: 'Cannot delete reporter because they are linked to tickets.' }, { status: 400 });
        }
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
