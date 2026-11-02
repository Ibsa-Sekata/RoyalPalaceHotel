import { apiRequest } from "./client.js";
export const paymentsApi = {
  list: (query) => apiRequest("/payments", { query }),
  create: (body) => apiRequest("/payments", { method: "POST", body }),
  update: (id, body) => apiRequest(`/payments/${id}`, { method: "PATCH", body }),
  remove: (id) => apiRequest(`/payments/${id}`, { method: "DELETE" }),
  invoiceUrl: (id) => `${import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1"}/payments/${id}/invoice`,
};
