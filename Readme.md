# Sneaker Drop Frontend

Production-grade React + TypeScript + Tailwind frontend for a limited-edition sneaker drop system.

## Tech Stack

- React
- TypeScript
- Vite
- Tailwind CSS
- React Router
- TanStack Query
- Zustand
- React Hook Form
- Zod
- Socket.IO Client
- Sonner

## Features

- Login / Register
- Protected dashboard
- Active drop listing
- Drop detail page
- Realtime stock updates via Socket.IO
- Atomic reserve flow UI
- Purchase flow UI
- Reservation countdown
- Persistent reservation banner
- Recent purchasers displayed per drop
- Admin create-drop form
- Form validation
- Error boundary
- 404 page
- Responsive, mobile-safe layout
- Reusable modal dialog
- Friendly API error mapping

## Project Structure

```txt
src/
  app/
  components/
    common/
    layout/
    ui/
  features/
    admin/
    auth/
    drops/
  hooks/
  lib/
  store/
  styles/
  types/
```

## Getting Started

### 1. Environment Variables

Create a `.env` file in the project root:

```env
VITE_API_BASE_URL=http://localhost:4000/api/v1
VITE_SOCKET_URL=http://localhost:4000
```

Adjust the values if your backend runs on a different host or port.

### 2. Installation

```bash
npm install
```

### 3. Development

Start the Vite dev server:

```bash
npm run dev
```

The app will usually be available at:

```
http://localhost:5173
```

### 4. Production Build

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

## Backend Contract Assumptions

This frontend expects the backend to expose endpoints similar to:

| Method | Endpoint                                       | Description               |
| ------ | ---------------------------------------------- | ------------------------- |
| `POST` | `/api/v1/auth/login`                           | Authenticate user         |
| `POST` | `/api/v1/auth/register`                        | Register new user         |
| `GET`  | `/api/v1/drops/active`                         | List active drops         |
| `GET`  | `/api/v1/drops/:dropId`                        | Get drop details          |
| `POST` | `/api/v1/drops/:dropId/reserve`                | Reserve stock for a drop  |
| `POST` | `/api/v1/reservations/:reservationId/purchase` | Complete a purchase       |
| `POST` | `/api/v1/drops`                                | Create a new drop (admin) |

If your backend route names differ, update them in:

```
src/lib/api/endpoints.ts
```

## Realtime Events

The Socket.IO client listens for the following events:

- `stock_updated`
- `reservation_created`
- `reservation_expired`
- `purchase_completed`

## Authentication

- The app stores the access token and user object in Zustand with persistence.
- Protected routes require a valid session.
- Admin create-drop access is only shown when the current user has `role === "ADMIN"`.

## Validation

Validation is handled with Zod and React Hook Form. Rules include:

- **Username:** 3–30 chars, letters/numbers/underscores only
- **Email:** valid email format
- **Password:** 8+ chars, with at least one letter and one number
- **Drop title:** 3–120 chars
- **Total stock:** positive integer

## Notes on Reservation UX

The frontend treats the backend as the source of truth.

- Reservation countdown is displayed locally for UX purposes.
- Reservation expiration is enforced by the backend.
- Realtime socket events keep the dashboard synchronized.
- Expired local reservation state is cleared automatically when relevant events arrive.

## Mobile Behavior

The layout is responsive and supports:

- Stacked cards
- Wrapping header controls
- Compact reservation banner actions
- Modal dialogs on small screens

## Deployment

Recommended deployment setup:

- **Frontend:** Vercel
- **Backend:** Vercel / Render / Railway / Fly.io
- **Database:** Neon / PostgreSQL provider

Set these environment variables in your hosting dashboard:

```env
VITE_API_BASE_URL=your_backend_api_url
VITE_SOCKET_URL=your_backend_socket_url
```

## Build Checklist

Before submission, verify:

- [ ] Login works
- [ ] Register works
- [ ] Active drops load
- [ ] Reserve works
- [ ] Purchase works
- [ ] Countdown appears
- [ ] Stock updates in realtime
- [ ] Expired reservation clears correctly
- [ ] Admin create-drop form works
- [ ] Loading states appear
- [ ] Errors show readable messages

## Project Philosophy

This frontend is intentionally structured for production use:

- **Modular** — features are isolated and self-contained
- **Typed** — end-to-end TypeScript with Zod-validated boundaries
- **Reusable** — shared UI primitives and hooks
- **Scalable** — clear separation of concerns across `app`, `features`, `lib`, and `store`
- **Backend-contract driven** — centralized API and socket configuration for easy adaptation
