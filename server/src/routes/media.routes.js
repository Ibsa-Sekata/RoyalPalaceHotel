import { Router } from "express";
import multer from "multer";
import { authenticate } from "../middleware/auth.middleware.js";
import { requireRole } from "../middleware/role.middleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { mediaController } from "../controllers/media.controller.js";

const router = Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 8 * 1024 * 1024 },
});

router.post(
  "/images",
  authenticate,
  requireRole("ADMIN"),
  upload.single("image"),
  asyncHandler(mediaController.uploadImage),
);

export default router;
