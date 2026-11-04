import { apiRequest } from "./client.js";
export const reportsApi = {
  dashboard: () => apiRequest("/reports/dashboard"),
};
