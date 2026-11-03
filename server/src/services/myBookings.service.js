import { prisma } from "../app.js";
import { ApiError } from "../utils/apiError.js";

export const myBookingsService = {
  async list({ userId, status, page = 1, limit = 20 }) {
    const user = await prisma.user.findUnique({
      where: { id: Number(userId) },
      select: { id: true, email: true },
    });
    const where = {
      OR: [
        { userId: Number(userId) },
        { guest: { userId: Number(userId) } },
        ...(user?.email ? [{ guest: { email: user.email } }] : []),
      ],
    };
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
    const user = await prisma.user.findUnique({
      where: { id: Number(userId) },
      select: { id: true, email: true },
    });
    const b = await prisma.booking.findFirst({
      where: {
        id: Number(id),
        OR: [
          { userId: Number(userId) },
          { guest: { userId: Number(userId) } },
          ...(user?.email ? [{ guest: { email: user.email } }] : []),
        ],
      },
      include: { room: true, payments: true },
    });
    if (!b) throw ApiError.notFound("Booking not found");
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

  async remove(id, userId) {
    const booking = await this.getById(id, userId);
    await prisma.$transaction(async (tx) => {
      await tx.payment.deleteMany({ where: { bookingId: booking.id } });
      await tx.booking.delete({ where: { id: booking.id } });
      if (booking.status === "CHECKED_IN") {
        await tx.room.update({
          where: { id: booking.roomId },
          data: { status: "AVAILABLE" },
        });
      }
    });
  },
};