import { diningReservationsService } from "../services/diningReservations.service.js";

export const diningReservationsController = {
  async create(req, res) {
    const data = await diningReservationsService.create({ ...req.body, userId: req.user.id });
    res.status(201).json({ success: true, data, message: "Dining reservation confirmed" });
  },
  async mine(req, res) {
    res.json({ success: true, data: await diningReservationsService.listForGuest(req.user.id) });
  },
};
