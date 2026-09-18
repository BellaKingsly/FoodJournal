/*
 * Date: 19/09/2026
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

export function useMenu(): MenuState {
  const [state, setState] = useState<MenuState>({
    items: [],
    isLoading: true,
    error: "",
  });

  useEffect(() => {
    let isActive = true;

    // Keep the page useful while the API request is in flight
    api
      .get<MenuItem[]>("/menu")
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
  }, []);

  return state;
}
