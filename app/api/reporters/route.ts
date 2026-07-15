export const dynamic = 'force-dynamic';
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

        let sql = 'SELECT * FROM reporters_info';
        let countSql = 'SELECT COUNT(*) as total FROM reporters_info';
        let values: any[] = [];

        if (query) {
            const whereClause = ' WHERE nama LIKE ? OR no_hp LIKE ?';
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
        const {
            name, type, phone, job, address,
            jabatan, pendidikan, usia, jenis_kelamin, hobi,
            pilihan_jenis_lagu, alat_transportasi, range_harga_gadget,
            radio_sering_diputar, acara_radio_favorit, objek_wisata_favorit,
            tv_sering_ditonton, acara_tv_favorit
        } = body;

        if (!id) return NextResponse.json({ error: 'Missing ID' }, { status: 400 });

        const fields: string[] = [];
        const values: any[] = [];

        if (name !== undefined) { fields.push('nama = ?'); values.push(name); }
        if (type !== undefined) { fields.push('tipe_pelapor = ?'); values.push(type); }
        if (phone !== undefined) { fields.push('no_hp = ?'); values.push(phone); }
        if (job !== undefined) { fields.push('pekerjaan = ?'); values.push(job); }
        if (address !== undefined) { fields.push('alamat = ?'); values.push(address); }
        if (jabatan !== undefined) { fields.push('jabatan = ?'); values.push(jabatan); }
        if (pendidikan !== undefined) { fields.push('pendidikan = ?'); values.push(pendidikan); }
        if (usia !== undefined) { fields.push('usia = ?'); values.push(usia); }
        if (jenis_kelamin !== undefined) { fields.push('jenis_kelamin = ?'); values.push(jenis_kelamin); }
        if (hobi !== undefined) { fields.push('hobi = ?'); values.push(hobi); }
        if (pilihan_jenis_lagu !== undefined) { fields.push('pilihan_jenis_lagu = ?'); values.push(pilihan_jenis_lagu); }
        if (alat_transportasi !== undefined) { fields.push('alat_transportasi = ?'); values.push(alat_transportasi); }
        if (range_harga_gadget !== undefined) { fields.push('range_harga_gadget = ?'); values.push(range_harga_gadget); }
        if (radio_sering_diputar !== undefined) { fields.push('radio_sering_diputar = ?'); values.push(radio_sering_diputar); }
        if (acara_radio_favorit !== undefined) { fields.push('acara_radio_favorit = ?'); values.push(acara_radio_favorit); }
        if (objek_wisata_favorit !== undefined) { fields.push('objek_wisata_favorit = ?'); values.push(objek_wisata_favorit); }
        if (tv_sering_ditonton !== undefined) { fields.push('tv_sering_ditonton = ?'); values.push(tv_sering_ditonton); }
        if (acara_tv_favorit !== undefined) { fields.push('acara_tv_favorit = ?'); values.push(acara_tv_favorit); }

        if (fields.length === 0) return NextResponse.json({ error: 'No fields to update' }, { status: 400 });

        values.push(id);
        await pool.query(`UPDATE reporters_info SET ${fields.join(', ')} WHERE id = ?`, values);

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
        await pool.query('DELETE FROM reporters_info WHERE id = ?', [id]);

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
