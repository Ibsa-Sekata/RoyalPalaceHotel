import { mediaService } from "../services/media.service.js";

export const mediaController = {
  async uploadImage(req, res) {
    res.status(201).json({ success: true, data: await mediaService.uploadImage(req.file) });
  },
};
