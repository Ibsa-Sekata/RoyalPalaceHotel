import { prisma } from "../app.js";
import { ApiError } from "../utils/apiError.js";

export const roomsService = {
    async list({ search, type, status, minPrice, maxPrice, guests, page = 1, limit = 10, sort }) {
        const where = {};
        if (search) where.OR = [
            { name: { contains: search, mode: "insensitive" } },
            { roomNumber: { contains: search, mode: "insensitive" } },
            { description: { contains: search, mode: "insensitive" } },
        ];
        if (type) where.type = type;
        if (status) where.status = status;
        if (minPrice || maxPrice) where.pricePerNight = {
            ...(minPrice ? { gte: Number(minPrice) } : {}),
            ...(maxPrice ? { lte: Number(maxPrice) } : {}),
        };
        if (guests) where.maxGuests = { gte: Number(guests) };

        const orderBy = sort === "price_asc" ? { pricePerNight: "asc" }
            : sort === "price_desc" ? { pricePerNight: "desc" }
                : sort === "name" ? { name: "asc" }
                    : { createdAt: "desc" };

        const skip = (Number(page) - 1) * Number(limit);
        const [items, total] = await Promise.all([
            prisma.room.findMany({ where, orderBy, skip, take: Number(limit) }),
            prisma.room.count({ where }),
        ]);

        return {
            items,
            meta: {
                page: Number(page),
                limit: Number(limit),
                total,
                totalPages: Math.ceil(total / Number(limit)),
            },
        };
    },

    async getById(id) {
        const room = await prisma.room.findUnique({ where: { id: Number(id) } });
        if (!room) throw ApiError.notFound("Room not found");
        return room;
    },

    async create(data) {
        return prisma.room.create({ data });
    },

    async update(id, data) {
        await this.getById(id);
        return prisma.room.update({ where: { id: Number(id) }, data });
    },

    async remove(id) {
        await this.getById(id);
        await prisma.room.delete({ where: { id: Number(id) } });
    },

    async availability({ checkIn, checkOut, guests }) {
        if (!checkIn || !checkOut)
            throw ApiError.badRequest("checkIn and checkOut are required");

        const ci = new Date(checkIn);
        const co = new Date(checkOut);
        if (isNaN(ci) || isNaN(co)) throw ApiError.badRequest("Invalid dates");
        if (co <= ci) throw ApiError.badRequest("checkOut must be after checkIn");
        if (guests !== undefined && (!Number.isInteger(Number(guests)) || Number(guests) < 1))
            throw ApiError.badRequest("guests must be a positive number");

        const conflicting = await prisma.booking.findMany({
            where: {
                status: { in: ["PENDING", "CONFIRMED", "CHECKED_IN"] },
                checkIn: { lt: co },
                checkOut: { gt: ci },
            },
            select: { roomId: true },
        });
        const blocked = conflicting.map((b) => b.roomId);

        return prisma.room.findMany({
            where: {
                status: { notIn: ["MAINTENANCE", "OUT_OF_SERVICE"] },
                ...(guests ? { maxGuests: { gte: Number(guests) } } : {}),
                id: { notIn: blocked },
            },
            orderBy: { pricePerNight: "asc" },
        });
    },
};