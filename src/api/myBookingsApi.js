import { apiRequest } from "./client.js";

export const myBookingsApi = {
  list: (query) => apiRequest("/my-bookings", { query }),
  get: (id) => apiRequest(`/my-bookings/${id}`),
  cancel: (id) => apiRequest(`/my-bookings/${id}/cancel`, { method: "POST" }),
};