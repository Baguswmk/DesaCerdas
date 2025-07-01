import prisma from "../../prisma/index.js";
import { sendToAI } from "../utils/openaiClient.js";
import sanitizeHtml from "sanitize-html";

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
      return res.status(429).json({ error: "Batas penggunaan harian AI tercapai." });
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

    res.status(200).json({ userMsg, aiMsg });
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
