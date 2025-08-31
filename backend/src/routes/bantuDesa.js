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
import { authenticateToken, optionalAuth } from "../middleware/auth.js";

const router = express.Router();




router.get("/kegiatan-desa", getKegiatanAktif);
router.get("/kegiatan-desa/:id", getDetailKegiatan);
router.post("/kegiatan-desa", authenticateToken, createKegiatan);
router.put("/kegiatan-desa/:id", authenticateToken, updateKegiatan);
router.delete("/kegiatan-desa/:id", authenticateToken, deleteKegiatan);
router.post("/kegiatan-desa/:id/donasi", optionalAuth, createDonasi);


router.get("/donasi/pending", authenticateToken, getDonasiPending);
router.put("/donasi/:id/verify", authenticateToken, verifyDonasi);
router.get("/donasi/history", authenticateToken, getDonasiHistory);

export default router;