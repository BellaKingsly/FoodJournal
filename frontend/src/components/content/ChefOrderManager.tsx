/*
 * Date: 20/08/2026
 * Name: Penglei Fan - Bella / Cole Zinda
 *
 * File Path: src/components/content/ChefOrderManager.tsx
 * Function: Lets chefs review incoming orders and confirm their status
 */

import { ActionButton } from "../ui/ActionButton";
import { useOrders } from "../../hooks/useOrders";

export function ChefOrderManager() {
  const { orders, isLoading, error, updateStatus } = useOrders();

  if (isLoading)
    return <div className="card data-state">Loading orders...</div>;
  if (error) return <div className="card data-state error-state">{error}</div>;

  return (
    <section className="order-history" aria-label="Chef orders">
      {orders.map((order) => (
        <article className="card order-card" key={order.id}>
          <div className="order-card-heading">
            <div>
              <span className="eyebrow">{order.id}</span>
              <h2>{order.customerName}</h2>
            </div>
            <strong className="order-status">{order.status}</strong>
          </div>
          <div className="order-summary">
            <span>{order.address}</span>
            <strong>${order.total.toFixed(2)}</strong>
          </div>
          {order.status !== "Confirmed" && (
            <ActionButton
              label="Confirm order"
              onClick={() => void updateStatus(order.id)}
            />
          )}
        </article>
      ))}
    </section>
  );
}
