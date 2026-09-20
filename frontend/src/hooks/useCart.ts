/*
 * Date: 20/08/2026
 * Name: Cole Zinda
 *
 * File Path: src/hooks/useCart.ts
 * Function: Loads the cart, updates item quantities, and creates checkout sessions
 */

import { useCallback, useEffect, useState } from "react";
import { api } from "../services/api";
import type { Cart } from "../types/models";

const emptyCart: Cart = { items: [], subtotal: 0, deliveryFee: 0, total: 0 };

export function useCart() {
  const [cart, setCart] = useState<Cart>(emptyCart);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [paymentConfigured, setPaymentConfigured] = useState(false);
  const [updatingItemId, setUpdatingItemId] = useState<number | null>(null);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    try {
      setCart(await api.get<Cart>("/cart"));
      setError("");
      try {
        const config = await api.get<{ paymentConfigured: boolean }>("/config");
        setPaymentConfigured(config.paymentConfigured);
      } catch {
        setPaymentConfigured(false);
      }
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Cart unavailable.",
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const updateItem = async (
    itemId: number,
    quantity: number,
    customization = "",
    unitAdjustment = 0,
  ) => {
    setUpdatingItemId(itemId);
    try {
      const nextCart = await api.post<Cart>("/cart", {
        itemId,
        quantity,
        customization,
        unitAdjustment,
      });
      setCart(nextCart);
      setError("");
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Cart update failed.",
      );
    } finally {
      setUpdatingItemId(null);
    }
  };

  const startCheckout = async () => {
    const result = await api.post<{ url: string }>(
      "/payments/checkout-session",
      {},
    );
    return result.url;
  };

  return {
    cart,
    isLoading,
    error,
    paymentConfigured,
    updatingItemId,
    refresh,
    updateItem,
    startCheckout,
  };
}
