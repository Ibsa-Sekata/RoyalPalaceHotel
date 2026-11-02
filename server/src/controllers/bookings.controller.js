import { bookingsService } from "../services/bookings.service.js";

export const bookingsController = {
  async list(req, res) {
    const d = await bookingsService.list(req.query);
    res.json({ success: true, data: d.items, meta: d.meta });
  },
  async getById(req, res) {
    res.json({ success: true, data: await bookingsService.getById(req.params.id) });
  },
  async create(req, res) {
    const data = await bookingsService.create({
      ...req.body,
      userId: req.user?.id || null,
    });
    res.status(201).json({ success: true, data, message: "Booking created" });
  },
  async confirm(req, res) {
    res.json({ success: true, data: await bookingsService.updateStatus(req.params.id, "CONFIRMED") });
  },
  async cancel(req, res) {
    res.json({ success: true, data: await bookingsService.cancel(req.params.id) });
  },
  async checkIn(req, res) {
    res.json({ success: true, data: await bookingsService.checkIn(req.params.id) });
  },
  async checkOut(req, res) {
    res.json({ success: true, data: await bookingsService.checkOut(req.params.id) });
  },
  async remove(req, res) {
    await bookingsService.remove(req.params.id);
    res.status(204).send();
  },
};