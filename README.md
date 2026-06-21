# DevCollect

A personal knowledge-management app for developers. Save what you learn as blogs, organize them by category, attach source links, and embed code snippets — including **runnable Python** that executes right in the browser.

## Features

- **Login** — simple JWT auth, one admin user seeded from `.env`
- **Categories** — create, edit, delete (Data Structures, Algorithms, Web Development, Git, etc.)
- **Blogs**
  - Create / view / edit / delete inside any category
  - Rich content blocks: paragraphs, headings, syntax-highlighted code
  - Add multiple **source links** per blog
  - Mark Python code blocks as **runnable** — executes in-browser via Pyodide
- **Search & filter** by category, title, summary, or tag

## Tech stack

| Layer | Technology |
|-------|------------|
| Frontend | React 19 + TypeScript + Vite + Tailwind 4 |
| Routing | React Router |
| Code highlighting | react-syntax-highlighter |
| Python in browser | Pyodide |
| Backend | Node.js + Express + TypeScript |
| Database | MongoDB (Atlas or local) |
| Auth | JWT + bcrypt |

## Project layout

```
DevCollect/
  src/             # React app
    api/           # API client
    pages/         # Login, Home, BlogDetail, BlogEditor, CategoryManage
    components/    # Sidebar, KnowledgeCard, PythonRunner, etc.
  server/          # Express API
    src/
      models/      # User, Category, Blog
      routes/      # auth, categories, blogs
      scripts/     # seed.ts
  vite.config.ts
  docker-compose.yml  # optional local MongoDB
```

## Getting started

### Option A — one command (recommended)

```bash
cd DevCollect
npm install
cd server && cp .env.example .env   # first time: edit MONGODB_URI + JWT_SECRET
cd ..
npm run dev:all
```

Starts **API** (port 4000) and **frontend** (port 5173) together.

### Option B — two terminals

**Terminal 1 — Backend**

```bash
cd server
cp .env.example .env
# edit .env: set MONGODB_URI (Atlas or local) and JWT_SECRET
npm install
npm run seed     # creates admin user + default categories
npm run dev      # API on http://localhost:4000
```

### 2. Frontend

In a second terminal:

```bash
npm install
npm run dev      # app on http://localhost:5173
```

Open the URL and sign in with the email/password you set as `ADMIN_EMAIL` / `ADMIN_PASSWORD` in `server/.env`.

## Troubleshooting

| Problem | Fix |
|---------|-----|
| `ECONNREFUSED` / no data loads | Start the API: `cd server && npm run dev`, or use `npm run dev:all` |
| `querySrv ENOTFOUND` on API start | Your Atlas hostname is wrong or cluster was deleted — copy a fresh URI from [MongoDB Atlas](https://cloud.mongodb.com) |
| Frontend on port 5174 | Normal when 5173 is busy; API proxy still works |
| `npm run dev` fails in parent folder | Run commands inside `DevCollect/`, not `DevCollection/` |

## Environment variables (`server/.env`)

| Variable | Purpose |
|----------|---------|
| `MONGODB_URI` | MongoDB connection string |
| `JWT_SECRET` | Long random string for signing tokens |
| `JWT_EXPIRES_IN` | e.g. `7d` |
| `PORT` | API port (default `4000`) |
| `CORS_ORIGIN` | Frontend URL (default `http://localhost:5173`) |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | Seed admin credentials |

## API overview

All routes require a Bearer token except `POST /api/auth/login`.

- `POST /api/auth/login`
- `GET  /api/auth/me`
- `GET /POST/PUT/DELETE /api/categories`
- `GET /POST/PUT/DELETE /api/blogs`

## Scripts

In `DevCollect/`:

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Type-check and build production bundle |
| `npm run lint` | Run ESLint |

In `DevCollect/server/`:

| Command | Description |
|---------|-------------|
| `npm run dev` | Start API with hot reload |
| `npm run seed` | Seed admin user and default categories |
| `npm run build` | Compile TypeScript to `dist/` |

## Deploy to Vercel

The app deploys as **one Vercel project**: React frontend (static) + Express API (serverless function at `/api`).

### Prerequisites

1. **MongoDB Atlas** cluster (free tier is fine)
   - Network Access → **Allow access from anywhere** (`0.0.0.0/0`) — required for Vercel
   - Connection string must include a database name, e.g. `/devcollect`
2. **GitHub** repo with this project pushed
3. **Vercel** account at [vercel.com](https://vercel.com)

### 1. Push code to GitHub

```bash
cd DevCollect
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

### 2. Import project on Vercel

1. Vercel Dashboard → **Add New** → **Project**
2. Import your GitHub repository
3. **Root Directory:** `DevCollect` (if the repo root is `DevCollection`; otherwise leave as `.`)
4. Framework Preset: **Vite** (auto-detected)
5. Build Command: `npm run build:vercel` (from `vercel.json`)
6. Output Directory: `dist`

### 3. Environment variables

In Vercel → Project → **Settings** → **Environment Variables**, add:

| Variable | Value | Notes |
|----------|-------|-------|
| `MONGODB_URI` | `mongodb+srv://...` | Atlas URI with `/devcollect` db name |
| `JWT_SECRET` | long random string | e.g. `openssl rand -base64 32` |
| `JWT_EXPIRES_IN` | `7d` | optional |
| `CORS_ORIGIN` | `https://your-app.vercel.app` | your production URL |
| `ADMIN_EMAIL` | your email | for seeding only |
| `ADMIN_PASSWORD` | secure password | for seeding only |

Do **not** set `VITE_API_URL` on Vercel — the frontend calls `/api` on the same domain.

Apply variables to **Production**, **Preview**, and **Development**.

### 4. Deploy

Click **Deploy**. Vercel will run `npm install`, build the server + frontend, and publish.

### 5. Seed the database (first time)

From your machine (with `server/.env` pointing to the **same** Atlas database):

```bash
cd server
npm run seed
```

This creates your admin user and default categories.

### 6. Verify

- Open `https://your-app.vercel.app` — login page loads
- Open `https://your-app.vercel.app/api/health` — should return `{"status":"ok"}`
- Sign in with `ADMIN_EMAIL` / `ADMIN_PASSWORD`

### Troubleshooting (production)

| Problem | Fix |
|---------|-----|
| API 500 / health fails | Check `MONGODB_URI` and `JWT_SECRET` in Vercel env vars |
| MongoDB timeout | Atlas → Network Access → allow `0.0.0.0/0` |
| CORS error | Set `CORS_ORIGIN` to your exact Vercel URL (preview `*.vercel.app` works automatically) |
| Login fails | Run `npm run seed` in `server/` against production DB |
| Blank page on refresh | `vercel.json` SPA rewrite should handle this — redeploy if missing |

### Local vs production

| | Local | Vercel |
|--|-------|--------|
| Frontend | `npm run dev` (port 5173) | Static from `dist/` |
| API | `npm run dev --prefix server` (port 4000) | Serverless `/api` |
| Start both | `npm run dev:all` | N/A |

## License

Personal / educational use.
