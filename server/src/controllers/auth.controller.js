import { authService } from "../services/auth.service.js";

export const authController = {
  async register(req, res) {
    const data = await authService.register(req.validated.body);
    res.status(201).json({ success: true, data, message: "Registered" });
  },
  async login(req, res) {
    const data = await authService.login(req.validated.body);
    res.json({ success: true, data, message: "Logged in" });
  },
  async me(req, res) {
    const data = await authService.me(req.user.id);
    res.json({ success: true, data });
  },
  async updateProfile(req, res) {
    const data = await authService.updateProfile(req.user.id, req.body);
    res.json({ success: true, data, message: "Profile updated" });
  },
  async changePassword(req, res) {
    const data = await authService.changePassword(req.user.id, req.body);
    res.json({ success: true, data, message: "Password updated" });
  },
};