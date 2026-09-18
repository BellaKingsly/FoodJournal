/*
 * Date: 20/08/2026
 * Name: Penglei Fan - Bella / Cole Zindaaa
 *
 * File Path: src/App.tsx
 * Function: Routes browser hash URLs to application pages and the screen directory
 */

import { useEffect, useMemo, useState } from "react";
import { ViewShell } from "./components/ViewShell";
import { DishDetailsPage } from "./components/content/DishDetailsPage";
import { ScreenDirectory } from "./components/navigation/ScreenDirectory";
import { views } from "./viewRegistry";
import "./styles.css";

// Resolves the current hash to a registered screen, with a safe fallback
function resolveView() {
  const hash = window.location.hash.replace(/^#/, "") || "/";
  return (
    views.find((view) => view.route === hash) ??
    views.find((view) => view.route === "/") ??
    views[0]
  );
}

// Identifies the searchable screen-directory route
function isScreenDirectoryRoute() {
  return window.location.hash.replace(/^#/, "").startsWith("/screens");
}

// Returns the selected menu item identifier for the customer dish-detail route
function resolveDishId() {
  const match = window.location.hash.replace(/^#/, "").match(/^\/dish\/(\d+)$/);
  return match ? Number(match[1]) : null;
}

export default function App() {
  const [view, setView] = useState(resolveView);
  const [isScreenDirectory, setIsScreenDirectory] = useState(
    isScreenDirectoryRoute,
  );
  const [dishId, setDishId] = useState(resolveDishId);
  // Keep the rendered screen aligned with browser hash navigation
  useEffect(() => {
    const sync = () => {
      setView(resolveView());
      setIsScreenDirectory(isScreenDirectoryRoute());
      setDishId(resolveDishId());
    };
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, []);
  const Component = useMemo(() => view.component, [view]);
  if (dishId !== null) return <DishDetailsPage itemId={dishId} />;
  if (isScreenDirectory) {
    const role = new URLSearchParams(
      window.location.hash.split("?")[1] ?? "",
    ).get("role");
    const initialRole = ["customer", "chef", "courier", "auth"].includes(
      role ?? "",
    )
      ? (role as "customer" | "chef" | "courier" | "auth")
      : "all";
    return <ScreenDirectory views={views} initialRole={initialRole} />;
  }
  return Component ? <Component key={view.route} /> : <ViewShell view={view} />;
}
