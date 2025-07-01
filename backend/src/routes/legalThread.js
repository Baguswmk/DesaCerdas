import express from 'express';
import {
  createThread,
  getThreadMessages,
  postMessageToThread,
  getUserThreads,
} from '../controllers/legalThread.js';

import { verifyToken } from '../middlewares/auth.js';

const router = express.Router();
router.use(verifyToken);

router.post('/', createThread); 
router.get('/', getUserThreads); 
router.post('/:threadId/messages', postMessageToThread); 
router.get('/:threadId/messages', getThreadMessages); 

export default router;
