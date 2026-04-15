# Art & Animation Portfolio

An elegant portfolio for a 3D animator — built to earn interviews at studios
like Pixar, Walt Disney Animation, DreamWorks, ILM, and Sony Pictures
Animation.

- **Framework:** Next.js 15 (App Router) + React 19
- **Styling:** Tailwind CSS v4 + CSS variables
- **Motion:** Framer Motion (shared-element `layoutId` lightbox)
- **CMS:** Payload v3 mounted at `/admin` (same Next.js app)
- **Database:** Neon Postgres (free tier, scales to zero)
- **Media:** Cloudflare R2 (10 GB + unlimited free egress)
- **Video:** Vimeo embed (hero reel) + Mux free (breakdown clips)
- **3D:** Google `<model-viewer>` web component
- **Email:** Resend (contact form relay)
- **Runtime:** Bun locally, Node on Vercel
- **Hosting:** Vercel Hobby

Expected steady-state cost: **$0/month** at ~5K visitors/mo.

## Quick start

```bash
bun install
cp .env.example .env.local     # fill in secrets
bun run seed                   # categories + education defaults
bun run create-admin           # creates first (only) admin user
bun run dev                    # http://localhost:3000
```

Sign in at `http://localhost:3000/admin`.

## Environment

Required (see `.env.example`):

| Variable | Purpose |
|---|---|
| `POSTGRES_URL` | Neon pooled connection string |
| `POSTGRES_URL_UNPOOLED` | Neon direct connection for migrations |
| `PAYLOAD_SECRET` | 32+ char random (`openssl rand -hex 32`) |
| `NEXT_PUBLIC_SITE_URL` | Public site URL, no trailing slash |
| `R2_ACCOUNT_ID` | Cloudflare account ID |
| `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY` | R2 S3 API credentials |
| `R2_BUCKET` | e.g. `av-portfolio-media` |
| `R2_PUBLIC_URL` | Public domain on the R2 bucket |
| `RESEND_API_KEY` | For `/contact` email relay |
| `CONTACT_TO_EMAIL` | Where contact form submissions are delivered |

Optional:

| Variable | Purpose |
|---|---|
| `MUX_TOKEN_ID`, `MUX_TOKEN_SECRET` | For breakdown clip streaming |
| `ADMIN_EMAIL`, `ADMIN_PASSWORD` | Used by `create-admin` script |

## Content architecture

Five hard-coded discipline routes, DB-driven content via Payload:

- `/` — landing (hero reel + featured projects)
- `/reel` — full demo reel + shot breakdown
- `/animation` — 3D animation projects
- `/modeling` — 3D modeling with GLB viewers
- `/digital` — digital art
- `/drawing` — traditional & life drawing (dense masonry)
- `/projects/[slug]` — project detail
- `/about` — bio, education, résumé download
- `/contact` — form → Resend relay
- `/admin` — Payload CMS (single admin)

## Editing content

Sign in at `/admin`. You can:

- **Projects** — add, edit, drag to reorder, toggle Featured, publish/draft
- **Media** — upload images (sharp auto-sizes them), videos, GLB 3D models, PDFs. All stored on R2. Alt text is required.
- **Categories** — the five disciplines. Don't rename slugs.
- **Site Settings** — name, tagline, bio, reel Vimeo ID, résumé PDF, social links, education, default OG image

## Deployment (Vercel)

1. Create a Vercel project pointed at this repo.
2. Add all env vars from `.env.example` in the project settings.
3. Set region to match your Neon region (default `iad1`).
4. Push — Vercel builds automatically.

On the Neon side: use the free plan's *pooled* connection string for
`POSTGRES_URL` and the *direct* connection for `POSTGRES_URL_UNPOOLED`.

On the R2 side: create a bucket, attach a custom public domain, and add the
domain to `R2_PUBLIC_URL`. Also add the hostname to Next.js
`images.remotePatterns` (already wired via `R2_PUBLIC_URL` in `next.config.ts`).

## Scripts

- `bun run dev` — Next.js dev server (Turbopack)
- `bun run build` — production build
- `bun run typecheck` — TypeScript check
- `bun run lint` — ESLint
- `bun run seed` — seed categories + education defaults
- `bun run create-admin` — one-time admin user creation

## Studio-submission checklist

Before sending the site link to a recruiter:

1. Hero demo reel embedded, 1–2 minutes, 16:9, 1080p+ on Vimeo
2. Shot breakdown list on `/reel` with per-shot role, tools, and credits for non-self-made rigs
3. Life drawing section populated — Disney/Pixar weigh fundamentals heavily
4. Résumé PDF uploaded in Site Settings, one page, Maya listed first
5. Alt text on every image (CMS enforces this)
6. `NEXT_PUBLIC_SITE_URL` set so OG cards unfurl correctly on LinkedIn

## License

All artwork rights reserved to the artist. Code MIT (or change here).
