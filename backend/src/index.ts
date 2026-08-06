import express from 'express';
import dotenv from 'dotenv';
dotenv.config();

import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { connectDB } from './config/db';
import path from 'path';
import fs from 'fs';
import { authLimiter, generalLimiter, aiLimiter } from './middleware/rateLimiter';

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
import hospitalRoutes from './routes/hospitalRoutes';
import privacyRoutes from './routes/privacyRoutes';
import adminRoutes from './routes/adminRoutes';
import { ipBlocklistCheck } from './middleware/securityLogger';

const app = express();

// Trust proxy for deployment behind Render / Vercel / Cloudflare reverse proxies
app.set('trust proxy', 1);

// Connect to Database
connectDB();

// Ensure Uploads folders exist
const uploadRoot = path.join(__dirname, '../uploads');
['reports', 'visits', 'profiles'].forEach(dir => {
  const fullPath = path.join(uploadRoot, dir);
  if (!fs.existsSync(fullPath)) fs.mkdirSync(fullPath, { recursive: true });
});

// CORS Configuration - Permissive for authenticated origins
app.use(cors({
  origin: true,
  credentials: true 
}));

// Security Headers (OWASP recommended)
app.use(helmet({
  crossOriginEmbedderPolicy: false,
  contentSecurityPolicy: false
}));

// Body Parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(cookieParser());

// Safe NoSQL Injection Sanitizer (Express 5 compatible)
app.use((req, res, next) => {
  try {
    if (req.body && typeof req.body === 'object') {
      const sanitizeObj = (obj: any) => {
        for (const key in obj) {
          if (key.startsWith('$') || key.includes('.')) {
            delete obj[key];
          } else if (typeof obj[key] === 'object' && obj[key] !== null) {
            sanitizeObj(obj[key]);
          }
        }
      };
      sanitizeObj(req.body);
    }
  } catch (e) {
    // Ignore error
  }
  next();
});

// Global IP Blocklist Check
app.use(ipBlocklistCheck);

// General Rate Limiting on all /api routes
app.use('/api', generalLimiter);

// Robust Static File Serving
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

import { checkSystemStatus } from './middleware/systemMiddleware';
app.use('/api', checkSystemStatus);

// API Routes
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/medical', medicalRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/ai', aiLimiter, aiRoutes);
app.use('/api/emergency', emergencyRoutes);
app.use('/api/medicines', medicineRoutes);
app.use('/api/vaccinations', vaccinationRoutes);
app.use('/api/visits', visitRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/vitals', vitalsRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/family', familyRoutes);
app.use('/api/hospitals', hospitalRoutes);
app.use('/api/privacy', privacyRoutes);
app.use('/api/admin', adminRoutes);

// System State Check
app.get('/api/system-state', async (req, res) => {
  try {
    const { SystemSettings } = require('./models/SystemSettings');
    const settings = await SystemSettings.findOne({ key: 'system_state' });
    res.json({ 
      status: settings?.maintenanceMode ? 'maintenance' : 'operational',
      maintenanceMode: settings?.maintenanceMode || false
    });
  } catch (error) {
    res.json({ status: 'operational', maintenanceMode: false });
  }
});

// Health Check
app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.originalUrl} not found` });
});

// Global Error Handler to catch all unhandled errors cleanly
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('💥 Global Backend Exception:', err);
  const statusCode = err.status || err.statusCode || 500;
  res.status(statusCode).json({
    message: err.message || 'Internal Server Error',
    code: err.code || 'SERVER_ERROR'
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 EHP Backend running on port ${PORT}`);
});
