import { http } from "@/features/common/http";
import type { AuthResponse, LoginRequest, RegisterRequest } from "../domain/auth";

export function login(credentials: LoginRequest): Promise<AuthResponse> {
  return http<AuthResponse>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  });
}

export function register(details: RegisterRequest): Promise<AuthResponse> {
  return http<AuthResponse>("/api/auth/register", {
    method: "POST",
    body: JSON.stringify(details),
  });
}
