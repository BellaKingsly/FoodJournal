/*
 * Date: 06/09/2026
 * Name: Cole Zinda
 *
 * File Path: src/pages/chef/dishes/UploadDish.tsx
 * Function: Shows the chef Upload Dish page
 */

import { ViewShell } from "../../../components/ViewShell";
import type { ViewDefinition } from "../../../types/models";
import { ChefDishManager } from "../../../components/content/ChefDishManager";

const view: ViewDefinition = {
  id: 52,
  route: "/screen/052-uploaddish",
  componentName: "UploadDish",
  title: "Upload Dish",
  role: "chef",
  group: "dishes",
  kind: "form",
};

export default function UploadDish() {
  return (
    <ViewShell view={view}>
      <ChefDishManager />
    </ViewShell>
  );
}
