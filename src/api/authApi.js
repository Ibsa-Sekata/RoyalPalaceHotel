import { apiRequest } from "./client.js";

export const authApi = {
  login: (email, password) =>
    apiRequest("/auth/login", { method: "POST", body: { email, password } }),

  register: (fullName, email, password, phone) =>
    apiRequest("/auth/register", { method: "POST", body: { fullName, email, password, phone } }),

  me: (token) => apiRequest("/auth/me", { token }),
};