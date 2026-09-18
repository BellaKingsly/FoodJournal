/*
 * Date: 20/08/2026
 * Name: Penglei Fan - Bella / Cole Zinda
 * Good job Bella and Cole
 * File Path: src/components/navigation/ScreenDirectory.tsx
 * Function: Lists every registered screen with role filtering and text search
 */

import { useMemo, useState } from "react";
import type { RegisteredView } from "../../viewRegistry";
import type { UserRole } from "../../types/models";

interface ScreenDirectoryProps {
  views: RegisteredView[];
  initialRole?: RoleFilter;
}

type RoleFilter = "all" | UserRole;

const roleFilters: Array<{ label: string; value: RoleFilter }> = [
  { label: "All", value: "all" },
  { label: "Customer", value: "customer" },
  { label: "Chef", value: "chef" },
  { label: "Courier", value: "courier" },
  { label: "Auth", value: "auth" },
];

const roleOrder: UserRole[] = ["customer", "chef", "courier", "auth"];

function formatLabel(value: string) {
  return value
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function ScreenDirectory({
  views,
  initialRole = "all",
}: ScreenDirectoryProps) {
  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<RoleFilter>(initialRole);
  const visibleViews = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return views.filter((view) => {
      const matchesRole = roleFilter === "all" || view.role === roleFilter;
      const searchableText =
        `${view.title} ${view.componentName} ${view.route} ${view.group}`.toLowerCase();
      return (
        matchesRole &&
        (!normalizedQuery || searchableText.includes(normalizedQuery))
      );
    });
  }, [query, roleFilter, views]);
  const groupedViews = useMemo(() => {
    const groups = new Map<UserRole, Map<string, RegisteredView[]>>();
    visibleViews.forEach((view) => {
      const roleGroups = groups.get(view.role) ?? new Map();
      const groupViews = roleGroups.get(view.group) ?? [];
      roleGroups.set(view.group, [...groupViews, view]);
      groups.set(view.role, roleGroups);
    });
    return roleOrder
      .filter((role) => groups.has(role))
      .map((role) => ({ role, groups: groups.get(role)! }));
  }, [visibleViews]);
  const sharedEntryCount = visibleViews.filter(
    (view) => view.sharedComponent,
  ).length;

  return (
    <main className="screen-directory">
      <header className="directory-header">
        <button
          className="brand"
          onClick={() => {
            location.hash = "#/";
          }}
        >
          Food Journal
        </button>
        <button
          className="directory-home-link"
          onClick={() => {
            location.hash = "#/";
          }}
        >
          Back to Home
        </button>
      </header>
      <section className="directory-content">
        <span className="eyebrow">All pages</span>
        <h1>Page directory</h1>
        <p>
          Search by page title, component name, route, or group, then select a
          screen to open it.
        </p>
        <input
          className="directory-search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="e.g. CustomerCurrentOrder, order, chef, or /screen/"
          aria-label="Search pages"
        />
        <div className="directory-filters">
          {roleFilters.map((filter) => (
            <button
              key={filter.value}
              className={
                roleFilter === filter.value
                  ? "directory-filter active"
                  : "directory-filter"
              }
              onClick={() => setRoleFilter(filter.value)}
            >
              {filter.label}
            </button>
          ))}
        </div>
        <p className="directory-count">
          {visibleViews.length} of {views.length} pages
          {sharedEntryCount > 0 &&
            ` · ${sharedEntryCount} entries use a shared component`}
        </p>
        {groupedViews.map(({ role, groups }) => (
          <section className="directory-role" key={role}>
            <div className="directory-role-heading">
              <div>
                <span className="eyebrow">Role</span>
                <h2>{formatLabel(role)}</h2>
              </div>
              <span className="directory-role-count">
                {[...groups.values()].flat().length} pages
              </span>
            </div>
            {[...groups.entries()].map(([group, groupViews]) => (
              <section className="directory-group" key={group}>
                <div className="directory-group-heading">
                  <h3>{formatLabel(group)}</h3>
                  <span>{groupViews.length}</span>
                </div>
                <div className="directory-grid">
                  {groupViews.map((view) => (
                    <button
                      key={view.id}
                      className="directory-card"
                      onClick={() => {
                        location.hash = `#${view.route}`;
                      }}
                    >
                      <span className="directory-id">
                        Page {String(view.id).padStart(3, "0")}
                      </span>
                      <strong>{view.title}</strong>
                      <code>{view.componentName}</code>
                      {view.sharedComponent && (
                        <span className="directory-shared">
                          Shared component
                        </span>
                      )}
                      <small>{view.route}</small>
                    </button>
                  ))}
                </div>
              </section>
            ))}
          </section>
        ))}
        {visibleViews.length === 0 && (
          <div className="directory-empty">No pages match your search.</div>
        )}
      </section>
    </main>
  );
}
