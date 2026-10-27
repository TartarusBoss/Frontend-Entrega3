"use client";

import { useEffect, useState } from "react";
import { getProducts } from "../services/product-service";
import type { ProductPage } from "../domain/product";

export function useProducts(page: number) {
  const [state, setState] = useState<{
    page: number;
    result?: ProductPage;
    error?: string;
  }>({ page: 0 });

  useEffect(() => {
    let active = true;
    getProducts(page)
      .then((response) => {
        if (active) setState({ page, result: response });
      })
      .catch((cause: unknown) => {
        if (active) {
          setState({
            page,
            error: cause instanceof Error ? cause.message : "No se pudo cargar el catálogo.",
          });
        }
      })
      ;

    return () => {
      active = false;
    };
  }, [page]);

  const currentPage = state.page === page;
  return {
    result: currentPage ? state.result ?? null : null,
    error: currentPage ? state.error ?? "" : "",
    loading: !currentPage,
  };
}
