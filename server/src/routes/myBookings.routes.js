import { Router } from "express";
import { myBookingsController } from "../controllers/myBookings.controller.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = Router();
router.use(authenticate);
router.get("/", asyncHandler(myBookingsController.list));
router.get("/:id", asyncHandler(myBookingsController.getById));
router.post("/:id/cancel", asyncHandler(myBookingsController.cancel));

export default router;