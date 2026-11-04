import { foodOrdersService } from "../services/foodOrders.service.js";

export const foodOrdersController = {
  menu: async (_req, res) => res.json({ success: true, data: await foodOrdersService.menu() }),
  create: async (req, res) => res.status(201).json({ success: true, data: await foodOrdersService.create({ ...req.body, userId: req.user.id }) }),
  mine: async (req, res) => res.json({ success: true, data: await foodOrdersService.listForGuest(req.user.id) }),
  get: async (req, res) => res.json({ success: true, data: await foodOrdersService.getForGuest(req.params.id, req.user.id) }),
  updateItem: async (req, res) => res.json({ success: true, data: await foodOrdersService.updateItem(req.params.id, req.user.id, Number(req.body.quantity), Number(req.params.itemId)) }),
  removeItem: async (req, res) => res.json({ success: true, data: await foodOrdersService.removeItem(req.params.id, req.user.id, req.params.itemId) }),
  kitchen: async (req, res) => res.json({ success: true, data: await foodOrdersService.listKitchen(req.query.status) }),
  transition: async (req, res) => res.json({ success: true, data: await foodOrdersService.transition(req.params.id, req.body.status) }),
};
