import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../app.js";
import { env } from "../config/env.js";
import { ApiError } from "../utils/apiError.js";

const signAccess = (user) =>
  jwt.sign(
    { id: user.id, role: user.role, email: user.email },
    env.JWT_ACCESS_SECRET,
    { expiresIn: env.JWT_ACCESS_EXPIRES_IN },
  );

const signRefresh = (user) =>
  jwt.sign({ id: user.id }, env.JWT_REFRESH_SECRET, {
    expiresIn: env.JWT_REFRESH_EXPIRES_IN,
  });

const safeUser = (u) => ({
  id: u.id,
  fullName: u.fullName,
  email: u.email,
  phone: u.phone,
  role: u.role,
  status: u.status,
});

export const authService = {
  async register({ fullName, email, password, phone }) {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) throw ApiError.conflict("Email already registered");

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        fullName,
        email,
        phone: phone || null,
        passwordHash,
        role: "GUEST",
        status: "ACTIVE",
      },
    });

    await prisma.guest.create({
      data: {
        fullName,
        email,
        phone: phone || null,
        userId: user.id,
      },
    }).catch(() => {});

    return safeUser(user);
  },

  async login({ email, password }) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || user.status !== "ACTIVE")
      throw ApiError.unauthorized("Invalid email or password");

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) throw ApiError.unauthorized("Invalid email or password");

    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    return {
      user: safeUser(user),
      accessToken: signAccess(user),
      refreshToken: signRefresh(user),
    };
  },

  async me(id) {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) throw ApiError.notFound("User not found");
    return safeUser(user);
  },

  async updateProfile(id, { fullName, phone }) {
    const patch = {};
    if (fullName) patch.fullName = fullName;
    if (phone !== undefined) patch.phone = phone;
    const u = await prisma.user.update({ where: { id: Number(id) }, data: patch });
    return safeUser(u);
  },
};