/*
 * Date: 20/09/2026
 * Name: Cole Zinda / Penglei Fan - Bella
 *
 * File Path: src/hooks/useOrders.ts
 * Function: Loads orders and updates an order status after chef confirmation
 */

import { useEffect, useState } from "react";
import { api } from "../services/api";
import type { Order } from "../types/models";

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isActive = true;
    api
      .get<Order[]>("/orders")
      .then((result) => {
        if (isActive) {
          setOrders(result);
          setError("");
        }
      })
      .catch((requestError) => {
        if (isActive) {
          setError(
            requestError instanceof Error
              ? requestError.message
              : "Orders unavailable.",
          );
        }
      })
      .finally(() => {
        if (isActive) setIsLoading(false);
      });

    return () => {
      isActive = false;
    };
  }, []);

  const updateStatus = async (id: string) => {
    const updated = await api.patch<Order>(`/orders/${id}`, {
      status: "Confirmed",
    });
    setOrders((current) =>
      current.map((order) => (order.id === id ? updated : order)),
    );
  };

  return { orders, isLoading, error, updateStatus };
}
