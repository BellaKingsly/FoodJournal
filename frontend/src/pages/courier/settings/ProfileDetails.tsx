/*
 * Date: 20/08/2026
 * Name: Penglei Fan - Bella
 *
 * File Path: src/pages/courier/settings/ProfileDetails.tsx
 * Function: Shows the courier Profile Details page
 */

import { ViewShell } from "../../../components/ViewShell";
import { ProfileForm } from "../../../components/content/ProfileForm";
import type { ViewDefinition } from "../../../types/models";

const view: ViewDefinition = {
  id: 14,
  route: "/screen/014-profiledetails",
  componentName: "ProfileDetails",
  title: "Profile Details",
  role: "courier",
  group: "settings",
  kind: "settings",
};

export default function ProfileDetails() {
  return (
    <ViewShell view={view}>
      <ProfileForm />
    </ViewShell>
  );
}
