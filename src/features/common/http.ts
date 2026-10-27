import { API_BASE_URL } from "./config";

export class HttpError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
    this.name = "HttpError";
  }
}

export async function http<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers);
  if (init.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const token = typeof window !== "undefined" ? localStorage.getItem("sportzone-token") : null;
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, { ...init, headers });
  } catch (error) {
    if (error instanceof TypeError) {
      throw new HttpError("No se pudo conectar con la API. Verifica que el backend esté disponible.", 0);
    }
    throw error;
  }
  if (!response.ok) {
    const body: unknown = await response.json().catch(() => null);
    const message =
      typeof body === "object" && body !== null && "error" in body && typeof body.error === "string"
        ? body.error
        : "No fue posible completar la solicitud.";

    if (response.status === 401 && typeof window !== "undefined" && !path.startsWith("/api/auth/")) {
      localStorage.removeItem("sportzone-token");
      window.location.replace("/login");
    }

    throw new HttpError(message, response.status);
  }

  if (response.status === 204) {
    return undefined as T;
  }
  return response.json() as Promise<T>;
}
