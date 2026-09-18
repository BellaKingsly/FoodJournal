/*
 * Date: 20/08/2026
 * Name: Penglei Fan - Bella / Cole Zinda /Joe Green
 *
 * File Path: src/services/api.ts
 * Function: Wraps API requests and converts failed responses into useful errors
 */

import type { AuthUser, Profile } from "../types/models";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8081/api";
const SESSION_KEY = "food-journal-session";

interface StoredSession {
  token: string;
  user?: AuthUser;
}

// Saves the server-issued session so later API requests can identify the customer
export function saveSession(session: StoredSession) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

// Removes the local session when the customer explicitly signs out
export function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}

// Reads the current session token without exposing storage details to components
function sessionToken() {
  try {
    return (
      JSON.parse(localStorage.getItem(SESSION_KEY) ?? "{}") as StoredSession
    ).token;
  } catch {
    return undefined;
  }
}

// Lets protected customer actions check whether a successful login is available
export function isSignedIn() {
  return Boolean(sessionToken());
}

// Returns the public identity shown in the signed-in account menu
export function currentUser() {
  try {
    const session = JSON.parse(
      localStorage.getItem(SESSION_KEY) ?? "{}",
    ) as StoredSession;
    return session.token && session.user ? session.user : null;
  } catch {
    return null;
  }
}

// Keeps the header identity aligned with profile changes made by the customer
export function updateCurrentUser(profile: Profile) {
  try {
    const session = JSON.parse(
      localStorage.getItem(SESSION_KEY) ?? "{}",
    ) as StoredSession;
    if (!session.token || !session.user) return;
    session.user = {
      ...session.user,
      name: profile.name,
      email: profile.email,
      phone: profile.phone,
      avatar: profile.avatar,
    };
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    window.dispatchEvent(new Event("food-journal-session"));
  } catch {
    // The saved session will be refreshed after the next successful sign-in
  }
}

// Sends one typed request to the configured backend endpoint
async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = sessionToken();
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers ?? {}),
    },
  });
  if (!response.ok) {
    const rawMessage = await response.text();
    let message = rawMessage;
    try {
      message =
        (JSON.parse(rawMessage) as { error?: string }).error ?? rawMessage;
    } catch {
      // Keep non-JSON server errors readable
    }
    if (response.status === 503 && message.includes("STRIPE_SECRET_KEY")) {
      throw new Error(
        "Online payment is not configured. Set STRIPE_SECRET_KEY on the backend.",
      );
    }
    throw new Error(message || `Request failed with status ${response.status}`);
  }
  return response.json() as Promise<T>;
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body: unknown) =>
    request<T>(path, { method: "POST", body: JSON.stringify(body) }),
  put: <T>(path: string, body: unknown) =>
    request<T>(path, { method: "PUT", body: JSON.stringify(body) }),
  patch: <T>(path: string, body: unknown) =>
    request<T>(path, { method: "PATCH", body: JSON.stringify(body) }),
  delete: <T>(path: string) => request<T>(path, { method: "DELETE" }),
};
