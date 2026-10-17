# Seconds Digital

[![Deploy to GitHub Pages](https://github.com/chandrucs2430/Seconds-Digital/actions/workflows/deploy.yml/badge.svg)](https://github.com/chandrucs2430/Seconds-Digital/actions/workflows/deploy.yml)
[![Live Site](https://img.shields.io/badge/Live_Site-GitHub_Pages-22c55e?style=flat&logo=github)](https://chandrucs2430.github.io/Seconds-Digital/)

**Seconds Digital** is a full-stack e-commerce storefront and administration platform for tested branded laptops, computer sales, repairs, and servicing in Somarasampettai, Tiruchirappalli.

- **Live Storefront:** [https://chandrucs2430.github.io/Seconds-Digital/](https://chandrucs2430.github.io/Seconds-Digital/)
- **Repository:** [https://github.com/chandrucs2430/Seconds-Digital](https://github.com/chandrucs2430/Seconds-Digital)

---

## Architecture & Tech Stack

```
                                  ┌───────────────────────────────┐
                                  │      Client (Browser)         │
                                  └──────────────┬────────────────┘
                                                 │
                        ┌────────────────────────┴────────────────────────┐
                        │                                                 │
                        ▼                                                 ▼
             ┌─────────────────────┐                          ┌───────────────────────┐
             │   Static Frontend   │                          │    Express Backends   │
             │   React 19 + Vite   │                          ├───────────────────────┤
             │   Tailwind CSS 4    │                          │ • SQLite Local API    │
             │   TypeScript 5.7    │                          │ • Prisma Postgres API │
             └─────────────────────┘                          └───────────────────────┘
```

### Frontend (`src/`)
- **React 19** with **TypeScript** for reactive storefront views, cart management, and admin dashboard.
- **Vite 8** with **Tailwind CSS 4** via `@tailwindcss/vite` for optimized styling and instant hot module replacement (HMR).
- **Responsive Layouts**: Designed for mobile and desktop with product filters, modal previews, and WhatsApp order handoffs.

### Backend Services (`server/`)
1. **Storefront & Admin API (`server/index.mjs`)**:
   - Lightweight Express 5 API backed by **SQLite** (`better-sqlite3`).
   - Handles admin authentication, JWT sessions, product catalog CRUD, visitor analytics, and multipart image uploads.
2. **Enterprise Cloud API (`server/api/`)**:
   - TypeScript Express API powered by **Prisma ORM** with **PostgreSQL / Neon Cloud Database**.
   - Input validation with **Zod**, rate-limiting with `express-rate-limit`, and security headers via `helmet`.

---

## Directory Structure

```text
Seconds-Digital-main/
├── .github/
│   └── workflows/
│       └── deploy.yml            # Automated CI/CD deployment to GitHub Pages
├── prisma/
│   └── schema.prisma             # PostgreSQL schema definition & models
├── migrations/                   # Database migration history
├── data/
│   └── seconds-digital.sqlite    # Local SQLite database
├── public/                       # Static public assets (Favicon, Logo, Uploads)
│   ├── seconds-digital-logo.jpg  # Optimized branding logo
│   └── assets/                   # Public media assets
├── src/                          # Pure React + Vite Frontend
│   ├── assets/                   # Bundled media (DELL.jpg, Wallpaper, Video)
│   ├── data/
│   │   └── products.ts           # Product catalog definitions & types
│   ├── App.tsx                   # Storefront pages, cart, and admin UI
│   ├── main.tsx                  # React entrypoint
│   ├── index.css                 # Global CSS & Tailwind CSS 4 theme tokens
│   └── vite-env.d.ts             # Vite TypeScript declarations
├── server/                       # Backend APIs
│   ├── index.mjs                 # SQLite Express API (local development)
│   └── api/                      # Enterprise TypeScript Prisma API
│       ├── controllers/          # Business logic (auth, shop)
│       ├── middlewares/          # JWT auth & security middlewares
│       ├── routes/               # API route definitions
│       ├── prisma/               # Prisma client singleton (db.ts)
│       └── index.ts              # Server entrypoint
├── scripts/                      # Developer utility scripts
│   ├── dev.mjs                   # Orchestrates both Vite and Express simultaneously
│   └── login-check.mjs           # Automated admin login verification script
├── .env.example                  # Environment configuration template
├── package.json                  # Unified dependency manifest and run scripts
├── tsconfig.json                 # TypeScript compiler configuration
├── vite.config.mts               # Vite configuration (port 8443, proxies to API)
└── vite.config.ts                # TypeScript delegation stub for toolchains
```

---

## Quick Start & Installation

### Prerequisites
- **Node.js**: v20.x, v22.x, or v24.x (`v24.21.0` supported with prebuilt binaries).
- **npm**: v10+ (included with Node.js).

### Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/chandrucs2430/Seconds-Digital.git
   cd Seconds-Digital
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment**:
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

   Generate a secure 32+ character JWT secret and set it in `.env`:
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

   Configure `.env` options:
   ```env
   API_PORT=8787
   PORT=8443
   JWT_SECRET="your-generated-jwt-secret-min-32-chars"
   ADMIN_EMAIL="admin@secondsdigital.com"
   ADMIN_PASSWORD="adminpassword123"
   DATABASE_URL="postgresql://user:password@host/dbname?sslmode=require"
   ```

---

## Available Scripts

| Command | Action |
| :--- | :--- |
| `npm run dev:all` | **Recommended**: Starts both the Express API (`:8787`) and Vite frontend (`:8443`) in one command. |
| `npm run dev` | Runs only the Vite frontend development server (`http://localhost:8443`). |
| `npm run dev:api` | Runs the SQLite Express backend server (`http://localhost:8787`). |
| `npm run dev:server` | Runs the TypeScript Prisma/Postgres backend server using `tsx`. |
| `npm run check:login` | Tests admin authentication against the active API and prints session token. |
| `npm run typecheck` | Runs TypeScript static analysis (`tsc --noEmit`) with zero errors. |
| `npm run build` | Builds the production bundle to `dist/` with optimized assets. |
| `npm run preview` | Serves the production build locally with API proxies. |

---

## Environment Variables

| Variable | Default | Purpose |
| :--- | :--- | :--- |
| `JWT_SECRET` | Required | Cryptographic secret for signing admin session tokens (min 32 chars). |
| `API_PORT` | `8787` | Port for the Express SQLite API; Vite proxies `/api` and `/uploads` here. |
| `PORT` | `8443` | Port for the Vite development server and preview server. |
| `ADMIN_EMAIL` | Optional | Bootstraps or updates the administrator account on API start. |
| `ADMIN_PASSWORD` | Optional | Bootstraps or updates the administrator password on API start. |
| `DATABASE_URL` | Optional | PostgreSQL connection string for the Prisma Enterprise Cloud API. |

---

## Deployment

The storefront is automatically built and deployed to **GitHub Pages** via [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) on pushes to `main`.

- Production base path: `/Seconds-Digital/`
- Direct link: [https://chandrucs2430.github.io/Seconds-Digital/](https://chandrucs2430.github.io/Seconds-Digital/)

---

## License

This project is proprietary and maintained for Seconds Digital, Somarasampettai, Tiruchirappalli. All rights reserved.