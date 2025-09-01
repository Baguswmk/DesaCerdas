// backend/src/routes/bantuDesa.js - Express 5 Compatible
import express from "express";
import { 
  getKegiatanAktif, 
  getDetailKegiatan, 
  createKegiatan, 
  updateKegiatan, 
  deleteKegiatan,
  createDonasi, 
  getDonasiPending, 
  verifyDonasi, 
  getDonasiHistory 
} from "../controllers/bantuDesa.js";
import { authenticateToken, optionalAuth } from "../middlewares/auth.js";

const router = express.Router();

// Public routes - tidak perlu autentikasi
router.get("/kegiatan-desa", getKegiatanAktif);
router.get("/kegiatan-desa/:id", getDetailKegiatan);

// Protected routes - perlu autentikasi  
router.post("/kegiatan-desa", authenticateToken, createKegiatan);
router.put("/kegiatan-desa/:id", authenticateToken, updateKegiatan);
router.delete("/kegiatan-desa/:id", authenticateToken, deleteKegiatan);

// Donasi routes - mixed auth
router.post("/kegiatan-desa/:id/donasi", optionalAuth, createDonasi);

// Admin donasi routes
router.get("/donasi/pending", authenticateToken, getDonasiPending);
router.put("/donasi/:id/verify", authenticateToken, verifyDonasi);
router.get("/donasi/history", authenticateToken, getDonasiHistory);

export default router;