/*
 * Date: 20/08/2026
 * Name: Cole Zinda / Penglei Fan - Bella
 *
 * File Path: src/components/content/DishDetailsPage.tsx
 * Function: Loads one dish from the API and lets the customer add it to the cart
 */

import { useEffect, useState } from "react";
import { useCart } from "../../hooks/useCart";
import { api, isSignedIn } from "../../services/api";
import type { MenuItem } from "../../types/models";
import { ActionButton } from "../ui/ActionButton";

interface DishDetailsPageProps {
  itemId: number;
}

// Displays live menu data for the selected dish instead of a static page placeholder
export function DishDetailsPage({ itemId }: DishDetailsPageProps) {
  const [item, setItem] = useState<MenuItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const { cart, updatingItemId, updateItem } = useCart();

  useEffect(() => {
    let isActive = true;
    setIsLoading(true);
    setError("");
    setMessage("");

    api
      .get<MenuItem>(`/menu/${itemId}`)
      .then((result) => {
        if (isActive) setItem(result);
      })
      .catch((requestError: unknown) => {
        if (!isActive) return;
        setItem(null);
        setError(
          requestError instanceof Error
            ? requestError.message
            : "Dish unavailable.",
        );
      })
      .finally(() => {
        if (isActive) setIsLoading(false);
      });

    return () => {
      isActive = false;
    };
  }, [itemId]);

  const addToCart = async () => {
    if (!item) return;
    if (!isSignedIn()) {
      setMessage("Please sign in before adding food to your cart");
      return;
    }
    const quantity =
      cart.items.find((cartItem) => cartItem.itemId === item.id)?.quantity ?? 0;
    await updateItem(item.id, quantity + 1);
    setMessage(`${item.name} added to your cart.`);
  };

  if (isLoading) {
    return (
      <main className="dish-details-page card data-state">Loading dish...</main>
    );
  }

  if (error || !item) {
    return (
      <main className="dish-details-page card data-state error-state">
        <h1>Dish unavailable</h1>
        <p>{error || "This dish could not be found."}</p>
        <ActionButton
          label="Back to menu"
          onClick={() => (location.hash = "#/")}
        />
      </main>
    );
  }

  return (
    <main className="dish-details-page">
      <button className="back-link" onClick={() => (location.hash = "#/")}>
        ← Back to menu
      </button>
      <article className="dish-details-card">
        <img src={item.image} alt={item.name} />
        <div className="dish-details-content">
          <div className="food-meta">
            <span>{item.category}</span>
            <span>★ {item.rating.toFixed(1)}</span>
          </div>
          <h1>{item.name}</h1>
          <p>{item.description}</p>
          <strong>${item.price.toFixed(2)}</strong>
          {message && <p className="success dish-feedback">{message}</p>}
          <div className="actions">
            <ActionButton
              label={updatingItemId === item.id ? "Adding..." : "Add to cart"}
              disabled={updatingItemId === item.id}
              onClick={() => void addToCart()}
            />
            {!isSignedIn() && (
              <ActionButton
                label="Sign in"
                onClick={() => (location.hash = "#/screen/142-signin")}
              />
            )}
            <ActionButton
              label="Go to cart"
              onClick={() => (location.hash = "#/screen/131-shoppingcart")}
            />
          </div>
        </div>
      </article>
    </main>
  );
}
