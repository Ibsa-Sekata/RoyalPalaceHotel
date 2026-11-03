import { myBookingsService } from "../services/myBookings.service.js";

export const myBookingsController = {
  async list(req, res) {
    const d = await myBookingsService.list({ userId: req.user.id, ...req.query });
    res.json({ success: true, data: d.items, meta: d.meta });
  },
  async getById(req, res) {
    res.json({ success: true, data: await myBookingsService.getById(req.params.id, req.user.id) });
  },
  async cancel(req, res) {
    res.json({ success: true, data: await myBookingsService.cancel(req.params.id, req.user.id) });
  },
  async remove(req, res) {
    await myBookingsService.remove(req.params.id, req.user.id);
    res.status(204).send();
  },
};