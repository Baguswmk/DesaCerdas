import express from 'express';
import {
  createThread,
  getThreadMessages,
  postMessageToThread,
  getUserThreads,
} from '../controllers/legalThread.controller.js';

import { verifyToken } from '../middlewares/auth.js';

const router = express.Router();
router.use(verifyToken);

// 🧵 Buat thread baru
router.post('/', createThread); 
// 📄 Ambil semua thread milik user
router.get('/', getUserThreads); 

// 💬 Kirim pesan ke thread (dan dapat balasan AI)
router.post('/:threadId/messages', postMessageToThread); 

// 📜 Ambil semua pesan dalam 1 thread
router.get('/:threadId/messages', getThreadMessages); 

export default router;
