// backend/src/app.js - Updated dengan CSRF yang benar
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import smartCSRF from './middlewares/csrf.js';
import rateLimit from 'express-rate-limit';
import { startWeatherScheduler } from "./utils/weatherScheduler.js";

// Import routes
import legalThreadRoutes from './routes/legalThread.js';
import farmSmartRoutes from './routes/farmSmart.js';
import authRoutes from './routes/auth.js';
import bantuDesaRoutes from './routes/bantuDesa.js';
import uploadRoutes from './routes/upload.js';

const app = express();

// Start scheduler
startWeatherScheduler();

// Basic middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Cookie parser HARUS sebelum CSRF
app.use(cookieParser());

// Security middleware
app.use(helmet({
  crossOriginEmbedderPolicy: false // Untuk development
}));

// CORS configuration
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-csrf-token']
}));

// Serve static files
app.use('/uploads', express.static('uploads'));

// Rate limiting untuk auth
const authLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 10,
  message: { error: 'Terlalu banyak percobaan, coba lagi nanti.' },
  standardHeaders: true,
  legacyHeaders: false
});

// CSRF token endpoint - HARUS sebelum routes lain yang pakai CSRF
app.get('/api/csrf-token', smartCSRF, (req, res) => {
  try {
    const token = req.csrfToken();
    res.json({ 
      success: true,
      csrfToken: token,
      environment: process.env.NODE_ENV || 'development',
      message: 'CSRF token berhasil diambil'
    });
  } catch (error) {
    console.error('Error generating CSRF token:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal generate CSRF token',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal error'
    });
  }
});

// API Routes
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/legal', legalThreadRoutes);
app.use('/api/farm', farmSmartRoutes);
app.use('/api/bantu-desa', bantuDesaRoutes);
app.use('/api/upload', uploadRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    csrf: process.env.NODE_ENV === 'production' ? 'enabled' : 'disabled'
  });
});

// API info endpoint
app.get('/api', (req, res) => {
  res.json({
    success: true,
    message: 'Desa Cerdas API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      legal: '/api/legal', 
      farm: '/api/farm',
      bantuDesa: '/api/bantu-desa',
      upload: '/api/upload',
      csrf: '/api/csrf-token'
    }
  });
});

// 404 handler
app.use((req, res, next) => {
  if (!res.headersSent) {
    res.status(404).json({ 
      success: false,
      message: `Route ${req.method} ${req.originalUrl} tidak ditemukan`,
      availableEndpoints: [
        '/api/auth',
        '/api/legal',
        '/api/farm', 
        '/api/bantu-desa',
        '/api/upload',
        '/api/csrf-token',
        '/health'
      ]
    });
  } else {
    next();
  }
});

// Global error handler
app.use((err, req, res, next) => {
  // Log error untuk debugging
  console.error(`[${new Date().toISOString()}] Error:`, {
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    url: req.url,
    method: req.method
  });
  
  // Jangan kirim response jika sudah dikirim
  if (res.headersSent) {
    return next(err);
  }
  
  // Handle specific error types
  if (err.code === 'EBADCSRFTOKEN') {
    return res.status(403).json({
      success: false,
      message: 'CSRF token tidak valid atau tidak ada',
      code: 'INVALID_CSRF_TOKEN',
      hint: 'Ambil CSRF token dari GET /api/csrf-token terlebih dahulu'
    });
  }
  
  if (err.type === 'entity.too.large') {
    return res.status(413).json({
      success: false,
      message: 'File atau data terlalu besar',
      code: 'PAYLOAD_TOO_LARGE'
    });
  }
  
  // Generic error response
  res.status(err.status || 500).json({ 
    success: false,
    message: err.message || 'Internal Server Error',
    code: err.code || 'INTERNAL_ERROR',
    ...(process.env.NODE_ENV === 'development' && { 
      stack: err.stack,
      details: err 
    })
  });
});

export default app;