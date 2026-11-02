import { prisma } from "../app.js";
import { ApiError } from "../utils/apiError.js";

export const housekeepingService = {
    async list({ status, roomId, page = 1, limit = 50 }) {
        const where = {};
        if (status) where.status = status;
        if (roomId) where.roomId = Number(roomId);
        const skip = (Number(page) - 1) * Number(limit);
        const [items, total] = await Promise.all([
            prisma.housekeepingTask.findMany({
                where,
                include: { room: true },
                orderBy: { createdAt: "desc" },
                skip,
                take: Number(limit),
            }),
            prisma.housekeepingTask.count({ where }),
        ]);
        return { items, meta: { page: Number(page), limit: Number(limit), total } };
    },

    async getById(id) {
        const t = await prisma.housekeepingTask.findUnique({
            where: { id: Number(id) }, include: { room: true },
        });
        if (!t) throw ApiError.notFound("Task not found");
        return t;
    },

    async create(data) {
        const room = await prisma.room.findUnique({ where: { id: Number(data.roomId) } });
        if (!room) throw ApiError.notFound("Room not found");
        return prisma.housekeepingTask.create({ data, include: { room: true } });
    },

    async update(id, data) {
        await this.getById(id);
        return prisma.housekeepingTask.update({ where: { id: Number(id) }, data });
    },

    async remove(id) {
        await this.getById(id);
        await prisma.housekeepingTask.delete({ where: { id: Number(id) } });
    },

    async start(id) {
        return prisma.housekeepingTask.update({
            where: { id: Number(id) },
            data: { status: "IN_PROGRESS", startedAt: new Date() },
        });
    },

    async complete(id) {
        const task = await this.getById(id);
        const updated = await prisma.housekeepingTask.update({
            where: { id: Number(id) },
            data: { status: "COMPLETED", completedAt: new Date() },
        });
        // Mark room AVAILABLE if it was CLEANING
        if (task.room.status === "CLEANING") {
            await prisma.room.update({ where: { id: task.roomId }, data: { status: "AVAILABLE" } });
        }
        return updated;
    },
};