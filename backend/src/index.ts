import express from 'express';
import dotenv from 'dotenv';
dotenv.config();

import cors from 'cors';
import cookieParser from 'cookie-parser';
import { connectDB } from './config/db';
import authRoutes from './routes/authRoutes';
import profileRoutes from './routes/profileRoutes';
import medicalRoutes from './routes/medicalRoutes';
import feedbackRoutes from './routes/feedbackRoutes';
import aiRoutes from './routes/aiRoutes';
import path from 'path';

const app = express();

// Connect to Database
connectDB();

// CORS Configuration
app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    const allowedOrigins = [
      'https://ehp-tan-eight.vercel.app',
      'https://ehp-web.onrender.com',
      process.env.CORS_ORIGIN
    ].filter(Boolean);
    const isVercel = origin.endsWith('.vercel.app');
    const isLocal = origin.startsWith('http://localhost') || origin.startsWith('http://127.0.0.1');
    if (allowedOrigins.includes(origin) || isVercel || (process.env.NODE_ENV !== 'production' && isLocal)) {
      return callback(null, true);
    }
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true 
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Static Files for Uploads
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/medical', medicalRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/ai', aiRoutes);

// Health Check
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.originalUrl} not found` });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 EHP Backend running on port ${PORT}`);
});
