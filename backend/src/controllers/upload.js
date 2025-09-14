// controllers/upload.js
import multer from 'multer';
import { 
  uploadFile, 
  uploadMultipleFiles, 
  deleteFile, 
  validateFileType, 
  validateFileSize,
  extractFilePathFromUrl 
} from '../utils/supabaseStorage.js';
import { successResponse, errorResponse } from '../utils/response.js';
import prisma from '../../prisma/index.js';

// Configure multer untuk memory storage (tidak menyimpan ke disk)
const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
    files: 10 // Maximum 10 files for multiple upload
  },
  fileFilter: (req, file, cb) => {
    // Validasi dasar tipe file
    const allowedTypes = [
      'image/jpeg', 
      'image/jpg', 
      'image/png', 
      'image/gif', 
      'image/webp'
    ];
    
    if (validateFileType(file.mimetype, allowedTypes)) {
      cb(null, true);
    } else {
      cb(new Error('Tipe file tidak diizinkan. Hanya gambar yang diperbolehkan.'), false);
    }
  }
});

/**
 * Upload single image
 */
export const uploadSingleImage = [
  upload.single("image"),
  async (req, res) => {
    try {
      if (!req.file) {
        return errorResponse(res, "Tidak ada file yang diupload.", null, 400);
      }

      // Validasi ukuran file
      if (!validateFileSize(req.file.size)) {
        return errorResponse(res, "Ukuran file terlalu besar. Maksimal 5MB.", null, 400);
      }

      // Upload ke Supabase
      const result = await uploadFile(
        req.file.buffer, 
        req.file.originalname, 
        'bantu-desa', 
        'images'
      );

      if (!result.success) {
        return errorResponse(res, "Gagal mengupload gambar ke storage.", result.error, 500);
      }

      return successResponse(res, "Gambar berhasil diupload.", {
        url: result.data.publicUrl,
        filename: result.data.filename,
        path: result.data.fullPath,
        size: req.file.size
      });

    } catch (error) {
      console.error("❌ Upload Single Image Error:", error);
      
      if (error.message.includes('Tipe file tidak diizinkan')) {
        return errorResponse(res, error.message, null, 400);
      }
      
      return errorResponse(res, "Gagal mengupload gambar.", error.message, 500);
    }
  }
];

/**
 * Upload multiple images
 */
export const uploadMultipleImage = [
  upload.array("images", 10),
  async (req, res) => {
    try {
      if (!req.files || req.files.length === 0) {
        return errorResponse(res, "Tidak ada file yang diupload.", null, 400);
      }

      // Validasi setiap file
      for (const file of req.files) {
        if (!validateFileSize(file.size)) {
          return errorResponse(res, `File ${file.originalname} terlalu besar. Maksimal 5MB.`, null, 400);
        }
      }

      // Upload ke Supabase
      const result = await uploadMultipleFiles(req.files, 'bantu-desa', 'images');

      if (!result.success && result.errors?.length === req.files.length) {
        return errorResponse(res, "Gagal mengupload semua gambar.", result.errors, 500);
      }

      const response = {
        message: `${result.data.length} dari ${req.files.length} gambar berhasil diupload.`,
        files: result.data.map(file => ({
          url: file.publicUrl,
          filename: file.filename,
          path: file.fullPath,
          originalName: file.originalName,
          size: file.size
        }))
      };

      if (result.errors?.length > 0) {
        response.errors = result.errors;
        response.message += ` ${result.errors.length} gambar gagal diupload.`;
      }

      return successResponse(res, response.message, response);

    } catch (error) {
      console.error("❌ Upload Multiple Images Error:", error);
      
      if (error.message.includes('Tipe file tidak diizinkan')) {
        return errorResponse(res, error.message, null, 400);
      }
      
      return errorResponse(res, "Gagal mengupload gambar.", error.message, 500);
    }
  }
];

/**
 * Upload bukti transfer
 */
export const uploadBuktiTransfer = [
  upload.single("bukti"),
  async (req, res) => {
    try {
      if (!req.file) {
        return errorResponse(res, "Bukti transfer wajib diupload.", null, 400);
      }

      // Validasi ukuran file
      if (!validateFileSize(req.file.size)) {
        return errorResponse(res, "Ukuran file terlalu besar. Maksimal 5MB.", null, 400);
      }

      // Upload ke Supabase dengan folder khusus bukti transfer
      const result = await uploadFile(
        req.file.buffer, 
        req.file.originalname, 
        'bantu-desa', 
        'bukti-transfer'
      );

      if (!result.success) {
        return errorResponse(res, "Gagal mengupload bukti transfer ke storage.", result.error, 500);
      }

      return successResponse(res, "Bukti transfer berhasil diupload.", {
        url: result.data.publicUrl,
        filename: result.data.filename,
        path: result.data.fullPath,
        size: req.file.size
      });

    } catch (error) {
      console.error("❌ Upload Bukti Transfer Error:", error);
      
      if (error.message.includes('Tipe file tidak diizinkan')) {
        return errorResponse(res, error.message, null, 400);
      }
      
      return errorResponse(res, "Gagal mengupload bukti transfer.", error.message, 500);
    }
  }
];

/**
 * Delete uploaded file
 */
export const deleteUploadedFile = async (req, res) => {
  try {
    if (req.user.role !== "ADMIN") {
      return errorResponse(res, "Hanya admin yang dapat menghapus file.", null, 403);
    }

    const { fileUrl } = req.body;
    
    if (!fileUrl) {
      return errorResponse(res, "URL file harus disediakan.", null, 400);
    }

    // Extract file path from URL
    const filePath = extractFilePathFromUrl(fileUrl);
    
    if (!filePath) {
      return errorResponse(res, "URL file tidak valid.", null, 400);
    }

    // Cek apakah file masih digunakan
    const [usedInKegiatan, usedInDonasi] = await Promise.all([
      prisma.kegiatanDesa.findFirst({
        where: {
          OR: [
            { foto_url: fileUrl },
            { qris_url: fileUrl },
            { galeri: { contains: fileUrl } }
          ]
        }
      }),
      prisma.donasiDesa.findFirst({
        where: { bukti_transfer_url: fileUrl }
      })
    ]);

    if (usedInKegiatan || usedInDonasi) {
      return errorResponse(res, "File tidak dapat dihapus karena masih digunakan.", null, 400);
    }

    // Delete from Supabase
    const result = await deleteFile(filePath, 'bantu-desa');

    if (!result.success) {
      return errorResponse(res, "Gagal menghapus file dari storage.", result.error, 500);
    }

    return successResponse(res, "File berhasil dihapus.", null);

  } catch (error) {
    console.error("❌ Delete File Error:", error);
    return errorResponse(res, "Gagal menghapus file.", error.message, 500);
  }
};

/**
 * Get file info (optional utility function)
 */
export const getFileInfo = async (req, res) => {
  try {
    const { fileUrl } = req.query;
    
    if (!fileUrl) {
      return errorResponse(res, "URL file harus disediakan.", null, 400);
    }

    const filePath = extractFilePathFromUrl(fileUrl);
    
    if (!filePath) {
      return errorResponse(res, "URL file tidak valid.", null, 400);
    }

    // You can add more file info logic here if needed
    return successResponse(res, "Info file berhasil diambil.", {
      url: fileUrl,
      path: filePath
    });

  } catch (error) {
    console.error("❌ Get File Info Error:", error);
    return errorResponse(res, "Gagal mengambil info file.", error.message, 500);
  }
};