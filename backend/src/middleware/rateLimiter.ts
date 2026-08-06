import { Request, Response, NextFunction } from 'express';
import rateLimit from 'express-rate-limit';

/**
 * General API Rate Limiter
 * 100 requests per 15 minutes per IP for all routes
 */
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    code: 'RATE_LIMIT_EXCEEDED',
    message: 'Too many requests from this IP. Please try again after 15 minutes.'
  }
});

/**
 * Strict Auth Rate Limiter
 * 10 login/register attempts per 15 minutes per IP
 * This prevents brute-force attacks on credentials
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true, // Only count failed attempts
  message: {
    code: 'AUTH_RATE_LIMIT',
    message: 'Too many authentication attempts. Account temporarily locked. Try again in 15 minutes.'
  }
});

/**
 * AI Endpoint Rate Limiter
 * 20 AI requests per 5 minutes per user (prevents API abuse/cost explosion)
 */
export const aiLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    code: 'AI_RATE_LIMIT',
    message: 'AI request limit reached. Please wait 5 minutes before submitting more AI queries.'
  }
});
