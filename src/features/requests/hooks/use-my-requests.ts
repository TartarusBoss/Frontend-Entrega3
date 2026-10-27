"use client";

import { useEffect, useState } from "react";
import { getMyRequests } from "../services/request-service";
import type { OrderRequest } from "../domain/order-request";

export function useMyRequests(enabled: boolean) {
  const [requests, setRequests] = useState<OrderRequest[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!enabled) return;
    let active = true;
    getMyRequests()
      .then((result) => {
        if (active) setRequests(result);
      })
      .catch((cause: unknown) => {
        if (active) setError(cause instanceof Error ? cause.message : "No se pudieron cargar las solicitudes.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [enabled]);

  return { requests, error, loading };
}
