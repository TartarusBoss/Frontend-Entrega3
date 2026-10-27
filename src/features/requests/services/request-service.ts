import { http } from "@/features/common/http";
import type { CreateOrderRequest, OrderRequest } from "../domain/order-request";

export function createRequest(data: CreateOrderRequest): Promise<OrderRequest> {
  return http<OrderRequest>("/api/requests", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function getMyRequests(): Promise<OrderRequest[]> {
  return http<OrderRequest[]>("/api/requests/mias");
}
