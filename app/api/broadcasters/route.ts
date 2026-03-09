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

        let sql = 'SELECT * FROM Broadcasters_Info';
        let countSql = 'SELECT COUNT(*) as total FROM Broadcasters_Info';
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
        console.error("GET Broadcasters error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const {
            nama, tipe_pelapor, no_hp, alamat, pekerjaan,
            jabatan, pendidikan, usia, jenis_kelamin, hobi,
            pilihan_jenis_lagu, alat_transportasi, range_harga_gadget,
            radio_sering_diputar, acara_radio_favorit, objek_wisata_favorit,
            tv_sering_ditonton, acara_tv_favorit
        } = body;

        const [result]: any = await pool.query(
            `INSERT INTO Broadcasters_Info (
                nama, tipe_pelapor, no_hp, alamat, pekerjaan,
                jabatan, pendidikan, usia, jenis_kelamin, hobi,
                pilihan_jenis_lagu, alat_transportasi, range_harga_gadget,
                radio_sering_diputar, acara_radio_favorit, objek_wisata_favorit,
                tv_sering_ditonton, acara_tv_favorit
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                nama, tipe_pelapor, no_hp, alamat, pekerjaan,
                jabatan, pendidikan, usia, jenis_kelamin, hobi,
                pilihan_jenis_lagu, alat_transportasi, range_harga_gadget,
                radio_sering_diputar, acara_radio_favorit, objek_wisata_favorit,
                tv_sering_ditonton, acara_tv_favorit
            ]
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
        const {
            name, type, phone, job, address,
            jabatan, pendidikan, usia, jenis_kelamin, hobi,
            pilihan_jenis_lagu, alat_transportasi, range_harga_gadget,
            radio_sering_diputar, acara_radio_favorit, objek_wisata_favorit,
            tv_sering_ditonton, acara_tv_favorit,
            nama: bodyNama, tipe_pelapor: bodyType, no_hp: bodyPhone, pekerjaan: bodyJob, alamat: bodyAddress
        } = body;

        if (!id) return NextResponse.json({ error: 'Missing ID' }, { status: 400 });

        const fields: string[] = [];
        const values: any[] = [];

        // Support both field names for flexibility
        const finalNama = name !== undefined ? name : bodyNama;
        const finalType = type !== undefined ? type : bodyType;
        const finalPhone = phone !== undefined ? phone : bodyPhone;
        const finalJob = job !== undefined ? job : bodyJob;
        const finalAddress = address !== undefined ? address : bodyAddress;

        if (finalNama !== undefined) { fields.push('nama = ?'); values.push(finalNama); }
        if (finalType !== undefined) { fields.push('tipe_pelapor = ?'); values.push(finalType); }
        if (finalPhone !== undefined) { fields.push('no_hp = ?'); values.push(finalPhone); }
        if (finalJob !== undefined) { fields.push('pekerjaan = ?'); values.push(finalJob); }
        if (finalAddress !== undefined) { fields.push('alamat = ?'); values.push(finalAddress); }

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
