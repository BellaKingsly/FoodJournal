# Food Journal NYC

Food Journal is a New York food ordering application with a React frontend, a Java REST API, and a SQLite database. The main customer journey is:

```text
Customer home -> Menu -> Cart -> Checkout -> Order history
```

## Features

- Personal information loaded and saved through real profile CRUD APIs

## Technology

- React 18
- TypeScript 5.6
- Vite 5
- Java 21 compatible HTTP server
- SQLite through Xerial JDBC
- Maven for backend dependency management
- USD currency
- New York City location data

## Requirements

- Node.js and npm
- Java 21 or a compatible JDK
- Maven

Check the local tools before starting:

```bash
node --version
npm --version
java --version
mvn --version
```

## Quick start

From the project root, run:

```bash
./run-mac.sh
```

The script prepares the SQLite JDBC dependency, compiles and starts the backend, installs frontend dependencies, and starts Vite.

Open the application at `http://localhost:5173/#/`.

The backend API is available at `http://localhost:8081/api`.

On Windows, run `run-windows.bat`.

Before enabling checkout, create `backend/.env` from `backend/.env.example` and add your Stripe key. Never commit this file or send the key through chat:

```bash
cp backend/.env.example backend/.env
# Edit backend/.env and replace the placeholder with your Stripe key.
STRIPE_SECRET_KEY=sk_test_replace_with_your_secret
export STRIPE_SUCCESS_REDIRECT=http://localhost:5173/#/screen/105-customerorderhistory?checkout=success
```

Use `sk_test_...` while integrating and testing. Use `sk_live_...` only after Stripe account verification and production deployment. `run-mac.sh` automatically loads `backend/.env` before starting Java.

## Manual start

### Backend

```bash
cd backend
mvn dependency:copy-dependencies -DoutputDirectory=lib -DincludeScope=runtime
rm -rf out
mkdir -p out
javac -cp "lib/*" -d out src/main/java/com/foodjournal/api/FoodJournalServer.java
java -cp "out:lib/*" com.foodjournal.api.FoodJournalServer
```

### Frontend

Open a second terminal:

```bash
cd frontend
npm install
npm run dev
```

## Main routes

| Purpose                | URL                                                       |
| ---------------------- | --------------------------------------------------------- |
| Customer home          | `http://localhost:5173/#/`                                |
| Shopping cart          | `http://localhost:5173/#/screen/131-shoppingcart`         |
| Customer order history | `http://localhost:5173/#/screen/105-customerorderhistory` |
| All pages directory    | `http://localhost:5173/#/screens`                         |
| API health check       | `http://localhost:8081/api/health`                        |
| API documentation      | `http://localhost:8081/api/docs`                          |

## Customer data flow

1. The homepage requests `GET /api/menu`.
2. The customer selects a dish and the frontend sends `POST /api/cart`.
3. The cart page requests `GET /api/cart` and supports quantity changes.
4. Checkout requests `POST /api/payments/checkout-session`.
5. Stripe collects the card details on its hosted payment page.
6. Stripe redirects to `GET /api/payments/confirm`, which creates the paid order in SQLite and clears the cart.
7. The order history page requests `GET /api/orders`.

## Switching application roles

The top bar provides direct switches for Customer, Chef, and Courier. Customer opens the ordering homepage, Chef opens the chef profile flow, and Courier opens the earnings flow. `Page Catalogue` remains available as a searchable development and submission index for all registered pages; it is not required for normal customer use.

## Database

The database file is created automatically at `backend/data/food-journal.db`.

Payment uses Stripe Checkout. Set `STRIPE_SECRET_KEY` in the backend environment before enabling checkout. Card details are entered only on Stripe's PCI-compliant hosted page and are never sent to or stored by this application.

The backend initializes these tables when it starts:

- `menu_items`: menu name, description, price, category, image, and rating
- `cart_items`: customer cart quantities and menu item references
- `orders`: customer orders, totals, addresses, status, and timestamps
- `payments`: Stripe payment references, status, amount, and provider metadata

Seed menu and order records are inserted only when their tables are empty. Runtime menu, cart, order, and payment reads and writes use SQLite; no JSON file is used as a data source.

See [docs/DATA_STORAGE.md](docs/DATA_STORAGE.md) for the schema and persistence behavior.

## Project structure

See [docs/PROJECT_STRUCTURE.md](docs/PROJECT_STRUCTURE.md) for source folders and naming rules.

The complete page catalogue is in [docs/VIEW_CATALOG.md](docs/VIEW_CATALOG.md).

## Formatting and validation

Run frontend formatting from `frontend/`:

```bash
npm run format
npm run format:check
npm run build
```

Compile the backend with the SQLite driver:

```bash
cd backend
mvn dependency:copy-dependencies -DoutputDirectory=lib -DincludeScope=runtime
rm -rf out && mkdir -p out
javac -cp "lib/*" -d out src/main/java/com/foodjournal/api/FoodJournalServer.java
```

```bash
cd backend
mkdir -p out
javac -d out src/main/java/com/foodjournal/api/FoodJournalServer.java
java -cp out com.foodjournal.api.FoodJournalServer
```
