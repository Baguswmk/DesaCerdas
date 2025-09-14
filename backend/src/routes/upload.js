
import express from "express";
import { 
  uploadSingleImage, 
  uploadMultipleImage, 
  uploadBuktiTransfer,
  deleteUploadedFile,
  getFileInfo
} from "../controllers/upload.js";
import { authenticateToken, optionalAuth } from "../middlewares/auth.js";

const router = express.Router();


router.post("/image", authenticateToken, ...uploadSingleImage);
router.post("/images", authenticateToken, ...uploadMultipleImage);
router.post("/bukti-transfer", optionalAuth, ...uploadBuktiTransfer);
router.delete("/file", authenticateToken, deleteUploadedFile);
router.get("/file-info", authenticateToken, getFileInfo);


router.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "Upload service is running",
    storage: "Supabase Storage",
    timestamp: new Date().toISOString()
  });
});

export default router;