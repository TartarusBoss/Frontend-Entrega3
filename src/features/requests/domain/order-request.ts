import type { Product } from "@/features/catalog/domain/product";

export type OrderRequest = {
  id: number;
  userId: number;
  productId: number;
  message: string;
  status: string;
  createdAt: string;
  product: Pick<Product, "id" | "name" | "category" | "price" | "image">;
};

export type CreateOrderRequest = {
  productId: number;
  message: string;
};
