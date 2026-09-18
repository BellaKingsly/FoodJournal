/*
 * Date: 18/09/2026
 * Name: Penglei Fan - Bella
 *
 * File Path: src/hooks/useScreenConnection.ts
 * Function: Checks whether the backend can provide metadata for the active screen
 */

import { useEffect, useState } from "react";
import { api } from "../services/api";
import type { ViewDefinition } from "../types/models";

interface ScreenConnectionState {
  isConnected: boolean;
  isLoading: boolean;
  error: string;
}

export function useScreenConnection(screenId: number): ScreenConnectionState {
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let isActive = true;
    setIsLoading(true);
    setError("");

    api
      .get<{ screen: ViewDefinition; location: string }>(`/screens/${screenId}`)
      .then(() => {
        if (isActive) setIsConnected(true);
      })
      .catch(() => {
        if (isActive) {
          setIsConnected(false);
          setError("Java API is unavailable. Start the backend on port 8081.");
        }
      })
      .finally(() => {
        if (isActive) setIsLoading(false);
      });

    return () => {
      isActive = false;
    };
  }, [screenId]);

  return { isConnected, isLoading, error };
}
