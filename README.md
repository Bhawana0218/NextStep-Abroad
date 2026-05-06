# 🎓 Help Study Abroad — Admin Dashboard

> **Frontend Technical Assessment** — Built with Next.js 16, Material UI v9, Zustand, and the DummyJSON public API.

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![MUI](https://img.shields.io/badge/MUI-v9-1976d2?logo=mui)
![Zustand](https://img.shields.io/badge/Zustand-5-orange)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?logo=typescript)
![Recharts](https://img.shields.io/badge/Recharts-2-22b5bf)

---

## 📋 Table of Contents

- [Overview](#overview)
- [Live Demo](#live-demo)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Why Zustand?](#why-zustand)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Demo Credentials](#demo-credentials)
- [API Reference](#api-reference)
- [State Management Architecture](#state-management-architecture)
- [Performance Optimizations](#performance-optimizations)
- [Caching Strategy](#caching-strategy)

---

## 🌐 Overview

A fully functional, responsive admin dashboard built as part of the **Help Study Abroad Frontend Technical Assessment**. The application demonstrates real-world skills in:

- Authentication with protected routes
- REST API integration with DummyJSON
- Global state management with Zustand
- Data visualization with interactive charts
- Responsive UI with Material UI v9
- Performance optimization (memoization, debounce, caching)

---

## 🚀 Live Demo

> **Demo Credentials**
> - Username: `emilys`
> - Password: `emilyspass`

---

## ✨ Features

### 🔐 Authentication
- Login page with form validation via `react-hook-form`
- Password visibility toggle
- Token stored in Zustand (persisted to `localStorage`)
- Lightweight `isLoggedIn` cookie for middleware-level redirect
- Protected routes — unauthenticated users are redirected to `/login`
- Auto-redirect on token expiry (401 interceptor)

### 📊 Dashboard
- Animated welcome banner with logged-in user's avatar and role
- **6 stat cards** — Total Users, Products, Categories, Avg Price, Top Rating, Low Stock
- **Area chart** — Monthly activity trend (users + products)
- **Donut chart** — Gender distribution
- **Bar charts** — Age groups, price ranges
- **Horizontal bar chart** — Products by category
- **Radial bar chart** — Rating distribution
- **Scatter plot** — Price vs Rating (bubble size = stock)
- Top 5 rated products leaderboard
- Tech stack progress bars

### 👥 Users
- Responsive MUI table with avatar, name, email, gender, phone, company
- **Table / Card view toggle**
- Real-time search with 500ms debounce
- API-side pagination (limit + skip)
- Gender donut chart, age group bar chart, department chart
- Full user detail page with contact, company, address, physical stats

### 🛍️ Products
- Responsive product grid with image, title, price, category, rating
- Category filter dropdown (from `/products/categories` API)
- Real-time search with debounce
- API-side pagination
- Category pie chart, rating bar chart, price vs rating scatter plot
- Full product detail page with Swiper image carousel, discount badge, stock progress bar

---

## 🛠️ Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| [Next.js](https://nextjs.org) | 16.2.4 | React framework (App Router) |
| [React](https://react.dev) | 19 | UI library |
| [TypeScript](https://typescriptlang.org) | 5 | Type safety |
| [Material UI](https://mui.com) | v9 | UI component library |
| [Zustand](https://zustand-demo.pmnd.rs) | 5 | State management |
| [Recharts](https://recharts.org) | 2 | Charts & data visualization |
| [Axios](https://axios-http.com) | 1.x | HTTP client with interceptors |
| [React Hook Form](https://react-hook-form.com) | 7 | Form validation |
| [Swiper](https://swiperjs.com) | 12 | Image carousel |
| [React Hot Toast](https://react-hot-toast.com) | 2 | Toast notifications |
| [DummyJSON](https://dummyjson.com) | — | Public REST API |

---

## 🧠 Why Zustand?

> This is one of the most important architectural decisions in this project.

Zustand was chosen over Redux, Context API, and other alternatives for the following reasons:

### 1. Zero Boilerplate
Redux requires actions, action creators, reducers, selectors, and often middleware setup (Redux Toolkit still needs slices + store config). Zustand needs **one `create()` call** — the store, actions, and state live together.

```ts
// Redux approach — 4+ files, 50+ lines
// Zustand approach — 1 file, done:
const useStore = create((set) => ({
  count: 0,
  increment: () => set((s) => ({ count: s.count + 1 })),
}));
```

### 2. Built-in Async Actions
No need for `redux-thunk`, `redux-saga`, or `createAsyncThunk`. Async logic lives directly inside the store as plain `async` functions:

```ts
getUsers: async (page = 1) => {
  set({ loading: true });
  const data = await fetchUsers(10, (page - 1) * 10);
  set({ users: data.users, total: data.total, loading: false });
}
```

### 3. Tiny Bundle Size
- **Zustand**: ~1.1 KB gzipped
- **Redux Toolkit**: ~11 KB gzipped
- **MobX**: ~16 KB gzipped

For a small-to-medium app like this dashboard, Zustand's footprint is 10× smaller than Redux.

### 4. Built-in Persistence
The `persist` middleware serializes state to `localStorage` in one line — no extra libraries needed:

```ts
create(persist((set) => ({ ... }), { name: "auth-storage" }))
```

### 5. Selector-Based Subscriptions
Components only re-render when the specific slice they subscribe to changes — not the entire store:

```ts
// Only re-renders when `token` changes, not when `loading` changes
const token = useAuthStore((s) => s.token);
```

### 6. No Provider Wrapping
Redux requires wrapping the entire app in `<Provider store={store}>`. Zustand stores are module-level singletons — import and use anywhere.

### When to use Redux instead
Redux is better for very large teams where strict action-log traceability (Redux DevTools time-travel) is critical. For a small-to-medium dashboard like this, Zustand is the right tool.

---

## 📁 Project Structure

```
nextstep-abroad/
├── app/                        # Next.js App Router pages
│   ├── dashboard/page.tsx      # Dashboard with charts
│   ├── login/page.tsx          # Auth page
│   ├── products/
│   │   ├── page.tsx            # Products list + charts
│   │   └── [id]/page.tsx       # Product detail
│   ├── users/
│   │   ├── page.tsx            # Users list + charts
│   │   └── [id]/page.tsx       # User detail
│   ├── layout.tsx              # Root layout
│   └── providers.tsx           # MUI ThemeProvider (client)
│
├── components/
│   ├── common/                 # Shared components
│   │   ├── Loader.tsx          # Skeleton loaders
│   │   ├── Navbar.tsx          # Top navigation bar
│   │   ├── PaginationComponent.tsx
│   │   ├── ProtectedRoute.tsx  # Client-side auth guard
│   │   ├── SearchBar.tsx       # Reusable search input
│   │   └── Sidebar.tsx         # Navigation drawer
│   ├── layout/
│   │   └── DashboardLayout.tsx # Sidebar + Navbar wrapper
│   ├── products/               # Product-specific components
│   │   ├── CategoryFilter.tsx
│   │   ├── ProductCard.tsx     # Memoized product card
│   │   ├── ProductCarousel.tsx # Swiper image gallery
│   │   ├── ProductDetails.tsx  # Full product detail view
│   │   └── ProductGrid.tsx
│   └── users/                  # User-specific components
│       ├── UserCard.tsx        # Memoized user card
│       ├── UserDetails.tsx     # Full user detail view
│       ├── UserSearch.tsx
│       └── UserTable.tsx       # Memoized user table
│
├── hooks/
│   ├── useAuth.ts              # Auth state convenience hook
│   ├── useDebounce.ts          # Generic debounce hook
│   └── usePagination.ts        # Pagination logic hook
│
├── services/                   # Axios API layer
│   ├── api.ts                  # Axios instance + interceptors
│   ├── authService.ts
│   ├── productService.ts
│   └── userService.ts
│
├── store/                      # Zustand stores
│   ├── authStore.ts            # Auth state + persist
│   ├── productStore.ts         # Products + caching
│   └── userStore.ts            # Users + caching
│
├── types/                      # TypeScript interfaces
│   ├── auth.types.ts
│   ├── product.types.ts
│   └── user.types.ts
│
├── utils/
│   ├── constants.ts            # Sidebar links
│   ├── helpers.ts              # formatPrice, truncate, etc.
│   └── storage.ts              # Safe localStorage helpers
│
├── middleware.ts               # Next.js edge middleware
├── next.config.ts
├── .env.local                  # Environment variables
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** >= 18.x
- **npm** >= 9.x (or yarn / pnpm)

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/nextstep-abroad.git
cd nextstep-abroad
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env.local` file in the project root (see [Environment Variables](#environment-variables) below):

```bash
cp .env.example .env.local
```

Or create it manually:

```bash
echo "NEXT_PUBLIC_API_URL=https://dummyjson.com" > .env.local
```

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Build for production

```bash
npm run build
npm run start
```

### 6. Lint

```bash
npm run lint
```

---

## 🔐 Environment Variables

Create a `.env.local` file in the root of the project:

```env
# Base URL for the DummyJSON public API
# No API key required — this is a public mock API
NEXT_PUBLIC_API_URL=https://dummyjson.com
```

### Token Storage

The auth token returned by DummyJSON is stored in two places:

| Storage | Key | Purpose |
|---|---|---|
| `localStorage` | `auth-storage` | Zustand `persist` middleware — survives page refresh |
| `document.cookie` | `isLoggedIn` | Lightweight flag readable by Next.js middleware for server-side redirect |

> **Note:** The token is a JWT returned by `POST /auth/login`. It is stored client-side only and never sent to any server other than `dummyjson.com`.

---

## 🔑 Demo Credentials

The app uses [DummyJSON](https://dummyjson.com/docs/auth) for authentication.

```
Username: emilys
Password: emilyspass
```

Any valid DummyJSON user credentials will work. You can find more at [dummyjson.com/users](https://dummyjson.com/users).

---

## 🌐 API Reference

All data comes from the [DummyJSON](https://dummyjson.com) public API. No API key required.

| Endpoint | Method | Description |
|---|---|---|
| `/auth/login` | POST | Authenticate user, returns JWT token |
| `/users?limit=10&skip=0` | GET | Paginated users list |
| `/users/search?q=...` | GET | Search users by name |
| `/users/{id}` | GET | Single user details |
| `/products?limit=10&skip=0` | GET | Paginated products list |
| `/products/search?q=...` | GET | Search products |
| `/products/category/{name}` | GET | Filter by category |
| `/products/{id}` | GET | Single product details |
| `/products/categories` | GET | All category names |

---

## 🏗️ State Management Architecture

Three Zustand stores manage all application state:

```
┌─────────────────────────────────────────────────────┐
│                   Zustand Stores                     │
│                                                     │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐ │
│  │  authStore  │  │  userStore  │  │productStore │ │
│  │             │  │             │  │             │ │
│  │ user        │  │ users[]     │  │ products[]  │ │
│  │ token       │  │ total       │  │ categories[]│ │
│  │ loading     │  │ page        │  │ total       │ │
│  │ error       │  │ cachedUsers │  │ cachedProds │ │
│  │             │  │             │  │             │ │
│  │ login()     │  │ getUsers()  │  │ getProducts │ │
│  │ logout()    │  │ searchUsers │  │ searchProds │ │
│  │             │  │ getSingle   │  │ filterByCat │ │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘ │
│         │                │                │         │
│    localStorage      API calls        API calls     │
│    (persisted)       + cache          + cache       │
└─────────────────────────────────────────────────────┘
```

### Auth Flow

```
User fills login form
       ↓
useAuthStore.login(payload)
       ↓
POST /auth/login → DummyJSON
       ↓
Store token in Zustand state
       ↓
Zustand persist → localStorage["auth-storage"]
       ↓
Set document.cookie "isLoggedIn=true"
       ↓
router.push("/dashboard")
       ↓
ProtectedRoute checks token after hydration
       ↓
Render dashboard ✓
```

---

## ⚡ Performance Optimizations

| Technique | Where Used | Why |
|---|---|---|
| `React.memo` | `ProductCard`, `UserTable`, `UserCard`, `SearchBar` | Prevents re-renders when parent state changes but props haven't |
| `useCallback` | Page-level handlers | Stable function references for memoized children |
| `useMemo` | Chart data derivations | Expensive array transforms only recompute when source data changes |
| `useDebounce` | Search inputs | Delays API calls by 500ms — avoids a request on every keystroke |
| API-side pagination | Users + Products | Only fetches 10 records at a time instead of loading all data |

---

## 💾 Caching Strategy

> **Why caching?** Without caching, navigating back to page 1 after visiting page 3 would fire a redundant API call for data we already have.

Both `userStore` and `productStore` implement a **page-level in-memory cache**:

```ts
// Before fetching, check if this page is already cached
if (cachedUsers[page]) {
  set({ users: cachedUsers[page], page });
  return; // ← skip the API call entirely
}

// After fetching, store the result
set((state) => ({
  cachedUsers: { ...state.cachedUsers, [page]: response.users },
}));
```

**Cache strategy:** Write-through, page-keyed, in-memory (lives for the session).  
**Cache invalidation:** Cleared on search (search results are not cached to avoid stale data).

---


## 👨‍💻 Author

#### Bhawana Bisht

Built with ❤️ for the **Help Study Abroad Frontend Technical Assessment**.

> For any questions, feel free to reach out via email.
