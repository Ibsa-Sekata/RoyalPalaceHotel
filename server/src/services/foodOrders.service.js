import { prisma } from "../app.js";
import { env } from "../config/env.js";
import { ApiError } from "../utils/apiError.js";
import { emitOrderEvent } from "../utils/orderEvents.js";

const TAX_RATE = 0.15;
const ACTIVE_STATUSES = ["PENDING", "CONFIRMED", "PREPARING", "READY"];
const TRANSITIONS = {
  PENDING: ["CONFIRMED", "CANCELLED"],
  CONFIRMED: ["PREPARING", "CANCELLED"],
  PREPARING: ["READY"],
  READY: ["DELIVERED"],
  DELIVERED: [],
  CANCELLED: [],
};

function orderNumber() {
  return `FO-${Date.now().toString(36).toUpperCase()}-${Math.floor(Math.random() * 1000)}`;
}

async function guestForUser(userId) {
  const user = await prisma.user.findUnique({ where: { id: Number(userId) } });
  if (!user) throw ApiError.unauthorized("User not found");
  let guest = await prisma.guest.findFirst({ where: { userId: user.id } });
  if (!guest) guest = await prisma.guest.findFirst({ where: { email: user.email } });
  if (!guest) {
    guest = await prisma.guest.create({
      data: { fullName: user.fullName, email: user.email, phone: user.phone || null, userId: user.id },
    });
  } else if (!guest.userId) {
    guest = await prisma.guest.update({ where: { id: guest.id }, data: { userId: user.id } });
  }
  return { user, guest };
}

function includeOrder() {
  return { items: { orderBy: { createdAt: "asc" }, include: { menuItem: { include: { category: true } } } }, guest: true };
}

async function recalculate(orderId) {
  const items = await prisma.foodOrderItem.findMany({ where: { orderId } });
  if (!items.length) throw ApiError.badRequest("An order must contain at least one item");
  const subtotal = items.reduce((sum, item) => sum + Number(item.unitPrice) * item.quantity, 0);
  const tax = subtotal * TAX_RATE;
  return prisma.foodOrder.update({
    where: { id: orderId },
    data: { subtotal, tax, totalAmount: subtotal + tax },
    include: includeOrder(),
  });
}

export const foodOrdersService = {
  async menu() {
    return prisma.menuCategory.findMany({
      where: { isActive: true },
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
      include: { items: { where: { isAvailable: true }, orderBy: [{ sortOrder: "asc" }, { name: "asc" }] } },
    });
  },

  async create({ userId, items, deliveryLocation, notes, orderType = "ROOM_SERVICE" }) {
    const { user, guest } = await guestForUser(userId);
    if (!Array.isArray(items) || !items.length) throw ApiError.badRequest("At least one menu item is required");
    if (!["DINE_IN", "ROOM_SERVICE", "TAKEAWAY"].includes(orderType)) throw ApiError.badRequest("Invalid order type");
    const requested = new Map();
    for (const input of items) {
      const id = Number(input.menuItemId ?? input.id);
      const quantity = Number(input.quantity);
      if (!Number.isInteger(id) || !Number.isInteger(quantity) || quantity < 1 || quantity > 99) {
        throw ApiError.badRequest("Each item needs a valid menuItemId and quantity");
      }
      requested.set(id, (requested.get(id) || 0) + quantity);
    }
    const menuItems = await prisma.menuItem.findMany({ where: { id: { in: [...requested.keys()] }, isAvailable: true } });
    if (menuItems.length !== requested.size) throw ApiError.badRequest("One or more menu items are unavailable");
    const orderItems = menuItems.map((item) => ({
      menuItemId: item.id, name: item.name, unitPrice: item.price, quantity: requested.get(item.id),
      specialInstructions: items.find((input) => Number(input.menuItemId ?? input.id) === item.id)?.specialInstructions || null,
    }));
    const subtotal = orderItems.reduce((sum, item) => sum + Number(item.unitPrice) * item.quantity, 0);
    const tax = subtotal * TAX_RATE;
    const order = await prisma.foodOrder.create({
      data: {
        orderNumber: orderNumber(), guestId: guest.id, userId: user.id, orderType, subtotal, tax, totalAmount: subtotal + tax,
        currency: env.CURRENCY, deliveryLocation: deliveryLocation || null, notes: notes || null, items: { create: orderItems },
      },
      include: includeOrder(),
    });
    emitOrderEvent("order:created", order);
    return order;
  },

  async listForGuest(userId) {
    const guest = await prisma.guest.findFirst({ where: { userId: Number(userId) } });
    if (!guest) return [];
    return prisma.foodOrder.findMany({ where: { guestId: guest.id }, orderBy: { createdAt: "desc" }, include: includeOrder() });
  },

  async getForGuest(id, userId) {
    const guest = await prisma.guest.findFirst({ where: { userId: Number(userId) } });
    const order = await prisma.foodOrder.findFirst({ where: { id: Number(id), guestId: guest?.id }, include: includeOrder() });
    if (!order) throw ApiError.notFound("Food order not found");
    return order;
  },

  async updateItem(id, userId, quantity, itemId) {
    const order = await this.getForGuest(id, userId);
    if (!["PENDING", "CONFIRMED"].includes(order.status)) throw ApiError.badRequest("This order can no longer be changed");
    if (!Number.isInteger(Number(quantity)) || Number(quantity) < 1 || Number(quantity) > 99) throw ApiError.badRequest("Quantity must be between 1 and 99");
    const item = order.items.find((candidate) => candidate.id === Number(itemId));
    if (!item) throw ApiError.notFound("Order item not found");
    await prisma.foodOrderItem.update({ where: { id: item.id }, data: { quantity: Number(quantity) } });
    const updated = await recalculate(order.id);
    emitOrderEvent("order:updated", updated);
    return updated;
  },

  async removeItem(id, userId, itemId) {
    const order = await this.getForGuest(id, userId);
    if (order.status !== "PENDING") throw ApiError.badRequest("This order can no longer be changed");
    if (!order.items.some((item) => item.id === Number(itemId))) throw ApiError.notFound("Order item not found");
    await prisma.foodOrderItem.delete({ where: { id: Number(itemId) } });
    const updated = await recalculate(order.id);
    emitOrderEvent("order:updated", updated);
    return updated;
  },

  async listKitchen(status) {
    const where = status && ACTIVE_STATUSES.includes(status) ? { status } : {};
    return prisma.foodOrder.findMany({ where, orderBy: { createdAt: "asc" }, include: includeOrder() });
  },

  async transition(id, status) {
    if (!Object.prototype.hasOwnProperty.call(TRANSITIONS, status)) throw ApiError.badRequest("Invalid order status");
    const current = await prisma.foodOrder.findUnique({ where: { id: Number(id) }, include: includeOrder() });
    if (!current) throw ApiError.notFound("Food order not found");
    if (!TRANSITIONS[current.status].includes(status)) throw ApiError.badRequest(`Cannot move order from ${current.status} to ${status}`);
    const now = new Date();
    const timestamps = { CONFIRMED: { confirmedAt: now }, PREPARING: { preparingAt: now }, READY: { readyAt: now }, DELIVERED: { completedAt: now }, CANCELLED: { cancelledAt: now } };
    const updated = await prisma.foodOrder.update({ where: { id: current.id }, data: { status, ...(timestamps[status] || {}) }, include: includeOrder() });
    emitOrderEvent("order:status", updated);
    return updated;
  },
};
