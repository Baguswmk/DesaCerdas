import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { smartCSRF } from './middlewares/csrf.js'; 
import rateLimit from 'express-rate-limit';
import { startWeatherScheduler } from "./utils/weatherScheduler.js";
import { requestLogger } from './middlewares/logger.js';


import legalThreadRoutes from './routes/legalThread.js';
import farmSmartRoutes from './routes/farmSmart.js';
import authRoutes from './routes/auth.js';
import bantuDesaRoutes from './routes/bantuDesa.js';
import uploadRoutes from './routes/upload.js';

const app = express();


startWeatherScheduler();


app.use(requestLogger);


app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));


app.use(cookieParser());


app.use(helmet({
  crossOriginEmbedderPolicy: false 
}));


app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true, 
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-csrf-token', 'X-CSRF-Token']
}));


app.use('/uploads', express.static('uploads'));


const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100, 
  message: { 
    success: false,
    message: 'Terlalu banyak percobaan login. Coba lagi dalam 15 menit.' 
  },
  standardHeaders: true,
  legacyHeaders: false
});


app.get('/api/csrf-token', smartCSRF, (req, res) => {
  try {
    const token = req.csrfToken();
    res.json({ 
      success: true,
      csrfToken: token,
      environment: process.env.NODE_ENV || 'development',
      message: 'CSRF token berhasil dibuat'
    });
  } catch (error) {
    console.error('❌ Error buat CSRF token:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal membuat CSRF token'
    });
  }
});


app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/legal', legalThreadRoutes);
app.use('/api/farm', farmSmartRoutes);
app.use('/api/bantu-desa', bantuDesaRoutes);
app.use('/api/upload', uploadRoutes);


app.get('/health', (req, res) => {
  res.json({ 
    success: true,
    status: 'Server berjalan normal', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});


app.get('/api', (req, res) => {
  res.json({
    success: true,
    message: 'Desa Cerdas API - Siap digunakan!',
    version: '1.0.0',
    endpoints: [
      'POST /api/auth/register - Daftar akun baru',
      'POST /api/auth/login - Login',
      'GET /api/auth/me - Info user',
      'POST /api/auth/logout - Logout',
      'GET /api/legal - Tanya hukum',
      'GET /api/farm - Smart farming',
      'GET /api/bantu-desa - Bantuan desa',
      'POST /api/upload - Upload file',
      'GET /api/csrf-token - Ambil CSRF token'
    ]
  });
});


app.use((req, res, next) => {
  if (!res.headersSent) {
    res.status(404).json({ 
      success: false,
      message: `Endpoint ${req.method} ${req.originalUrl} tidak ditemukan`,
      hint: 'Cek dokumentasi API di GET /api'
    });
  }
});


app.use((err, req, res, next) => {
  
  console.error(`[${new Date().toISOString()}] ❌ Error:`, {
    message: err.message,
    url: req.url,
    method: req.method,
    user: req.user?.email || 'anonymous'
  });
  
  
  if (res.headersSent) {
    return next(err);
  }
  
  
  if (err.code === 'EBADCSRFTOKEN') {
    return res.status(403).json({
      success: false,
      message: 'CSRF token tidak valid',
      hint: 'Ambil token baru dari GET /api/csrf-token'
    });
  }
  
  
  if (err.type === 'entity.too.large') {
    return res.status(413).json({
      success: false,
      message: 'File terlalu besar, maksimal 10MB'
    });
  }
  
  
  if (err.code && err.code.startsWith('P')) {
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan database'
    });
  }
  
  
  res.status(err.status || 500).json({ 
    success: false,
    message: process.env.NODE_ENV === 'development' 
      ? err.message 
      : 'Terjadi kesalahan server',
    ...(process.env.NODE_ENV === 'development' && { 
      stack: err.stack 
    })
  });
});

export default app;