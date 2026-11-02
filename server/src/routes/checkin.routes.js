import { Router } from "express";
import { checkinController } from "../controllers/checkin.controller.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { requireRole } from "../middleware/role.middleware.js";

const router = Router();
router.use(authenticate, requireRole("ADMIN"));
router.get("/today", asyncHandler(checkinController.today));

export default router;