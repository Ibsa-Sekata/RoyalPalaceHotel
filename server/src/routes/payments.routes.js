import { Router } from "express";
import { paymentsController } from "../controllers/payments.controller.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { requireRole } from "../middleware/role.middleware.js";

const router = Router();
router.use(authenticate, requireRole("ADMIN"));

router.get("/", asyncHandler(paymentsController.list));
router.get("/:id", asyncHandler(paymentsController.getById));
router.post("/", asyncHandler(paymentsController.create));
router.patch("/:id", asyncHandler(paymentsController.update));
router.post("/:id/approve", asyncHandler(paymentsController.approve));
router.post("/:id/reject", asyncHandler(paymentsController.reject));
router.delete("/:id", asyncHandler(paymentsController.remove));
router.get("/:id/invoice", asyncHandler(paymentsController.invoice));

export default router;