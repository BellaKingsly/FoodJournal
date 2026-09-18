# Database Storage

## Database technology

The backend uses SQLite through the Xerial JDBC driver:

- Database file: `backend/data/food-journal.db`
- Maven dependency: `org.xerial:sqlite-jdbc:3.46.1.0`
- Connection URL: `jdbc:sqlite:data/food-journal.db`
- Schema initialization: `FoodJournalServer.initializeDatabase()`

The database is created automatically when the backend starts. The application does not use a JSON file as a runtime data source.

## Tables

### `menu_items`

| Column        | Type    | Description         |
| ------------- | ------- | ------------------- |
| `id`          | INTEGER | Primary key         |
| `name`        | TEXT    | Display name        |
| `description` | TEXT    | Menu description    |
| `price`       | REAL    | Item price in USD   |
| `category`    | TEXT    | Menu category       |
| `image`       | TEXT    | Frontend asset path |
| `rating`      | REAL    | Display rating      |

Used by `GET /api/menu`, `GET /api/menu/{id}`, and chef dish CRUD routes. Chef dish changes are immediately visible on the customer homepage after the next menu request.

### `cart_items`

| Column         | Type    | Description                      |
| -------------- | ------- | -------------------------------- |
| `customer_id`  | INTEGER | Current demo customer identifier |
| `menu_item_id` | INTEGER | Foreign key to `menu_items.id`   |
| `quantity`     | INTEGER | Quantity greater than zero       |

The composite primary key is `(customer_id, menu_item_id)`. A quantity update uses SQLite upsert behavior. A quantity of zero or less removes the item.

Used by `GET /api/cart`, `POST /api/cart`, `PUT /api/cart`, and `POST /api/cart/checkout`.

### `orders`

| Column          | Type | Description                   |
| --------------- | ---- | ----------------------------- |
| `id`            | TEXT | Primary key such as `FJ-1003` |
| `customer_name` | TEXT | Customer display name         |
| `chef_name`     | TEXT | Kitchen or chef name          |
| `status`        | TEXT | Current order status          |
| `total`         | REAL | Order total in USD            |
| `address`       | TEXT | Delivery address              |
| `created_at`    | TEXT | SQLite creation timestamp     |

Used by `GET /api/orders`, `POST /api/orders`, `GET /api/orders/{id}`, and `PATCH /api/orders/{id}`.

### `payments`

| Column           | Type | Description                           |
| ---------------- | ---- | ------------------------------------- |
| `id`             | TEXT | Payment identifier such as `PAY-1001` |
| `order_id`       | TEXT | Unique order reference                |
| `payment_method` | TEXT | Payment method                        |
| `card_last4`     | TEXT | Last four digits only                 |
| `amount`         | REAL | Paid amount in USD                    |
| `status`         | TEXT | Payment status                        |
| `created_at`     | TEXT | SQLite creation timestamp             |

Used by `GET /api/payments/{id}` and created after Stripe confirms a hosted checkout session. The `payment_method` field stores the provider reference, not card data.

### `profiles`

| Column    | Type    | Description           |
| --------- | ------- | --------------------- |
| `id`      | INTEGER | Primary key           |
| `name`    | TEXT    | Customer display name |
| `email`   | TEXT    | Customer email        |
| `city`    | TEXT    | Customer city         |
| `country` | TEXT    | Customer country      |
| `address` | TEXT    | Delivery address      |

The `profiles` table is used by `GET /api/profile` and `PUT /api/profile`. Personal Information pages load this record and save changes back to SQLite.

## Seed behavior

On startup:

1. The five tables are created if they do not exist.
2. Eight menu records are inserted if `menu_items` is empty.
3. Two example orders are inserted if `orders` is empty.
4. No existing rows are overwritten.

## Customer purchase flow

```text
GET /menu
  -> POST /cart
  -> GET /cart
  -> POST /payments/checkout-session
  -> GET /orders
```

Stripe Checkout collects and processes the card details outside this application. After Stripe confirms payment, the backend creates an order with status `Paid`, inserts a payment reference, and deletes the current customer's cart rows in one SQLite transaction. Raw card numbers and CVV values are never sent to or persisted by this application.

## Resetting demo data

To reset the local database, stop the backend and remove the database file:

```bash
rm backend/data/food-journal.db
```

The next backend startup recreates the schema and seed records.
