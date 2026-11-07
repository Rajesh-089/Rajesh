import rateLimit from 'express-rate-limit';
import { config } from '../config/env.js';

export const apiRateLimiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.maxRequests,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests from this IP address. Please try again after 15 minutes.',
    error: { code: 'RATE_LIMIT_EXCEEDED' }
  }
});

export const aiRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 30, // 30 AI generations per hour per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Hourly AI generation quota exceeded. Please try again later or consult previous advisory history.',
    error: { code: 'AI_RATE_LIMIT_EXCEEDED' }
  }
});
