/*
 * Date: 20/08/2026
 * Name: Penglei Fan - Bella
 *
 * File Path: src/pages/customer/profile/ProfileOverview.tsx
 * Function: Shows the customer Profile Overview page
 */

import { ViewShell } from "../../../components/ViewShell";
import { ProfileForm } from "../../../components/content/ProfileForm";
import type { ViewDefinition } from "../../../types/models";

const view: ViewDefinition = {
  id: 96,
  route: "/screen/096-profileoverview",
  componentName: "ProfileOverview",
  title: "Profile Overview",
  role: "customer",
  group: "profile",
  kind: "settings",
};

export default function ProfileOverview() {
  return (
    <ViewShell view={view}>
      <ProfileForm />
    </ViewShell>
  );
}
