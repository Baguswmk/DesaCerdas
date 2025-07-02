// src/app.js
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import csrfMiddleware from './middlewares/csrf.js';
import rateLimit from 'express-rate-limit';
import { startWeatherScheduler } from "./utils/weatherScheduler.js"
import legalThreadRoutes from './routes/legalThread.js';
import farmSmartRoutes from './routes/farmSmart.js';
import authRoutes from './routes/auth.js';

const app = express();
startWeatherScheduler();
app.use(express.json({ limit: '1mb' }));
app.use(cookieParser());
app.use(helmet());

app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true,
}));

const authLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 10,
  message: 'Terlalu banyak percobaan, coba lagi nanti.',
});


app.use('/api/auth', authLimiter,authRoutes);
app.use('/api/legal', legalThreadRoutes);
app.use('/api/farm', farmSmartRoutes);
app.get('/api/csrf-token', csrfMiddleware, (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

export default app;
