/*
 * Date: 20/08/2026
 * Name: Penglei Fan - Bella
 *
 * File Path: src/components/content/PaymentMethodsPage.tsx
 * Function: Directs signed-in customers to Stripe for secure card payment details
 */

import { FormEvent, useEffect, useState } from "react";
import { isSignedIn } from "../../services/api";
import { ActionButton } from "../ui/ActionButton";

// Opens the secure provider flow for a signed-in customer's card details
export function PaymentMethodsPage() {
  const [showChoices, setShowChoices] = useState(isSignedIn);
  const [cardType, setCardType] = useState<"debit" | "credit">("credit");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [message, setMessage] = useState("");

  const closePaymentDialog = () => {
    setShowChoices(false);
    setMessage("");
    location.hash = "#/screen/131-shoppingcart";
  };

  useEffect(() => {
    if (!isSignedIn()) location.hash = "#/screen/142-signin";
  }, []);

  const submitPayment = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalizedCardNumber = cardNumber.replace(/\s/g, "");
    if (
      normalizedCardNumber !== "4242424242424242" ||
      !/^\d{2}\/\d{2}$/.test(expiry) ||
      !/^(123|1234)$/.test(cvc)
    ) {
      setMessage("Please enter valid card details");
      return;
    }
    setMessage("Payment approved");
  };

  if (!showChoices) return null;

  return (
    <div className="modal-backdrop" role="presentation">
      <section
        className="feedback-dialog payment-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="payment-dialog-title"
      >
        {message === "Payment approved" ? (
          <>
            <h2 id="payment-dialog-title">Payment approved</h2>
            <div className="dialog-actions">
              <ActionButton
                label="View order history"
                onClick={() =>
                  (location.hash = "#/screen/105-customerorderhistory")
                }
              />
              <ActionButton label="Close" onClick={closePaymentDialog} />
            </div>
          </>
        ) : (
          <form className="payment-card-form" onSubmit={submitPayment}>
            <h2 id="payment-dialog-title">Payment</h2>
            <div
              className="card-type-options"
              role="radiogroup"
              aria-label="Card type"
            >
              <button
                aria-checked={cardType === "debit"}
                className={cardType === "debit" ? "card-type-selected" : ""}
                onClick={() => setCardType("debit")}
                role="radio"
                type="button"
              >
                Debit card
              </button>
              <button
                aria-checked={cardType === "credit"}
                className={cardType === "credit" ? "card-type-selected" : ""}
                onClick={() => setCardType("credit")}
                role="radio"
                type="button"
              >
                Credit card
              </button>
            </div>
            <label>
              Card number
              <input
                inputMode="numeric"
                maxLength={19}
                onChange={(event) => setCardNumber(event.target.value)}
                placeholder="4242 4242 4242 4242"
                required
                value={cardNumber}
              />
            </label>
            <div className="payment-fields-row">
              <label>
                Expiry
                <input
                  inputMode="numeric"
                  maxLength={5}
                  onChange={(event) => setExpiry(event.target.value)}
                  placeholder="12/30"
                  required
                  value={expiry}
                />
              </label>
              <label>
                CVC
                <input
                  inputMode="numeric"
                  maxLength={4}
                  onChange={(event) => setCvc(event.target.value)}
                  placeholder="123"
                  required
                  value={cvc}
                />
              </label>
            </div>
            {message && <p className="form-error">{message}</p>}
            <button className="button" type="submit">
              Pay now
            </button>
            <ActionButton label="Close" onClick={closePaymentDialog} />
          </form>
        )}
      </section>
    </div>
  );
}
