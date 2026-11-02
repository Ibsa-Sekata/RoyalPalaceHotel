import { Router } from "express";
import { bookingsController } from "../controllers/bookings.controller.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { requireRole } from "../middleware/role.middleware.js";

const router = Router();

router.post("/", authenticate, asyncHandler(bookingsController.create));

router.use(authenticate, requireRole("ADMIN"));
router.get("/", asyncHandler(bookingsController.list));
router.get("/:id", asyncHandler(bookingsController.getById));
router.post("/:id/confirm", asyncHandler(bookingsController.confirm));
router.post("/:id/cancel", asyncHandler(bookingsController.cancel));
router.post("/:id/check-in", asyncHandler(bookingsController.checkIn));
router.post("/:id/check-out", asyncHandler(bookingsController.checkOut));
router.delete("/:id", asyncHandler(bookingsController.remove));

export default router;