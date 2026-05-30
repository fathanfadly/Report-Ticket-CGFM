import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { RowDataPacket } from 'mysql2';

export async function GET() {
    try {
        // Ambil activity terbaru dari ticket_activities, join dengan tickets untuk info judul
        const [rows] = await pool.query<RowDataPacket[]>(`
            SELECT 
                ta.id,
                ta.ticket_id,
                ta.content,
                ta.activity_type,
                ta.ticket_status,
                ta.created_at,
                ta.created_by_name,
                ta.created_by_code,
                ta.user_role,
                COALESCE(t.judul_laporan, ct.judul_laporan) AS judul_laporan,
                COALESCE(t.priority, ct.priority) AS priority,
                COALESCE(t.kode_broadcaster, ct.kode_broadcaster) AS kode_broadcaster,
                COALESCE(t.kategori_laporan, ct.kategori_laporan) AS kategori_laporan
            FROM ticket_activities ta
            LEFT JOIN tickets t ON ta.ticket_id = t.id
            LEFT JOIN completed_tickets ct ON ta.ticket_id = ct.id
            ORDER BY ta.created_at DESC
            LIMIT 50
        `);

        return NextResponse.json(rows);
    } catch (error: any) {
        console.error('Notifications GET error:', error.message);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// Mark as read — simpan di session/state saja (tidak perlu kolom DB baru)
// Cukup return 200 OK, state read/unread dikelola di frontend context
export async function PATCH(request: Request) {
    try {
        const { ids } = await request.json();
        // Tidak perlu DB update — read state dikelola di frontend
        return NextResponse.json({ success: true, marked: ids });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
