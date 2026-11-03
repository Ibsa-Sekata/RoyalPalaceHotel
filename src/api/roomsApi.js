import { apiRequest } from "./client.js";
export const roomsApi = {
  list: (query) => apiRequest("/rooms", { query }),
  get: (id) => apiRequest(`/rooms/${id}`),
  availability: (checkIn, checkOut, guests) => apiRequest("/rooms/availability", { query: { checkIn, checkOut, guests } }),
  create: (body) => apiRequest("/rooms", { method: "POST", body }),
  update: (id, body) => apiRequest(`/rooms/${id}`, { method: "PATCH", body }),
  remove: (id) => apiRequest(`/rooms/${id}`, { method: "DELETE" }),
};
