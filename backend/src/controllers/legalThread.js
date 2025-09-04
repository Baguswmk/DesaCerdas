import prisma from "../../prisma/index.js";
import { sendToAI } from "../utils/openaiClient.js";
import sanitizeHtml from "sanitize-html";

// Untuk tracking guest usage menggunakan IP
const guestUsage = new Map(); // IP -> { count, date }

// Helper function untuk reset daily count
const resetDailyCount = () => {
  const today = new Date().toDateString();
  for (const [ip, data] of guestUsage.entries()) {
    if (data.date !== today) {
      guestUsage.set(ip, { count: 0, date: today });
    }
  }
};

// Guest Question Endpoint (3 kali per hari per IP)
export const askGuestQuestion = async (req, res) => {
  try {
    const { question } = req.body;
    const clientIP = req.ip || req.connection.remoteAddress;
    const today = new Date().toDateString();

    resetDailyCount();

    // Check guest usage limit
    const usage = guestUsage.get(clientIP) || { count: 0, date: today };
    
    if (usage.count >= 3) {
      return res.status(429).json({ 
        error: "Batas 3 pertanyaan gratis per hari tercapai. Silakan login untuk mendapatkan 20 pertanyaan per hari.",
        code: "GUEST_LIMIT_EXCEEDED"
      });
    }

    // Validate question
    const cleanQuestion = sanitizeHtml(question?.trim() || "", {
      allowedTags: [],
      allowedAttributes: {},
    });

    if (cleanQuestion.length < 2 || cleanQuestion.length > 500) {
      return res.status(400).json({ error: "Pertanyaan harus antara 2-500 karakter." });
    }

    // Send to AI
    const messages = [{
      sender: "USER",
      message: cleanQuestion,
    }];

    let aiResponse = await sendToAI(messages);
    if (!aiResponse || aiResponse.trim().length < 3) {
      aiResponse = "Maaf, tidak dapat memberikan jawaban yang memadai.";
    }

    // Update guest usage
    guestUsage.set(clientIP, { 
      count: usage.count + 1, 
      date: today 
    });

    res.status(200).json({
      question: cleanQuestion,
      answer: sanitizeHtml(aiResponse, {
        allowedTags: [],
        allowedAttributes: {},
      }),
      usage: {
        current: usage.count + 1,
        limit: 3,
        remaining: 2 - usage.count
      }
    });

  } catch (err) {
    console.error("askGuestQuestion error:", err);
    res.status(500).json({ error: "Gagal memproses pertanyaan" });
  }
};

// Get guest usage count
export const getGuestUsage = async (req, res) => {
  try {
    const clientIP = req.ip || req.connection.remoteAddress;
    const today = new Date().toDateString();
    
    resetDailyCount();
    
    const usage = guestUsage.get(clientIP) || { count: 0, date: today };
    
    res.json({
      current: usage.count,
      limit: 3,
      remaining: 3 - usage.count,
      canAsk: usage.count < 3
    });
  } catch (err) {
    console.error("getGuestUsage error:", err);
    res.status(500).json({ error: "Gagal mengambil data usage" });
  }
};

// Existing functions for logged users
export const createThread = async (req, res) => {
  try {
    const title = sanitizeHtml(req.body.title || "", {
      allowedTags: [],
      allowedAttributes: {},
    }).trim();

    if (!title) {
      return res.status(400).json({ error: "Judul tidak boleh kosong" });
    }

    const userId = req.user.id;

    const thread = await prisma.legalThread.create({
      data: { title, userId },
    });

    res.status(201).json(thread);
  } catch (err) {
    console.error("createThread error:", err);
    res.status(500).json({ error: "Gagal membuat thread" });
  }
};

export const getUserThreads = async (req, res) => {
  try {
    const threads = await prisma.legalThread.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: "desc" },
    });

    res.json(threads);
  } catch (err) {
    console.error("getUserThreads error:", err);
    res.status(500).json({ error: "Gagal mengambil thread" });
  }
};

export const postMessageToThread = async (req, res) => {
  const { message } = req.body;
  const { threadId } = req.params;
  const userId = req.user.id;
  
  try {
    const today = new Date().toISOString().split("T")[0];

    // Check daily usage for logged users (20 limit)
    const usageToday = await prisma.aIUsage.upsert({
      where: {
        userId_date: {
          userId,
          date: new Date(today),
        },
      },
      update: {
        count: { increment: 1 },
      },
      create: {
        userId,
        date: new Date(today),
        count: 1,
      },
    });

    if (usageToday.count > 20) {
      return res.status(429).json({ 
        error: "Batas penggunaan harian AI tercapai (20 pertanyaan per hari).",
        code: "USER_LIMIT_EXCEEDED"
      });
    }

    const cleanMessage = sanitizeHtml((message || "").trim(), {
      allowedTags: [],
      allowedAttributes: {},
    });

    if (cleanMessage.length < 2 || cleanMessage.length > 500) {
      return res.status(400).json({ error: "Pesan harus antara 2-500 karakter." });
    }

    const allowedChars = /^[\p{L}\p{N}\s.,!?"'\-]{2,}$/u;
    if (!allowedChars.test(cleanMessage)) {
      return res.status(400).json({ error: "Pesan mengandung karakter tidak valid." });
    }

    const thread = await prisma.legalThread.findUnique({
      where: { id: threadId },
    });

    if (!thread || thread.userId !== userId) {
      return res.status(403).json({ error: "Akses ditolak ke thread ini" });
    }

    const userMsg = await prisma.legalMessage.create({
      data: {
        threadId,
        sender: "USER",
        message: cleanMessage,
      },
    });

    const messages = await prisma.legalMessage.findMany({
      where: { threadId },
      orderBy: { createdAt: "asc" },
    });

    let aiResponse = await sendToAI(messages);
    if (!aiResponse || aiResponse.trim().length < 3) {
      aiResponse = "Maaf, tidak dapat memberikan jawaban yang memadai.";
    }

    const aiMsg = await prisma.legalMessage.create({
      data: {
        threadId,
        sender: "AI",
        message: sanitizeHtml(aiResponse, {
          allowedTags: [],
          allowedAttributes: {},
        }),
      },
    });

    res.status(200).json({ 
      userMsg, 
      aiMsg,
      usage: {
        current: usageToday.count,
        limit: 20,
        remaining: 20 - usageToday.count
      }
    });
  } catch (err) {
    console.error("postMessageToThread error:", err);
    res.status(500).json({ error: "Gagal memproses pesan" });
  }
};

export const getThreadMessages = async (req, res) => {
  const { threadId } = req.params;
  const userId = req.user.id;

  try {
    const thread = await prisma.legalThread.findUnique({
      where: { id: threadId },
    });

    if (!thread || thread.userId !== userId) {
      return res.status(403).json({ error: "Akses ditolak" });
    }

    const messages = await prisma.legalMessage.findMany({
      where: { threadId },
      orderBy: { createdAt: "asc" },
    });

    res.json(messages);
  } catch (err) {
    console.error("getThreadMessages error:", err);
    res.status(500).json({ error: "Gagal mengambil pesan" });
  }
};

export const getThreadHistory = async (req, res) => {
  const userId = req.user.id;

  try {
    const threads = await prisma.legalThread.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      include: {
        messages: {
          orderBy: { createdAt: "asc" },
          take: 1,
        },
      },
    });

    const result = threads.map((thread) => ({
      sessionId: thread.id,
      title: thread.title,
      preview: thread.messages[0]?.message || "",
      createdAt: thread.createdAt,
    }));

    res.json(result);
  } catch (err) {
    console.error("getThreadHistory error:", err);
    res.status(500).json({ error: "Gagal mengambil riwayat thread" });
  }
};

export const updateThreadTitle = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  const cleanTitle = sanitizeHtml((req.body.title || "").trim(), {
    allowedTags: [],
    allowedAttributes: {},
  });

  if (!cleanTitle) {
    return res.status(400).json({ error: "Judul tidak boleh kosong" });
  }

  try {
    const updated = await prisma.legalThread.updateMany({
      where: { id, userId },
      data: { title: cleanTitle },
    });

    if (updated.count === 0) {
      return res.status(404).json({ error: "Thread tidak ditemukan atau bukan milik Anda" });
    }

    res.json({ message: "Judul berhasil diperbarui" });
  } catch (err) {
    console.error("updateThreadTitle error:", err);
    res.status(500).json({ error: "Gagal memperbarui judul" });
  }
};

export const deleteThread = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    await prisma.legalMessage.deleteMany({ where: { threadId: id } });

    const deleted = await prisma.legalThread.deleteMany({
      where: { id, userId },
    });

    if (deleted.count === 0) {
      return res.status(404).json({ error: "Thread tidak ditemukan atau bukan milik Anda" });
    }

    res.json({ message: "Thread berhasil dihapus" });
  } catch (err) {
    console.error("deleteThread error:", err);
    res.status(500).json({ error: "Gagal menghapus thread" });
  }
};

export const getTodayQuestionCount = async (req, res) => {
  const userId = req.user.id;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  try {
    const usage = await prisma.aIUsage.findUnique({
      where: {
        userId_date: {
          userId,
          date: today,
        },
      },
    });

    const count = usage?.count || 0;

    res.json({ 
      current: count,
      limit: 20,
      remaining: 20 - count,
      canAsk: count < 20
    });
  } catch (err) {
    console.error("getTodayQuestionCount error:", err);
    res.status(500).json({ error: "Gagal mengambil data usage" });
  }
};