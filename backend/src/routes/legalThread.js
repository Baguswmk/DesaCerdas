
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
router.get('/history', getThreadHistory);
router.get('/daily-limit', getTodayQuestionCount);


router.post('/:threadId/messages', chatRateLimiter, postMessageToThread);
router.get('/:threadId/messages', getThreadMessages);
router.patch('/:id', updateThreadTitle); 
router.delete('/:id', deleteThread);     

export default router;