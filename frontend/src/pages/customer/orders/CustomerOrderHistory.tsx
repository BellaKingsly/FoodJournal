/*
 * Date: 20/08/2026
 * Name: Penglei Fan - Bella / Cole Zinda
 *
 * File Path: src/pages/customer/orders/CustomerOrderHistory.tsx
 * Function: Shows the customer Order History page
 */

import { ViewShell } from "../../../components/ViewShell";
import { useOrders } from "../../../hooks/useOrders";
import type { ViewDefinition } from "../../../types/models";

const view: ViewDefinition = {
  id: 105,
  route: "/screen/105-customerorderhistory",
  componentName: "CustomerOrderHistory",
  title: "Order History",
  role: "customer",
  group: "orders",
  kind: "list",
};

export default function CustomerOrderHistory() {
  const { orders, isLoading, error } = useOrders();
  return (
    <ViewShell view={view}>
      <section className="order-history">
        {isLoading && <div className="card data-state">Loading orders...</div>}
        {error && <div className="card data-state error-state">{error}</div>}
        {!isLoading && !error && orders.length === 0 && (
          <div className="card empty-state">
            <h2>No orders yet</h2>
            <p>Your completed checkout orders will appear here.</p>
          </div>
        )}
        {!isLoading &&
          !error &&
          orders.map((order) => (
            <article className="card order-card" key={order.id}>
              <div className="order-card-heading">
                <div>
                  <span className="eyebrow">{order.id}</span>
                  <h2>{order.chefName}</h2>
                </div>
                <strong className="order-status">{order.status}</strong>
              </div>
              <div className="order-summary">
                <span>Customer: {order.customerName}</span>
                <strong>${order.total.toFixed(2)}</strong>
              </div>
              <p>{order.address}</p>
            </article>
          ))}
      </section>
    </ViewShell>
  );
}
