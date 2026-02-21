import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request) {
    try {
        const { email, otp } = await request.json();

        const SMTP_USER = process.env.SMTP_USER;
        const SMTP_PASS = process.env.SMTP_PASS;

        // If no SMTP configured, we just log and pretend success for development
        if (!SMTP_USER || !SMTP_PASS) {
            console.warn(`[DEV MODE] MOCK EMAIL SENT - OTP for ${email} is ${otp}`);
            return NextResponse.json({ success: true, message: 'OTP sent (Dev mode simulated)', devMode: true, otp });
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
            subject: "Your OTP Verification Code",
            text: `Your OTP code is ${otp}. Please enter this to verify your email.`,
            html: `<b>Your OTP verification code is: <span style="font-size:24px; color:#2563eb; letter-spacing: 2px;">${otp}</span></b><br/><p>Please enter this code to verify your action.</p>`,
        });

        return NextResponse.json({ success: true, message: 'OTP sent successfully' });
    } catch (error) {
        console.error("Error sending OTP email:", error);
        return NextResponse.json({ success: false, error: 'Failed to send OTP. Please check server configuration.' }, { status: 500 });
    }
}
