import 'dotenv/config';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { connectDb } from '../server/dist/config/db.js';
import { createApp } from '../server/dist/app.js';

let app: ReturnType<typeof createApp> | null = null;

async function getApp() {
  if (!process.env.MONGODB_URI || !process.env.JWT_SECRET) {
    throw new Error('MONGODB_URI and JWT_SECRET must be set');
  }

  if (!app) {
    await connectDb(process.env.MONGODB_URI);
    app = createApp();
  }

  return app;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const expressApp = await getApp();
    return expressApp(req, res);
  } catch (err) {
    console.error('API init failed:', err);
    res.status(500).json({ error: 'Server misconfigured or database unavailable' });
  }
}
