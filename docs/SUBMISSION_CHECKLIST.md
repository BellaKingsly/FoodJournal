# Submission Checklist

## Application

- [x] React + TypeScript frontend
- [x] Java REST backend
- [x] SQLite database with JDBC
- [x] Database schema initialization on backend startup
- [x] Seed menu and order data
- [x] Customer homepage shown at `#/`
- [x] Menu loaded through the backend API
- [x] Database-backed shopping cart
- [x] Checkout creates a database order
- [x] Customer order history loaded through the backend API
- [x] CORS configured for local frontend development
- [x] API documentation available at `/api/docs`

## Pages and organization

- [x] 149 registered page entries
- [x] Descriptive PascalCase view filenames
- [x] Role-based view folders
- [x] Customer, chef, courier, and auth page groups
- [x] All-pages directory at `#/screens`
- [x] Shared `ChefProfileView` entries explicitly marked
- [x] Page file names match page component names

## Product details

- [x] New York, NY, USA location
- [x] USD currency
- [x] Food image assets
- [x] Responsive frontend layout
- [x] Loading and error states for API-backed views
- [x] Simple English code comments for database and data-flow logic

## Verification

- [x] Frontend `npm run build` passes
- [x] Backend compiles with the SQLite JDBC classpath
- [x] `GET /api/health` responds successfully
- [x] `GET /api/menu` returns database records
- [x] Cart insert and quantity update verified
- [x] Checkout creates an order and clears the cart
- [x] `GET /api/orders` returns database orders
