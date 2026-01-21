import { MongoClient } from 'mongodb';

const client = new MongoClient(process.env.MONGODB_URI);

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
    const { email } = req.body;
    try {
        await client.connect();
        const db = client.db('loginSystem');
        const users = await db.collection('users').find({ email }).toArray();
        res.status(200).json({ accounts: users.map(u => ({ id: u._id, name: u.name, email: u.email })) });
    } catch (error) {
        res.status(500).json({ error: 'Database error' });
    } finally {
        await client.close();
    }
}