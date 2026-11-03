import { Router } from "express";
import { diningReservationsController } from "../controllers/diningReservations.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { requireRole } from "../middleware/role.middleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();
router.use(authenticate, requireRole("GUEST"));
router.post("/", asyncHandler(diningReservationsController.create));
router.get("/mine", asyncHandler(diningReservationsController.mine));

export default router;
