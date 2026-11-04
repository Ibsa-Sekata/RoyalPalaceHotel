const configuredApiUrl = import.meta.env.VITE_API_URL?.trim();

if (import.meta.env.PROD && !configuredApiUrl) {
  throw new Error("VITE_API_URL must be configured for the production frontend.");
}

export const API_URL = (configuredApiUrl || "http://localhost:5000/api/v1").replace(/\/+$/, "");
export const SOCKET_URL = API_URL.replace(/\/api\/v1$/, "");
