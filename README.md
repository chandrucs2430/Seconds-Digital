# seconds-digital-web

React + Vite frontend, Express + SQLite backend. Client is a local laptop/repair shop in Trichy.

## setup

1. `npm i`
2. `npm run dev:api` (backend starts on 8787)
3. `npm run dev` (frontend)

**Note on DB:** 
Make sure you are using Node 20. If you use Node 22+, `node-gyp` will throw a massive C++ compile error when installing `better-sqlite3`. Don't waste time on it, just use v20.

## env vars
Don't forget to create a `.env` file from `.env.example`. Without the JWT secret, the admin panel auth will crash.

## TODOs / Technical debt
- [ ] UI is still loading some hardcoded products from `App.tsx`. Need to wire this up to the SQLite db properly.
- [ ] WhatsApp order flow is just opening a generic link right now.
- [ ] Move from SQLite to Postgres before we put this on a real server. SQLite locks up too easily.
- [ ] Fix the weird padding on mobile header.