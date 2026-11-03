import { prisma } from "../app.js";
import { ApiError } from "../utils/apiError.js";

export const guestsService = {
    async list({ search, guestType, page = 1, limit = 20 }) {
        const where = {};
        if (search) where.OR = [
            { fullName: { contains: search, mode: "insensitive" } },
            { email: { contains: search, mode: "insensitive" } },
            { phone: { contains: search } },
        ];
        if (guestType) where.guestType = guestType;

        const skip = (Number(page) - 1) * Number(limit);
        const [items, total] = await Promise.all([
            prisma.guest.findMany({ where, orderBy: { createdAt: "desc" }, skip, take: Number(limit) }),
            prisma.guest.count({ where }),
        ]);
        return { items, meta: { page: Number(page), limit: Number(limit), total } };
    },
    async getById(id) {
        const g = await prisma.guest.findUnique({
            where: { id: Number(id) },
            include: { bookings: { include: { room: true } } },
        });
        if (!g) throw ApiError.notFound("Guest not found");
        return g;
    },
    async create(data) { return prisma.guest.create({ data }); },
    async update(id, data) {
        await this.getById(id);
        return prisma.guest.update({ where: { id: Number(id) }, data });
    },
    async remove(id) {
        const guest = await this.getById(id);
        await prisma.$transaction(async (tx) => {
            const bookings = await tx.booking.findMany({
                where: { guestId: guest.id },
                select: { id: true },
            });
            const bookingIds = bookings.map((booking) => booking.id);
            if (bookingIds.length) {
                await tx.payment.deleteMany({ where: { bookingId: { in: bookingIds } } });
                await tx.booking.deleteMany({ where: { id: { in: bookingIds } } });
            }
            await tx.guest.delete({ where: { id: guest.id } });
        });
    },
};