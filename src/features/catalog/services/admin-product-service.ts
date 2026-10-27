import { http } from "@/features/common/http";
import type { Product } from "../domain/product";

export type ProductInput = Omit<Product, "id">;

export function createProduct(product: ProductInput): Promise<Product> {
  return http<Product>("/api/products", { method: "POST", body: JSON.stringify(product) });
}

export function updateProduct(id: number, product: ProductInput): Promise<Product> {
  return http<Product>(`/api/products/${id}`, { method: "PUT", body: JSON.stringify(product) });
}

export function deleteProduct(id: number): Promise<void> {
  return http<void>(`/api/products/${id}`, { method: "DELETE" });
}
