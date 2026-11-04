import { apiRequest } from "./client.js";
export const guestsApi = {
  list: (query) => apiRequest("/guests", { query }),
  get: (id) => apiRequest(`/guests/${id}`),
  create: (body) => apiRequest("/guests", { method: "POST", body }),
  update: (id, body) => apiRequest(`/guests/${id}`, { method: "PATCH", body }),
  remove: (id) => apiRequest(`/guests/${id}`, { method: "DELETE" }),
};
