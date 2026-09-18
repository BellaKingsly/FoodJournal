/*
 * Date: 20/08/2026
 * Name: Penglei Fan - Bella /Cole Zinda
 *
 * File Path: src/components/content/DefaultViewContent.tsx
 * Function: Provides fallback content for screen types that do not have a custom component
 */

import type { UserRole, ViewDefinition } from "../../types/models";
import { FoodGrid } from "./FoodGrid";
import { ActionButton } from "../ui/ActionButton";

interface DefaultViewContentProps {
  view: ViewDefinition;
  onAction: (action: string) => void;
}

// Chooses the reusable content pattern that matches the registered screen type
export function DefaultViewContent({
  view,
  onAction,
}: DefaultViewContentProps) {
  // Reuse the live menu and cart UI only where food browsing is the intended task.
  if (
    view.kind === "home" ||
    view.kind === "cart" ||
    (view.group === "home" && view.kind === "list")
  )
    return <FoodGrid mode={view.kind} />;
  if (view.kind === "list")
    return <CollectionPanel view={view} onAction={onAction} />;
  if (view.kind === "map")
    return (
      <div className="card map-card">
        <div className="map-grid">
          <span className="map-label">New York City</span>
          <span className="map-marker one" />
          <span className="map-marker two" />
          <span className="map-marker three" />
          <div className="street s1" />
          <div className="street s2" />
          <div className="street s3" />
        </div>
        <h2>Delivery location</h2>
        <p>125 W 72nd St, New York, NY 10023, USA</p>
        <ActionButton
          label="Confirm Location"
          onClick={() => onAction("Confirm Location")}
        />
      </div>
    );
  if (view.kind === "form")
    return (
      <div className="card form-card">
        <label>
          Full name
          <input defaultValue="Alex Morgan" />
        </label>
        <label>
          Email
          <input defaultValue="alex@example.com" type="email" />
        </label>
        <label>
          New York address
          <input defaultValue="125 W 72nd St, New York, NY 10023" />
        </label>
        <label>
          Notes
          <textarea defaultValue="Please leave the order at the front desk." />
        </label>
        <ActionButton
          label="Save and Continue"
          onClick={() => onAction("Save and Continue")}
        />
      </div>
    );
  if (view.kind === "status")
    return (
      <div className="card status-card">
        <div className="status-icon">✓</div>
        <h2>{view.title}</h2>
        <p>Your request has been processed for your New York City account.</p>
        <ActionButton label="Continue" onClick={() => onAction("Continue")} />
      </div>
    );
  if (view.kind === "error")
    return (
      <div className="card status-card">
        <div className="status-icon error-icon">!</div>
        <h2>{view.title}</h2>
        <p>
          We could not complete the request. Please review the information and
          try again.
        </p>
        <ActionButton label="Try Again" onClick={() => onAction("Try Again")} />
      </div>
    );
  if (view.kind === "empty")
    return (
      <div className="card empty-state">
        <div className="empty-icon">○</div>
        <h2>{view.title}</h2>
        <p>
          There is nothing here yet. Your New York activity will appear here
          when available.
        </p>
        <ActionButton
          label="Explore Food"
          onClick={() => onAction("Explore Food")}
        />
      </div>
    );
  if (view.kind === "wallet")
    return (
      <>
        <div className="stats">
          <div className="stat">
            <span>Available</span>
            <strong>$1,284.50</strong>
          </div>
          <div className="stat">
            <span>This week</span>
            <strong>$386.20</strong>
          </div>
          <div className="stat">
            <span>Completed</span>
            <strong>38</strong>
          </div>
        </div>
        <div className="card">
          <h2>Weekly earnings</h2>
          <div className="bars">
            {[42, 58, 35, 76, 64, 88, 70].map((height, index) => (
              <i key={index} style={{ height: `${height}%` }} />
            ))}
          </div>
          <ActionButton
            label="Request Withdrawal"
            onClick={() => onAction("Request Withdrawal")}
          />
        </div>
      </>
    );
  if (view.kind === "messages")
    return (
      <div className="card">
        <div className="message">
          <div className="avatar">JD</div>
          <div>
            <strong>Jordan Davis</strong>
            <p>Your order is being prepared in Manhattan.</p>
            <small>2 min ago</small>
          </div>
        </div>
        <div className="message">
          <div className="avatar">FC</div>
          <div>
            <strong>Food Journal Support</strong>
            <p>How can we help with your order today?</p>
            <small>18 min ago</small>
          </div>
        </div>
        <ActionButton
          label="Send Message"
          onClick={() => onAction("Send Message")}
        />
      </div>
    );
  if (view.kind === "settings")
    return (
      <div className="settings-list">
        {[
          [
            "Personal Information",
            getSettingsRoute(view, "Personal Information"),
          ],
          ["Security", getSettingsRoute(view, "Security")],
          ["Payment Methods", getSettingsRoute(view, "Payment Methods")],
          ["Notifications", getSettingsRoute(view, "Notifications")],
          [
            "Delivery Preferences",
            getSettingsRoute(view, "Delivery Preferences"),
          ],
          ["Work City", getSettingsRoute(view, "Work City")],
          ["Help and Feedback", getSettingsRoute(view, "Help and Feedback")],
        ].map((item) => (
          <button
            key={item[0]}
            className="settings-row"
            onClick={() => {
              if (item[1]) location.hash = `#${item[1]}`;
              else onAction(`Open ${item[0]}`);
            }}
          >
            <span>{item[0]}</span>
            <span>›</span>
          </button>
        ))}
      </div>
    );
  return (
    <div className="card">
      <h2>{view.title}</h2>
      <p>Manage this part of your Food Journal account from one place.</p>
      <div className="actions">
        <ActionButton label="Continue" onClick={() => onAction("Continue")} />
      </div>
    </div>
  );
}

// Renders a shared collection panel for list pages that do not need a custom data view.
function CollectionPanel({ view, onAction }: DefaultViewContentProps) {
  const labels: Record<string, string> = {
    orders:
      "Review the latest order information and select an item to continue.",
    recipes: "Browse saved recipes and open one to view its details.",
    profile: "Review the information saved for this account.",
    messages: "Review recent conversations and notifications.",
    wallet: "Review your available balance and recent transactions.",
  };
  return (
    <section className="card collection-panel">
      <span className="eyebrow">{view.role}</span>
      <h2>{view.title}</h2>
      <p>
        {labels[view.group] ??
          "Review the available information for this page."}
      </p>
    </section>
  );
}

// Maps each role's settings label to its dedicated screen route
function getSettingsRoute(view: ViewDefinition, label: string) {
  const routes: Record<UserRole, Record<string, string>> = {
    customer: {
      "Personal Information": "/screen/096-profileoverview",
      Security: "/screen/100-profilesecurity",
      "Payment Methods": "/screen/099-profilepayment",
      Notifications: "/screen/096-profileoverview",
      "Delivery Preferences": "/screen/101-profilepreferences",
      "Work City": "/screen/098-profileaddresses",
      "Help and Feedback": "/screen/102-recipecomments",
    },
    chef: {
      "Personal Information": "/screen/039-chef-profile-details",
      Security: "/screen/044-chef-security",
      "Payment Methods": "/screen/045-chef-payment-profile",
      Notifications: "/screen/042-chef-notifications",
      "Delivery Preferences": "/screen/041-chef-service-area",
      "Work City": "/screen/093-chef-business-address",
      "Help and Feedback": "/screen/089-chef-support",
    },
    courier: {
      "Personal Information": "/screen/014-profiledetails",
      Security: "/screen/019-passworderror",
      "Payment Methods": "/screen/009-bankcardlist",
      Notifications: "/screen/036-courierbrand",
      "Delivery Preferences": "/screen/012-workcity",
      "Work City": "/screen/012-workcity",
      "Help and Feedback": "/screen/013-feedback",
    },
    auth: {},
  };
  return routes[view.role][label] ?? "";
}
