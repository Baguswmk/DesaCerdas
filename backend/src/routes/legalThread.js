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
router.use(verifyToken);

// routes/legalThread.js
router.post('/', createThread); 
router.get('/', getUserThreads); 

// taruh yang statis dulu
router.get('/history', getThreadHistory); 
router.get('/daily-limit', getTodayQuestionCount);

// baru dynamic pakai param
router.post('/:threadId/messages', chatRateLimiter, postMessageToThread); 
router.get('/:threadId/messages', getThreadMessages); 
router.patch('/thread/:id', updateThreadTitle); 
router.delete('/thread/:id', deleteThread);


router.get('/daily-limit', getTodayQuestionCount);

export default router;
