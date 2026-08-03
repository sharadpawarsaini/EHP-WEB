import { Request, Response, NextFunction } from 'express';
import { IPBlocklist } from '../models/IPBlocklist';
import { SecurityLog } from '../models/SecurityLog';

export const getClientIp = (req: Request): string => {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string') {
    return forwarded.split(',')[0].trim();
  }
  if (Array.isArray(forwarded)) {
    return forwarded[0].trim();
  }
  return req.socket.remoteAddress || req.ip || '127.0.0.1';
};

export const ipBlocklistCheck = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const clientIp = getClientIp(req);
    const isBlocked = await IPBlocklist.findOne({
      ipAddress: clientIp,
      $or: [
        { expiresAt: null },
        { expiresAt: { $gt: new Date() } }
      ]
    });

    if (isBlocked) {
      // Record blocked attempt asynchronously
      SecurityLog.create({
        eventType: 'BLOCKED_IP_ATTEMPT',
        severity: 'CRITICAL',
        ipAddress: clientIp,
        userAgent: req.headers['user-agent'] || 'Unknown',
        endpoint: req.originalUrl,
        method: req.method,
        statusCode: 403,
        metadata: { reason: isBlocked.reason }
      }).catch(err => console.error('Failed to log blocked IP attempt:', err));

      res.status(403).json({
        message: 'Access Denied: Your IP address has been flagged and restricted by the Security Operations Center.',
        code: 'IP_BLOCKED'
      });
      return;
    }

    next();
  } catch (error) {
    console.error('Error in ipBlocklistCheck middleware:', error);
    next();
  }
};

export const recordSecurityEvent = async (data: {
  eventType: string;
  severity: 'INFO' | 'WARNING' | 'CRITICAL';
  ipAddress?: string;
  userAgent?: string;
  endpoint?: string;
  method?: string;
  statusCode?: number;
  userId?: any;
  metadata?: any;
}) => {
  try {
    await SecurityLog.create(data);
  } catch (err) {
    console.error('Failed to record security event:', err);
  }
};
