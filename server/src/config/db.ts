import mongoose from 'mongoose';

declare global {
  // eslint-disable-next-line no-var
  var __mongooseCache: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  };
}

const cache = global.__mongooseCache ?? { conn: null, promise: null };
global.__mongooseCache = cache;

export async function connectDb(uri: string): Promise<typeof mongoose> {
  if (cache.conn) {
    return cache.conn;
  }

  if (!cache.promise) {
    cache.promise = mongoose
      .connect(uri, { serverSelectionTimeoutMS: 8000 })
      .then((mongooseInstance) => {
        console.log('Connected to MongoDB');
        return mongooseInstance;
      })
      .catch((err) => {
        cache.promise = null;
        const message = err instanceof Error ? err.message : String(err);
        console.error('\n❌ MongoDB connection failed:', message);

        if (message.includes('ENOTFOUND') || message.includes('querySrv')) {
          console.error(`
The cluster hostname in MONGODB_URI could not be found.

Fix options:
  1. Atlas: open https://cloud.mongodb.com → your cluster → Connect → copy a fresh connection string
     Update MONGODB_URI and add the database name, e.g.:
     mongodb+srv://USER:PASS@cluster0.xxxxx.mongodb.net/devcollect?retryWrites=true&w=majority

  2. Local Docker: start Docker Desktop, then run:
     docker compose up -d
     Set MONGODB_URI=mongodb://localhost:27017/devcollect
`);
        }

        throw err;
      });
  }

  cache.conn = await cache.promise;
  return cache.conn;
}
