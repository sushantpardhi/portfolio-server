import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import { Express } from 'express';
import cors from 'cors';
import hpp from 'hpp';

export const setupSecurity = (app: Express): void => {
  // Set security HTTP headers
  app.use(helmet());

  // Rate limiting
  const limiter = rateLimit({
    max: Number(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
    windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS) || 60 * 60 * 1000, // 1 hour
    message: 'Too many requests from this IP, please try again in an hour!',
    standardHeaders: true,
    legacyHeaders: false,
  });

  // Apply rate limiting to all routes
  app.use('/api', limiter);

  // Enable CORS with configuration
  app.use(
    cors({
      origin:
        process.env.NODE_ENV === 'production' ? process.env.ALLOWED_ORIGINS?.split(',') : true,
      credentials: true,
    })
  );
  // Prevent parameter pollution
  app.use(hpp());

  // Additional security headers
  app.use((_req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    next();
  });
};
