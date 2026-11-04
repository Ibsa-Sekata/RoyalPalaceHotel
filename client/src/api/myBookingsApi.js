import { apiRequest } from "./client.js";

export const myBookingsApi = {
  list: (query) => apiRequest("/my-bookings", { query }),
  get: (id) => apiRequest(`/my-bookings/${id}`),
  cancel: (id) => apiRequest(`/my-bookings/${id}/cancel`, { method: "POST" }),
  remove: (id) => apiRequest(`/my-bookings/${id}`, { method: "DELETE" }),
  submitReceipt: (id, formData) => apiRequest(`/my-bookings/${id}/payments`, { method: "POST", body: formData }),
};