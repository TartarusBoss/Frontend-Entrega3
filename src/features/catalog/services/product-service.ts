import { http } from "@/features/common/http";
import type { ProductPage } from "../domain/product";

export function getProducts(page: number, limit = 6): Promise<ProductPage> {
  return http<ProductPage>(`/api/products?page=${page}&limit=${limit}`);
}
