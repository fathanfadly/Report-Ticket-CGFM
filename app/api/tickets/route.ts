import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { RowDataPacket } from 'mysql2';

export async function GET() {
    try {
        const query = `
            SELECT t.*, r.tipe_pelapor, r.nama as nama_pelapor, r.nomor_telepon, r.pekerjaan, r.alamat
            FROM tickets t
            LEFT JOIN Reporters_Info r ON t.reporter_id = r.id
            ORDER BY t.created_at DESC
        `;
        const [ongoingRows] = await pool.query<RowDataPacket[]>(query);

        let completedRows: RowDataPacket[] = [];
        try {
            const completedQuery = `
                SELECT t.*, r.tipe_pelapor, r.nama as nama_pelapor, r.nomor_telepon, r.pekerjaan, r.alamat
                FROM completed_tickets t
                LEFT JOIN Reporters_Info r ON t.reporter_id = r.id
                ORDER BY t.created_at DESC
            `;
            const [rows] = await pool.query<RowDataPacket[]>(completedQuery);
            completedRows = rows;
        } catch (e) {
            console.log("completed_tickets table might not exist yet or structure mismatch");
        }

        const combined = [...ongoingRows, ...completedRows];

        // Parse tags from JSON string and normalize title
        const tickets = combined.map(row => ({
            ...row,
            title: row.judul_laporan || row.title, // Support both during transition if needed
            tags: typeof row.tags === 'string' ? JSON.parse(row.tags) : row.tags
        }));

        return NextResponse.json(tickets);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const {
            id, judul_laporan, priority, status, date_range, iso_date, likes, image_url, tags, description,
            tipe_pelapor, nama_pelapor, nomor_telepon, pekerjaan, alamat,
            kode_broadcaster, sumber_laporan, kategori_laporan
        } = body;

        // 1. Handle Reporter Info
        let reporter_id_to_use = body.reporter_id;

        if (!reporter_id_to_use) {
            const [reporterResult]: any = await pool.query(
                'INSERT INTO Reporters_Info (tipe_pelapor, nama, nomor_telepon, pekerjaan, alamat) VALUES (?, ?, ?, ?, ?)',
                [tipe_pelapor, nama_pelapor, nomor_telepon, pekerjaan, alamat]
            );
            reporter_id_to_use = reporterResult.insertId;
        }

        // 2. Insert Ticket with reporter_id
        await pool.query(
            'INSERT INTO tickets (id, judul_laporan, priority, status, date_range, iso_date, likes, image_url, tags, description, reporter_id, kode_broadcaster, sumber_laporan, kategori_laporan) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [id, judul_laporan, priority, status, date_range, iso_date, likes || 0, image_url, JSON.stringify(tags || []), description || null, reporter_id_to_use, kode_broadcaster, sumber_laporan, kategori_laporan]
        );

        return NextResponse.json({ success: true, id });
    } catch (error: any) {
        console.error("POST error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PATCH(request: Request) {
    try {
        const body = await request.json();
        const {
            id, status, solution, judul_laporan, title, priority, image_url, tags, description,
            tipe_pelapor, nama_pelapor, nomor_telepon, pekerjaan, alamat,
            kode_broadcaster, sumber_laporan, kategori_laporan
        } = body;

        if (!id) {
            return NextResponse.json({ error: 'Missing ID' }, { status: 400 });
        }

        // Helper to find existing ticket and its reporter_id
        const [rows] = await pool.query<RowDataPacket[]>('SELECT reporter_id FROM tickets WHERE id = ? UNION SELECT reporter_id FROM completed_tickets WHERE id = ?', [id, id]);
        const reporter_id = rows.length > 0 ? rows[0].reporter_id : null;

        // 1. Update Reporter Info if reporter_id exists and data provided
        if (reporter_id && (tipe_pelapor || nama_pelapor || nomor_telepon || pekerjaan || alamat)) {
            const repFields: string[] = [];
            const repValues: any[] = [];
            if (tipe_pelapor !== undefined) { repFields.push('tipe_pelapor = ?'); repValues.push(tipe_pelapor); }
            if (nama_pelapor !== undefined) { repFields.push('nama = ?'); repValues.push(nama_pelapor); }
            if (nomor_telepon !== undefined) { repFields.push('nomor_telepon = ?'); repValues.push(nomor_telepon); }
            if (pekerjaan !== undefined) { repFields.push('pekerjaan = ?'); repValues.push(pekerjaan); }
            if (alamat !== undefined) { repFields.push('alamat = ?'); repValues.push(alamat); }

            if (repFields.length > 0) {
                repValues.push(reporter_id);
                await pool.query(`UPDATE Reporters_Info SET ${repFields.join(', ')} WHERE id = ?`, repValues);
            }
        }

        // 2. Move logic (Migration to terminal state)
        if (status === 'completed' || status === 'blocked') {
            const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM tickets WHERE id = ?', [id]);
            if (rows.length > 0) {
                const t = rows[0];
                await pool.query(
                    'INSERT INTO completed_tickets (id, judul_laporan, priority, status, date_range, iso_date, likes, image_url, tags, solution, description, reporter_id, kode_broadcaster, sumber_laporan, kategori_laporan) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
                    [
                        t.id,
                        judul_laporan !== undefined ? judul_laporan : (title !== undefined ? title : t.judul_laporan),
                        priority !== undefined ? priority : t.priority,
                        status,
                        t.date_range,
                        t.iso_date,
                        t.likes,
                        image_url !== undefined ? image_url : t.image_url,
                        tags !== undefined ? JSON.stringify(tags) : (typeof t.tags === 'string' ? t.tags : JSON.stringify(t.tags)),
                        solution !== undefined ? solution : null,
                        description !== undefined ? description : t.description,
                        t.reporter_id,
                        kode_broadcaster !== undefined ? kode_broadcaster : t.kode_broadcaster,
                        sumber_laporan !== undefined ? sumber_laporan : t.sumber_laporan,
                        kategori_laporan !== undefined ? kategori_laporan : t.kategori_laporan
                    ]
                );
                await pool.query('DELETE FROM tickets WHERE id = ?', [id]);
                return NextResponse.json({ success: true });
            }
        }

        // 3. Generic UPDATE logic
        const updateFields: string[] = [];
        const updateValues: any[] = [];

        if (judul_laporan !== undefined) { updateFields.push('judul_laporan = ?'); updateValues.push(judul_laporan); }
        else if (title !== undefined) { updateFields.push('judul_laporan = ?'); updateValues.push(title); }

        if (priority !== undefined) { updateFields.push('priority = ?'); updateValues.push(priority); }
        if (status !== undefined) { updateFields.push('status = ?'); updateValues.push(status); }
        if (image_url !== undefined) { updateFields.push('image_url = ?'); updateValues.push(image_url); }
        if (tags !== undefined) { updateFields.push('tags = ?'); updateValues.push(JSON.stringify(tags)); }
        if (solution !== undefined) { updateFields.push('solution = ?'); updateValues.push(solution); }
        if (description !== undefined) { updateFields.push('description = ?'); updateValues.push(description); }
        if (kode_broadcaster !== undefined) { updateFields.push('kode_broadcaster = ?'); updateValues.push(kode_broadcaster); }
        if (sumber_laporan !== undefined) { updateFields.push('sumber_laporan = ?'); updateValues.push(sumber_laporan); }
        if (kategori_laporan !== undefined) { updateFields.push('kategori_laporan = ?'); updateValues.push(kategori_laporan); }

        if (updateFields.length > 0) {
            updateValues.push(id);
            const setClause = updateFields.join(', ');

            // Check ongoing first
            const [ongoing] = await pool.query<RowDataPacket[]>('SELECT id FROM tickets WHERE id = ?', [id]);
            if (ongoing.length > 0) {
                await pool.query(`UPDATE tickets SET ${setClause} WHERE id = ?`, updateValues);
            } else {
                await pool.query(`UPDATE completed_tickets SET ${setClause} WHERE id = ?`, updateValues);
            }
        }

        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');
        const status = searchParams.get('status');

        if (!id && !status) {
            return NextResponse.json({ error: 'Missing ID or Status' }, { status: 400 });
        }

        if (status) {
            if (status === 'completed' || status === 'blocked') {
                await pool.query('DELETE FROM completed_tickets WHERE status = ?', [status]);
            } else {
                await pool.query('DELETE FROM tickets WHERE status = ?', [status]);
            }
        } else if (id) {
            // Try deleting from both
            await pool.query('DELETE FROM tickets WHERE id = ?', [id]);
            await pool.query('DELETE FROM completed_tickets WHERE id = ?', [id]);
        }

        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
