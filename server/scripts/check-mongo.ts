import 'dotenv/config';
import dns from 'node:dns/promises';
import mongoose from 'mongoose';

const uri = process.env.MONGODB_URI;

async function check() {
  if (!uri) {
    console.error('❌ MONGODB_URI is missing in server/.env');
    process.exit(1);
  }

  console.log('Checking MongoDB connection...\n');

  const hostMatch = uri.match(/@([^/?]+)/);
  const host = hostMatch?.[1];

  if (host) {
    try {
      if (host.includes('.mongodb.net')) {
        await dns.resolveSrv(`_mongodb._tcp.${host}`);
        console.log(`✓ DNS OK: ${host}`);
      } else {
        console.log(`✓ Using host: ${host}`);
      }
    } catch {
      console.error(`❌ DNS failed for: ${host}`);
      console.error(`
This cluster hostname does not exist. Your Atlas cluster may have been deleted or renamed.

Fix:
  1. Go to https://cloud.mongodb.com
  2. Open your cluster → Connect → Drivers
  3. Copy the connection string
  4. Update server/.env:
     MONGODB_URI=mongodb+srv://USER:PASS@cluster0.xxxxx.mongodb.net/devcollect?retryWrites=true&w=majority
  5. Run: npm run seed && npm run dev
`);
      process.exit(1);
    }
  }

  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 8000 });
    console.log('✓ Connected to MongoDB successfully');
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('❌ MongoDB connection failed:', msg);
    console.error('\nCheck username/password in MONGODB_URI and Atlas Network Access (IP whitelist).');
    process.exit(1);
  }
}

check();
