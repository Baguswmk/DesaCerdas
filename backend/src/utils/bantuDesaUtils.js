import multer from "multer";
import path from "path";
import fs from "fs";


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = "uploads/bantu-desa/";
    
    
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + extension);
  }
});


const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif"];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Hanya file gambar (JPEG, PNG, GIF) yang diizinkan."), false);
  }
};


export const uploadImage = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, 
  },
  fileFilter: fileFilter
});


export const uploadMultipleImages = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, 
    files: 10 
  },
  fileFilter: fileFilter
});


export const formatCurrency = (amount) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0
  }).format(amount);
};


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


export const generateReference = (prefix = "REF") => {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
};


export const safeJSONParse = (jsonString, defaultValue = null) => {
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    console.warn("JSON Parse Error:", error.message);
    return defaultValue;
  }
};


export const calculateProgress = (currentAmount, targetAmount) => {
  if (!targetAmount || targetAmount === 0) return 0;
  const progress = (currentAmount / targetAmount) * 100;
  return Math.min(progress, 100); 
};


export const calculateDaysLeft = (endDate) => {
  const end = new Date(endDate);
  const now = new Date();
  const diffTime = end.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(diffDays, 0); 
};


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