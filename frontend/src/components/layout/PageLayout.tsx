/*
 * Date: 20/08/2026
 * Name: Penglei Fan - Bella
 *
 * File Path: src/components/layout/PageLayout.tsx
 * Function: Provides the shared header, navigation, and feedback area for every page
 */

import { useEffect, useState, type ReactNode } from "react";
import type { ViewDefinition } from "../../types/models";
import { clearSession, currentUser } from "../../services/api";

interface PageLayoutProps {
  view: ViewDefinition;
  children: ReactNode;
  isLoading: boolean;
  message: string;
  connectionError: string;
}

const navigationItems = [
  { label: "Home", route: "/" },
  { label: "Orders", route: "/screen/105-customerorderhistory" },
  { label: "Recipes", route: "/screen/102-recipecomments" },
  { label: "Cart", route: "/screen/131-shoppingcart" },
  { label: "Profile", route: "/screen/096-profileoverview" },
  { label: "Settings", route: "/screen/100-profilesecurity" },
];

const roleLinks = [
  { label: "Customer", role: "customer", route: "/" },
  { label: "Chef", role: "chef", route: "/screen/037-chef-profile" },
  {
    label: "Courier",
    role: "courier",
    route: "/screen/001-earningsoverview",
  },
];

function navigateTo(route: string) {
  location.hash = `#${route}`;
}

// Keeps the relevant primary navigation item selected on related account pages
function isNavigationActive(
  item: (typeof navigationItems)[number],
  view: ViewDefinition,
) {
  if (item.label === "Home") return view.route === "/";
  if (item.label === "Orders") return view.group === "orders";
  if (item.label === "Recipes") return view.group === "recipes";
  if (item.label === "Cart") return view.kind === "cart";
  if (item.label === "Profile")
    return view.route === "/screen/096-profileoverview";
  return (
    view.group === "profile" && view.route !== "/screen/096-profileoverview"
  );
}

export function PageLayout({
  view,
  children,
  isLoading,
  message,
  connectionError,
}: PageLayoutProps) {
  const [accountOpen, setAccountOpen] = useState(false);
  const [, setSessionVersion] = useState(0);
  useEffect(() => {
    const refreshAccount = () => setSessionVersion((version) => version + 1);
    window.addEventListener("food-journal-session", refreshAccount);
    return () =>
      window.removeEventListener("food-journal-session", refreshAccount);
  }, []);
  const user = currentUser();
  const initials = user
    ? user.name
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0])
        .join("")
        .toUpperCase()
    : "";

  const openAccountRoute = (route: string) => {
    setAccountOpen(false);
    navigateTo(route);
  };

  return (
    <div className="app-shell">
      <header className="topbar">
        <button
          className="brand"
          onClick={() => {
            location.hash = "#/";
          }}
        >
          Food Journal
        </button>
        <div className="location-pill">New York, NY</div>
        <div className="role-pill">{view.role}</div>
        <div className="role-switcher" aria-label="Switch application role">
          {roleLinks.map((link) => (
            <button
              key={link.role}
              className={
                view.role === link.role ? "role-switch active" : "role-switch"
              }
              onClick={() => {
                location.hash = `#${link.route}`;
              }}
            >
              {link.label}
            </button>
          ))}
        </div>
        {user ? (
          <div className="account-area">
            <button
              aria-expanded={accountOpen}
              className="account-trigger"
              onClick={() => setAccountOpen((open) => !open)}
            >
              <span className="account-avatar" aria-hidden="true">
                {user.avatar ? <img src={user.avatar} alt="" /> : initials}
              </span>
              <span className="account-name">{user.name}</span>
            </button>
            {accountOpen && (
              <div className="account-menu" role="menu">
                <strong>{user.name}</strong>
                <small>{user.email}</small>
                <button
                  onClick={() =>
                    openAccountRoute("/screen/096-profileoverview")
                  }
                >
                  My account
                </button>
                <button
                  onClick={() =>
                    openAccountRoute("/screen/100-profilesecurity")
                  }
                >
                  Personal settings
                </button>
                <button
                  onClick={() => openAccountRoute("/screen/099-profilepayment")}
                >
                  Payment methods
                </button>
                <button
                  onClick={() => openAccountRoute("/screen/125-paymentmethod")}
                >
                  Bind a bank card
                </button>
                <button
                  className="sign-out"
                  onClick={() => {
                    clearSession();
                    setAccountOpen(false);
                    navigateTo("/");
                  }}
                >
                  Sign out
                </button>
              </div>
            )}
          </div>
        ) : (
          <button
            className="role-switch auth-link"
            onClick={() => navigateTo("/screen/142-signin")}
          >
            Sign in
          </button>
        )}
      </header>
      <div className="layout">
        <aside className="sidebar">
          {navigationItems.map((item) => (
            <button
              key={item.label}
              aria-current={isNavigationActive(item, view) ? "page" : undefined}
              className={
                isNavigationActive(item, view) ? "nav-item active" : "nav-item"
              }
              onClick={() => navigateTo(item.route)}
            >
              {item.label}
            </button>
          ))}
        </aside>
        <main className="content">
          <section className="page-heading">
            <div>
              <h1>{view.title}</h1>
              {view.kind === "home" && (
                <p>Fresh food, prepared for your day.</p>
              )}
            </div>
          </section>
          {isLoading && (
            <div className="notice">Loading your information...</div>
          )}
          {connectionError && (
            <div className="notice error-state">
              We're having trouble loading this page. Please try again.
            </div>
          )}
          {message && <div className="success">{message}</div>}
          {children}
        </main>
      </div>
    </div>
  );
}
