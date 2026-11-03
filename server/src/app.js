import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { PrismaClient } from "@prisma/client";
import { env } from "./config/env.js";
import authRoutes from "./routes/auth.routes.js";
import roomsRoutes from "./routes/rooms.routes.js";
import guestsRoutes from "./routes/guests.routes.js";
import bookingsRoutes from "./routes/bookings.routes.js";
import myBookingsRoutes from "./routes/myBookings.routes.js";
import paymentsRoutes from "./routes/payments.routes.js";
import housekeepingRoutes from "./routes/housekeeping.routes.js";
import checkinRoutes from "./routes/checkin.routes.js";
import contactRoutes from "./routes/contact.routes.js";
import settingsRoutes from "./routes/settings.routes.js";
import reportsRoutes from "./routes/reports.routes.js";
import usersRoutes from "./routes/users.routes.js";
import mediaRoutes from "./routes/media.routes.js";
import diningReservationsRoutes from "./routes/diningReservations.routes.js";
import { errorHandler } from "./middleware/error.middleware.js";
import { notFound } from "./middleware/notFound.middleware.js";

export const prisma = new PrismaClient();

const app = express();
app.use(helmet());
app.use(cors({ origin: env.CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(morgan("dev"));

app.get("/health", async (_req, res) => {
  const rows = await prisma.$queryRaw`SELECT NOW() as now`;
  res.json({ success: true, data: { status: "ok", time: rows[0].now } });
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/rooms", roomsRoutes);
app.use("/api/v1/guests", guestsRoutes);
app.use("/api/v1/bookings", bookingsRoutes);
app.use("/api/v1/my-bookings", myBookingsRoutes);
app.use("/api/v1/payments", paymentsRoutes);
app.use("/api/v1/housekeeping", housekeepingRoutes);
app.use("/api/v1/checkin", checkinRoutes);
app.use("/api/v1/contact", contactRoutes);
app.use("/api/v1/settings", settingsRoutes);
app.use("/api/v1/reports", reportsRoutes);
app.use("/api/v1/users", usersRoutes);
app.use("/api/v1/media", mediaRoutes);
app.use("/api/v1/dining-reservations", diningReservationsRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;