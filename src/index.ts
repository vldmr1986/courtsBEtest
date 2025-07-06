import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

// Import routes
import courtsRouter from './routes/courts';
import gamesRouter from './routes/games';
import statisticsRouter from './routes/statistics';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env['PORT'] || 3000;

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: process.env['CORS_ORIGIN'] || 'http://localhost:3000',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env['RATE_LIMIT_WINDOW_MS'] || '900000'), // 15 minutes
  max: parseInt(process.env['RATE_LIMIT_MAX_REQUESTS'] || '100'), // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    error: 'Too many requests from this IP, please try again later.'
  }
});
app.use(limiter);

// Logging middleware
app.use(morgan('combined'));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'CourtLA API is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// API routes
const apiPrefix = process.env['API_PREFIX'] || '/api';
app.use(`${apiPrefix}/courts`, courtsRouter);
app.use(`${apiPrefix}/games`, gamesRouter);
app.use(`${apiPrefix}/statistics`, statisticsRouter);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to CourtLA API',
    version: '1.0.0',
    endpoints: {
      courts: `${apiPrefix}/courts`,
      games: `${apiPrefix}/games`,
      statistics: `${apiPrefix}/statistics`,
      health: '/health'
    }
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
    path: req.originalUrl
  });
});

// Global error handler
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled error:', err);
  
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    message: process.env['NODE_ENV'] === 'development' ? err.message : 'Something went wrong'
  });
});

// Start server
const HOST = process.env['HOST'] || '0.0.0.0'; // Listen on all network interfaces
app.listen(Number(PORT), HOST, () => {
  console.log(`🚀 CourtLA API server running on ${HOST}:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🔗 API base URL: http://localhost:${PORT}${apiPrefix}`);
  console.log(`🌐 Network URL: http://192.168.99.73:${PORT}${apiPrefix}`);
  console.log(`🌍 Environment: ${process.env['NODE_ENV'] || 'development'}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  process.exit(0);
});

export default app; 