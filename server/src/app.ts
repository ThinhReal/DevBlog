import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import categoryRoutes from './routes/categories.js';
import blogRoutes from './routes/blogs.js';

const isDev = process.env.NODE_ENV !== 'production';

function getAllowedOrigins(): string[] {
  const fromEnv = (process.env.CORS_ORIGIN ?? 'http://localhost:5173')
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean);

  if (process.env.VERCEL_URL) {
    fromEnv.push(`https://${process.env.VERCEL_URL}`);
  }

  return fromEnv;
}

function isAllowedOrigin(origin: string, allowed: string[]): boolean {
  if (allowed.includes(origin)) return true;

  if (isDev && /^http:\/\/localhost:\d+$/.test(origin)) return true;

  try {
    const { hostname } = new URL(origin);
    if (hostname.endsWith('.vercel.app')) return true;
  } catch {
    return false;
  }

  return false;
}

export function createApp() {
  const app = express();
  const corsOrigins = getAllowedOrigins();

  app.use(
    cors({
      origin(origin, callback) {
        if (!origin) return callback(null, true);
        if (isAllowedOrigin(origin, corsOrigins)) return callback(null, true);
        callback(new Error('Not allowed by CORS'));
      },
      credentials: true,
    })
  );
  app.use(express.json({ limit: '2mb' }));

  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok' });
  });

  app.use('/api/auth', authRoutes);
  app.use('/api/categories', categoryRoutes);
  app.use('/api/blogs', blogRoutes);

  app.use((_req, res) => {
    res.status(404).json({ error: 'Not found' });
  });

  app.use(
    (err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
      console.error(err);
      const message = err.message === 'Not allowed by CORS' ? err.message : 'Internal server error';
      const status = err.message === 'Not allowed by CORS' ? 403 : 500;
      res.status(status).json({ error: message });
    }
  );

  return app;
}
