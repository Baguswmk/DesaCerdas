import rateLimit from 'express-rate-limit';

export const chatRateLimiter = rateLimit({
  windowMs: 60 * 1000, 
  max: 5,
  message: {
    error: 'Terlalu banyak permintaan, silakan coba lagi dalam beberapa saat.',
  },
  keyGenerator: (req) => req.user?.id || req.ip, 
});
