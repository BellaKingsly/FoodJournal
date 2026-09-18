/*
 * Date: 20/08/2026
 * Name: Penglei Fan - Bella
 *
 * File Path: src/components/ViewShell.tsx
 * Function: Composes the shared page layout, API connection state, and screen actions
 */

import type { ReactNode } from "react";
import { DefaultViewContent } from "./content/DefaultViewContent";
import { PageLayout } from "./layout/PageLayout";
import { useScreenAction } from "../hooks/useScreenAction";
import { useScreenConnection } from "../hooks/useScreenConnection";
import { isSignedIn } from "../services/api";
import type { ViewDefinition } from "../types/models";
import { ActionButton } from "./ui/ActionButton";

interface ViewShellProps {
  view: ViewDefinition;
  children?: ReactNode;
}

// Uses custom child content when supplied; otherwise renders the default screen content
export function ViewShell({ view, children }: ViewShellProps) {
  const { isLoading, error } = useScreenConnection(view.id);
  const { message, submitAction } = useScreenAction(view);
  const requiresSignIn =
    view.role === "customer" &&
    (view.group === "recipes" ||
      view.group === "profile" ||
      view.kind === "settings");
  const blocked = requiresSignIn && !isSignedIn();

  return (
    <PageLayout
      view={view}
      isLoading={blocked ? false : isLoading}
      message={blocked ? "" : message}
      connectionError={blocked ? "" : error}
    >
      {blocked ? (
        <section className="card auth-required-card">
          <h2>Sign in required</h2>
          <p>Please sign in to view your recipes, profile, and settings</p>
          <ActionButton
            label="Sign in"
            onClick={() => (location.hash = "#/screen/142-signin")}
          />
        </section>
      ) : (
        (children ?? <DefaultViewContent view={view} onAction={submitAction} />)
      )}
    </PageLayout>
  );
}
