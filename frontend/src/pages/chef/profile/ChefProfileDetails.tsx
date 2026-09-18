/*
 * Date: 17/09/2026
 * Name: Penglei Fan (Bella) / Cole Zinda
 *
 * File Path: src/pages/chef/profile/ChefProfileDetails.tsx
 * Function: Shows the chef Chef Profile Details page
 */

import { ProfileForm } from "../../../components/content/ProfileForm";
import { ViewShell } from "../../../components/ViewShell";
import type { ViewDefinition } from "../../../types/models";

const view: ViewDefinition = {
  id: 39,
  route: "/screen/039-chef-profile-details",
  componentName: "ChefProfileDetails",
  title: "Chef Profile Details",
  role: "chef",
  group: "profile",
  kind: "settings",
};

export default function ChefProfileDetails() {
  return (
    <ViewShell view={view}>
      <ProfileForm />
    </ViewShell>
  );
}
