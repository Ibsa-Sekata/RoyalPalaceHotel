import { paymentsService } from "../services/payments.service.js";

export const paymentsController = {
    async list(req, res) {
        const d = await paymentsService.list(req.query);
        res.json({ success: true, data: d.items, meta: d.meta });
    },
    async getById(req, res) {
        res.json({ success: true, data: await paymentsService.getById(req.params.id) });
    },
    async create(req, res) {
        res.status(201).json({ success: true, data: await paymentsService.create(req.body) });
    },
    async update(req, res) {
        res.json({ success: true, data: await paymentsService.update(req.params.id, req.body) });
    },
    async remove(req, res) {
        await paymentsService.remove(req.params.id);
        res.status(204).send();
    },
    async invoice(req, res) {
        const html = await paymentsService.invoice(req.params.id);
        res.type("text/html").send(html);
    },
};