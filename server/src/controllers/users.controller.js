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
  async count(_req, res) {
    const count = await usersService.countAdmins();
    res.json({ success: true, data: { admins: count, canBootstrap: count === 0, canAddAdmin: count < 2 } });
  },

  async bootstrap(req, res) {
    const data = await usersService.bootstrapFirstAdmin(req.body);
    res.status(201).json({ success: true, data, message: "First admin created" });
  },
};