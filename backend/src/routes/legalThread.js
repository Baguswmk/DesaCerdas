import express from 'express';
import {
  createThread,
  getThreadMessages,
  postMessageToThread,
  getUserThreads,
  getThreadHistory,
  deleteThread,
  updateThreadTitle,
  getTodayQuestionCount,
  askGuestQuestion,
  getGuestUsage
} from '../controllers/legalThread.js';

import { verifyToken, optionalAuth } from '../middlewares/auth.js';
import { chatRateLimiter, guestRateLimiter } from '../middlewares/rateLimiter.js';
import { smartCSRF } from '../middlewares/csrf.js';

const router = express.Router();

// ========== GUEST ROUTES (No authentication required) ==========
// Apply CSRF but allow guests
router.post('/guest/ask', smartCSRF, guestRateLimiter, askGuestQuestion);
router.get('/guest/usage', getGuestUsage);

// ========== AUTHENTICATED ROUTES (Login required) ==========
router.use(smartCSRF); // Apply CSRF to all authenticated routes
router.use(verifyToken); // All routes below require authentication

// Thread management
router.post('/', createThread);
router.get('/', getUserThreads);
router.get('/history', getThreadHistory);
router.get('/daily-limit', getTodayQuestionCount);

// Message management
router.post('/:threadId/messages', chatRateLimiter, postMessageToThread);
router.get('/:threadId/messages', getThreadMessages);

// Thread CRUD
router.patch('/:id', updateThreadTitle); 
router.delete('/:id', deleteThread);     

export default router;