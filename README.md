# Seconds Digital

Seconds Digital is a storefront and admin tool for a laptop sales, repair, and servicing business in Somarasampettai, Tiruchirappalli. The frontend is a React single-page app; the API uses Express and SQLite.

## Tech Stack

- React 19 and TypeScript
- Vite 8 with Tailwind CSS 4
- Express 5, SQLite (`better-sqlite3`), and JWT-backed admin sessions
- npm scripts and lockfile; Node.js 20 is recommended

## Features

- Responsive storefront with featured products, product search, and product-name filtering.
- Customer detail form and product detail view, with order enquiries handed off to WhatsApp.
- About, contact, and customer review summary pages.
- Admin sign-in, dashboard metrics, product creation and archiving, and order listing.
- SQLite-backed administrator and product management, with uploaded product images served from `/uploads`.

The public storefront reads its nine products from `src/data/products.ts`. Admin-created products are stored in SQLite and are not yet shown in the public catalog. The database schema also defines customer, order, and visitor-event tables, but the current storefront does not populate them: customer details are included in the WhatsApp handoff, and orders are not recorded by the API.

## Requirements

- Node.js 20 (the recommended version is recorded in `.mise.toml`).
- npm, included with Node.js.
- A modern browser. Internet access is needed for Google Fonts and product photos hosted by third parties.

Use npm for installation and scripts. `package-lock.json`, `run-dev.cmd`, and the VS Code tasks use npm. The repository also contains pnpm workspace/lock metadata; do not regenerate one lockfile with a different package manager. From the repository root, run:

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
node --check login-check.mjs
```

There are no configured lint or automated test scripts. `login-check.mjs` is a manual API login check and requires `ADMIN_EMAIL` and `ADMIN_PASSWORD` in the environment. Preview serves the production frontend and proxies API/upload requests to `API_PORT`; start `npm run dev:api` in another terminal before testing admin features in preview.

## Deployment

The workflow at `.github/workflows/deploy.yml` builds and deploys the static frontend to GitHub Pages on pushes to `main` and on manual dispatch. The production base path is `/Seconds-Digital/`; update `vite.config.mts` if the repository is deployed under a different path.

GitHub Pages does not run the Express API. The storefront's WhatsApp handoff works independently, but admin login, product management, and uploaded images require a separately hosted API with HTTPS, persistent SQLite and upload storage, and `/api` and `/uploads` routing to that API. Configure the same environment variables documented above on the API host. The Pages workflow does not deploy or configure this backend.

## Project Map

| Path | Contents |
| --- | --- |
| `src/App.tsx` | Storefront pages, customer flows, and admin UI. |
| `src/data/products.ts` | Hardcoded storefront catalog and product type. |
| `src/main.tsx` | React entry point. |
| `src/index.css` | Tailwind CSS v4 import, fonts, theme tokens, and global styles. |
| `server/index.mjs` | Express API, SQLite schema, admin authentication, and image upload handling. |
| `scripts/dev.mjs` | Starts and manages the API and Vite as one development command. |
| `public/` | Storefront logo, hero image, and runtime product uploads. |
| `DELL.jpg`, `a_realiastic_drone_shot_of_tri.mp4` | Locally imported storefront media. |
| `data/seconds-digital.sqlite` | Tracked SQLite database used and migrated by the API. |
| `vite.config.mts` | Vite, Tailwind, aliases, ports, and API proxies. |
| `index.html` | Browser metadata and SPA mount point. |
| `Adminlogin.html` | Legacy redirect to the admin route. |
| `login-check.mjs` | Manual API authentication check. |
| `.env.example` | Safe template containing variable names but no credentials. |
| `.mise.toml` | Recommended Node.js version. |
| `.github/workflows/deploy.yml` | GitHub Pages frontend deployment workflow. |

The storefront logo and hero background are served locally. Product photos for most hardcoded products and the Fraunces, Outfit, and Caveat fonts are loaded from external hosts, so those assets require network access. Replace them with properly licensed local assets if offline use is required.

The WhatsApp order number and contact/social URLs are configured in `src/App.tsx`; product names, pricing, descriptions, and image sources are in `src/data/products.ts`. Confirm business details and third-party asset rights before publishing.

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

## Contributing

Keep changes focused and preserve the existing React/Vite/Express stack. Use npm, avoid committing `.env` files or real customer data, and run `npm run typecheck` and `npm run build` before submitting changes. There is no separate contribution policy or automated test suite at this time.

## License

No license has been selected for this repository, and no `LICENSE` file is present. The repository owner must choose a license after confirming ownership and redistribution rights for the source code and included assets. Until then, reuse and redistribution permissions are not granted by this repository.