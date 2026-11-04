import { apiRequest } from "./client.js";

export const usersApi = {
  list: (query) => apiRequest("/users", { query }),
  count: () => apiRequest("/users/count"),
  bootstrap: (body) => apiRequest("/users/bootstrap", { method: "POST", body }),
  create: (body) => apiRequest("/users", { method: "POST", body }),
  update: (id, body) => apiRequest(`/users/${id}`, { method: "PATCH", body }),
  setStatus: (id, status) => apiRequest(`/users/${id}/status`, { method: "PATCH", body: { status } }),
  remove: (id) => apiRequest(`/users/${id}`, { method: "DELETE" }),
};