import { prisma } from "../app.js";
import { ApiError } from "../utils/apiError.js";
import { generateBookingNumber, calculateTotals } from "../utils/bookingHelpers.js";

export const bookingsService = {
  async list({ status, search, page = 1, limit = 20 }) {
    const where = {};
    if (status) where.status = status;
    if (search) where.OR = [
      { bookingNumber: { contains: search, mode: "insensitive" } },
      { guest: { fullName: { contains: search, mode: "insensitive" } } },
    ];
    const skip = (Number(page) - 1) * Number(limit);
    const [items, total] = await Promise.all([
      prisma.booking.findMany({ where, include: { guest: true, room: true }, orderBy: { createdAt: "desc" }, skip, take: Number(limit) }),
      prisma.booking.count({ where }),
    ]);
    return { items, meta: { page: Number(page), limit: Number(limit), total } };
  },

  async getById(id) {
    const b = await prisma.booking.findUnique({ where: { id: Number(id) }, include: { guest: true, room: true, payments: true } });
    if (!b) throw ApiError.notFound("Booking not found");
    return b;
  },

  async create({ checkIn, checkOut, roomId, guests, fullName, email, phone, specialRequests, userId: userIdParam }) {
    const ci = new Date(checkIn); const co = new Date(checkOut);
    if (isNaN(ci) || isNaN(co)) throw ApiError.badRequest("Invalid dates");
    if (co <= ci) throw ApiError.badRequest("Check-out must be after check-in");

    const room = await prisma.room.findUnique({ where: { id: Number(roomId) } });
    if (!room) throw ApiError.notFound("Room not found");
    if (guests > room.maxGuests) throw ApiError.badRequest(`This room holds max ${room.maxGuests} guests`);
    if (room.status === "OUT_OF_SERVICE") throw ApiError.conflict("Room is out of service");

    const overlap = await prisma.booking.findFirst({
      where: { roomId: Number(roomId), status: { in: ["PENDING","CONFIRMED","CHECKED_IN"] }, checkIn: { lt: co }, checkOut: { gt: ci } },
    });
    if (overlap) throw ApiError.conflict("Room is not available for these dates");

    let guest = email ? await prisma.guest.findFirst({ where: { email } }) : null;
    if (!guest) {
      guest = await prisma.guest.create({
        data: { fullName: fullName || "Walk-in Guest", email: email || null, phone: phone || null },
      });
    }

    const userId = userIdParam ? Number(userIdParam) : null;
    if (userId && guest && !guest.userId) {
      await prisma.guest.update({ where: { id: guest.id }, data: { userId } }).catch(() => {});
    }

    const { subtotal, tax, totalAmount } = calculateTotals(room.pricePerNight, ci, co);
    const bookingNumber = await generateBookingNumber();

    return prisma.booking.create({
      data: { bookingNumber, guestId: guest.id, roomId: room.id, userId, checkIn: ci, checkOut: co, guests: Number(guests), specialRequests, status: "PENDING", subtotal, tax, totalAmount },
      include: { guest: true, room: true },
    });
  },

  async updateStatus(id, status) {
    await this.getById(id);
    return prisma.booking.update({ where: { id: Number(id) }, data: { status }, include: { guest: true, room: true } });
  },

  async checkIn(id) {
    const b = await this.getById(id);
    if (b.status !== "CONFIRMED") throw ApiError.badRequest("Only confirmed bookings can be checked in");
    const u = await prisma.booking.update({ where: { id: Number(id) }, data: { status: "CHECKED_IN" } });
    await prisma.room.update({ where: { id: b.roomId }, data: { status: "BOOKED" } });
    return u;
  },

  async checkOut(id) {
    const b = await this.getById(id);
    if (b.status !== "CHECKED_IN") throw ApiError.badRequest("Only checked-in bookings can be checked out");
    const u = await prisma.booking.update({ where: { id: Number(id) }, data: { status: "CHECKED_OUT" } });
    await prisma.room.update({ where: { id: b.roomId }, data: { status: "CLEANING" } });
    return u;
  },

  async cancel(id) {
    const b = await this.getById(id);
    if (["CHECKED_OUT", "CANCELLED"].includes(b.status)) throw ApiError.badRequest("Cannot cancel this booking");
    return prisma.booking.update({ where: { id: Number(id) }, data: { status: "CANCELLED", cancelledAt: new Date() } });
  },

  async remove(id) {
    await this.getById(id);
    await prisma.booking.delete({ where: { id: Number(id) } });
  },
};