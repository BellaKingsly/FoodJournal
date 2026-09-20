/*
 * Date: 21/09/2026
 * Name: Penglei Fan - Bella / Cole Zinda
 *
 * File Path: src/hooks/useMenu.ts
 * Function: Loads menu items and exposes loading and request-error states
 */

import { useEffect, useState } from "react";
import { api } from "../services/api";
import type { MenuItem } from "../types/models";

interface MenuState {
  items: MenuItem[];
  isLoading: boolean;
  error: string;
}

export interface MenuFilters {
  category?: string;
  search?: string;
  minimumRating?: number;
  sort?: "featured" | "price-asc" | "price-desc" | "rating-desc";
}

// Loads one filtered menu result set from the API whenever a customer changes a control
export function useMenu(filters: MenuFilters = {}): MenuState {
  const [state, setState] = useState<MenuState>({
    items: [],
    isLoading: true,
    error: "",
  });

  useEffect(() => {
    let isActive = true;
    const parameters = new URLSearchParams();
    if (filters.category) parameters.set("category", filters.category);
    if (filters.search?.trim()) parameters.set("q", filters.search.trim());
    if (filters.minimumRating) {
      parameters.set("minRating", String(filters.minimumRating));
    }
    if (filters.sort && filters.sort !== "featured") {
      parameters.set("sort", filters.sort);
    }
    const endpoint = parameters.size ? `/menu?${parameters}` : "/menu";

    // Keep the page useful while the filtered API request is in flight
    api
      .get<MenuItem[]>(endpoint)
      .then((items) => {
        if (isActive) setState({ items, isLoading: false, error: "" });
      })
      .catch((error: unknown) => {
        if (!isActive) return;
        setState({
          items: [],
          isLoading: false,
          error: error instanceof Error ? error.message : "Menu unavailable.",
        });
      });

    return () => {
      isActive = false;
    };
  }, [filters.category, filters.minimumRating, filters.search, filters.sort]);

  return state;
}
