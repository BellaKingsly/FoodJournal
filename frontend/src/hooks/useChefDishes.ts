/*
 * Date: 20/9/2026
 * Name: Penglei Fan - Bella
 *
 * File Path: src/hooks/useChefDishes.ts
 * Function: Loads and maintains the chef-owned dish catalog through the API
 */

import { useCallback, useEffect, useState } from "react";
import { api } from "../services/api";
import type { MenuItem } from "../types/models";

export type DishInput = Omit<MenuItem, "id" | "rating"> & { rating: number };

export function useChefDishes() {
  const [dishes, setDishes] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const refresh = useCallback(async () => {
    setIsLoading(true);
    try {
      setDishes(await api.get<MenuItem[]>("/chef/dishes"));
      setError("");
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Dishes unavailable.",
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const saveDish = async (input: DishInput, id?: number) => {
    const saved = id
      ? await api.put<MenuItem>(`/chef/dishes/${id}`, input)
      : await api.post<MenuItem>("/chef/dishes", input);
    setDishes((current) =>
      id
        ? current.map((dish) => (dish.id === id ? saved : dish))
        : [...current, saved],
    );
    return saved;
  };

  const removeDish = async (id: number) => {
    await api.delete(`/chef/dishes/${id}`);
    setDishes((current) => current.filter((dish) => dish.id !== id));
  };

  return { dishes, isLoading, error, refresh, saveDish, removeDish };
}
