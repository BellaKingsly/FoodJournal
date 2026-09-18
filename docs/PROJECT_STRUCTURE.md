# Project structure and naming

```
backend/
  src/main/java/com/foodjournal/api/  Java HTTP API source
frontend/
  public/assets/                     Static assets
  src/components/content/            Reusable default page content
  src/components/layout/             Shared application layout
  src/components/navigation/         In-app screen discovery and navigation
  src/components/ui/                 Small reusable UI controls
  src/components/ViewShell.tsx       Page data and action orchestration
  src/hooks/                         Reusable screen data and action hooks
  src/services/                      HTTP and integration services
  src/types/                         Shared TypeScript types
  src/pages/authentication/          Sign-in, registration, and welcome pages
  src/pages/customer/home/            Customer browsing and checkout pages
  src/pages/customer/orders/          Customer order tracking pages
  src/pages/customer/profile/         Customer account and preference pages
  src/pages/customer/recipes/         Customer recipe pages
  src/pages/chef/dishes/              Chef dish and recommendation pages
  src/pages/chef/orders/              Chef order-management pages
  src/pages/chef/profile/             Chef account pages
  src/pages/chef/recipes/             Chef recipe-management pages
  src/pages/courier/messages/         Courier messages and notifications
  src/pages/courier/orders/           Courier delivery and route pages
  src/pages/courier/settings/         Courier account and document pages
  src/pages/courier/wallet/           Courier earnings and withdrawal pages
docs/                                Project and API documentation
```

## Naming rules

- React components, view files, and Java classes use `PascalCase`.
- TypeScript variables, functions, and service filenames use `camelCase`.
- URL routes use lowercase `kebab-case`.
- Java packages use lowercase names.
- Generated directories (`frontend/node_modules`, `frontend/dist`, and `backend/out`) are not source code and are ignored by Git.
- Pages declare page-specific configuration only; shared presentation belongs in `components/`.
- Screen metadata belongs in `frontend/src/viewRegistry.ts`; use a shared component when a screen has no unique UI implementation.

## Entry points

- Frontend home: `http://localhost:5173/#/`
- Screen directory: `http://localhost:5173/#/screens`
- Backend API: `http://localhost:8081/api`
- API reference: `http://localhost:8081/api/docs`
