import { apiRequest } from "./client.js";

export const foodOrdersApi = {
  menu: () => apiRequest("/food-orders/menu"),
  create: (body) => apiRequest("/food-orders", { method: "POST", body }),
  mine: () => apiRequest("/food-orders/mine"),
  updateItem: (orderId, itemId, quantity) => apiRequest(`/food-orders/${orderId}/items/${itemId}`, { method: "PATCH", body: { quantity } }),
  removeItem: (orderId, itemId) => apiRequest(`/food-orders/${orderId}/items/${itemId}`, { method: "DELETE" }),
  kitchen: (status) => apiRequest("/food-orders/kitchen", { query: status ? { status } : undefined }),
  transition: (id, status) => apiRequest(`/food-orders/${id}/status`, { method: "PATCH", body: { status } }),
};
