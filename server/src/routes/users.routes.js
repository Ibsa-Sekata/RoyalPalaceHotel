import { Router } from "express";
import { usersController } from "../controllers/users.controller.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { requireRole } from "../middleware/role.middleware.js";

const router = Router();

// PUBLIC: check admin count + bootstrap first admin (only if 0 admins exist)
router.get("/count", asyncHandler(usersController.count));
router.post("/bootstrap", asyncHandler(usersController.bootstrap));

// ADMIN-only routes
router.use(authenticate, requireRole("ADMIN"));
router.get("/", asyncHandler(usersController.list));
router.get("/:id", asyncHandler(usersController.getById));
router.post("/", asyncHandler(usersController.create));
router.patch("/:id", asyncHandler(usersController.update));
router.patch("/:id/status", asyncHandler(usersController.setStatus));
router.delete("/:id", asyncHandler(usersController.remove));

export default router;