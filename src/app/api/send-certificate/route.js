import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request) {
    try {
        const { email, certificateId, studentName, courseName } = await request.json();

        const SMTP_USER = process.env.SMTP_USER;
        const SMTP_PASS = process.env.SMTP_PASS;

        // The URL for verification, derived from the request origin or hardcoded base URL
        const originUrl = request.nextUrl ? new URL(request.url).origin : (process.env.NEXT_PUBLIC_BASE_URL || 'https://ac-dc-institute.com');
        const certLink = `${originUrl}/verify/${certificateId}`;

        if (!SMTP_USER || !SMTP_PASS) {
            console.warn(`[DEV MODE] MOCK CERTIFICATE EMAIL SENT to ${email} for cert ${certificateId}`);
            return NextResponse.json({ success: true, message: 'Certificate email pseudo-sent (Dev mode)', devMode: true });
        }

        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST || 'smtp.gmail.com',
            port: process.env.SMTP_PORT || 587,
            secure: false,
            auth: {
                user: SMTP_USER,
                pass: SMTP_PASS,
            },
        });

        await transporter.sendMail({
            from: `"AC & DC Technical Institute" <${SMTP_USER}>`,
            to: email,
            subject: `Your Certificate for ${courseName} is Ready!`,
            text: `Dear ${studentName},\n\nCongratulations on completing ${courseName}!\nYour certificate has been generated and is now available.\n\nYou can view and download your official certificate here: ${certLink}\n\nBest Regards,\nAC & DC Technical Institute`,
            html: `
            <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 8px;">
                <h2 style="color: #2563eb;">Congratulations, ${studentName}! 🎉</h2>
                <p>We are thrilled to inform you that you have successfully completed the <strong>${courseName}</strong> course.</p>
                <p>Your official certificate has been generated and is permanently stored on our secure verification network.</p>
                <div style="text-align: center; margin: 30px 0;">
                    <a href="${certLink}" style="background-color: #2563eb; color: #fff; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: bold; display: inline-block;">View & Download Certificate</a>
                </div>
                <p>If the button above does not work, please copy and paste the following link into your browser:</p>
                <p style="word-break: break-all; color: #666; font-size: 14px;"><a href="${certLink}">${certLink}</a></p>
                <hr style="border: none; border-top: 1px solid #eaeaea; margin: 30px 0;" />
                <p style="font-size: 12px; color: #999; text-align: center;">AC & DC Technical Institute<br/>Empowering the Next Generation of Technicians</p>
            </div>
            `,
        });

        return NextResponse.json({ success: true, message: 'Certificate email sent successfully' });
    } catch (error) {
        console.error("Error sending certificate email:", error);
        return NextResponse.json({ success: false, error: 'Failed to send certificate email.' }, { status: 500 });
    }
}
