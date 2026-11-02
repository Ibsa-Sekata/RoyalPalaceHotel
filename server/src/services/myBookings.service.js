import { prisma } from "../app.js";
import { ApiError } from "../utils/apiError.js";

export const myBookingsService = {
  async list({ userId, status, page = 1, limit = 20 }) {
    const where = { userId: Number(userId) };
    if (status) where.status = status;
    const skip = (Number(page) - 1) * Number(limit);
    const [items, total] = await Promise.all([
      prisma.booking.findMany({
        where,
        include: { room: true, payments: true },
        orderBy: { createdAt: "desc" },
        skip,
        take: Number(limit),
      }),
      prisma.booking.count({ where }),
    ]);
    return { items, meta: { page: Number(page), limit: Number(limit), total } };
  },

  async getById(id, userId) {
    const b = await prisma.booking.findUnique({
      where: { id: Number(id) },
      include: { room: true, payments: true },
    });
    if (!b) throw ApiError.notFound("Booking not found");
    if (Number(b.userId) !== Number(userId))
      throw ApiError.forbidden("You do not own this booking");
    return b;
  },

  async cancel(id, userId) {
    const b = await this.getById(id, userId);
    if (["CHECKED_OUT", "CANCELLED"].includes(b.status))
      throw ApiError.badRequest("Cannot cancel this booking");

    const checkInDate = new Date(b.checkIn);
    checkInDate.setHours(0, 0, 0, 0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (today >= checkInDate)
      throw ApiError.badRequest("Cancellation window has closed (check-in day reached)");

    const updated = await prisma.booking.update({
      where: { id: Number(id) },
      data: { status: "CANCELLED", cancelledAt: new Date() },
    });

    if (b.room.status === "BOOKED")
      await prisma.room.update({ where: { id: b.roomId }, data: { status: "AVAILABLE" } });

    return updated;
  },
};