# NREMT Master AI (MVP)

Next.js App Router MVP with Supabase auth/data, Stripe subscriptions, protected drills, attempt logging, and dashboard scoring.

## 1) Prerequisites

- Node 20+
- Supabase project
- Stripe account + monthly price
- Stripe CLI (for local webhook testing)

## 2) Install & configure

```bash
npm install
cp .env.example .env.local
```

Fill `.env.local` values:

- `NEXT_PUBLIC_APP_URL` (usually `http://localhost:3000`)
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (server only)
- `STRIPE_SECRET_KEY` (server only)
- `STRIPE_WEBHOOK_SECRET` (server only)
- `STRIPE_PRICE_ID` (monthly subscription price)

## 3) Run SQL migration

Run this migration in Supabase SQL editor:

- `supabase/migrations/202602270001_init.sql`

This creates:

- `profiles`
- `subscriptions`
- `attempts`
- user profile trigger from `auth.users`
- RLS policies so users only access their own rows

## 4) Start local app

```bash
npm run dev
```

App routes:

- Public: `/`, `/pricing`, `/login`, `/signup`
- Paid-only: `/app/dashboard`, `/app/practice`, `/app/history`

## 5) Stripe webhook local testing

In a separate terminal:

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

Copy the generated webhook secret into `STRIPE_WEBHOOK_SECRET`.

Then trigger test events (or run real checkout):

```bash
stripe trigger checkout.session.completed
stripe trigger customer.subscription.updated
stripe trigger invoice.payment_failed
```

## 6) Notes

- Middleware checks auth + paid status for `/app/*`.
- Server-side guard in `app/app/layout.tsx` re-checks paid status.
- Stripe webhook verifies signatures and updates `subscriptions` table.
- Drill questions are hardcoded in `lib/questions/bank.ts` for easy future AI swap.
