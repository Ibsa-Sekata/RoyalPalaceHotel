import { Router } from "express";
import { authController } from "../controllers/auth.controller.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { validate } from "../middleware/validate.middleware.js";
import { registerSchema, loginSchema } from "../validators/auth.validators.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/register", validate(registerSchema), asyncHandler(authController.register));
router.post("/login", validate(loginSchema), asyncHandler(authController.login));
router.get("/me", authenticate, asyncHandler(authController.me));
router.patch("/profile", authenticate, asyncHandler(authController.updateProfile));
router.post("/change-password", authenticate, asyncHandler(authController.changePassword));

export default router;