import multer from "multer";
import path from "path";
import fs from "fs";

// Konfigurasi multer untuk upload gambar
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = "uploads/bantu-desa/";
    
    // Buat folder jika belum ada
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // Format: timestamp-random-originalname
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + extension);
  }
});

// Filter file untuk gambar saja
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif"];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Hanya file gambar (JPEG, PNG, GIF) yang diizinkan."), false);
  }
};

// Konfigurasi upload
export const uploadImage = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max
  },
  fileFilter: fileFilter
});

// Upload multiple untuk galeri
export const uploadMultipleImages = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB per file
    files: 10 // maksimal 10 file
  },
  fileFilter: fileFilter
});

// Helper function untuk format currency
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0
  }).format(amount);
};

// Helper function untuk validasi tanggal
export const validateDate = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const now = new Date();

  if (start < now) {
    throw new Error("Tanggal mulai tidak boleh kurang dari hari ini.");
  }

  if (end <= start) {
    throw new Error("Tanggal selesai harus lebih dari tanggal mulai.");
  }

  return true;
};

// Helper function untuk generate reference code
export const generateReference = (prefix = "REF") => {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
};

// Helper function untuk parse JSON dengan error handling
export const safeJSONParse = (jsonString, defaultValue = null) => {
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    console.warn("JSON Parse Error:", error.message);
    return defaultValue;
  }
};

// Helper function untuk cleanup expired pending donations
export const cleanupExpiredDonations = async () => {
  const prisma = (await import("../../prisma/index.js")).default;
  
  try {
    // Hapus donasi pending yang lebih dari 24 jam
    const expiredTime = new Date();
    expiredTime.setHours(expiredTime.getHours() - 24);

    const result = await prisma.donasiDesa.deleteMany({
      where: {
        status: "PENDING",
        createdAt: {
          lt: expiredTime
        }
      }
    });

    console.log(`🗑️ Cleaned up ${result.count} expired pending donations`);
    return result.count;
  } catch (error) {
    console.error("❌ Cleanup Error:", error);
    return 0;
  }
};

// Helper function untuk menghitung progress kegiatan
export const calculateProgress = (currentAmount, targetAmount) => {
  if (!targetAmount || targetAmount === 0) return 0;
  const progress = (currentAmount / targetAmount) * 100;
  return Math.min(progress, 100); // Max 100%
};

// Helper function untuk menghitung sisa hari
export const calculateDaysLeft = (endDate) => {
  const end = new Date(endDate);
  const now = new Date();
  const diffTime = end.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(diffDays, 0); // Tidak boleh negatif
};

// Helper function untuk validasi nominal donasi
export const validateDonationAmount = (amount, minAmount = 10000) => {
  const numAmount = parseInt(amount);
  
  if (isNaN(numAmount) || numAmount <= 0) {
    throw new Error("Jumlah donasi harus berupa angka yang valid.");
  }

  if (numAmount < minAmount) {
    throw new Error(`Minimal donasi adalah ${formatCurrency(minAmount)}.`);
  }

  return numAmount;
};

// Helper function untuk send notification (bisa dikembangkan untuk WhatsApp, Email, dll)
export const sendNotification = async (userId, title, message, type = "DONATION") => {
  const prisma = (await import("../../prisma/index.js")).default;
  
  try {
    await prisma.notification.create({
      data: {
        userId,
        title,
        message,
        type
      }
    });
    
    // TODO: Implementasi push notification, email, atau WhatsApp
    console.log(`📱 Notification sent to user ${userId}: ${title}`);
  } catch (error) {
    console.error("❌ Send Notification Error:", error);
  }
};

// Helper function untuk log activity (untuk audit trail)
export const logActivity = async (userId, action, details = {}) => {
  try {
    console.log(`📝 Activity Log: User ${userId} - ${action}`, details);
    
    // TODO: Implementasi activity log ke database jika diperlukan
    // await prisma.activityLog.create({
    //   data: {
    //     userId,
    //     action,
    //     details: JSON.stringify(details),
    //     createdAt: new Date()
    //   }
    // });
  } catch (error) {
    console.error("❌ Log Activity Error:", error);
  }
};