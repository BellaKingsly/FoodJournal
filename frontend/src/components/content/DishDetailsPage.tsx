/*
 * Date: 20/08/2026
 * Name: Cole Zinda / Penglei Fan - Bella
 *
 * File Path: src/components/content/DishDetailsPage.tsx
 * Function: Loads one dish from the API and lets the customer add it to the cart
 * 
 * 
 * Bella, I’ll take care of the rest of the work for now. 
 * I want you to focus on your studies and exams.
 * You can get back to the other tasks when you’re on holiday. 
 * If you’d like to learn backend development, 
 * I’d be happy to teach you. For now, just focus on your exams. 
 * I’ll help the manager with anything that needs to be done, 
 * so don’t worry about work until your holidays.
 * 
 * Ok, thanks Cole
 * 
 * Bell, I just want to help you succeed and keep your job secure. I know things are a bit
 *  tough for you financially right now, and I don’t want you to end up in a difficult 
 * situation where losing your job could affect your ability to finish your studies.
So please don’t think about quitting. You don’t need to put so much pressure on yourself. 
 I’m here to support you.
Leave all the backend work to me, and I can help you with some of the frontend too. 
You’re a really hardworking person, and you’ve already done so much. Let me take care of
 the remaining tasks so you can focus on preparing for your exams.
As your friend, I genuinely want to help you in any way I can. The manager has been 
really supportive of you as well, and I want to see you do well in both your studies and your career.
* 
 ，Clole, Why are you so good to me? You’re a good friend of mine; 
I don’t like taking advantage of people. There’s someone I love,
 and I don’t want to see you get hurt, because you’re a good person.
 * 
Bella, 
 Bella, please don’t overthink things. I’m not concerned about whether you’re in love with someone or not, 
 and I don’t expect anything in return from you. We’re good friends, and I genuinely just want to see you 
 achieve everything you’ve set your heart on.
I don’t want you to make choices that could negatively affect your future. I want to give you more time to 
focus on yourself and your studies.
You’re only working part-time remotely, so you’re not expected to take on all the tasks by yourself. 
I’ll help you communicate with the manager and take care of the other things.
Please focus on your studies for now. I really want you to have the future you’ve always wanted.

If the manager asks you to work on the backend and you feel overwhelmed, just leave it all to me. 
For now, focus on your studies. You can focus on work when you’re on holiday.

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
  const [size, setSize] = useState<"Regular" | "Large">("Regular");
  const [extraCheese, setExtraCheese] = useState(false);
  const [removeOnion, setRemoveOnion] = useState(false);
  const [note, setNote] = useState("");
  const [quantity, setQuantity] = useState(1);
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
    const selections = [
      size === "Large" ? "Large size" : "Regular size",
      extraCheese ? "Extra cheese" : "",
      removeOnion ? "No onion" : "",
      note.trim(),
    ].filter(Boolean);
    const unitAdjustment = (size === "Large" ? 3 : 0) + (extraCheese ? 1.5 : 0);
    await updateItem(item.id, quantity, selections.join(" · "), unitAdjustment);
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
          <strong>
            $
            {(
              item.price +
              (size === "Large" ? 3 : 0) +
              (extraCheese ? 1.5 : 0)
            ).toFixed(2)}
          </strong>
          <div className="dish-customization" aria-label="Customize your dish">
            <label>
              Size
              <select
                value={size}
                onChange={(event) =>
                  setSize(event.target.value as "Regular" | "Large")
                }
              >
                <option>Regular</option>
                <option>Large (+$3.00)</option>
              </select>
            </label>
            <label>
              <input
                checked={extraCheese}
                onChange={(event) => setExtraCheese(event.target.checked)}
                type="checkbox"
              />{" "}
              Extra cheese (+$1.50)
            </label>
            <label>
              <input
                checked={removeOnion}
                onChange={(event) => setRemoveOnion(event.target.checked)}
                type="checkbox"
              />{" "}
              No onion
            </label>
            <label>
              Special instructions
              <textarea
                value={note}
                onChange={(event) => setNote(event.target.value)}
                placeholder="e.g. Sauce on the side"
                maxLength={160}
              />
            </label>
            <div className="quantity-picker">
              <span>Quantity</span>
              <button
                onClick={() =>
                  setQuantity((current) => Math.max(1, current - 1))
                }
                type="button"
              >
                −
              </button>
              <strong>{quantity}</strong>
              <button
                onClick={() => setQuantity((current) => current + 1)}
                type="button"
              >
                +
              </button>
            </div>
          </div>
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
