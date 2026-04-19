# Fintrack Web (Next.js)

Frontend for [Fintrack](https://github.com/SaratAngajalaoffl/fintrack): personal finance UI built with the **App Router**, **React**, **TypeScript**, and **Tailwind CSS v4**. The Go API lives in **[fintrack-api](https://github.com/SaratAngajalaoffl/fintrack-api)**. Docker Compose and cross-repo docs live in the **[fintrack](https://github.com/SaratAngajalaoffl/fintrack)** meta-repository (this tree appears there as **`web/`** when using submodules).

## Layout (this repository)

- **`src/app/`** — App Router routes, layouts, `globals.css`.
- **`src/components/`** — `ui/` (kit + composed screens), `hooks/`, `icons/`.
- **`src/configs/`** — `app-routes.ts`, `api-routes.ts` (`getAppRoute`, `getApiRoute`).
- **`src/services/`** — API clients and React Query provider.
- **`src/lib/`** — Shared utilities, domain types, formatters.
- **`public/brand/`**, **`public/icons/`** — Static assets.
- **`deploy/`** — Dockerfiles for dev, test, and production builds.

## Run locally

```bash
npm install
cp .env.example .env.local
# Set NEXT_PUBLIC_API_ORIGIN (and optional API_ORIGIN) to your Go API base URL
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Session checks use **`GET /api/auth/me`** on the Go API (see **`src/middleware.ts`** and **`src/lib/auth/`**). Route and fetch conventions are documented in the meta-repo: [docs/web/](https://github.com/SaratAngajalaoffl/fintrack/tree/main/docs/web).

## Scripts

| Command           | Description                |
| ----------------- | -------------------------- |
| `npm run dev`     | Next.js development server |
| `npm run build`   | Production build           |
| `npm run start`   | Run production build       |
| `npm run lint`    | ESLint                     |
| `npm run format`  | Prettier (write)           |

**shadcn/ui** — run the CLI from this directory: `npx shadcn@latest add <component>` (see **`components.json`**).

## Docker / Compose

From a **meta-repo** checkout, Compose builds this app with **`context: ../web`** (see **`deploy/docker-compose.*.yml`**). **`Dockerfile.dev`** / **`Dockerfile.prod`** / **`Dockerfile.test`** live under **`deploy/`** here.

## Contributing

UI and frontend-only changes belong in **this** repository. Compose, submodule bumps, and shared **`docs/`** changes belong in the **fintrack** meta-repo. See **[docs/CONTRIBUTING.md](https://github.com/SaratAngajalaoffl/fintrack/blob/main/docs/CONTRIBUTING.md)** and **[AGENTS.md](https://github.com/SaratAngajalaoffl/fintrack/blob/main/AGENTS.md)** for conventions.
