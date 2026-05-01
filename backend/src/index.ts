import express from 'express';
import dotenv from 'dotenv';
dotenv.config();

import cors from 'cors';
import cookieParser from 'cookie-parser';
import { connectDB } from './config/db';
import path from 'path';

// Route Imports
import authRoutes from './routes/authRoutes';
import profileRoutes from './routes/profileRoutes';
import medicalRoutes from './routes/medicalRoutes';
import feedbackRoutes from './routes/feedbackRoutes';
import aiRoutes from './routes/aiRoutes';
import emergencyRoutes from './routes/emergencyRoutes';
import medicineRoutes from './routes/medicineRoutes';
import vaccinationRoutes from './routes/vaccinationRoutes';
import visitRoutes from './routes/visitRoutes';
import appointmentRoutes from './routes/appointmentRoutes';
import vitalsRoutes from './routes/vitalsRoutes';
import reportRoutes from './routes/reportRoutes';
import familyRoutes from './routes/familyRoutes';

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

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/medical', medicalRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/emergency', emergencyRoutes);
app.use('/api/medicines', medicineRoutes);
app.use('/api/vaccinations', vaccinationRoutes);
app.use('/api/visits', visitRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/vitals', vitalsRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/family', familyRoutes);

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
