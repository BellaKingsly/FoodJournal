/*
 * Date: 21/09/2026
 * Name: Penglei Fan - Bella / / Cole Zinda
 *
 * File Path: src/components/content/MembershipPage.tsx
 * Function: Displays and updates the signed-in customer's membership tier and rewards
 */

import { useEffect, useState } from "react";
import { api, isSignedIn } from "../../services/api";
import type { Membership, ViewDefinition } from "../../types/models";
import { ViewShell } from "../ViewShell";
import { ActionButton } from "../ui/ActionButton";

const view: ViewDefinition = {
  id: 150,
  route: "/screen/150-membership",
  componentName: "Membership",
  title: "Membership",
  role: "customer",
  group: "membership",
  kind: "info",
};

const tiers: Array<Membership["tier"]> = ["Basic", "Gold", "Platinum"];
const prices: Record<string, string> = {
  Basic: "$4.99 / month",
  Gold: "$9.99 / month",
  Platinum: "$19.99 / month",
};

// Uses the membership API so tiers and points persist for each customer account
export function MembershipPage() {
  const [membership, setMembership] = useState<Membership | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [savingTier, setSavingTier] = useState("");

  useEffect(() => {
    if (!isSignedIn()) return;
    api
      .get<Membership>("/membership")
      .then(setMembership)
      .catch((requestError: unknown) =>
        setError(
          requestError instanceof Error
            ? requestError.message
            : "Membership unavailable",
        ),
      )
      .finally(() => setLoading(false));
  }, []);

  const saveTier = async (tier: Membership["tier"]) => {
    setSavingTier(tier);
    setError("");
    try {
      const checkout = await api.post<{ url: string }>(
        "/membership/checkout-session",
        {
          tier,
        },
      );
      window.location.assign(checkout.url);
    } catch (requestError: unknown) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Membership update failed",
      );
    } finally {
      setSavingTier("");
    }
  };

  return (
    <ViewShell view={view}>
      {!isSignedIn() ? (
        <section className="card auth-required-card">
          <h2>Sign in required</h2>
          <ActionButton
            label="Sign in"
            onClick={() => (location.hash = "#/screen/142-signin")}
          />
        </section>
      ) : (
        <section className="membership-page">
          <article className="card membership-summary">
            <span className="eyebrow">Food Journal Rewards</span>
            <h2>
              {loading
                ? "Loading membership"
                : `${membership?.tier ?? "Guest"} member`}
            </h2>
            <strong>{membership?.points ?? 0} points</strong>
            <p>Earn points on every completed Food Journal order</p>
          </article>
          <div className="membership-tiers">
            {tiers.map((tier) => (
              <article
                className={
                  membership?.tier === tier
                    ? "membership-tier selected"
                    : "membership-tier"
                }
                key={tier}
              >
                <h3>{tier}</h3>
                <strong>{prices[tier]}</strong>
                <p>
                  {tier === "Basic"
                    ? "Member rewards"
                    : tier === "Gold"
                      ? "Priority offers and rewards"
                      : "Premium rewards and priority support"}
                </p>
                <ActionButton
                  label={
                    membership?.tier === tier
                      ? "Current tier"
                      : `Choose ${tier}`
                  }
                  disabled={
                    loading || savingTier === tier || membership?.tier === tier
                  }
                  onClick={() => void saveTier(tier)}
                />
              </article>
            ))}
          </div>
          {error && <p className="form-error">{error}</p>}
        </section>
      )}
    </ViewShell>
  );
}
