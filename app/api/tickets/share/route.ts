export const dynamic = 'force-dynamic';
// app/api/tickets/share/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

export async function POST(request: NextRequest) {
    try {
        // Cek API Key di awal
        const apiKey = process.env.RESEND_API_KEY;
        
        if (!apiKey) {
            console.error('RESEND_API_KEY is missing in environment variables');
            return NextResponse.json(
                { error: 'Email service not configured. Please set RESEND_API_KEY.' },
                { status: 500 }
            );
        }
        
        // Inisialisasi Resend dengan API Key
        const resend = new Resend(apiKey);
        
        const { email, ticketId, shareUrl, title } = await request.json();
        
        // Validasi input
        if (!email || !ticketId || !shareUrl) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }
        
        console.log('Sending email to:', email);
        console.log('Using API Key:', apiKey.substring(0, 10) + '...');
        
        // Kirim email
        const { data, error } = await resend.emails.send({
            from: 'onboarding@resend.dev', // Untuk testing
            to: [email],
            subject: `Laporan: ${title}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #4f46e5;">Laporan Tiket</h2>
                    <p>Seseorang telah membagikan laporan berikut kepada Anda:</p>
                    
                    <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
                        <h3 style="margin: 0 0 10px 0; color: #1f2937;">${title}</h3>
                        <p style="margin: 0; color: #6b7280;">ID Tiket: ${ticketId}</p>
                    </div>
                    
                    <a href="${shareUrl}" 
                       style="display: inline-block; background-color: #4f46e5; color: white; padding: 12px 24px; 
                              text-decoration: none; border-radius: 6px; margin: 20px 0;">
                        Lihat Laporan
                    </a>
                    
                    <p style="color: #9ca3af; font-size: 12px; margin-top: 30px;">
                        Email ini dikirim secara otomatis. Harap tidak membalas email ini.
                    </p>
                </div>
            `,
        });
        
        if (error) {
            console.error('Resend error:', error);
            return NextResponse.json(
                { error: error.message },
                { status: 500 }
            );
        }
        
        return NextResponse.json({ 
            success: true, 
            message: 'Email sent successfully',
            data 
        });
        
    } catch (error) {
        console.error('Error sending share email:', error);
        return NextResponse.json(
            { error: 'Internal server error: ' + (error as Error).message },
            { status: 500 }
        );
    }
}

export async function GET() {
    return NextResponse.json({ 
        status: 'API is working',
        hasApiKey: !!process.env.RESEND_API_KEY,
        apiKeyPrefix: process.env.RESEND_API_KEY ? process.env.RESEND_API_KEY.substring(0, 10) : null
    });
}