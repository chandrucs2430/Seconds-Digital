# Seconds Digital

Seconds Digital is a storefront and admin tool for a laptop sales, repair, and servicing business in Somarasampettai, Tiruchirappalli. The frontend is a React single-page app; the local API uses Express and SQLite.

## Features

- Responsive storefront with featured products, product search, and product-name filtering.
- Customer detail form and product detail view, with order enquiries handed off to WhatsApp.
- About, contact, and customer review summary pages.
- Admin sign-in, dashboard metrics, product creation and archiving, and order listing.
- Local SQLite storage for admin, customer, product, order, and visitor-event records; uploaded product images are served from `/uploads`.

The public storefront currently reads its nine products from `src/App.tsx`. Admin-created products are stored in SQLite and are not yet shown in the public catalog. Orders are initiated through WhatsApp; the API does not create an order record from that flow.

## Requirements

- Node.js 20 (the recommended version is recorded in `.mise.toml`).
- npm, included with Node.js.
- A modern browser. Internet access is needed for Google Fonts and product photos hosted by third parties.

Open the repository root as the workspace in VS Code. For Claude Code, start the session from the repository root and review `AGENTS.md` before making changes; it describes the app's framework and existing development-server setup. In either environment, run the commands below from the repository root.

Use npm for installation and scripts: `package-lock.json`, `run-dev.cmd`, and the VS Code tasks use npm. The repository also contains pnpm workspace/lock metadata; avoid mixing package managers or regenerating the npm lockfile with pnpm unless the project is intentionally migrated. From the VS Code terminal:

```powershell
node --version
npm ci
Copy-Item .env.example .env
```

Before running these commands, activate/install Node.js 20 and confirm `node --version` prints `v20.x`. `.mise.toml` pins this project to Node 20; the native SQLite dependency is not reliable under the workspace's system Node 24 runtime. Re-run `npm ci` after changing Node major versions so the SQLite native module matches the active runtime.

Create a private JWT secret of at least 32 characters and set it as `JWT_SECRET` in `.env`. For example, generate one with:

```powershell
node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"
```

The command prints a secret to your terminal; paste it into `.env` and do not commit or share that file. `.env` is ignored by Git.

To enable admin sign-in, also set `ADMIN_EMAIL` and `ADMIN_PASSWORD` in `.env`. The API creates that admin account on first startup. On later startups, the configured password is synchronized to the existing account. Leave both unset if admin sign-in is not needed.

## Environment

| Variable | Default | Purpose |
| --- | --- | --- |
| `JWT_SECRET` | Required | Signs admin sessions; must be at least 32 characters. |
| `ADMIN_EMAIL` | Unset | Email for the bootstrapped admin account. |
| `ADMIN_PASSWORD` | Unset | Password for the bootstrapped admin account. |
| `API_PORT` | `8787` | Express API port; Vite proxies `/api` and `/uploads` here. |
| `PORT` | `8443` | Vite development port and default preview port. |
| `PREVIEW_PORT` | `PORT` or `8443` | Optional Vite preview port override. |
| `FIGMA_DEV_SERVER_HOST` | `0.0.0.0` | Optional Vite host override for the managed preview environment. |

The API reads `.env` directly at startup. Keep variable names uppercase and use one `NAME=value` entry per line.

## Run and Verify

Start both the API and frontend together:

```powershell
npm run dev:all
```

Open `http://localhost:8443`. The API health endpoint is `http://localhost:8787/api/health`. The Windows helper `run-dev.cmd` performs basic setup checks before running the same combined command.

For separate processes, use two terminals:

```powershell
npm run dev:api
npm run dev
```

Available checks and build commands:

```powershell
npm run typecheck
npm run build
npm run preview
```

There are currently no configured lint or automated test scripts. Preview serves the production frontend and proxies API/upload requests to `API_PORT`; start `npm run dev:api` in another terminal before testing admin features in preview. A production deployment must provide an API process, HTTPS, and equivalent `/api` and `/uploads` routing.

## Project Map

| Path | Contents |
| --- | --- |
| `src/App.tsx` | Storefront pages, product data, customer flows, and admin UI. |
| `src/main.tsx` | React entry point. |
| `src/index.css` | Tailwind CSS v4 import, fonts, theme tokens, and global styles. |
| `server/index.mjs` | Express API, SQLite schema, admin authentication, and image upload handling. |
| `scripts/dev.mjs` | Starts and manages the API and Vite as one development command. |
| `public/assets/` | Local storefront background image. |
| `public/uploads/` | Product image uploads; created if missing. |
| `data/seconds-digital.sqlite` | SQLite database used and migrated by the API; a database file is already tracked in this workspace. |
| `vite.config.mts` | Vite, Tailwind, aliases, ports, and API proxies. |
| `index.html` | Browser metadata and SPA mount point. |
| `.env.example` | Safe template containing variable names but no credentials. |

The storefront logo and hero background are served locally. Product photos for most hardcoded products and the Fraunces, Outfit, and Caveat fonts are loaded from external hosts, so those assets require network access. Replace them with properly licensed local assets if offline use is required.

The WhatsApp order number is the `WHATSAPP_NUMBER` constant near the top of `src/App.tsx`; the WhatsApp, map, Instagram, and YouTube contact URLs are configured in `AboutPage` in the same file. Product names, pricing, descriptions, and image sources are in the `PRODUCTS` array there. Confirm these business details and third-party asset rights before publishing.

The API stores its database in `data/` and uploads in `public/uploads/` when those directories are writable. If the workspace is read-only, it falls back to an `seconds-digital-website` directory under the operating system's temporary directory; that fallback data may not be persistent.

## Troubleshooting

- **API exits immediately:** check that `.env` exists and `JWT_SECRET` contains at least 32 characters. The starter template intentionally leaves it blank.
- **Admin login is rejected:** set `ADMIN_EMAIL` and `ADMIN_PASSWORD`, restart the API, and use those values. Do not store real credentials in the repository.
- **Port is already in use:** set `PORT` and/or `API_PORT` in `.env`; keep Vite's API proxy and the API port aligned.
- **SQLite native module fails to install or the API crashes at runtime:** use Node.js 20 from `.mise.toml`, confirm `node --version` reports `v20.x`, and run `npm ci` again under that runtime.
- **Images or fonts are missing:** check network access for external images and Google Fonts. Locally uploaded images are saved under `public/uploads/`.
- **Preview shows the storefront but admin requests fail:** run `npm run dev:api` separately and confirm `API_PORT` matches the configured preview proxy.
- **Database contents matter:** the current SQLite database is tracked in this workspace. Do not use it for real customer or production data. Back it up before replacing or moving the workspace; if the API had to use its temporary-directory fallback, back up that location instead.

## Known Limitations

- Public products are hardcoded and are not synchronized with admin-managed SQLite products.
- WhatsApp is an external order handoff; no payment processing or server-side order creation is implemented.
- Admin credentials must be configured manually. No default credentials are provided.
- Production deployment, database backup policy, and external service credentials/ownership remain operator responsibilities.