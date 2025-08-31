// backend/src/routes/bantuDesa.js (DIPERBAIKI)
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
import { verifyToken, optionalAuth, requireRole } from "../middlewares/auth.js";
import { validate, schemas } from "../middlewares/validate.js";

const router = express.Router();

// ====== ROUTES KEGIATAN DESA ======
// Public routes - bisa diakses tanpa login
router.get("/kegiatan", getKegiatanAktif);
router.get("/kegiatan/:id", getDetailKegiatan);

// Protected routes - butuh login dan role ADMIN
router.post("/kegiatan", 
  verifyToken, 
  requireRole('ADMIN'), 
  validate(schemas.createKegiatan), 
  createKegiatan
);

router.put("/kegiatan/:id", 
  verifyToken, 
  requireRole('ADMIN'), 
  validate(schemas.updateKegiatan), 
  updateKegiatan
);

router.delete("/kegiatan/:id", 
  verifyToken, 
  requireRole('ADMIN'), 
  deleteKegiatan
);

// ====== ROUTES DONASI ======
// Buat donasi - bisa dengan atau tanpa login
router.post("/kegiatan/:id/donasi", 
  optionalAuth, 
  validate(schemas.createDonasi), 
  createDonasi
);

// Kelola donasi - butuh role ADMIN
router.get("/donasi/pending", 
  verifyToken, 
  requireRole('ADMIN'), 
  getDonasiPending
);

router.put("/donasi/:id/verify", 
  verifyToken, 
  requireRole('ADMIN'), 
  validate(schemas.verifyDonasi), 
  verifyDonasi
);

// History donasi user
router.get("/donasi/history", 
  verifyToken, 
  getDonasiHistory
);

export default router;
