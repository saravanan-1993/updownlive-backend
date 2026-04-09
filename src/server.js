import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, '../../.env') });

import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import authRoutes from './routes/authRoutes.js';
import settingsRoutes from './routes/settingsRoutes.js';
import enquiryRoutes from './routes/enquiryRoutes.js';
import userRoutes from './routes/userRoutes.js';
import newsletterRoutes from './routes/newsletterRoutes.js';
import forexRoutes from './routes/forexRoutes.js';
import goldRoutes from './routes/goldRoutes.js';
import cryptoRoutes from './routes/cryptoRoutes.js';
import stockRoutes from './routes/stockRoutes.js';
import newsRoutes from './routes/newsRoutes.js';
import commentRoutes from './routes/commentRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import economicCalendarRoutes from './routes/economicCalendarRoutes.js';
import connectDB from './config/db.js';
import { initAdmin } from './scripts/initAdmin.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Connect on module load — critical for Vercel cold starts
connectDB()
  .then(() => initAdmin())
  .catch(err => console.error('Initial DB connect failed:', err.message));

// Re-ensure connection before every request (handles dropped connections)
app.use(async (_req, _res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    next(err);
  }
});

app.set('trust proxy', 1);

const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:3000',
  'http://localhost:3000',
  'http://localhost:5173',
  'https://updownlive.vercel.app',
  'https://updownlive-4778.vercel.app',
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    if (/\.vercel\.app$/.test(origin)) return callback(null, true);
    console.log('CORS blocked origin:', origin);
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie', 'X-Requested-With'],
  exposedHeaders: ['Set-Cookie'],
  preflightContinue: false,
  optionsSuccessStatus: 204,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/enquiries', enquiryRoutes);
app.use('/api/users', userRoutes);
app.use('/api/newsletter', newsletterRoutes);
app.use('/api/forex', forexRoutes);
app.use('/api/gold', goldRoutes);
app.use('/api/crypto', cryptoRoutes);
app.use('/api/stocks', stockRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/economic-calendar', economicCalendarRoutes);

app.get('/', (_req, res) => {
  res.json({
    message: 'UpDownLive API is running',
    status: 'healthy',
    timestamp: new Date().toISOString(),
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
  });
});

app.get('/api/health', async (_req, res) => {
  const dbStatus = mongoose.connection.readyState;
  const dbStatusText = { 0: 'disconnected', 1: 'connected', 2: 'connecting', 3: 'disconnecting' }[dbStatus] || 'unknown';
  
  let adminStatus = 'unknown';
  try {
    if (dbStatus === 1) {
      const adminEmail = process.env.ADMIN_EMAIL?.replace(/"/g, '').trim();
      const admin = await mongoose.connection.db.collection('user').findOne({ email: adminEmail, role: 'admin' });
      adminStatus = admin ? 'exists' : 'not found';
    }
  } catch { adminStatus = 'check failed'; }

  res.json({
    status: dbStatus === 1 ? 'healthy' : 'unhealthy',
    mongoose: dbStatusText,
    admin: adminStatus,
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
  });
});

// Global error handler
app.use((err, _req, res, _next) => {
  console.error('Unhandled error:', err.message);
  res.status(500).json({ message: err.message || 'Internal server error' });
});

// Only start HTTP server when not on Vercel
if (process.env.VERCEL !== '1') {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

export default app;
