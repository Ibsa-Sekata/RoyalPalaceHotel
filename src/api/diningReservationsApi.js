import { apiRequest } from "./client.js";

export const diningReservationsApi = {
  create: (body) => apiRequest("/dining-reservations", { method: "POST", body }),
  mine: () => apiRequest("/dining-reservations/mine"),
};
