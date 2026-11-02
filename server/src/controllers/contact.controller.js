import { contactService } from "../services/contact.service.js";
export const contactController = {
  async create(req, res) { res.status(201).json({ success: true, data: await contactService.create(req.body) }); },
  async list(req, res) { const d = await contactService.list(req.query); res.json({ success: true, data: d.items, meta: d.meta }); },
  async updateStatus(req, res) { res.json({ success: true, data: await contactService.updateStatus(req.params.id, req.body.status) }); },
  async reply(req, res) { res.json({ success: true, data: await contactService.reply(req.params.id, req.body.reply) }); },
};
