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

### 1. Backend

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

## License

Personal / educational use.
