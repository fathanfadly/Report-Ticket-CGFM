import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { RowDataPacket } from 'mysql2';
import { getAuthenticatedUser } from '@/lib/authHelper';

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = await params;
        const [rows] = await pool.query<RowDataPacket[]>(
            'SELECT * FROM ticket_activities WHERE ticket_id = ? ORDER BY created_at DESC',
            [id]
        );

        return NextResponse.json(rows);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = await params;
        const { content, activity_type = 'comment', ticket_status } = await request.json();

        if (!content) {
            return NextResponse.json({ error: 'Content is required' }, { status: 400 });
        }

        const user = await getAuthenticatedUser();

        const [result]: any = await pool.query(
            'INSERT INTO ticket_activities (ticket_id, content, activity_type, ticket_status, created_by_name, created_by_code, user_role) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [id, content, activity_type, ticket_status, user.created_by_name, user.created_by_code, user.user_role]
        );

        const [newActivity] = await pool.query<RowDataPacket[]>(
            'SELECT * FROM ticket_activities WHERE id = ?',
            [result.insertId]
        );

        return NextResponse.json(newActivity[0]);
    } catch (error: any) {
        console.error('Activities POST error:', error.message);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }   
}

