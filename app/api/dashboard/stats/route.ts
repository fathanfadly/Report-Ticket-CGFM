export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { RowDataPacket } from 'mysql2';

export async function GET() {
    try {
        // Helper function to safely query table if it exists
        const queryTable = async (queryStr: string) => {
            try {
                const [result] = await pool.query<RowDataPacket[]>(queryStr);
                return result;
            } catch (e) {
                return [];
            }
        };

        // Get total tickets from both tables
        const [totalResult1] = await pool.query<RowDataPacket[]>('SELECT COUNT(*) as count FROM tickets');
        const totalTickets1 = totalResult1[0].count;
        let totalTickets2 = 0;
        try {
            const [totalResult2] = await pool.query<RowDataPacket[]>('SELECT COUNT(*) as count FROM completed_tickets');
            totalTickets2 = totalResult2[0].count;
        } catch (e) {
            // completed_tickets might not exist
        }
        const totalTickets = totalTickets1 + totalTickets2;

        // Get tickets by status
        const statusCounts: Record<string, number> = {};
        const statusResult1 = await queryTable('SELECT status, COUNT(*) as count FROM tickets GROUP BY status');
        statusResult1.forEach(row => { statusCounts[row.status] = row.count; });
        const statusResult2 = await queryTable('SELECT status, COUNT(*) as count FROM completed_tickets GROUP BY status');
        statusResult2.forEach(row => { statusCounts[row.status] = (statusCounts[row.status] || 0) + row.count; });

        // Get tickets by priority
        const priorityCounts: Record<string, number> = {};
        const priorityResult1 = await queryTable('SELECT priority, COUNT(*) as count FROM tickets GROUP BY priority');
        priorityResult1.forEach(row => { priorityCounts[row.priority || 'P?'] = row.count; });
        const priorityResult2 = await queryTable('SELECT priority, COUNT(*) as count FROM completed_tickets GROUP BY priority');
        priorityResult2.forEach(row => { priorityCounts[row.priority || 'P?'] = (priorityCounts[row.priority || 'P?'] || 0) + row.count; });

        // Get recent activity (last 5)
        const [activityResult] = await pool.query<RowDataPacket[]>(`
            SELECT ta.content, ta.created_at, ta.ticket_status, 
                   COALESCE(t1.judul_laporan, t2.judul_laporan) as ticket_title, 
                   ta.ticket_id
            FROM Ticket_Activities ta
            LEFT JOIN tickets t1 ON ta.ticket_id = t1.id
            LEFT JOIN completed_tickets t2 ON ta.ticket_id = t2.id
            ORDER BY ta.created_at DESC
            LIMIT 5
        `);

        // Get reporter count from Broadcasters_Info as requested
        const [broadcasterResult] = await pool.query<RowDataPacket[]>('SELECT COUNT(*) as count FROM Broadcasters_Info');
        const totalBroadcasters = broadcasterResult[0].count;
        
        // Use broadcasters count for active reporters
        const totalReporters = totalBroadcasters;

        // Calculate actual resolution rate
        const resolvedTicketsCount = statusCounts['completed'] || 0;
        const efficiencyScore = totalTickets > 0 ? Math.round((resolvedTicketsCount / totalTickets) * 100) : 0;

        return NextResponse.json({
            totalTickets,
            statusCounts,
            priorityCounts,
            recentActivity: activityResult,
            totalReporters,
            totalBroadcasters,
            // Mock AI analytics data for placeholders
            performanceAnalysis: {
                efficiencyScore: efficiencyScore,
                trend: "up",
                aiSummary: "The service performance is stable. Resolution rate has increased by 12% compared to last week. Potential bottleneck detected in 'Assessment' phase."
            }
        });
    } catch (error: any) {
        console.error("Dashboard Stats API error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
