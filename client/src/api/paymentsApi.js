import { apiRequest } from "./client.js";
import { API_URL } from "../config.js";
export const paymentsApi = {
  list: (query) => apiRequest("/payments", { query }),
  create: (body) => apiRequest("/payments", { method: "POST", body }),
  update: (id, body) => apiRequest(`/payments/${id}`, { method: "PATCH", body }),
  remove: (id) => apiRequest(`/payments/${id}`, { method: "DELETE" }),
  approve: (id) => apiRequest(`/payments/${id}/approve`, { method: "POST" }),
  reject: (id) => apiRequest(`/payments/${id}/reject`, { method: "POST" }),
  invoiceUrl: (id) => `${API_URL}/payments/${id}/invoice`,
};
