# Pothik — Travel Bangladesh smarter

A modern, full-stack bus booking platform built with **Next.js 14**, **TypeScript**, **Tailwind CSS**, and **Prisma + Postgres**. Showcases real-time interactive seat selection, transparent pricing, and a portfolio-grade UI.

---

## What's inside

- **Landing page** — animated hero, popular routes, how-it-works, testimonials, CTA
- **Search & filters** — origin, destination, date, passengers
- **Interactive seat layout** — click-to-select seats with real-time availability
- **Booking flow** — passenger details, summary, instant confirmation with e-ticket
- **Authentication** — credential-based with NextAuth (login + register)
- **User dashboard** — bookings overview, booking history, profile
- **Responsive design** — mobile-first, polished on every breakpoint
- **Production-ready** — proper transactions, type safety, SEO metadata, error pages

---

## Tech stack

| Layer | Choice |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS, custom design tokens |
| Animations | Framer Motion |
| Database | PostgreSQL via Prisma ORM |
| Auth | NextAuth (Credentials) |
| Forms | React Hook Form + Zod |
| Icons | Lucide React |
| Deployment | Vercel + Vercel Postgres |

---

## Getting started locally

### 1. Clone & install

```bash
cd Pothik-v2
npm install
```

### 2. Get a Postgres database

The cleanest path: **Vercel Postgres**.

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard) → **Storage** → **Create Database** → **Postgres**.
2. Open the database → **`.env.local`** tab → copy the `POSTGRES_PRISMA_URL` value.
3. Paste it into `.env` as `DATABASE_URL`.

(Alternative: [Neon](https://neon.tech) or [Supabase](https://supabase.com) — both have free tiers and give you a `postgres://...` connection string.)

### 3. Configure environment

Copy the example and fill in values:

```bash
cp .env.example .env
```

Set:

- `DATABASE_URL` — your Postgres connection string
- `NEXTAUTH_SECRET` — generate with `openssl rand -base64 32`

### 4. Push schema & seed sample data

```bash
npm run db:push       # creates tables in your Postgres database
npm run db:seed       # inserts sample routes, buses, schedules, seats
```

### 5. Start the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Demo credentials

After seeding, you can log in with:

| Email | Password | Role |
|---|---|---|
| `demo@pothik.bd` | `password123` | User |
| `admin@pothik.bd` | `admin123` | Admin |

---

## Deploying to Vercel

1. Push this repository to GitHub.
2. Import the repo at [vercel.com/new](https://vercel.com/new).
3. Add a **Vercel Postgres** database from the Storage tab — Vercel injects `DATABASE_URL` automatically.
4. Add `NEXTAUTH_SECRET` and `NEXTAUTH_URL` (your production URL) in Project Settings → Environment Variables.
5. Deploy.

After the first deploy, run the seed once from your local machine pointing at the production database:

```bash
DATABASE_URL="<your-production-postgres-url>" npm run db:seed
```

---

## Project structure

```
Pothik-v2/
├── app/
│   ├── api/              # auth, register, bookings endpoints
│   ├── booking/          # booking flow + success page
│   ├── dashboard/        # protected user dashboard
│   ├── login/            # auth pages
│   ├── register/
│   ├── search/           # search results
│   ├── routes/           # popular routes
│   ├── about/
│   ├── layout.tsx        # root layout, fonts, providers, toaster
│   └── page.tsx          # landing page
├── components/
│   ├── home/             # Hero, Features, PopularRoutes, Stats, etc.
│   ├── layout/           # Header, Footer
│   ├── search/           # SearchBar
│   ├── bus/              # BusCard, SeatLayout, icons
│   └── booking/          # BookingPanel
├── lib/
│   ├── prisma.ts         # Prisma client singleton
│   ├── auth.ts           # NextAuth config
│   ├── utils.ts          # cn, formatters, helpers
│   └── constants.ts      # cities, amenities
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
└── types/
    └── next-auth.d.ts
```

---

## What this is showcasing

This project was built as a portfolio piece replacing an earlier student version. The earlier version used `json-server` as a backend and had limited interactivity. **Pothik-v2** demonstrates:

- **End-to-end full-stack engineering** — schema design, transactional booking, auth, RSC + client components.
- **Production patterns** — atomic seat reservation in a single Prisma transaction so two users can never book the same seat.
- **Design systems thinking** — custom Tailwind tokens (brand, accent, ink scales), component variants, consistent spacing & motion.
- **Attention to detail** — empty states, loading states, error pages, mobile responsiveness, accessibility (aria-labels on seats, semantic HTML).

---

## Roadmap

- [ ] Admin dashboard with route/bus/schedule CRUD
- [ ] SSLCommerz payment integration
- [ ] Email confirmation via Resend
- [ ] Live route tracking on a map
- [ ] PDF ticket download with QR code
- [ ] Reviews & ratings system

---

Built with care in Bangladesh.
