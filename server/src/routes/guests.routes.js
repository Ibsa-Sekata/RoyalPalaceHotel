import { Router } from "express";
import { guestsController } from "../controllers/guests.controller.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { requireRole } from "../middleware/role.middleware.js";

const router = Router();
router.use(authenticate, requireRole("ADMIN"));

router.get("/", asyncHandler(guestsController.list));
router.get("/:id", asyncHandler(guestsController.getById));
router.post("/", asyncHandler(guestsController.create));
router.patch("/:id", asyncHandler(guestsController.update));
router.delete("/:id", requireRole("ADMIN"), asyncHandler(guestsController.remove));

export default router;