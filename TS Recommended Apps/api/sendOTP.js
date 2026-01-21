import { kv } from '@vercel/kv';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransporter({
    service: 'gmail',
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
});

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
    const { userId } = req.body;
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes
    await kv.set(`otp:${userId}`, JSON.stringify({ otp, expiresAt, attempts: 0 }), { ex: 600 });
    // Send email
    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: 'user@example.com', // Fetch from DB
        subject: 'Your OTP Code',
        text: `Your OTP is ${otp}. Expires in 10 minutes. If you didn't request this, ignore.`
    });
    res.status(200).json({ success: true });
}