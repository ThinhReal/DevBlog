import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { connectDb } from '../config/db.js';
import { User } from '../models/User.js';
import { Category } from '../models/Category.js';
import { toSlug } from '../utils/slug.js';

const defaultCategories = [
  { name: 'Data Structures', icon: 'Database', order: 1 },
  { name: 'Algorithms', icon: 'Cpu', order: 2 },
  { name: 'Web Development', icon: 'Globe', order: 3 },
  { name: 'Git', icon: 'GitBranch', order: 4 },
  { name: 'Personal Projects', icon: 'Folder', order: 5 },
];

async function seed() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('MONGODB_URI is required');

  await connectDb(uri);

  const email = process.env.ADMIN_EMAIL ?? 'admin@devcollect.local';
  const password = process.env.ADMIN_PASSWORD ?? 'admin123';

  const passwordHash = await bcrypt.hash(password, 12);
  const admin = await User.findOneAndUpdate(
    { email: email.toLowerCase() },
    { email: email.toLowerCase(), passwordHash },
    { upsert: true, new: true }
  );
  console.log(`Admin user ready: ${admin.email}`);

  for (const cat of defaultCategories) {
    const slug = toSlug(cat.name);
    await Category.findOneAndUpdate(
      { slug },
      { ...cat, slug },
      { upsert: true, new: true }
    );
    console.log(`Category ready: ${cat.name}`);
  }

  console.log('Seed completed');
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
