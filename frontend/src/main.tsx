/*
 * Date: 20/08/2026
 * Name: Penglei Fan - Bella
 *
 * File Path: src/main.tsx
 * Function: Mounts the Food Journal React application into the document root
 */

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

const root = document.getElementById("root");
if (!root) throw new Error("Root element not found");
createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
