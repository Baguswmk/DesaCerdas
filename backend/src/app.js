import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import path from 'path';

// Import middlewares
import csrfMiddleware from './middlewares/csrf.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { requestLogger } from './middlewares/logger.js';

// Import routes
import authRoutes from './routes/auth.js';
import legalThreadRoutes from './routes/legalThread.js';
import farmSmartRoutes from './routes/farmSmart.js';
import bantuDesaRoutes from './routes/bantuDesa.js';
import uploadRoutes from './routes/upload.js';

// Import utilities
import { startWeatherScheduler } from './utils/weatherScheduler.js';

const app = express();

// ====== BASIC MIDDLEWARE ======
app.use(helmet());
app.use(cookieParser());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ====== CORS CONFIGURATION ======
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token']
}));

// ====== LOGGING ======
if (process.env.NODE_ENV === 'development') {
  app.use(requestLogger);
}

// ====== RATE LIMITING ======
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 menit
  max: 1000, // 1000 requests per window
  message: {
    success: false,
    message: 'Terlalu banyak permintaan, coba lagi nanti'
  }
});

const authLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 menit
  max: 5, // 5 percobaan login per menit
  message: {
    success: false,
    message: 'Terlalu banyak percobaan login, coba lagi nanti'
  }
});

// ====== STATIC FILES ======
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// ====== ROUTES ======
// Health check
app.get('/health', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Server berjalan dengan baik',
    timestamp: new Date().toISOString()
  });
});

// CSRF Token endpoint
app.get('/api/csrf-token', csrfMiddleware, (req, res) => {
  res.json({ 
    success: true,
    csrfToken: req.csrfToken() 
  });
});

// API Routes
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/legal', generalLimiter, legalThreadRoutes);
app.use('/api/farm', generalLimiter, farmSmartRoutes);
app.use('/api/bantu-desa', generalLimiter, bantuDesaRoutes);
app.use('/api/upload', generalLimiter, uploadRoutes);

// ====== 404 HANDLER ======
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint tidak ditemukan'
  });
});

// ====== ERROR HANDLER ======
app.use(errorHandler);

// ====== START SCHEDULERS ======
startWeatherScheduler();

export default app;
