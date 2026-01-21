import { kv } from '@vercel/kv';

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
    const { otp } = req.body;
    const keys = await kv.keys('otp:*');
    for (const key of keys) {
        const data = JSON.parse(await kv.get(key) || '{}');
        if (data.otp === otp && Date.now() < data.expiresAt && data.attempts < 3) {
            data.attempts++;
            await kv.set(key, JSON.stringify(data));
            if (data.attempts >= 3) await kv.del(key);
            // Login user (e.g., set session)
            return res.status(200).json({ success: true });
        }
    }
    res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
}