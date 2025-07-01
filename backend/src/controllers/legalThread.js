import prisma from '../../prisma/index.js';
import { sendToAI } from '../utils/openaiClient.js';
import sanitizeHtml from 'sanitize-html';

export const createThread = async (req, res) => {
  const title = sanitizeHtml(req.body.title, {
      allowedTags: [], 
      allowedAttributes: {},
    });

  const userId = req.user.id;

  try {
    const thread = await prisma.legalThread.create({
      data: {
        title,
        userId,
      },
    });

    res.status(201).json(thread);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create thread' });
  }
};

export const getUserThreads = async (req, res) => {
  const userId = req.user.id;

  try {
    const threads = await prisma.legalThread.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    res.json(threads);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch threads' });
  }
};
export const postMessageToThread = async (req, res) => {
  const { message } = req.body;
  const { threadId } = req.params;
  const userId = req.user?.id;

  if (!message || message.length < 2) {
    return res.status(400).json({ error: 'Pesan terlalu pendek' });
  }

  const cleanMessage = sanitizeHtml(message, {
    allowedTags: [],
    allowedAttributes: {},
  });

  try {
    const thread = await prisma.legalThread.findUnique({
      where: { id: threadId },
      include: { user: true },
    });

    if (!thread || thread.userId !== userId) {
      return res.status(403).json({ error: 'Akses ditolak ke thread ini' });
    }

    const userMsg = await prisma.legalMessage.create({
      data: {
        threadId,
        sender: 'USER',
        message: cleanMessage,
      },
    });

    const messages = await prisma.legalMessage.findMany({
      where: { threadId },
      orderBy: { createdAt: 'asc' },
    });

    const aiResponse = await sendToAI(messages);

    const aiMsg = await prisma.legalMessage.create({
      data: {
        threadId,
        sender: 'AI',
        message: sanitizeHtml(aiResponse, {
          allowedTags: [],
          allowedAttributes: {},
        }),
      },
    });

    res.status(200).json({ userMsg, aiMsg });
  } catch (err) {
    console.error('postMessageToThread error:', err);
    res.status(500).json({ error: 'Gagal memproses pesan' });
  }
};

export const getThreadMessages = async (req, res) => {
  const { threadId } = req.params;
  const userId = req.user?.id;

  try {
    const thread = await prisma.legalThread.findUnique({
      where: { id: threadId },
    });

    if (!thread || thread.userId !== userId) {
      return res.status(403).json({ error: 'Akses ditolak' });
    }

    const messages = await prisma.legalMessage.findMany({
      where: { threadId },
      orderBy: { createdAt: 'asc' },
    });

    res.json(messages);
  } catch (err) {
    console.error('getThreadMessages error:', err);
    res.status(500).json({ error: 'Gagal mengambil pesan' });
  }
};