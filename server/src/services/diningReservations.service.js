import { prisma } from "../app.js";
import { ApiError } from "../utils/apiError.js";

const TABLES = ["T1", "T2", "T3", "T4", "T5", "T6", "T7", "T8"];

async function confirmationNumber() {
  const suffix = Date.now().toString(36).toUpperCase();
  return `DR-${suffix}`;
}

export const diningReservationsService = {
  async create({ userId, restaurantName, date, time, guests, tableNumber, specialRequests }) {
    const user = await prisma.user.findUnique({ where: { id: Number(userId) } });
    if (!user) throw ApiError.unauthorized("User not found");
    if (!restaurantName || !date || !time) throw ApiError.badRequest("Restaurant, date, and time are required");

    const start = new Date(`${date}T${time}:00`);
    if (Number.isNaN(start.getTime())) throw ApiError.badRequest("Invalid reservation date or time");
    if (start <= new Date()) throw ApiError.badRequest("Choose a future reservation time");
    const end = new Date(start.getTime() + 2 * 60 * 60 * 1000);
    const guestCount = Number(guests);
    if (!Number.isInteger(guestCount) || guestCount < 1 || guestCount > 12) {
      throw ApiError.badRequest("Guests must be between 1 and 12");
    }
    if (tableNumber && !TABLES.includes(tableNumber)) throw ApiError.badRequest("Invalid table selection");

    const where = {
      restaurantName,
      status: { in: ["PENDING", "CONFIRMED"] },
      reservationStart: { lt: end },
      reservationEnd: { gt: start },
    };
    if (tableNumber) where.tableNumber = tableNumber;
    const conflict = await prisma.diningReservation.findFirst({ where });
    if (conflict) throw ApiError.conflict(tableNumber ? "That table is not available at this time" : "No tables are available at this time");

    let guest = await prisma.guest.findFirst({ where: { userId: user.id } });
    if (!guest) guest = await prisma.guest.findFirst({ where: { email: user.email } });
    if (!guest) {
      guest = await prisma.guest.create({
        data: { fullName: user.fullName, email: user.email, phone: user.phone || null, userId: user.id },
      });
    } else if (!guest.userId) {
      await prisma.guest.update({ where: { id: guest.id }, data: { userId: user.id } });
    }

    const reservation = await prisma.diningReservation.create({
      data: {
        confirmationNumber: await confirmationNumber(),
        guestId: guest.id,
        restaurantName,
        reservationStart: start,
        reservationEnd: end,
        guests: guestCount,
        tableNumber: tableNumber || null,
        specialRequests: specialRequests || null,
        status: "CONFIRMED",
      },
      include: { guest: true },
    });
    return reservation;
  },

  async listForGuest(userId) {
    const guest = await prisma.guest.findFirst({ where: { userId: Number(userId) } });
    if (!guest) return [];
    return prisma.diningReservation.findMany({ where: { guestId: guest.id }, orderBy: { reservationStart: "desc" } });
  },
};

export { TABLES };
