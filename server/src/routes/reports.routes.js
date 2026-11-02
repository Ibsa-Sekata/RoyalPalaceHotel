import { Router } from "express";
import { reportsController } from "../controllers/reports.controller.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { requireRole } from "../middleware/role.middleware.js";
const router = Router();
router.use(authenticate, requireRole("ADMIN"));
router.get("/dashboard", asyncHandler(reportsController.dashboard));
export default router;
