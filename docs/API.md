# REST API

Base URL: `http://localhost:8081/api`

The frontend reads menu records from `GET /menu`. Menu and order mutations use the SQLite database at `backend/data/food-journal.db`, so order changes survive a server restart.

Hosted payment endpoints require the backend environment variable `STRIPE_SECRET_KEY`. Card data is collected by Stripe and is never sent to this API.

## Open the API reference

With the backend running, open `http://localhost:8081/api/docs` in a browser to view the complete, browser-friendly endpoint reference. It uses the same base URL as the Vite frontend (`frontend/src/services/api.ts`).

| Method | Endpoint                   | Purpose                                |
| ------ | -------------------------- | -------------------------------------- |
| GET    | /health                    | Health check                           |
| GET    | /config                    | Application and New York configuration |
| GET    | /menu                      | Menu list                              |
| GET    | /menu/{id}                 | Menu item                              |
| GET    | /recipes                   | Recipe list                            |
| GET    | /recipes/{id}              | Recipe detail                          |
| GET    | /orders                    | Orders                                 |
| POST   | /orders                    | Create order                           |
| GET    | /orders/{id}               | Order detail                           |
| PATCH  | /orders/{id}               | Update order                           |
| POST   | /auth/login                | Sign in                                |
| POST   | /auth/register             | Register                               |
| GET    | /profile                   | Profile                                |
| PUT    | /profile                   | Update profile                         |
| GET    | /messages                  | Messages                               |
| POST   | /messages                  | Send message                           |
| GET    | /cart                      | Cart                                   |
| POST   | /cart                      | Set cart item quantity                 |
| PUT    | /cart                      | Set cart item quantity                 |
| POST   | /cart/checkout             | Deprecated secure-checkout redirect    |
| POST   | /payments/checkout-session | Create Stripe hosted checkout          |
| GET    | /payments/confirm          | Confirm Stripe payment                 |
| GET    | /payments/{id}             | Payment detail                         |
| GET    | /addresses                 | Saved addresses                        |
| POST   | /addresses                 | Save address                           |
| GET    | /earnings                  | Courier earnings                       |
| GET    | /courier/jobs              | Courier jobs                           |
| PATCH  | /courier/jobs/{id}         | Update courier job                     |
| GET    | /courier/wallet            | Courier wallet                         |
| POST   | /courier/withdraw          | Request withdrawal                     |
| GET    | /chef/stats                | Chef dashboard statistics              |
| GET    | /chef/dishes               | Chef dishes                            |
| POST   | /chef/dishes               | Create chef dish                       |
| PUT    | /chef/dishes/{id}          | Update chef dish                       |
| DELETE | /chef/dishes/{id}          | Delete chef dish                       |
| GET    | /chef/recipes              | Chef recipes                           |
| POST   | /actions                   | Execute a screen action                |
| GET    | /screens/{id}              | Screen metadata                        |

## Customer purchase flow

1. `GET /menu` loads menu items from SQLite.
2. `POST /cart` with `{ "itemId": 1, "quantity": 2 }` writes the customer's cart.
3. `GET /cart` returns item rows, subtotal, delivery fee, and total.
4. `POST /payments/checkout-session` creates a Stripe hosted checkout session.
5. Stripe collects and processes card details outside this application.
6. `GET /payments/confirm?session_id=...` confirms the paid session, creates the order, and clears the cart.
7. `GET /orders` returns the resulting order history.

The backend requires `STRIPE_SECRET_KEY`. Raw card numbers and CVV values are not accepted by the application API.
