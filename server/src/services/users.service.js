import bcrypt from "bcryptjs";
import { prisma } from "../app.js";
import { ApiError } from "../utils/apiError.js";

const safe = (u) => ({
  id: u.id, fullName: u.fullName, email: u.email, phone: u.phone,
  role: u.role, status: u.status, lastLoginAt: u.lastLoginAt, createdAt: u.createdAt,
});

export const usersService = {
  async list({ role, status, search, page = 1, limit = 50 }) {
    const where = {};
    if (role) where.role = role;
    if (status) where.status = status;
    if (search) where.OR = [
      { fullName: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
    ];
    const skip = (Number(page) - 1) * Number(limit);
    const [items, total] = await Promise.all([
      prisma.user.findMany({ where, orderBy: { createdAt: "desc" }, skip, take: Number(limit) }),
      prisma.user.count({ where }),
    ]);
    return { items: items.map(safe), meta: { page: Number(page), limit: Number(limit), total } };
  },
  async getById(id) {
    const u = await prisma.user.findUnique({ where: { id: Number(id) } });
    if (!u) throw ApiError.notFound("User not found");
    return safe(u);
  },
  async create({ fullName, email, password, role, status, phone }) {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) throw ApiError.conflict("Email already registered");
    const passwordHash = await bcrypt.hash(password, 10);
    const u = await prisma.user.create({
      data: { fullName, email, phone: phone || null, passwordHash, role: role || "ADMIN", status: status || "ACTIVE" },
    });
    return safe(u);
  },
  async update(id, data) {
    await this.getById(id);
    const patch = {};
    if (data.fullName) patch.fullName = data.fullName;
    if (data.phone !== undefined) patch.phone = data.phone;
    if (data.role) patch.role = data.role;
    if (data.status) patch.status = data.status;
    if (data.password) patch.passwordHash = await bcrypt.hash(data.password, 10);
    const u = await prisma.user.update({ where: { id: Number(id) }, data: patch });
    return safe(u);
  },
  async setStatus(id, status) {
    await this.getById(id);
    const u = await prisma.user.update({ where: { id: Number(id) }, data: { status } });
    return safe(u);
  },
  async remove(id) {
    await this.getById(id);
    await prisma.user.delete({ where: { id: Number(id) } });
  },
  async countAdmins() {
    return prisma.user.count({ where: { role: "ADMIN", status: { not: "SUSPENDED" } } });
  },

  async createAdmin({ fullName, email, password, phone }) {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) throw ApiError.conflict("Email already registered");

    const adminCount = await this.countAdmins();
    if (adminCount >= 2) {
      throw ApiError.forbidden("Maximum of 2 admin accounts allowed");
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const u = await prisma.user.create({
      data: {
        fullName,
        email,
        phone: phone || null,
        passwordHash,
        role: "ADMIN",
        status: "ACTIVE",
      },
    });
    return safe(u);
  },

  async bootstrapFirstAdmin({ fullName, email, password, phone }) {
    const count = await this.countAdmins();
    if (count > 0) {
      throw ApiError.forbidden("An admin already exists. Please log in.");
    }
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) throw ApiError.conflict("Email already registered");

    const passwordHash = await bcrypt.hash(password, 10);
    const u = await prisma.user.create({
      data: {
        fullName,
        email,
        phone: phone || null,
        passwordHash,
        role: "ADMIN",
        status: "ACTIVE",
      },
    });
    return safe(u);
  },
};