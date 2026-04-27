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
import path from 'path';

dotenv.config();

connectDB();

const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN || 'https://ehp-tan-eight.vercel.app', credentials: true }));
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
