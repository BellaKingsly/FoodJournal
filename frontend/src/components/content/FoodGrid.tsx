/*
 * Date: 20/9/2026
 * Name: Penglei Fan - Bella / Cole Zinda
 *
 * File Path: src/components/content/FoodGrid.tsx
 * Function: Displays menu items, manages cart quantities, and starts Stripe checkout
 * 
 * * 
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
 * 
 */

import { ActionButton } from "../ui/ActionButton";
import { useMenu } from "../../hooks/useMenu";
import { useEffect, useState } from "react";
import { useCart } from "../../hooks/useCart";
import { api, isSignedIn } from "../../services/api";

type FoodGridMode = "home" | "list" | "cart";

interface FoodGridProps {
  mode: FoodGridMode;
}

export function FoodGrid({ mode }: FoodGridProps) {
  const isCart = mode === "cart";
  const itemCount = mode === "home" ? 6 : Number.POSITIVE_INFINITY;
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [minimumRating, setMinimumRating] = useState(0);
  const [sort, setSort] = useState<
    "featured" | "price-asc" | "price-desc" | "rating-desc"
  >("featured");
  const [categories, setCategories] = useState<string[]>([]);
  const { items, isLoading, error } = useMenu({
    category,
    search,
    minimumRating,
    sort,
  });
  const {
    cart,
    isLoading: isCartLoading,
    error: cartError,
    updatingItemId,
    updateItem,
  } = useCart();
  const [toastMessage, setToastMessage] = useState("");
  const [loginRequired, setLoginRequired] = useState(false);

  useEffect(() => {
    if (!toastMessage) return;
    const timeout = window.setTimeout(() => setToastMessage(""), 2200);
    return () => window.clearTimeout(timeout);
  }, [toastMessage]);

  // Loads categories independently so all choices remain visible after filtering
  useEffect(() => {
    api
      .get<string[]>("/menu/categories")
      .then(setCategories)
      .catch(() => setCategories([]));
  }, []);

  if (isCartLoading) {
    return <div className="card data-state">Loading menu...</div>;
  }

  if (error || cartError) {
    return (
      <div className="card data-state error-state">{error || cartError}</div>
    );
  }

  // Opens the single payment dialog after the customer has signed in
  const handleCheckout = () => {
    if (!isSignedIn()) {
      setLoginRequired(true);
      return;
    }
    location.hash = "#/screen/125-paymentmethod";
  };

  // Increments the selected dish in the cart and confirms the update to the user
  const handleAddToCart = async (itemId: number, itemName: string) => {
    if (!isSignedIn()) {
      setLoginRequired(true);
      return;
    }
    const currentQuantity =
      cart.items.find((item) => item.itemId === itemId)?.quantity ?? 0;
    await updateItem(itemId, currentQuantity + 1);
    setToastMessage(`${itemName} added to cart`);
  };

  // Blocks cart changes until the customer has a successful local session
  const handleCartUpdate = async (itemId: number, quantity: number) => {
    if (!isSignedIn()) {
      setLoginRequired(true);
      return;
    }
    const item = cart.items.find((cartItem) => cartItem.itemId === itemId);
    await updateItem(
      itemId,
      quantity,
      item?.customization ?? "",
      item?.unitAdjustment ?? 0,
    );
  };

  if (isCart) {
    return (
      <div className="card cart-panel">
        <h2>Your cart</h2>
        {cart.items.length === 0 ? (
          <div className="empty-cart-content">
            <p>Your cart is empty. Add a dish from the menu to get started.</p>
            <ActionButton
              label="Browse menu"
              onClick={() => {
                location.hash = "#/";
              }}
            />
          </div>
        ) : (
          <>
            {cart.items.map((item) => (
              <div className="cart-row" key={item.itemId}>
                <div>
                  <strong>{item.name}</strong>
                  <span>${item.price.toFixed(2)} each</span>
                  {item.customization && <span>{item.customization}</span>}
                </div>
                <div className="cart-controls">
                  <button
                    aria-label={`Decrease ${item.name}`}
                    disabled={updatingItemId === item.itemId}
                    onClick={() =>
                      void handleCartUpdate(item.itemId, item.quantity - 1)
                    }
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    aria-label={`Increase ${item.name}`}
                    disabled={updatingItemId === item.itemId}
                    onClick={() =>
                      void handleCartUpdate(item.itemId, item.quantity + 1)
                    }
                  >
                    +
                  </button>
                </div>
              </div>
            ))}
            <div className="cart-total">
              <span>Total</span>
              <strong>${cart.total.toFixed(2)}</strong>
            </div>
            <div className="payment-form">
              <h3>Add a payment card</h3>
              <p>
                Continue to Stripe to enter your card details securely. Your
                card is charged only after you confirm the payment there.
              </p>
              <ActionButton
                label="Add card and continue"
                onClick={handleCheckout}
              />
            </div>
          </>
        )}
        {loginRequired && (
          <div className="modal-backdrop" role="presentation">
            <div
              className="feedback-dialog"
              role="dialog"
              aria-modal="true"
              aria-labelledby="cart-login-required-title"
            >
              <h2 id="cart-login-required-title">Sign in required</h2>
              <p>
                Please sign in before adding food to your cart or checking out
              </p>
              <div className="dialog-actions">
                <ActionButton
                  label="Sign in"
                  onClick={() => (location.hash = "#/screen/142-signin")}
                />
                <ActionButton
                  label="Close"
                  onClick={() => setLoginRequired(false)}
                />
              </div>
            </div>
          </div>
        )}
        {toastMessage && (
          <div className="modal-backdrop" role="presentation">
            <div
              className="feedback-dialog success-dialog"
              role="dialog"
              aria-modal="true"
              aria-labelledby="cart-success-title"
            >
              <div className="success-dialog-icon">✓</div>
              <h2 id="cart-success-title">Added to your cart</h2>
              <p>{toastMessage}</p>
              <div className="dialog-actions">
                <ActionButton
                  label="Continue shopping"
                  onClick={() => setToastMessage("")}
                />
                <ActionButton
                  label="Go to checkout"
                  onClick={() => {
                    location.hash = "#/screen/131-shoppingcart";
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <>
      <section className="menu-toolbar" aria-label="Menu filters">
        <label className="menu-search">
          <span>Search menu</span>
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search dishes or ingredients"
          />
        </label>
        <label>
          <span>Category</span>
          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
          >
            <option value="">All categories</option>
            {categories.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span>Rating</span>
          <select
            value={minimumRating}
            onChange={(event) => setMinimumRating(Number(event.target.value))}
          >
            <option value={0}>Any rating</option>
            <option value={4.5}>4.5 stars and up</option>
            <option value={4.8}>4.8 stars and up</option>
          </select>
        </label>
        <label>
          <span>Sort by</span>
          <select
            value={sort}
            onChange={(event) =>
              setSort(
                event.target.value as
                  | "featured"
                  | "price-asc"
                  | "price-desc"
                  | "rating-desc",
              )
            }
          >
            <option value="featured">Featured</option>
            <option value="rating-desc">Highest rated</option>
            <option value="price-asc">Price: low to high</option>
            <option value="price-desc">Price: high to low</option>
          </select>
        </label>
      </section>
      {isLoading ? (
        <div className="card data-state">Updating menu...</div>
      ) : items.length === 0 ? (
        <div className="card data-state">
          <h2>No dishes found</h2>
          <p>Try a different search term or filter.</p>
        </div>
      ) : (
        <div className="grid">
          {items.slice(0, itemCount).map((item) => (
            <article className="food-card" key={item.id}>
              <img src={item.image} alt={item.name} />
              <div className="food-info">
                <div className="food-meta">
                  <span>{item.category}</span>
                  <span>★ {item.rating.toFixed(1)}</span>
                </div>
                <h3>{item.name}</h3>
                <p>{item.description}</p>
                <strong>${item.price.toFixed(2)}</strong>
                <ActionButton
                  label="View details"
                  onClick={() => {
                    location.hash = `#/dish/${item.id}`;
                  }}
                />
                <ActionButton
                  label={
                    updatingItemId === item.id ? "Adding..." : "Add to Cart"
                  }
                  disabled={updatingItemId === item.id}
                  onClick={() => void handleAddToCart(item.id, item.name)}
                />
              </div>
            </article>
          ))}
        </div>
      )}
      {loginRequired && (
        <div className="modal-backdrop" role="presentation">
          <div
            className="feedback-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="login-required-title"
          >
            <h2 id="login-required-title">Sign in required</h2>
            <p>
              Please sign in before adding food to your cart or checking out
            </p>
            <div className="dialog-actions">
              <ActionButton
                label="Sign in"
                onClick={() => (location.hash = "#/screen/142-signin")}
              />
              <ActionButton
                label="Close"
                onClick={() => setLoginRequired(false)}
              />
            </div>
          </div>
        </div>
      )}
      {toastMessage && (
        <div className="modal-backdrop" role="presentation">
          <div
            className="feedback-dialog success-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="cart-success-title"
          >
            <div className="success-dialog-icon">✓</div>
            <h2 id="cart-success-title">Added to your cart</h2>
            <p>{toastMessage}</p>
            <div className="dialog-actions">
              <ActionButton
                label="Continue shopping"
                onClick={() => setToastMessage("")}
              />
              <ActionButton
                label="Go to checkout"
                onClick={() => {
                  location.hash = "#/screen/131-shoppingcart";
                }}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
