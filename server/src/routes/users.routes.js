import { Router } from "express";
import { usersController } from "../controllers/users.controller.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { requireRole } from "../middleware/role.middleware.js";

const router = Router();
router.use(authenticate, requireRole("ADMIN"));

router.get("/", asyncHandler(usersController.list));
router.get("/:id", asyncHandler(usersController.getById));
router.post("/", asyncHandler(usersController.create));
router.patch("/:id", asyncHandler(usersController.update));
router.patch("/:id/status", asyncHandler(usersController.setStatus));
router.delete("/:id", asyncHandler(usersController.remove));

export default router;