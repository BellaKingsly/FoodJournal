/*
 * Date: 13/09/2026
 * Name: Joe Green
 *
 * File Path: src/pages/chef/orders/ChefOrderList.tsx
 * Function: Shows the chef Orders page
 */

import { ViewShell } from "../../../components/ViewShell";
import type { ViewDefinition } from "../../../types/models";
import { ChefOrderManager } from "../../../components/content/ChefOrderManager";

const view: ViewDefinition = {
  id: 83,
  route: "/screen/083-cheforderlist",
  componentName: "ChefOrderList",
  title: "Orders",
  role: "chef",
  group: "orders",
  kind: "list",
};

export default function ChefOrderList() {
  return (
    <ViewShell view={view}>
      <ChefOrderManager />
    </ViewShell>
  );
}
