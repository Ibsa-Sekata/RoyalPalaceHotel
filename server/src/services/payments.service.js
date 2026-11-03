import { prisma } from "../app.js";
import { ApiError } from "../utils/apiError.js";
import { generateInvoiceNumber } from "../utils/invoiceNumber.js";

export const paymentsService = {
    async list({ status, page = 1, limit = 20 }) {
        const where = {};
        if (status) where.status = status;
        const skip = (Number(page) - 1) * Number(limit);
        const [items, total] = await Promise.all([
            prisma.payment.findMany({
                where,
                include: { booking: { include: { guest: true, room: true } } },
                orderBy: { createdAt: "desc" },
                skip,
                take: Number(limit),
            }),
            prisma.payment.count({ where }),
        ]);
        return { items, meta: { page: Number(page), limit: Number(limit), total } };
    },

    async getById(id) {
        const p = await prisma.payment.findUnique({
            where: { id: Number(id) },
            include: { booking: { include: { guest: true, room: true } } },
        });
        if (!p) throw ApiError.notFound("Payment not found");
        return p;
    },

    async create({ bookingId, amount, method, status, transactionReference }) {
        const booking = await prisma.booking.findUnique({ where: { id: Number(bookingId) } });
        if (!booking) throw ApiError.notFound("Booking not found");
        const invoiceNumber = await generateInvoiceNumber();
        return prisma.payment.create({
            data: {
                invoiceNumber,
                bookingId: Number(bookingId),
                amount: amount ?? booking.totalAmount,
                currency: "ETB",
                method: method || "CASH",
                status: status || "PAID",
                transactionReference,
                paidAt: status === "PAID" || !status ? new Date() : null,
            },
            include: { booking: { include: { guest: true, room: true } } },
        });
    },

    async update(id, data) {
        const payment = await this.getById(id);
        if (data.status === "PAID" && !data.paidAt) data.paidAt = new Date();
        const updated = await prisma.payment.update({ where: { id: Number(id) }, data, include: { booking: { include: { guest: true, room: true } } } });
        if (data.status === "PAID" && payment.booking.status === "PENDING") {
            await prisma.booking.update({ where: { id: payment.bookingId }, data: { status: "CONFIRMED" } });
        }
        return updated;
    },

    async createReceipt({ bookingId, userId, amount, method, file }) {
        const user = await prisma.user.findUnique({
            where: { id: Number(userId) },
            select: { id: true, email: true },
        });
        if (!user) throw ApiError.unauthorized("Guest account not found");

        const booking = await prisma.booking.findFirst({
            where: {
                id: Number(bookingId),
                OR: [
                    { userId: user.id },
                    { guest: { userId: user.id } },
                    { guest: { email: user.email } },
                ],
            },
        });
        if (!booking) throw ApiError.notFound("Booking not found");
        if (["CANCELLED", "CHECKED_OUT"].includes(booking.status)) {
            throw ApiError.badRequest("This booking cannot receive a payment");
        }
        if (!file) throw ApiError.badRequest("Receipt file is required");
        const allowed = ["image/jpeg", "image/png", "image/webp", "application/pdf"];
        if (!allowed.includes(file.mimetype)) throw ApiError.badRequest("Receipt must be a PDF, JPG, PNG, or WEBP file");
        if (file.size > 8 * 1024 * 1024) throw ApiError.badRequest("Receipt must be smaller than 8 MB");
        if (!booking.userId) {
            await prisma.booking.update({
                where: { id: booking.id },
                data: { userId: user.id },
            });
        }
        return prisma.payment.create({
            data: {
                invoiceNumber: await generateInvoiceNumber(),
                bookingId: booking.id,
                amount: amount == null || amount === "" ? booking.totalAmount : Number(amount),
                currency: "ETB",
                method: method || "BANK_TRANSFER",
                status: "UNPAID",
                receiptData: file.buffer.toString("base64"),
                receiptName: file.originalname,
                receiptMimeType: file.mimetype,
            },
            include: { booking: { include: { guest: true, room: true } } },
        });
    },

    async remove(id) {
        await this.getById(id);
        await prisma.payment.delete({ where: { id: Number(id) } });
    },

    async invoice(id) {
        const p = await this.getById(id);
        const html = `
      <html><head><title>Invoice ${p.invoiceNumber}</title>
      <style>body{font-family:sans-serif;padding:40px;max-width:700px;margin:auto}
      h1{color:#9c762e}table{width:100%;border-collapse:collapse;margin:20px 0}
      th,td{padding:10px;text-align:left;border-bottom:1px solid #eee}
      .total{font-weight:bold;font-size:18px;color:#9c762e}</style></head><body>
      <h1>ROYAL PALACE HOTEL</h1>
      <p>Addis Ababa, Ethiopia · hello@royalpalace.example</p>
      <hr/>
      <h2>Invoice ${p.invoiceNumber}</h2>
      <p><b>Date:</b> ${new Date(p.createdAt).toLocaleDateString()}</p>
      <p><b>Status:</b> ${p.status}</p>
      <h3>Guest</h3>
      <p>${p.booking.guest.fullName}<br/>${p.booking.guest.email || ""}<br/>${p.booking.guest.phone || ""}</p>
      <h3>Booking ${p.booking.bookingNumber}</h3>
      <table>
        <tr><th>Room</th><td>${p.booking.room.roomNumber} — ${p.booking.room.name}</td></tr>
        <tr><th>Check-in</th><td>${new Date(p.booking.checkIn).toLocaleDateString()}</td></tr>
        <tr><th>Check-out</th><td>${new Date(p.booking.checkOut).toLocaleDateString()}</td></tr>
        <tr><th>Subtotal</th><td>ETB ${Number(p.booking.subtotal).toLocaleString()}</td></tr>
        <tr><th>VAT (15%)</th><td>ETB ${Number(p.booking.tax).toLocaleString()}</td></tr>
        <tr><th class="total">Total</th><td class="total">ETB ${Number(p.booking.totalAmount).toLocaleString()}</td></tr>
        <tr><th>Paid</th><td>ETB ${Number(p.amount).toLocaleString()} (${p.method})</td></tr>
      </table>
      <p style="text-align:center;color:#999;margin-top:40px">Thank you for choosing Royal Palace Hotel</p>
      </body></html>
    `;
        return html;
    },
};