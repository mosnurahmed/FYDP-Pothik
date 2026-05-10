# Pothik

Pothik is a tour management web application built around a single research question: how can a small Bangladeshi travel agency run group tours without wasting seats, time, or money on the operational side? The product is the practical implementation of an academic framework on vehicle usage optimization for tour purposes, applied to the kind of agency that does not own a dispatch system, a CRM, or a custom backend — but still needs all three.

This repository is the working prototype. It is being maintained as a portfolio piece while continuing to evolve from the original undergraduate thesis work.

## Background

The application takes its theoretical grounding from the following peer-reviewed paper:

> **Sarna, N. J., Ahmed, M., Rithen, F. A., and Islam, M. M.** *A Framework of Vehicle Usage Optimization for Tour Purposes.* Applied Sciences, MDPI, Vol. 13, Issue 19, 10973 (October 2023). [https://www.mdpi.com/2076-3417/13/19/10973](https://www.mdpi.com/2076-3417/13/19/10973)

The paper studies how Bangladeshi tour agencies lose money to empty seats, ad-hoc tour-guide assignments, and poor package discoverability. It proposes a matrix-based optimization model for filling buses across origin and destination routes, an algorithm for bundling tours with guides, and a database-backed system to operate the model in production. Pothik is the engineering side of that work — the live platform that operationalises the framework and gives a real agency something it can run on.

## What the platform does

Pothik is a transport-only group tour aggregator. It does not arrange hotels and it does not arrange food. The agency’s value is the bus, the route, and the timing — the three things travellers find hardest to coordinate themselves.

There are three audiences:

**Travellers** browse curated multi-day or single-day tours, see the day-by-day itinerary and the spots the bus will visit, pick a pickup point closest to their home, book seats for adults and children (infants travel free), and receive an electronic ticket.

**Admins** create tour packages with cover photos, galleries, ordered sightseeing spots (each with a stay duration), pickup points (each with arrival and return times), pricing, capacity, and a minimum-traveller floor below which a tour cannot run. They publish, close, or cancel tours, manage the bus fleet, and monitor bookings as they come in.

**The system** is the third actor. As bookings accumulate, it computes the live pickup-point distribution, suggests bus configurations the admin can apply with one click, and flags overloaded assignments. This is the matrix-driven optimization step from the paper — translated from a static algorithm into a live operational dashboard.

## How it actually works

A user’s journey through Pothik is shaped around one principle: the agency should never have to ask the user a question the system can answer. So the platform makes deliberate trade-offs.

When a user opens a tour, the price they see is the price they pay. The number of seats remaining is computed in real time across all confirmed and pending bookings. When they book, capacity is verified inside an atomic database transaction — two users hitting "confirm" at the same moment cannot push the tour past its limit, even by one seat.

When an admin opens a tour package, they see a horizontal bar chart of bookings grouped by pickup point. Below it the system proposes one or two bus configurations: a single-bus solution if any bus in the fleet can hold the entire passenger list, and a greedy multi-bus split that places the highest-demand pickup points on the largest buses. The admin accepts a suggestion and every assignment is created in a single sweep. They can also override manually — pick a bus, check off the pickup points it will serve, and the load bar updates as they go.

Tour status flows through a small state machine: a draft becomes published, a published tour can be closed to bookings or cancelled, and the system refuses to publish a tour with no spots or no pickup points. These rules sit in the domain layer, not in the form, so they hold whether the request comes from the admin form, the API, or a future automation script.

## Architecture

The project is structured for the next year of changes, not just the current screenshot. Three principles drive that.

**The first is that pages and route handlers do not talk to the database.** All Prisma access lives in `lib/<domain>/queries.ts` and `lib/<domain>/mutations.ts`. The four domains today are `tours`, `bookings`, `admin`, and `auth`, with a `shared/` folder for cross-cutting code. When a future change requires caching, replication, or splitting a domain into its own service, the call sites do not move.

**The second is that validation has one source of truth.** Each domain has a `schemas.ts` file written in Zod. The same schema validates the form input on the client, the request body in the API route, and the data going into the database. Type inference flows from there into every component that touches a tour or a booking.

**The third is that errors are domain objects, not HTTP status codes.** `NotFoundError`, `ValidationError`, `CapacityExceededError`, `UnauthorizedError`, and `ForbiddenError` are thrown from within business logic and translated to HTTP at exactly one place — the `apiHandler` wrapper. Business logic stays HTTP-agnostic, which keeps it testable and portable.

Authentication uses NextAuth with credential-based login. Role checks are funnelled through `requireUser`, `requireAdmin`, and a generic `requireRole(...allowed)` helper, so the day a `TOUR_LEADER` or `ACCOUNTANT` role is added it is a single enum change in Prisma plus a flag in the call site.

## Tech stack

| Layer        | Choice                                |
|--------------|---------------------------------------|
| Framework    | Next.js 14 (App Router)               |
| Language     | TypeScript (strict)                   |
| Styling      | Tailwind CSS, custom design tokens    |
| Animations   | Framer Motion                         |
| Database     | PostgreSQL via Prisma ORM             |
| Auth         | NextAuth (Credentials)                |
| Validation   | Zod                                   |
| Icons        | Lucide React                          |
| Notifications| react-hot-toast                       |
| Hosting      | Vercel + Prisma Postgres / Neon       |

## Running it locally

You will need Node 18 or newer and a Postgres database. The simplest path is Prisma Postgres through the Vercel dashboard, but any Postgres provider works.

```bash
cd Pothik-v2
npm install
cp .env.example .env
# fill in DATABASE_URL, NEXTAUTH_SECRET, NEXTAUTH_URL
npm run db:push
npm run db:seed
npm run dev
```

The seed inserts five sample tours (Cox’s Bazar three-day, Sajek three-day, Sundarbans two-day, Sonargaon day trip, Sylhet tea country day trip), four buses, and two demo accounts:

| Email              | Password       | Role  |
|--------------------|----------------|-------|
| `admin@pothik.bd`  | `admin123`     | ADMIN |
| `demo@pothik.bd`   | `password123`  | USER  |

Useful scripts:

| Command              | What it does                              |
|----------------------|-------------------------------------------|
| `npm run dev`        | start dev server                          |
| `npm run db:push`    | apply schema changes                      |
| `npm run db:seed`    | populate sample data                      |
| `npm run db:reset`   | wipe, re-push, re-seed                    |
| `npm run db:studio`  | open Prisma Studio (visual DB browser)    |
| `npm run build`      | production build                          |

## Deploying to Vercel

Push the repo to GitHub, import it at vercel.com/new, and Vercel detects Next.js automatically. Add a Prisma Postgres database from the Storage tab — `DATABASE_URL` is injected for you. Set `NEXTAUTH_SECRET` (a fresh value for production) and `NEXTAUTH_URL` (your live domain) in the project’s environment variables. Trigger a deploy.

For the very first deploy, run the seed against the production database once from your local machine:

```bash
DATABASE_URL="<production-postgres-url>" npm run db:push
DATABASE_URL="<production-postgres-url>" npm run db:seed
```

After this, schema changes are pushed via `prisma db push` from CI or local with the production URL.

## Project layout

```
Pothik-v2/
├── app/
│   ├── api/                              thin route handlers, delegate to lib/
│   ├── tours/                            public tour browsing + booking
│   │   └── [slug]/book/success/[code]/
│   ├── dashboard/                        traveller dashboard
│   ├── admin/                            admin panel
│   ├── login/  register/  about/
│   └── page.tsx                          landing
├── components/
│   ├── home/  tours/  booking/  admin/  layout/
├── lib/
│   ├── tours/                            schemas, queries, mutations
│   ├── bookings/
│   ├── admin/                            fleet, assignments, suggestions
│   ├── auth/                             NextAuth + RBAC helpers
│   └── shared/                           errors, apiHandler
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
└── types/
    └── next-auth.d.ts
```

## Roadmap

There are several pieces still on the bench. Payment integration through SSLCommerz is the immediate next step — at the moment a confirmed booking is treated as paid, which is fine for demonstration but not for production. Email confirmations through Resend are queued behind that. Image uploads still rely on URLs; an S3 or Cloudinary adapter is straightforward but unwritten. Live route tracking on the day of a tour, PDF tickets with QR codes, a reviews module, and a `TOUR_LEADER` dispatch role are all in the longer-term plan.

## Authors and credits

This project began as the undergraduate Final Year Design Project at United International University, Dhaka. The research and the implementation that followed it were carried out by:

- **Mosnur Ahmed** — main developer, system design, frontend & backend implementation
- **Nusrat Jahan Sarna** — co-author, research design, optimization model
- **Farzana Ahmed Rithen** — co-author, research design, system architecture

The platform you see in this repository is the continuing work of Mosnur Ahmed.

## License

This repository is shared for portfolio and educational reference. If you intend to use the optimization framework or the codebase commercially, please get in touch through the contact details in the published paper.
