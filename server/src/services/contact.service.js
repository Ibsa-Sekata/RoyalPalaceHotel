import { prisma } from "../app.js";
import { ApiError } from "../utils/apiError.js";
export const contactService = {
  async create({ fullName, email, subject, message }) {
    return prisma.contactMessage.create({ data: { fullName, email, subject, message } });
  },
  async list({ status, page = 1, limit = 50 }) {
    const where = {}; if (status) where.status = status;
    const skip = (Number(page) - 1) * Number(limit);
    const [items, total] = await Promise.all([
      prisma.contactMessage.findMany({ where, orderBy: { createdAt: "desc" }, skip, take: Number(limit) }),
      prisma.contactMessage.count({ where }),
    ]);
    return { items, meta: { page: Number(page), limit: Number(limit), total } };
  },
  async updateStatus(id, status) {
    const m = await prisma.contactMessage.findUnique({ where: { id: Number(id) } });
    if (!m) throw ApiError.notFound("Message not found");
    return prisma.contactMessage.update({ where: { id: Number(id) }, data: { status, repliedAt: status === "RESOLVED" ? new Date() : m.repliedAt } });
  },
  async reply(id, reply) {
    const text = String(reply || "").trim();
    if (!text) throw ApiError.badRequest("Reply is required");
    const m = await prisma.contactMessage.findUnique({ where: { id: Number(id) } });
    if (!m) throw ApiError.notFound("Message not found");
    return prisma.contactMessage.update({
      where: { id: Number(id) },
      data: { reply: text, status: "RESOLVED", repliedAt: new Date() },
    });
  },
};
