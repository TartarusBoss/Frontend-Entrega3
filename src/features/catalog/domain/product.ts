export type Product = {
  id: number;
  name: string;
  category: "futbol" | "basket" | "mma";
  price: number;
  description: string;
  image: string;
};

export type ProductPage = {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  data: Product[];
};
