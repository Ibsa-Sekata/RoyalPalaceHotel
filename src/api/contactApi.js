import { apiRequest } from "./client.js";
export const contactApi = {
  send: (body) => apiRequest("/contact/messages", { method: "POST", body }),
  list: (query) => apiRequest("/contact/messages", { query }),
  updateStatus: (id, status) => apiRequest(`/contact/messages/${id}/status`, { method: "PATCH", body: { status } }),
  reply: (id, reply) => apiRequest(`/contact/messages/${id}/reply`, { method: "POST", body: { reply } }),
};
