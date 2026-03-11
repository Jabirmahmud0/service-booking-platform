# BookEase

**Full-Stack Service Booking Platform**

![Version](https://img.shields.io/badge/version-1.0.0-blue) ![Status](https://img.shields.io/badge/status-Active%20Development-green) ![Delivery](https://img.shields.io/badge/delivery-48%20hours-orange)

BookEase is a production-grade service booking platform that enables end-users to browse a catalogue of services, select a preferred slot, complete a secure Stripe-powered payment, and receive an instant email confirmation — all within a polished, animated, mobile-first UI.

An integrated Admin Panel provides operators with a real-time dashboard to view, manage, and update all booking requests.

> **Problem:** Service businesses operating without digital booking lose an average of 30% of potential revenue to missed calls and manual scheduling friction. BookEase eliminates that gap with a zero-friction, payment-integrated booking flow accessible on any device.

---

## Tech Stack

| Layer | Technology | Rationale |
|---|---|---|
| Frontend Framework | Next.js 15 (App Router) | File-based routing, SSR/SSG, API Routes, built-in image optimisation |
| UI Library | React 19 (JS/JSX only) | Latest concurrent features |
| Styling | Tailwind CSS v4 | Utility-first CSS with Lightning CSS engine for instant HMR |
| Animation | Framer Motion 11 | Declarative spring animations; page transitions, card reveals, micro-interactions |
| Database | MongoDB Atlas (Mongoose) | Flexible document schema ideal for bookings |
| Payments | Stripe Checkout Sessions + Webhooks | PCI-compliant hosted checkout with webhook signature verification |
| Email | Resend + React Email | JSX-based email templates; 99.9% deliverability |
| Auth (Admin) | NextAuth.js v5 (Credentials) | Session-based admin auth with JWT; middleware-protected routes |
| Hosting | Vercel | Zero-config Next.js deployment; Edge Network CDN |
| CI/CD | GitHub Actions | Lint + build check on every push; auto-deploy to Vercel on merge to `main` |

---

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB Atlas account
- Stripe account
- Resend account

### Installation

```bash
git clone https://github.com/your-username/bookease.git
cd bookease
npm install
```

### Environment Variables

Create a `.env.local` file in the root of the project with the following variables:

```env
# MongoDB
MONGODB_URI=mongodb+srv://...

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# App
NEXT_PUBLIC_URL=http://localhost:3000

# Email (Resend)
RESEND_API_KEY=re_...

# Auth (NextAuth)
NEXTAUTH_SECRET=your-secret-here
NEXTAUTH_URL=http://localhost:3000
```

### Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Stripe Webhooks (Local)

Use the Stripe CLI to forward webhook events locally:

```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

---

## Project Structure

```
bookease/
├── app/
│   ├── (public)/
│   │   ├── page.jsx                  # Landing page
│   │   ├── services/page.jsx         # Service catalogue
│   │   ├── book/[serviceId]/         # Multi-step booking flow
│   │   ├── success/page.jsx          # Post-payment confirmation
│   │   └── cancel/page.jsx           # Payment cancelled
│   ├── (admin)/
│   │   ├── admin/login/page.jsx
│   │   └── admin/dashboard/          # Bookings + Services CRUD
│   └── api/
│       ├── checkout/route.js         # Create Stripe Checkout Session
│       ├── webhooks/stripe/          # Handle checkout.session.completed
│       ├── bookings/route.js         # CRUD for admin
│       ├── services/route.js         # CRUD for services
│       └── auth/[...nextauth]/       # NextAuth handler
├── components/
│   ├── ui/                           # Button, Input, Badge, Modal, Spinner
│   ├── booking/                      # ServiceCard, BookingForm, StepIndicator
│   └── admin/                        # DataTable, KPICard, StatusDropdown
├── lib/
│   ├── mongodb.js                    # Mongoose connection singleton
│   ├── stripe.js                     # Stripe SDK singleton
│   └── email.js                      # Resend client + React Email templates
├── models/
│   ├── Booking.js                    # Mongoose schema
│   └── Service.js                    # Mongoose schema
└── middleware.js                     # NextAuth route protection
```

---

## API Reference

| Method | Route | Auth | Description |
|---|---|---|---|
| GET | `/api/services` | None | Returns all active services for the public catalogue |
| GET | `/api/services/:id` | None | Returns a single service by MongoDB ObjectId |
| POST | `/api/checkout` | None | Creates Stripe Checkout Session, persists pending Booking, returns `{url}` |
| POST | `/api/webhooks/stripe` | Stripe Sig | Verifies webhook, updates Booking to confirmed, dispatches confirmation email |
| GET | `/api/bookings` | Admin JWT | Returns paginated bookings; supports `?status=&sort=&page=` |
| GET | `/api/bookings/:id` | Admin JWT | Returns a single booking with populated service reference |
| PATCH | `/api/bookings/:id` | Admin JWT | Updates booking status; triggers cancellation email when `status = cancelled` |
| DELETE | `/api/bookings/:id` | Admin JWT | Soft-deletes booking (sets `deleted: true`) |
| POST | `/api/services` | Admin JWT | Creates a new service document |
| PATCH | `/api/services/:id` | Admin JWT | Updates service name, description, price, duration, or active status |
| DELETE | `/api/services/:id` | Admin JWT | Sets `service.active = false` (soft delete) |

---

## Payment Flow

1. User completes the booking form and clicks **Confirm & Pay**
2. Client calls `POST /api/checkout` with `serviceId`, `scheduledAt`, and customer details
3. Server creates a Stripe Checkout Session (`mode: 'payment'`) with line items from `Service.price`
4. Server stores a **pending** Booking document with the Stripe session ID
5. User completes payment on Stripe-hosted page
6. Stripe sends `checkout.session.completed` webhook to `POST /api/webhooks/stripe`
7. Webhook handler verifies signature, updates Booking status to `confirmed`, and triggers Resend email
8. User is redirected to `/success?session_id={CHECKOUT_SESSION_ID}`

> **Security:** The webhook route verifies the `Stripe-Signature` header using `stripe.webhooks.constructEvent()`. Requests with invalid signatures return HTTP 400. Business logic only executes after successful verification.

### Test Card Numbers

| Scenario | Card Number | Result |
|---|---|---|
| Successful payment | `4242 4242 4242 4242` | Redirects to `/success` |
| Card declined | `4000 0000 0000 0002` | Stripe shows decline error |
| Requires authentication | `4000 0025 0000 3155` | Triggers 3D Secure modal |
| Insufficient funds | `4000 0000 0000 9995` | Stripe shows funds error |

Use any future expiry date, any 3-digit CVC, and any billing ZIP.

---

## Pages

| Route | Priority | Description |
|---|---|---|
| `/` | P0 | Hero with animated headline + CTA; feature highlights; service preview grid |
| `/services` | P0 | Full service catalogue; filter by category; Book Now CTA per card |
| `/book/[serviceId]` | P0 | 3-step wizard: Date/Time picker → Customer details → Review & Pay |
| `/success` | P0 | Confetti animation; booking reference card; Add to Calendar buttons |
| `/cancel` | P1 | Cancellation message; retry booking CTA |
| `/admin/login` | P0 | Credentials login; redirect to dashboard on success |
| `/admin/dashboard` | P0 | KPI cards; recent bookings table with status filter and sort |
| `/admin/bookings` | P0 | Full bookings table; pagination; search; status dropdown; delete |
| `/admin/services` | P1 | Service list; Add/Edit/Delete; toggle active/inactive |

---

## Admin Panel

Access the admin panel at `/admin/login`.

**Features:**
- Secure credentials-based login (session expires after 8 hours inactivity)
- Dashboard KPI cards: today's bookings, weekly revenue, total bookings
- Sortable, filterable bookings table (filter by `pending` / `confirmed` / `cancelled` / `completed`)
- Per-row status management with optimistic UI updates
- Service catalogue CRUD with confirmation modals for destructive actions

---

## Data Model

### Booking

| Field | Type | Description | Required |
|---|---|---|---|
| `bookingRef` | String | Auto-generated 8-char uppercase alphanumeric reference | Yes |
| `serviceId` | ObjectId | Reference to the booked Service document | Yes |
| `customerName` | String | Full name of the booking customer | Yes |
| `customerEmail` | String | Email address for confirmation and notifications | Yes |
| `customerPhone` | String | Contact phone number | Yes |
| `scheduledAt` | Date | ISO 8601 datetime of the booked appointment slot | Yes |
| `status` | Enum | `pending` \| `confirmed` \| `cancelled` \| `completed` | Yes |
| `stripeSessionId` | String | Stripe Checkout Session ID for reconciliation | Yes |
| `amountPaid` | Number | Amount charged in smallest currency unit (pence/cents) | Yes |
| `currency` | String | ISO 4217 currency code (e.g., `usd`, `gbp`) | Yes |
| `emailSent` | Boolean | True once confirmation email successfully dispatched | No |
| `notes` | String | Optional notes from admin or customer | No |
| `createdAt` / `updatedAt` | Date | Mongoose timestamps auto-managed | Auto |

---

## Deployment

### Vercel Deployment Checklist

- [ ] Connect GitHub repository to Vercel project (`vercel link`)
- [ ] Set all environment variables in **Vercel Project Settings → Environment Variables** (Production + Preview)
- [ ] Configure custom domain and verify SSL certificate
- [ ] Enable Vercel Analytics for Core Web Vitals monitoring
- [ ] Set up Stripe webhook endpoint pointing to `https://[production-domain]/api/webhooks/stripe`
- [ ] Verify MongoDB Atlas IP whitelist includes `0.0.0.0/0` (allow all) or Vercel static IPs
- [ ] Merge to `main` branch to trigger automatic production deployment

### CI/CD

- **Branch strategy:** `main` (production) → `develop` (staging) → `feature/*` (feature branches)
- PRs to `main` require passing CI (lint + build) before merge
- GitHub Actions workflow at `.github/workflows/ci.yml` runs `eslint` and `next build` on every push

---

## Submission Checklist

- [ ] Live Vercel URL shared
- [ ] GitHub repo link shared
- [ ] Test Stripe card (`4242...`) works end-to-end
- [ ] Confirmation email received
- [ ] Admin panel accessible at `/admin/login`
- [ ] README complete

---

## Success Metrics

| Metric | Target | Measurement |
|---|---|---|
| Booking completion rate | > 90% | Stripe dashboard |
| Email delivery success rate | > 99% | Resend logs |
| Page load time (LCP) | < 2.5 seconds | Vercel Analytics |
| Mobile responsiveness (320px–1440px) | 100% breakpoints pass | Browser DevTools |
| Admin panel booking list load | < 1 second | Network tab |
| Uptime on Vercel production | 99.9% | Vercel status page |

---

## Evaluation Criteria

| Weight | Criterion | What Evaluators Look For |
|---|---|---|
| 30% | Stripe Payment Integration | Checkout session created correctly; webhook verified; booking status updated; idempotency handled |
| 25% | UI/UX Design Quality | Professional visual design; smooth animations; responsive; polished micro-interactions |
| 20% | AI Tool Usage Speed & Efficiency | Evidence of AI-assisted development; complexity delivered within time constraint |
| 15% | Deployment & DevOps | Live Vercel URL accessible; GitHub repo structured; env vars set; README complete |
| 10% | Admin Panel (Bonus) | Admin login works; bookings table with filters; status management; service CRUD; KPIs |

---

*BookEase PRD v1.0.0 — March 2025*
