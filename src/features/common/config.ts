const configuredApiHost = process.env.NEXT_PUBLIC_API_HOST ?? "http://localhost:3001";

export const API_BASE_URL = configuredApiHost.replace(/\/+$/, "");
