import rateLimit from 'express-rate-limit';


export const guestRateLimiter = rateLimit({
  windowMs: 60 * 1000, 
  max: 2, 
  message: {
    error: 'Terlalu banyak permintaan dari IP ini. Silakan tunggu sebentar atau login untuk batas yang lebih tinggi.',
    code: 'GUEST_RATE_LIMIT'
  },
  keyGenerator: (req) => req.ip, 
  standardHeaders: true,
  legacyHeaders: false,
});


export const chatRateLimiter = rateLimit({
  windowMs: 60 * 1000, 
  max: 5, 
  message: {
    error: 'Terlalu banyak permintaan, silakan coba lagi dalam beberapa saat.',
    code: 'USER_RATE_LIMIT'
  },
  keyGenerator: (req) => req.user?.id || req.ip, 
  standardHeaders: true,
  legacyHeaders: false,
});


export const adaptiveRateLimiter = (req, res, next) => {
  const isAuthenticated = req.user && req.user.id;
  
  if (isAuthenticated) {
    return chatRateLimiter(req, res, next);
  } else {
    return guestRateLimiter(req, res, next);
  }
};