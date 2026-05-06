import { Request, Response, NextFunction } from 'express';
import { SystemSettings } from '../models/SystemSettings';

export const checkSystemStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // We don't block admin routes or login so admin can always log in and turn it off
    if (req.originalUrl.startsWith('/api/admin') || req.originalUrl === '/api/auth/login') {
      return next();
    }

    let settings = await SystemSettings.findOne({ key: 'system_state' });
    
    // If settings don't exist yet, just continue
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

    if (settings.registrationLocked && req.originalUrl === '/api/auth/register' && req.method === 'POST') {
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
