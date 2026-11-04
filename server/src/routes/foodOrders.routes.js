import { Router } from "express";
import { foodOrdersController } from "../controllers/foodOrders.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { requireRole } from "../middleware/role.middleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();
router.get("/menu", asyncHandler(foodOrdersController.menu));
router.use(authenticate);
router.post("/", requireRole("GUEST"), asyncHandler(foodOrdersController.create));
router.get("/mine", requireRole("GUEST"), asyncHandler(foodOrdersController.mine));
router.get("/kitchen", requireRole("ADMIN"), asyncHandler(foodOrdersController.kitchen));
router.patch("/:id/status", requireRole("ADMIN"), asyncHandler(foodOrdersController.transition));
router.get("/:id", requireRole("GUEST"), asyncHandler(foodOrdersController.get));
router.patch("/:id/items/:itemId", requireRole("GUEST"), asyncHandler(foodOrdersController.updateItem));
router.delete("/:id/items/:itemId", requireRole("GUEST"), asyncHandler(foodOrdersController.removeItem));
export default router;
