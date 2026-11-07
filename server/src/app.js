import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { config } from './config/env.js';
import { apiRateLimiter } from './middleware/rateLimiter.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';

// Route imports
import healthRoutes from './routes/healthRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
import landRoutes from './routes/landRoutes.js';
import cropRoutes from './routes/cropRoutes.js';
import advisoryRoutes from './routes/advisoryRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import weatherRoutes from './routes/weatherRoutes.js';

const app = express();

// Security & Parsing Middleware
app.use(helmet());
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, or dev servers)
    if (!origin) return callback(null, true);
    // Allow local development and configured client URL
    if (origin.startsWith('http://localhost') || origin.startsWith('http://127.0.0.1') || origin === config.clientUrl) {
      return callback(null, true);
    }
    return callback(null, true); // Permissive in dev, lock down in strict production if needed
  },
  credentials: true
}));

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Logging
if (config.nodeEnv !== 'test') {
  app.use(morgan('dev'));
}

// Global API Rate Limiter
app.use('/api', apiRateLimiter);

// API v1 Routes Mounting
app.use('/api/v1/health', healthRoutes);
app.use('/api/v1/profile', profileRoutes);
app.use('/api/v1/lands', landRoutes);
app.use('/api/v1/crops', cropRoutes);
app.use('/api/v1/advisory', advisoryRoutes);
app.use('/api/v1/chat', chatRoutes);
app.use('/api/v1/weather', weatherRoutes);

// Error Handling
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
