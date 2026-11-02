import { housekeepingService } from "../services/housekeeping.service.js";

export const housekeepingController = {
    async list(req, res) {
        const d = await housekeepingService.list(req.query);
        res.json({ success: true, data: d.items, meta: d.meta });
    },
    async getById(req, res) {
        res.json({ success: true, data: await housekeepingService.getById(req.params.id) });
    },
    async create(req, res) {
        res.status(201).json({ success: true, data: await housekeepingService.create(req.body) });
    },
    async update(req, res) {
        res.json({ success: true, data: await housekeepingService.update(req.params.id, req.body) });
    },
    async start(req, res) {
        res.json({ success: true, data: await housekeepingService.start(req.params.id) });
    },
    async complete(req, res) {
        res.json({ success: true, data: await housekeepingService.complete(req.params.id) });
    },
    async remove(req, res) {
        await housekeepingService.remove(req.params.id);
        res.status(204).send();
    },
};