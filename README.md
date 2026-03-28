# RentFit Web

Next.js frontend for RentFit: search, listings, maps, and AI chat backed by the RentFit API.

## Requirements

- Node.js **20+** (align with backend)
- Running the **rentfit-v1-be** API (local or deployed; see `../rentfit-v1-be` if you keep both repos side by side)

## Setup

```bash
npm install
cp .env.example .env
```

Set `NEXT_PUBLIC_API_URL` to your API base URL with **no trailing slash** (e.g. `http://localhost:8000` locally).

## Environment

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_API_URL` | Backend base URL. Must match an origin allowed by the API’s `CORS_ORIGIN` |
| `NEXT_PUBLIC_SITE_URL` | Canonical site URL for metadata and absolute asset URLs. On Vercel you can rely on `VERCEL_URL` if unset |

`NEXT_PUBLIC_*` variables are embedded at **build time**; redeploy after changing them on Vercel.

## Scripts

| Command | Description |
|--------|-------------|
| `npm run dev` | Next.js dev server (default [http://localhost:3000](http://localhost:3000)) |
| `npm run build` | Production build |
| `npm start` | Start production server (after `build`) |
| `npm run lint` | ESLint |

## Local development

1. Start MongoDB and the API (see the backend README), typically on port **8000**.
2. Point `.env` at the API:

   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8000
   ```

3. Run the app:

   ```bash
   npm run dev
   ```

The app uses **httpOnly session cookies** from the API (`withCredentials` / `credentials: "include"`). The frontend origin must be listed in the backend `CORS_ORIGIN`.

## Deploying on Vercel

1. Create a Vercel project from this repo.
2. Set **Environment Variables**:
   - `NEXT_PUBLIC_API_URL` — your deployed API origin, e.g. `https://your-api.vercel.app`
   - `NEXT_PUBLIC_SITE_URL` — your deployed app URL, e.g. `https://your-app.vercel.app` (recommended for stable metadata)
3. On the **backend** project, add your frontend URL to `CORS_ORIGIN` and avoid `AUTH_COOKIE_SAMESITE=lax` when UI and API are on different hosts.
4. Redeploy the frontend so `NEXT_PUBLIC_*` picks up new values.

## Tech stack

- [Next.js](https://nextjs.org/) 16 (App Router)
- React 19, TypeScript, Tailwind CSS
- [Vercel AI SDK](https://sdk.vercel.ai/) (`@ai-sdk/react`, `ai`) for chat
- Axios API client with credentials for JSON routes

## Related

- Backend: [rentfit-v1-be](../rentfit-v1-be) — Express API, MongoDB, OpenRouter chat.
