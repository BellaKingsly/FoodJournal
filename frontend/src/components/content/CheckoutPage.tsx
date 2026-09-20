/*
 * Date: 21/09/2026
 * Name: Penglei Fan - Bella  / Cole Zinda
 *
 * File Path: src/components/content/CheckoutPage.tsx
 * Function: Collects dining and payment choices, then creates and confirms a customer order
 */

import { FormEvent, useState } from "react";
import { useCart } from "../../hooks/useCart";
import { api, isSignedIn } from "../../services/api";
import type { Order, ViewDefinition } from "../../types/models";
import { ViewShell } from "../ViewShell";
import { ActionButton } from "../ui/ActionButton";

const view: ViewDefinition = {
  id: 125,
  route: "/screen/125-paymentmethod",
  componentName: "Checkout",
  title: "Checkout",
  role: "customer",
  group: "home",
  kind: "form",
};

// Uses Stripe for online payments and keeps cash or card-at-venue orders on the restaurant workflow
export function CheckoutPage() {
  const { cart, isLoading, startCheckout } = useCart();
  const [diningOption, setDiningOption] = useState<
    "Dine in" | "Pickup" | "Delivery"
  >("Pickup");
  const [pickupTime, setPickupTime] = useState("As soon as possible");
  const [tableNumber, setTableNumber] = useState("");
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<
    "Online" | "Pay at restaurant"
  >("Pay at restaurant");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [order, setOrder] = useState<Order | null>(null);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isSignedIn()) {
      location.hash = "#/screen/142-signin";
      return;
    }
    setError("");
    setIsSubmitting(true);
    try {
      if (paymentMethod === "Online") {
        window.location.assign(await startCheckout());
        return;
      }
      setOrder(
        await api.post<Order>("/orders/checkout", {
          diningOption,
          pickupTime,
          tableNumber,
          address,
        }),
      );
    } catch (requestError: unknown) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Checkout failed",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isSignedIn()) {
    return (
      <ViewShell view={view}>
        <section className="card auth-required-card">
          <h2>Sign in required</h2>
          <p>Please sign in before placing an order.</p>
          <ActionButton
            label="Sign in"
            onClick={() => (location.hash = "#/screen/142-signin")}
          />
        </section>
      </ViewShell>
    );
  }

  if (order) {
    const stages = [
      "Order Received",
      "Preparing",
      "Ready for Pickup",
      "Completed",
    ];
    return (
      <ViewShell view={view}>
        <section className="card checkout-confirmation">
          <span className="eyebrow">Order confirmed</span>
          <h2>Order {order.id}</h2>
          <p>
            {order.diningOption} · {order.pickupTime}
          </p>
          <strong>${order.total.toFixed(2)}</strong>
          <p>Estimated wait: {order.estimatedMinutes ?? 20} minutes</p>
          <ol className="order-timeline">
            {stages.map((stage, index) => (
              <li className={index === 0 ? "active" : ""} key={stage}>
                {stage}
              </li>
            ))}
          </ol>
          <div className="dialog-actions">
            <ActionButton
              label="View order history"
              onClick={() =>
                (location.hash = "#/screen/105-customerorderhistory")
              }
            />
            <ActionButton
              label="Continue browsing"
              onClick={() => (location.hash = "#/")}
            />
          </div>
        </section>
      </ViewShell>
    );
  }

  return (
    <ViewShell view={view}>
      <form className="card checkout-form" onSubmit={submit}>
        <h2>Checkout</h2>
        <p>
          {isLoading
            ? "Loading cart..."
            : `${cart.items.length} item${cart.items.length === 1 ? "" : "s"} · $${cart.total.toFixed(2)}`}
        </p>
        <label>
          Dining option
          <select
            value={diningOption}
            onChange={(event) =>
              setDiningOption(event.target.value as typeof diningOption)
            }
          >
            <option>Dine in</option>
            <option>Pickup</option>
            <option>Delivery</option>
          </select>
        </label>
        {diningOption === "Dine in" && (
          <label>
            Table number
            <input
              required
              value={tableNumber}
              onChange={(event) => setTableNumber(event.target.value)}
              placeholder="e.g. 12"
            />
          </label>
        )}
        {diningOption === "Delivery" && (
          <label>
            Delivery address
            <input
              required
              value={address}
              onChange={(event) => setAddress(event.target.value)}
              placeholder="Street address, New York"
            />
          </label>
        )}
        <label>
          Pickup time
          <select
            value={pickupTime}
            onChange={(event) => setPickupTime(event.target.value)}
          >
            <option>As soon as possible</option>
            <option>In 15 minutes</option>
            <option>In 30 minutes</option>
            <option>In 45 minutes</option>
          </select>
        </label>
        <label>
          Payment method
          <select
            value={paymentMethod}
            onChange={(event) =>
              setPaymentMethod(event.target.value as typeof paymentMethod)
            }
          >
            <option>Pay at restaurant</option>
            <option>Online</option>
          </select>
        </label>
        {paymentMethod === "Online" && (
          <p className="muted">
            You will enter card details on Stripe's secure payment page.
          </p>
        )}
        {error && <p className="form-error">{error}</p>}
        <button
          className="button"
          disabled={isSubmitting || cart.items.length === 0}
          type="submit"
        >
          {isSubmitting
            ? "Submitting..."
            : paymentMethod === "Online"
              ? "Continue to secure payment"
              : "Place order"}
        </button>
      </form>
    </ViewShell>
  );
}
