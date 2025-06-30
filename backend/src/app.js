// src/app.js
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import csrfMiddleware from './middlewares/csrf.js';
import rateLimit from 'express-rate-limit';

import legalThreadRoutes from './routes/legalThread.routes.js';
import authRoutes from './routes/auth.routes.js';

const app = express();

app.use(express.json({ limit: '1mb' }));
app.use(cookieParser());
app.use(helmet());

app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true,
}));

const authLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 10,
  message: 'Terlalu banyak percobaan, coba lagi nanti.',
});


app.use('/api/auth', authLimiter,authRoutes);
app.use('/api/threads', legalThreadRoutes);

app.get('/api/csrf-token', csrfMiddleware, (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

export default app;
