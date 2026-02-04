import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import algoRoutes from './routes/algoRoutes'; 

dotenv.config();
const app = express();

app.use(cors());
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

app.use(express.json());
app.use('/api', algoRoutes); 

mongoose.connect(process.env.MONGODB_URI || '')
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.log('❌ MongoDB Error:', err));

app.listen(5050, () => console.log('🚀 Server running on port 5050'));