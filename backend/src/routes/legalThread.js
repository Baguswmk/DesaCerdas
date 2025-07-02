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

router.post('/', createThread); 
router.get('/', getUserThreads); 
router.post('/:threadId/messages', chatRateLimiter , postMessageToThread); 
router.get('/:threadId/messages', getThreadMessages); 
router.get('/history', getThreadHistory); 
router.patch('/thread/:id', updateThreadTitle); 
router.delete('/thread/:id', deleteThread);     

router.get('/daily-limit', getTodayQuestionCount);

export default router;
