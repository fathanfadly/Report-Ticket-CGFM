import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { RowDataPacket } from 'mysql2';

export async function GET() {
    try {
        // Get total tickets
        const [totalResult] = await pool.query<RowDataPacket[]>('SELECT COUNT(*) as count FROM Tickets');
        const totalTickets = totalResult[0].count;

        // Get tickets by status
        const [statusResult] = await pool.query<RowDataPacket[]>('SELECT status, COUNT(*) as count FROM Tickets GROUP BY status');
        const statusCounts: Record<string, number> = {};
        statusResult.forEach(row => {
            statusCounts[row.status] = row.count;
        });

        // Get tickets by priority
        const [priorityResult] = await pool.query<RowDataPacket[]>('SELECT priority, COUNT(*) as count FROM Tickets GROUP BY priority');
        const priorityCounts: Record<string, number> = {};
        priorityResult.forEach(row => {
            priorityCounts[row.priority || 'P?'] = row.count;
        });

        // Get recent activity (last 5)
        const [activityResult] = await pool.query<RowDataPacket[]>(`
            SELECT ta.content, ta.created_at, ta.ticket_status, t.title as ticket_title, t.id as ticket_id
            FROM Ticket_Activities ta
            JOIN Tickets t ON ta.ticket_id = t.id
            ORDER BY ta.created_at DESC
            LIMIT 5
        `);

        // Get reporter count
        const [reporterResult] = await pool.query<RowDataPacket[]>('SELECT COUNT(*) as count FROM Reporters_Info');
        const totalReporters = reporterResult[0].count;

        // Get broadcaster count
        const [broadcasterResult] = await pool.query<RowDataPacket[]>('SELECT COUNT(*) as count FROM Broadcasters_Info');
        const totalBroadcasters = broadcasterResult[0].count;

        return NextResponse.json({
            totalTickets,
            statusCounts,
            priorityCounts,
            recentActivity: activityResult,
            totalReporters,
            totalBroadcasters,
            // Mock AI analytics data for placeholders
            performanceAnalysis: {
                efficiencyScore: 84, // Out of 100
                trend: "up",
                aiSummary: "The service performance is stable. Resolution rate has increased by 12% compared to last week. Potential bottleneck detected in 'Assessment' phase."
            }
        });
    } catch (error: any) {
        console.error("Dashboard Stats API error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
