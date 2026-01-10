import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { RowDataPacket } from 'mysql2';

export async function GET() {
    try {
        const [ongoingRows] = await pool.query<RowDataPacket[]>('SELECT * FROM tickets ORDER BY created_at DESC');
        let completedRows: RowDataPacket[] = [];

        try {
            const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM completed_tickets ORDER BY created_at DESC');
            completedRows = rows;
        } catch (e) {
            console.log("completed_tickets table might not exist yet");
        }

        const combined = [...ongoingRows, ...completedRows];

        // Parse tags from JSON string
        const tickets = combined.map(row => ({
            ...row,
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
        const { id, title, priority, status, date_range, iso_date, likes, image_url, tags, description } = body;

        const [result] = await pool.query(
            'INSERT INTO tickets (id, title, priority, status, date_range, iso_date, likes, image_url, tags, description) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [id, title, priority, status, date_range, iso_date, likes || 0, image_url, JSON.stringify(tags || []), description || null]
        );

        return NextResponse.json({ success: true, id });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PATCH(request: Request) {
    try {
        const body = await request.json();
        const { id, status, solution, title, priority, image_url, tags, description } = body;

        if (!id) {
            return NextResponse.json({ error: 'Missing ID' }, { status: 400 });
        }

        // 1. Move logic (Migration to terminal state)
        if (status === 'completed' || status === 'blocked') {
            const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM tickets WHERE id = ?', [id]);
            if (rows.length > 0) {
                const t = rows[0];
                await pool.query(
                    'INSERT INTO completed_tickets (id, title, priority, status, date_range, iso_date, likes, image_url, tags, solution, description) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
                    [
                        t.id,
                        title !== undefined ? title : t.title,
                        priority !== undefined ? priority : t.priority,
                        status,
                        t.date_range,
                        t.iso_date,
                        t.likes,
                        image_url !== undefined ? image_url : t.image_url,
                        tags !== undefined ? JSON.stringify(tags) : (typeof t.tags === 'string' ? t.tags : JSON.stringify(t.tags)),
                        solution !== undefined ? solution : null,
                        description !== undefined ? description : t.description
                    ]
                );
                await pool.query('DELETE FROM tickets WHERE id = ?', [id]);
                return NextResponse.json({ success: true });
            }
        }

        // 2. Generic UPDATE logic
        const updateFields: string[] = [];
        const updateValues: any[] = [];

        if (title !== undefined) { updateFields.push('title = ?'); updateValues.push(title); }
        if (priority !== undefined) { updateFields.push('priority = ?'); updateValues.push(priority); }
        if (status !== undefined) { updateFields.push('status = ?'); updateValues.push(status); }
        if (image_url !== undefined) { updateFields.push('image_url = ?'); updateValues.push(image_url); }
        if (tags !== undefined) { updateFields.push('tags = ?'); updateValues.push(JSON.stringify(tags)); }
        if (solution !== undefined) { updateFields.push('solution = ?'); updateValues.push(solution); }
        if (description !== undefined) { updateFields.push('description = ?'); updateValues.push(description); }

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
