import { Router } from "express";
import { myBookingsController } from "../controllers/myBookings.controller.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { authenticate } from "../middleware/auth.middleware.js";
import multer from "multer";
import { paymentsController } from "../controllers/payments.controller.js";

const router = Router();
router.use(authenticate);
router.get("/", asyncHandler(myBookingsController.list));
router.get("/:id", asyncHandler(myBookingsController.getById));
router.post("/:id/cancel", asyncHandler(myBookingsController.cancel));
router.delete("/:id", asyncHandler(myBookingsController.remove));
router.post("/:id/payments", multer({ storage: multer.memoryStorage(), limits: { fileSize: 8 * 1024 * 1024 } }).single("receipt"), asyncHandler((req, res) => paymentsController.submitReceipt(req, res)));

export default router;