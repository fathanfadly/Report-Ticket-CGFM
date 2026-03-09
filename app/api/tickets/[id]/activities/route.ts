import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { RowDataPacket } from 'mysql2';

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = await params;
        const [rows] = await pool.query<RowDataPacket[]>(
            'SELECT * FROM Ticket_Activities WHERE ticket_id = ? ORDER BY created_at DESC',
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

        const [result]: any = await pool.query(
            'INSERT INTO Ticket_Activities (ticket_id, content, activity_type, ticket_status) VALUES (?, ?, ?, ?)',
            [id, content, activity_type, ticket_status]
        );

        const [newActivity] = await pool.query<RowDataPacket[]>(
            'SELECT * FROM Ticket_Activities WHERE id = ?',
            [result.insertId]
        );

        return NextResponse.json(newActivity[0]);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
