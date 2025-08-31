import { uploadImage, uploadMultipleImages } from "../utils/bantuDesa.js";
import path from "path";


export const uploadSingleImage = [
  uploadImage.single("image"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "Tidak ada file yang diupload." });
      }

      const fileUrl = `/uploads/bantu-desa/${req.file.filename}`;

      res.json({
        message: "Gambar berhasil diupload.",
        url: fileUrl,
        filename: req.file.filename,
        size: req.file.size
      });
    } catch (error) {
      console.error("❌ Upload Single Image Error:", error);
      res.status(500).json({ message: "Gagal mengupload gambar." });
    }
  }
];


export const uploadMultipleImage = [
  uploadMultipleImages.array("images", 10),
  async (req, res) => {
    try {
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ message: "Tidak ada file yang diupload." });
      }

      const uploadedFiles = req.files.map(file => ({
        url: `/uploads/bantu-desa/${file.filename}`,
        filename: file.filename,
        size: file.size
      }));

      res.json({
        message: `${uploadedFiles.length} gambar berhasil diupload.`,
        files: uploadedFiles
      });
    } catch (error) {
      console.error("❌ Upload Multiple Images Error:", error);
      res.status(500).json({ message: "Gagal mengupload gambar." });
    }
  }
];


export const uploadBuktiTransfer = [
  uploadImage.single("bukti"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "Bukti transfer wajib diupload." });
      }

      const fileUrl = `/uploads/bantu-desa/${req.file.filename}`;

      res.json({
        message: "Bukti transfer berhasil diupload.",
        url: fileUrl,
        filename: req.file.filename
      });
    } catch (error) {
      console.error("❌ Upload Bukti Transfer Error:", error);
      res.status(500).json({ message: "Gagal mengupload bukti transfer." });
    }
  }
];


export const deleteUploadedFile = async (req, res) => {
  try {
    if (req.user.role !== "ADMIN") {
      return res.status(403).json({ message: "Hanya admin yang dapat menghapus file." });
    }

    const { filename } = req.params;
    const filePath = path.join("uploads/bantu-desa", filename);


    const prisma = (await import("../../prisma/index.js")).default;

    const fileUrl = `/uploads/bantu-desa/${filename}`;


    const usedInKegiatan = await prisma.kegiatanDesa.findFirst({
      where: {
        OR: [
          { foto_url: fileUrl },
          { qris_url: fileUrl },
          { galeri: { contains: fileUrl } }
        ]
      }
    });


    const usedInDonasi = await prisma.donasiDesa.findFirst({
      where: { bukti_transfer_url: fileUrl }
    });

    if (usedInKegiatan || usedInDonasi) {
      return res.status(400).json({
        message: "File tidak dapat dihapus karena masih digunakan."
      });
    }


    const fs = (await import("fs")).default;
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    res.json({ message: "File berhasil dihapus." });
  } catch (error) {
    console.error("❌ Delete File Error:", error);
    res.status(500).json({ message: "Gagal menghapus file." });
  }
};