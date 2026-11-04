import { apiRequest } from "./client.js";

export const diningReservationsApi = {
  create: (body) => apiRequest("/dining-reservations", { method: "POST", body }),
  mine: () => apiRequest("/dining-reservations/mine"),
  availability: (query) => apiRequest("/dining-reservations/availability", { query }),
  cancel: (id) => apiRequest(`/dining-reservations/${id}/cancel`, { method: "POST" }),
};
