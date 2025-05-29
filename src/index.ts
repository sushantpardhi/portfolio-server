import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
dotenv.config();

import { validateEnv } from './utils/validateEnv';
import { setupSecurity } from './middleware/security';
import { globalErrorHandler } from './middleware/errorHandler';
import portfolioRoutes from './routes/portfolio.routes';
import healthRoutes from './routes/health.routes';
import { startServer } from './config/server';
import logger from './utils/logger';
 
// Validate environment variables
validateEnv();

const app: Express = express();

// Enable CORS early
app.use(cors());

// Development logging
app.use(morgan('dev'));

// Body parsing middleware 
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Security settings
setupSecurity(app);

// Routes
app.use('/api/portfolio', portfolioRoutes);
app.use('/health', healthRoutes);

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    status: 'error',
    message: `Cannot ${req.method} ${req.url}`,
  });
});

// Global error handler
app.use(((err: Error, req: Request, res: Response, next: NextFunction) => {
  globalErrorHandler(err, req, res, next);
}) as express.ErrorRequestHandler);

// Start server
startServer(app).catch((error) => {
  logger.error('Failed to start server:', error);
  process.exit(1);
});
