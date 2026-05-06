import { Request, Response, NextFunction } from 'express';
import { SystemSettings } from '../models/SystemSettings';
import jwt from 'jsonwebtoken';

export const checkSystemStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // 1. Always allow Admin routes, Login, Health, and Emergency checks
    const exemptedPaths = [
      '/api/admin',
      '/api/auth/login',
      '/api/health',
      '/api/emergency/public'
    ];

    if (exemptedPaths.some(path => req.originalUrl.startsWith(path))) {
      return next();
    }

    // 2. Check for Admin token to allow full bypass
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as any;
        if (decoded && decoded.role === 'admin') {
          return next();
        }
      } catch (e) {
        // Token invalid, continue to maintenance check
      }
    }

    let settings = await SystemSettings.findOne({ key: 'system_state' });
    
    if (!settings) {
      return next();
    }

    if (settings.maintenanceMode) {
      res.status(503).json({ 
        message: 'System is currently under maintenance / lockdown.',
        isMaintenance: true
      });
      return;
    }

    if (settings.registrationLocked && req.originalUrl.startsWith('/api/auth/register') && req.method === 'POST') {
      res.status(403).json({
        message: 'New user registrations are temporarily locked.'
      });
      return;
    }

    next();
  } catch (error) {
    next();
  }
};
