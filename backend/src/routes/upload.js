import express from "express";
import { 
  uploadSingleImage, 
  uploadMultipleImage, 
  uploadBuktiTransfer,
  deleteUploadedFile 
} from "../controllers/upload.js";
import { authenticateToken, optionalAuth } from "../middleware/auth.js";

const router = express.Router();

router.post("/image", authenticateToken, ...uploadSingleImage);
router.post("/images", authenticateToken, ...uploadMultipleImage);
router.post("/bukti-transfer", ...uploadBuktiTransfer);
router.delete("/:filename", authenticateToken, deleteUploadedFile);

export default router;