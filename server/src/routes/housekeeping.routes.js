import { Router } from "express";
import { housekeepingController } from "../controllers/housekeeping.controller.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { requireRole } from "../middleware/role.middleware.js";

const router = Router();
router.use(authenticate, requireRole("ADMIN"));

router.get("/tasks", asyncHandler(housekeepingController.list));
router.get("/tasks/:id", asyncHandler(housekeepingController.getById));
router.post("/tasks", asyncHandler(housekeepingController.create));
router.patch("/tasks/:id", asyncHandler(housekeepingController.update));
router.post("/tasks/:id/start", asyncHandler(housekeepingController.start));
router.post("/tasks/:id/complete", asyncHandler(housekeepingController.complete));
router.delete("/tasks/:id", asyncHandler(housekeepingController.remove));

export default router;