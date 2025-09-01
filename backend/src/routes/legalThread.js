// backend/src/routes/legalThread.js - Express 5 Compatible
import express from 'express';
import {
  createThread,
  getThreadMessages,
  postMessageToThread,
  getUserThreads,
  getThreadHistory,
  deleteThread,
  updateThreadTitle,
  getTodayQuestionCount
} from '../controllers/legalThread.js';

import { verifyToken } from '../middlewares/auth.js';
import { chatRateLimiter } from '../middlewares/rateLimiter.js';

const router = express.Router();

// Apply auth middleware to all routes
router.use(verifyToken);

// Pastikan parameter names jelas dan tidak ambigu
router.post('/', createThread);
router.get('/', getUserThreads);
router.get('/history', getThreadHistory);
router.get('/daily-limit', getTodayQuestionCount);

// Routes dengan parameters - pastikan nama parameter jelas
router.post('/:threadId/messages', chatRateLimiter, postMessageToThread);
router.get('/:threadId/messages', getThreadMessages);
router.patch('/:id', updateThreadTitle); // Simplify - remove 'thread/' prefix
router.delete('/:id', deleteThread);     // Simplify - remove 'thread/' prefix

export default router;