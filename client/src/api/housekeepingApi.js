import { apiRequest } from "./client.js";
export const housekeepingApi = {
  list: (query) => apiRequest("/housekeeping/tasks", { query }),
  create: (body) => apiRequest("/housekeeping/tasks", { method: "POST", body }),
  start: (id) => apiRequest(`/housekeeping/tasks/${id}/start`, { method: "POST" }),
  complete: (id) => apiRequest(`/housekeeping/tasks/${id}/complete`, { method: "POST" }),
  remove: (id) => apiRequest(`/housekeeping/tasks/${id}`, { method: "DELETE" }),
};
