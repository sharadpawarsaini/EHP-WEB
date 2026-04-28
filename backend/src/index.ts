import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { connectDB } from './config/db';
import authRoutes from './routes/authRoutes';
import profileRoutes from './routes/profileRoutes';
import medicalRoutes from './routes/medicalRoutes';
import emergencyRoutes from './routes/emergencyRoutes';
import reportRoutes from './routes/reportRoutes';
import familyRoutes from './routes/familyRoutes';
import hospitalRoutes from './routes/hospitalRoutes';
import vitalsRoutes from './routes/vitalsRoutes';
import feedbackRoutes from './routes/feedbackRoutes';
import visitRoutes from './routes/visitRoutes';
import medicineRoutes from './routes/medicineRoutes';
import vaccinationRoutes from './routes/vaccinationRoutes';
import appointmentRoutes from './routes/appointmentRoutes';
import path from 'path';

dotenv.config();

connectDB();

const app = express();

app.use(cors({ 
  origin: function(origin, callback) {
    // 1. Mobile apps (Flutter/React Native) often don't send an origin header. Allow them.
    if (!origin) return callback(null, true);

    // 2. Define the strict list of allowed production domains
    const allowedOrigins = [
      'https://ehp-tan-eight.vercel.app',
      'https://ehp-web.onrender.com',
      process.env.CORS_ORIGIN
    ].filter(Boolean); // removes undefined

    // 3. If in local development, safely allow localhost ports (for Flutter Web / React Dev)
    if (process.env.NODE_ENV !== 'production' && (origin.startsWith('http://localhost') || origin.startsWith('http://127.0.0.1'))) {
      return callback(null, true);
    }

    // 4. In production, rigidly check against the allowed domains
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    
    // Block anything else!
    callback(new Error(`Origin ${origin} not allowed by CORS`));
  },
  credentials: true 
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/medical', medicalRoutes);
app.use('/api/emergency', emergencyRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/family', familyRoutes);
app.use('/api/hospitals', hospitalRoutes);
app.use('/api/vitals', vitalsRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/visits', visitRoutes);
app.use('/api/medicines', medicineRoutes);
app.use('/api/vaccinations', vaccinationRoutes);
app.use('/api/appointments', appointmentRoutes);

// Serve static files from uploads folder
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.get('/', (req, res) => {
  res.send('API is running...');
});

// 404 Handler for undefined routes
app.use((req, res) => {
  console.log(`404 - Not Found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({ message: `Route ${req.originalUrl} not found on this server` });
});

const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
