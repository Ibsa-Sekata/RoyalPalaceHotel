import { usersService } from "../services/users.service.js";

export const usersController = {
  async list(req, res) {
    const d = await usersService.list(req.query);
    res.json({ success: true, data: d.items, meta: d.meta });
  },
  async getById(req, res) {
    res.json({ success: true, data: await usersService.getById(req.params.id) });
  },
  async create(req, res) {
    res.status(201).json({ success: true, data: await usersService.create(req.body) });
  },
  async update(req, res) {
    res.json({ success: true, data: await usersService.update(req.params.id, req.body) });
  },
  async setStatus(req, res) {
    res.json({ success: true, data: await usersService.setStatus(req.params.id, req.body.status) });
  },
  async remove(req, res) {
    await usersService.remove(req.params.id);
    res.status(204).send();
  },
};