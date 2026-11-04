# Royal Palace Hotel Management System

<p align="center">
  <strong>A full-stack hotel reservation and operations platform for Royal Palace Hotel.</strong>
</p>

<p align="center">
  Browse rooms, create and manage reservations, coordinate hotel operations, handle dining orders, and review payments from one application.
</p>

<p align="center">
  <a href="#overview">Overview</a> ·
  <a href="#features">Features</a> ·
  <a href="#technology-stack">Stack</a> ·
  <a href="#getting-started">Getting started</a> ·
  <a href="#api-reference">API</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-18.3.1-61DAFB?logo=react&logoColor=20232A" alt="React" />
  <img src="https://img.shields.io/badge/Vite-6.4.5-646CFF?logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/Node.js-ESM-339933?logo=node.js&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/Express-4.22.3-000000?logo=express&logoColor=white" alt="Express" />
  <img src="https://img.shields.io/badge/PostgreSQL-Neon-4169E1?logo=postgresql&logoColor=white" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/Prisma-5.22.0-2D3748?logo=prisma&logoColor=white" alt="Prisma" />
  <img src="https://img.shields.io/badge/Cloudinary-2.7.0-3448C5?logo=cloudinary&logoColor=white" alt="Cloudinary" />
</p>

## Table of contents

- [Overview](#overview)
- [Features](#features)
- [Technology stack](#technology-stack)
- [Architecture](#architecture)
- [Screenshots](#screenshots)
- [Getting started](#getting-started)
- [Environment variables](#environment-variables)
- [Database](#database)
- [API reference](#api-reference)
- [Authentication and authorization](#authentication-and-authorization)
- [Payment workflow](#payment-workflow)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## Overview

Royal Palace Hotel Management System connects the public hotel experience with the hotel team’s daily operations. Guests can discover rooms and hotel services, create reservations, submit payment receipts, manage their stays, reserve dining, and place food orders. Administrators can manage rooms, reservations, guests, users, check-in/check-out, housekeeping, payments, hotel content, messages, settings, reports, and kitchen orders.

### Problems addressed

- Replaces disconnected reservation and operations workflows with a single web application.
- Gives guests visibility into room availability, bookings, dining reservations, and food orders.
- Gives administrators operational views for reservations, payments, rooms, housekeeping, content, and reporting.
- Provides a structured API and relational data model for hotel records and their relationships.

### Users

| User | Primary workspace |
| --- | --- |
| Guests | Public hotel pages, account profile, reservations, dining reservations, payment receipt submission, and food ordering |
| Administrators | Dashboard, room and booking operations, guests, users, payments, housekeeping, reports, messages, settings, content, and kitchen |

## Features

### Guest and public experience

- Account registration, login, profile updates, and password changes.
- Public home, rooms, room details, dining, about, amenities, gallery, and contact pages.
- Room listing, room detail, and availability lookup.
- Authenticated room booking with dates, guest count, and special requests.
- Personal booking list, booking details, cancellation, deletion, and payment receipt submission.
- Dining reservation availability, creation, personal reservations, and cancellation.
- Menu browsing and authenticated food ordering with order-item updates.
- Hotel content and gallery management surfaces are available to administrators.

### Administrator operations

- Admin dashboard statistics and reporting.
- Room creation, editing, deletion, status management, and availability.
- Booking listing, search, confirmation, cancellation, check-in, check-out, and deletion.
- Guest listing, creation, editing, and deletion.
- User listing, creation, editing, activation/status changes, and deletion.
- Housekeeping task lifecycle: create, assign/update, start, complete, and delete.
- Payment records, receipt review, approval/rejection, invoice HTML, and deletion.
- Contact message listing, status updates, and replies.
- Hotel settings and editable public content.
- Dining and food-order operations, including the kitchen dashboard and real-time order updates.
- Cloudinary-backed image upload for administrator-managed content.

### Feature status

The features above are implemented surfaces found in the current frontend routes, backend routes, controllers, services, and Prisma schema. The repository does not contain a separate roadmap or planned-feature list, so no additional features are presented as planned.

## Technology stack

| Layer | Technologies |
| --- | --- |
| Frontend | React 18, React Router 6, Vite 6, JavaScript/JSX |
| UI and charts | `lucide-react`, `recharts`, custom CSS |
| Backend | Node.js ES modules, Express 4 |
| API security and validation | Helmet, CORS, Morgan, express-rate-limit, Zod |
| Authentication | JSON Web Tokens (`jsonwebtoken`), `bcryptjs` password hashing |
| Database | PostgreSQL, configured through `DATABASE_URL` and demonstrated with Neon |
| ORM and migrations | Prisma 5 and Prisma Client |
| Files and media | Multer in-memory uploads and Cloudinary |
| Real-time updates | Socket.IO server and client |

## Architecture

### Repository structure

```text
royal-palace-hotel/
├── client/
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── src/
│       ├── App.jsx
│       ├── api/              # Frontend API clients
│       ├── components/       # Shared layouts and UI components
│       ├── context/          # Authentication context
│       ├── hooks/            # Shared React hooks
│       ├── pages/
│       │   ├── admin/        # Administrator screens
│       │   ├── auth/         # Login, registration, admin setup
│       │   ├── guest/        # Guest account screens
│       │   └── public/       # Public hotel experience
│       ├── data.js
│       └── styles.css
├── server/
│   ├── package.json
│   ├── src/
│   │   ├── app.js            # Express app and /api/v1 route mounts
│   │   ├── server.js         # HTTP and Socket.IO server
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── utils/
│   │   └── validators/
│   └── prisma/
│       ├── schema.prisma
│       ├── migrations/
│       └── seed.js
└── README.md
```

### Request and data flow

```mermaid
flowchart LR
    Browser["React + Vite client"] -->|REST /api/v1| API["Express API"]
    Browser <-->|Socket.IO order events| API
    API --> Auth["JWT + role middleware"]
    API --> Prisma["Prisma Client"]
    Prisma --> DB[("PostgreSQL / Neon")]
    API --> Cloudinary["Cloudinary image storage"]
```

The client uses `VITE_API_URL` and sends bearer access tokens when available. Express mounts the domain routes under `/api/v1`, applies security and request middleware, and delegates work to controllers and services. Prisma maps the service layer to PostgreSQL. Cloudinary is used for administrator image uploads, while Socket.IO broadcasts food-order updates to authenticated guests and the kitchen room.

## Screenshots

No screenshot image files are currently tracked in the repository. The following are named placeholders for future captures; they are not claims of existing screenshots.

| Screen | Placeholder |
| --- | --- |
| Home page | `[Screenshot placeholder: Home page]` |
| Rooms page | `[Screenshot placeholder: Rooms page]` |
| Room details | `[Screenshot placeholder: Room details]` |
| Guest dashboard | `[Screenshot placeholder: Guest dashboard / My bookings]` |
| Admin dashboard | `[Screenshot placeholder: Admin dashboard]` |
| Booking management | `[Screenshot placeholder: Admin booking management]` |
| Payment management | `[Screenshot placeholder: Admin payment management]` |
| Dining page | `[Screenshot placeholder: Dining page]` |

The repository does include a background video at `client/videos/hotel-background.mp4`.

## Getting started

### Prerequisites

- Node.js with npm.
- A PostgreSQL database. The checked-in example uses a Neon PostgreSQL connection string.
- Cloudinary credentials if administrator image uploads are required.

### 1. Clone the repository

```bash
git clone https://github.com/Ibsa-Sekata/frontednHotelManagementSystem.git
cd frontednHotelManagementSystem
```

### 2. Configure the backend

```bash
cd server
npm install
copy .env.example .env
```

On macOS/Linux, use `cp .env.example .env` instead of `copy`.

Edit `server/.env` with the values described in [Environment variables](#environment-variables).

### 3. Generate Prisma Client, migrate, and seed

```bash
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
```

`prisma:seed` inserts or merges public hotel content for gallery, amenities, and dining settings. It does not create an administrator account. The `/setup-admin` screen and `/api/v1/users/bootstrap` route are provided for first-admin setup when no administrator exists.

### 4. Start the backend

For development:

```bash
npm run dev
```

For the production-style Node start command:

```bash
npm start
```

The API listens on `http://localhost:5000` by default. Verify it with:

```text
http://localhost:5000/health
```

### 5. Configure and start the frontend

Open a second terminal at the repository root:

```bash
cd client
npm install
```

Create `client/.env` (or another Vite-loaded local environment file):

```env
VITE_API_URL=http://localhost:5000/api/v1
```

Start Vite:

```bash
npm run dev
```

Open the URL printed by Vite, normally `http://localhost:5173`.

### Available package scripts

| Directory | Command | Purpose |
| --- | --- | --- |
| `client` | `npm run dev` | Start the Vite development server |
| `client` | `npm run build` | Create the Vite production build |
| `client` | `npm run preview` | Preview the production build |
| `server` | `npm run dev` | Start the API with Nodemon |
| `server` | `npm start` | Start the API with Node |
| `server` | `npm run prisma:generate` | Generate Prisma Client |
| `server` | `npm run prisma:migrate` | Run Prisma development migrations |
| `server` | `npm run prisma:seed` | Seed public hotel content |

## Environment variables

### Backend: `server/.env`

Use safe local values and keep real secrets out of source control. The repository ignores local environment files.

```env
NODE_ENV=development
PORT=5000
DATABASE_URL="postgresql://USER:PASSWORD@YOUR-NEON-HOST/neondb?sslmode=require"
JWT_ACCESS_SECRET=replace_with_a_long_random_access_secret
JWT_REFRESH_SECRET=replace_with_a_different_long_random_refresh_secret
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
CURRENCY=ETB
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

| Variable | Required | Used for |
| --- | --- | --- |
| `NODE_ENV` | No | Runtime mode; defaults to `development` |
| `PORT` | No | API port; defaults to `5000` |
| `DATABASE_URL` | Yes | Prisma PostgreSQL connection |
| `JWT_ACCESS_SECRET` | Yes for auth | Signing access tokens |
| `JWT_REFRESH_SECRET` | Yes for auth | Signing refresh tokens |
| `JWT_ACCESS_EXPIRES_IN` | No | Access-token lifetime; defaults to `15m` |
| `JWT_REFRESH_EXPIRES_IN` | No | Refresh-token lifetime; defaults to `7d` |
| `CLIENT_URL` | No | CORS and Socket.IO origin; defaults to `http://localhost:5173` |
| `CURRENCY` | No | Food-order currency; defaults to `ETB` |
| `CLOUDINARY_CLOUD_NAME` | Required for image upload | Cloudinary cloud |
| `CLOUDINARY_API_KEY` | Required for image upload | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Required for image upload | Cloudinary API secret |

### Frontend: `client/.env`

```env
VITE_API_URL=http://localhost:5000/api/v1
```

If `VITE_API_URL` is omitted, the client uses that same local API URL as its built-in default.

## Database

Prisma uses PostgreSQL, with the connection read from `DATABASE_URL`. The schema contains these models:

| Model | Responsibility |
| --- | --- |
| `User` | Login identity, role, status, and account profile |
| `Guest` | Guest record connected to bookings and hospitality services |
| `Room` | Room inventory, pricing, occupancy capacity, and operational status |
| `Booking` | Reservation dates, totals, status, guest, room, and payments |
| `Payment` | Payment amount, method, status, receipt data, and invoice number |
| `HousekeepingTask` | Room task assignment and lifecycle |
| `ContactMessage` | Public contact messages and administrator replies |
| `DiningReservation` | Restaurant reservation and table details |
| `MenuCategory` / `MenuItem` | Food menu structure and availability |
| `FoodOrder` / `FoodOrderItem` | Guest food orders and their line items |
| `HotelSetting` | Key/value hotel and public-content settings |
| `AdminLog` | Administrator action metadata |

```mermaid
erDiagram
    USER ||--o| GUEST : has
    USER ||--o{ BOOKING : makes
    USER ||--o{ FOOD_ORDER : places
    USER ||--o{ CONTACT_MESSAGE : sends
    GUEST ||--o{ BOOKING : owns
    GUEST ||--o{ DINING_RESERVATION : makes
    GUEST ||--o{ FOOD_ORDER : places
    ROOM ||--o{ BOOKING : receives
    ROOM ||--o{ HOUSEKEEPING_TASK : has
    BOOKING ||--o{ PAYMENT : records
    MENU_CATEGORY ||--o{ MENU_ITEM : contains
    MENU_ITEM ||--o{ FOOD_ORDER_ITEM : selected_in
    FOOD_ORDER ||--o{ FOOD_ORDER_ITEM : contains
```

Migrations are stored in `server/prisma/migrations/`. The current schema defines two roles, `ADMIN` and `GUEST`, plus statuses for bookings, payments, rooms, housekeeping, dining reservations, and food orders.

## API reference

The base URL is `http://localhost:5000/api/v1` by default. Protected endpoints require `Authorization: Bearer <access-token>`.

### Health

| Method | Endpoint | Purpose | Auth |
| --- | --- | --- | --- |
| `GET` | `/health` | Check API and database connectivity | Public; outside `/api/v1` |

### Authentication and profile

| Method | Endpoint | Purpose | Auth |
| --- | --- | --- | --- |
| `POST` | `/auth/register` | Register a guest account | Public |
| `POST` | `/auth/login` | Authenticate and return access/refresh tokens | Public |
| `GET` | `/auth/me` | Read the current user | Authenticated |
| `PATCH` | `/auth/profile` | Update the current profile | Authenticated |
| `POST` | `/auth/change-password` | Change the current password | Authenticated |

### Rooms

| Method | Endpoint | Purpose | Auth |
| --- | --- | --- | --- |
| `GET` | `/rooms` | List rooms | Public |
| `GET` | `/rooms/availability` | Check room availability | Public |
| `GET` | `/rooms/:id` | Read one room | Public |
| `POST` | `/rooms` | Create a room | Admin |
| `PATCH` | `/rooms/:id` | Update a room | Admin |
| `DELETE` | `/rooms/:id` | Delete a room | Admin |

### Bookings

| Method | Endpoint | Purpose | Auth |
| --- | --- | --- | --- |
| `POST` | `/bookings` | Create a reservation | Authenticated |
| `GET` | `/bookings` | List bookings | Admin |
| `GET` | `/bookings/:id` | Read a booking | Admin |
| `POST` | `/bookings/:id/confirm` | Confirm a booking | Admin |
| `POST` | `/bookings/:id/cancel` | Cancel a booking | Admin |
| `POST` | `/bookings/:id/check-in` | Check in a confirmed booking | Admin |
| `POST` | `/bookings/:id/check-out` | Check out a checked-in booking | Admin |
| `DELETE` | `/bookings/:id` | Delete a booking | Admin |

### Guest bookings

| Method | Endpoint | Purpose | Auth |
| --- | --- | --- | --- |
| `GET` | `/my-bookings` | List the current guest’s bookings | Authenticated |
| `GET` | `/my-bookings/:id` | Read one owned booking | Authenticated |
| `POST` | `/my-bookings/:id/cancel` | Cancel an owned booking | Authenticated |
| `DELETE` | `/my-bookings/:id` | Delete an owned booking | Authenticated |
| `POST` | `/my-bookings/:id/payments` | Submit a payment receipt (`multipart/form-data`) | Authenticated |

### Payments

| Method | Endpoint | Purpose | Auth |
| --- | --- | --- | --- |
| `GET` | `/payments` | List payment records | Admin |
| `GET` | `/payments/:id` | Read a payment | Admin |
| `POST` | `/payments` | Create a payment record | Admin |
| `PATCH` | `/payments/:id` | Update a payment record | Admin |
| `POST` | `/payments/:id/approve` | Mark a submitted payment as paid | Admin |
| `POST` | `/payments/:id/reject` | Mark a submitted payment as failed | Admin |
| `DELETE` | `/payments/:id` | Delete a payment record | Admin |
| `GET` | `/payments/:id/invoice` | Return an invoice as HTML | Admin |

### Dining and food ordering

| Method | Endpoint | Purpose | Auth |
| --- | --- | --- | --- |
| `POST` | `/dining-reservations` | Create a dining reservation | Guest |
| `GET` | `/dining-reservations/availability` | Check dining availability | Guest |
| `GET` | `/dining-reservations/mine` | List the current guest’s dining reservations | Guest |
| `POST` | `/dining-reservations/:id/cancel` | Cancel a dining reservation | Guest |
| `GET` | `/food-orders/menu` | Read the menu | Public |
| `POST` | `/food-orders` | Create a food order | Guest |
| `GET` | `/food-orders/mine` | List the current guest’s orders | Guest |
| `GET` | `/food-orders/:id` | Read an owned food order | Guest |
| `PATCH` | `/food-orders/:id/items/:itemId` | Update an order item | Guest |
| `DELETE` | `/food-orders/:id/items/:itemId` | Remove an order item | Guest |
| `GET` | `/food-orders/kitchen` | Read kitchen orders | Admin |
| `PATCH` | `/food-orders/:id/status` | Transition an order status | Admin |

### Administration and operations

| Method | Endpoint | Purpose | Auth |
| --- | --- | --- | --- |
| `GET` | `/guests` | List guests | Admin |
| `GET` | `/guests/:id` | Read a guest | Admin |
| `POST` | `/guests` | Create a guest | Admin |
| `PATCH` | `/guests/:id` | Update a guest | Admin |
| `DELETE` | `/guests/:id` | Delete a guest | Admin |
| `GET` | `/users/count` | Count administrators for setup | Public |
| `POST` | `/users/bootstrap` | Bootstrap the first administrator | Public, limited by service logic |
| `GET` | `/users` | List users | Admin |
| `GET` | `/users/:id` | Read a user | Admin |
| `POST` | `/users` | Create a user | Admin |
| `PATCH` | `/users/:id` | Update a user | Admin |
| `PATCH` | `/users/:id/status` | Change user status | Admin |
| `DELETE` | `/users/:id` | Delete a user | Admin |
| `GET` | `/housekeeping/tasks` | List housekeeping tasks | Admin |
| `GET` | `/housekeeping/tasks/:id` | Read a task | Admin |
| `POST` | `/housekeeping/tasks` | Create a task | Admin |
| `PATCH` | `/housekeeping/tasks/:id` | Update a task | Admin |
| `POST` | `/housekeeping/tasks/:id/start` | Start a task | Admin |
| `POST` | `/housekeeping/tasks/:id/complete` | Complete a task | Admin |
| `DELETE` | `/housekeeping/tasks/:id` | Delete a task | Admin |
| `GET` | `/checkin/today` | List today’s check-in/check-out operations | Admin |
| `GET` | `/reports/dashboard` | Read dashboard report data | Admin |

### Content, messages, settings, and media

| Method | Endpoint | Purpose | Auth |
| --- | --- | --- | --- |
| `POST` | `/contact/messages` | Submit a contact message | Public |
| `GET` | `/contact/messages` | List contact messages | Admin |
| `PATCH` | `/contact/messages/:id/status` | Update message status | Admin |
| `POST` | `/contact/messages/:id/reply` | Reply to a message | Admin |
| `GET` | `/settings` | Read hotel settings/content | Public |
| `PATCH` | `/settings/:key` | Update a setting | Admin |
| `POST` | `/media/images` | Upload a JPG, PNG, or WEBP image (max 8 MB) | Admin |

## Authentication and authorization

- Registration creates a `GUEST` user and hashes the password with `bcryptjs`.
- Login validates the account and password, then returns an access token and refresh token signed with separate JWT secrets.
- The client stores the access token locally and sends it as a bearer token.
- The server verifies access tokens in `authenticate` middleware.
- `requireRole("ADMIN")` and `requireRole("GUEST")` protect role-specific routes.
- The Prisma `User.role` enum currently contains `ADMIN` and `GUEST`.
- The frontend protects admin routes with `ProtectedRoute` and protects guest account routes with the guest role.
- Account status is checked during login; inactive or suspended users cannot authenticate.

## Payment workflow

The current implementation uses receipt submission and administrator review rather than an integrated payment gateway:

1. An authenticated guest creates a reservation. The booking starts as `PENDING`.
2. The guest submits an amount, payment method, and a PDF/JPG/PNG/WEBP receipt through `/my-bookings/:id/payments`.
3. The server stores the receipt data with an `UNPAID` payment record. Receipts are limited to 8 MB.
4. An administrator reviews the record in payment management and approves or rejects it.
5. Approval changes the payment to `PAID`; if the booking is still `PENDING`, the service changes it to `CONFIRMED`.
6. An administrator checks in only confirmed bookings and checks out only checked-in bookings. Check-out changes the booking to `CHECKED_OUT` and the room to `CLEANING`.

The code supports `UNPAID`, `PARTIAL`, `PAID`, `REFUNDED`, and `FAILED` payment statuses and multiple payment records per booking. It does not implement a separate automatic “advance payment before check-in / balance payment at checkout” calculation; payment amounts are submitted and reviewed as records.

## Deployment

The repository does not include deployment manifests or a verified production deployment. A deployment should preserve the same runtime boundaries:

1. Build the client with `npm run build` in `client` and serve the generated `client/dist` using a static hosting service.
2. Run the server with `npm start` in `server` on a Node.js host.
3. Provide a production PostgreSQL `DATABASE_URL`; the Prisma datasource is PostgreSQL and the example is compatible with Neon.
4. Set `CLIENT_URL` to the deployed frontend origin and `VITE_API_URL` to the deployed API’s `/api/v1` URL before building the frontend.
5. Provide strong JWT secrets and Cloudinary credentials when media uploads are enabled.
6. Run Prisma Client generation and the appropriate migration command as part of the server release process.

These are deployment requirements derived from the checked-in configuration, not a claim that the application is currently deployed.

## Contributing

1. Create a focused branch for your change.
2. Keep frontend and backend changes scoped to the feature being addressed.
3. Update Prisma migrations when changing the database schema.
4. Update this README when scripts, environment variables, routes, or user-facing behavior change.
5. Run the relevant checks before opening a pull request:

```bash
cd client
npm run build

cd ../server
npm run prisma:generate
```

The repository currently defines build and Prisma scripts but does not define a test or lint script in either package manifest.

## License

No `LICENSE` file is currently present in the repository. The backend package metadata contains `"license": "ISC"`, but that metadata alone should not be treated as a project license until the project owners add and confirm the intended license.
