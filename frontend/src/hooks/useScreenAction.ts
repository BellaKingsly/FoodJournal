/*
 * Date: 29/08/2026
 * Name: Penglei Fan - Bella
 *
 * File Path: src/hooks/useScreenAction.ts
 * Function: Sends generic screen actions to the API and exposes their feedback message
 */

import { useState } from "react";
import { api } from "../services/api";
import type { ViewDefinition } from "../types/models";

interface ScreenActionState {
  message: string;
  submitAction: (action: string) => Promise<void>;
}

export function useScreenAction(view: ViewDefinition): ScreenActionState {
  const [message, setMessage] = useState("");

  const submitAction = async (action: string) => {
    setMessage("");
    try {
      await api.post<{ message: string }>("/actions", {
        screenId: view.id,
        action,
        role: view.role,
      });
      setMessage(`${action} completed successfully.`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Action failed.");
    }
  };

  return { message, submitAction };
}
