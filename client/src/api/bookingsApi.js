import { apiRequest } from "./client.js";
export const bookingsApi = {
  list: (query) => apiRequest("/bookings", { query }),
  get: (id) => apiRequest(`/bookings/${id}`),
  create: (body) => apiRequest("/bookings", { method: "POST", body }),
  confirm: (id) => apiRequest(`/bookings/${id}/confirm`, { method: "POST" }),
  cancel: (id) => apiRequest(`/bookings/${id}/cancel`, { method: "POST" }),
  checkIn: (id) => apiRequest(`/bookings/${id}/check-in`, { method: "POST" }),
  checkOut: (id) => apiRequest(`/bookings/${id}/check-out`, { method: "POST" }),
  remove: (id) => apiRequest(`/bookings/${id}`, { method: "DELETE" }),
};
