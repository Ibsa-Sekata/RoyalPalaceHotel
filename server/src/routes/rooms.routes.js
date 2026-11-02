import { Router } from "express";
import { roomsController } from "../controllers/rooms.controller.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { requireRole } from "../middleware/role.middleware.js";

const router = Router();

// Public
router.get("/", asyncHandler(roomsController.list));
router.get("/availability", asyncHandler(roomsController.availability));
router.get("/:id", asyncHandler(roomsController.getById));

// Admin only
router.post("/", authenticate, requireRole("ADMIN"), asyncHandler(roomsController.create));
router.patch("/:id", authenticate, requireRole("ADMIN"), asyncHandler(roomsController.update));
router.delete("/:id", authenticate, requireRole("ADMIN"), asyncHandler(roomsController.remove));

export default router;