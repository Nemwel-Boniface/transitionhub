# TransitionHub

Internal companion app for the Eden Care → Ginja.ai brand transition. A public site
(FAQ, brand guide, timeline, transition-lead directory) with a star-feature chatbot,
plus an admin panel for Transition Leads / Culture & People to manage content and
track external relationships.

Built with **Next.js 16 (App Router) + TypeScript + Tailwind CSS v4**.

---

## Quick start

```bash
npm install
npm run dev
```

Open http://localhost:3000.

That's it - **no external services are required to run this locally.** See "Data
storage" below for why.

### Admin panel

Go to `/admin` → you'll be redirected to `/admin/login`.

Default password: **`transitionhub2026`** (set in `.env.local` as `ADMIN_PASSWORD`
- change this before sharing the app with anyone else).

---

## Environment variables

Copy `.env.example` to `.env.local` and adjust as needed:

| Variable | Required | Purpose |
|---|---|---|
| `ADMIN_PASSWORD` | No (has a dev default) | Password for the admin panel |
| `SESSION_SECRET` | No (has a dev default) | Signs the admin session cookie |
| `UPSTASH_REDIS_REST_URL` | No | Production Redis (Upstash) |
| `UPSTASH_REDIS_REST_TOKEN` | No | Production Redis (Upstash) |

**Change `ADMIN_PASSWORD` and `SESSION_SECRET` before deploying anywhere real.**

---

## Data storage

Mirrors the pattern from `REDIS.md` (Upstash Redis, no persistent connections,
request-count-conscious, no polling):

- **In production**, set `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`
  (free tier is fine) and the app talks to real Upstash Redis over REST.
- **Locally, with no credentials set**, the app automatically falls back to a
  small JSON-file-backed store at `.data/local-db.json`. Same code path, same
  interface - just swap the env vars later and nothing else changes.

Data is seeded once automatically on server startup (`src/instrumentation.ts`):
15 real FAQs (pulled from the actual FAQ doc and the customer-transition
playbook) and a starter Transition Lead directory (pulled from the deck).
**The lead directory is intentionally a starting point** - the deck only names
leads at the team level, not a full person-by-person table, so add real names
via `/admin/leads` as they're confirmed.

To wipe and reseed locally: delete `.data/local-db.json` and restart `npm run dev`.

---

## What's in the app

### Public site
- **`/`** - homepage: two-brand overview, "same tools inside, new brand outside," quick nav
- **`/what-changes`** - what changes externally vs. what stays the same, phase 1 rollout groups
- **`/brand-guide`** - signature format, co-branding, dual-inbox guidance, the standard customer narrative
- **`/timeline`** - phased rollout, now through end of August
- **`/faq`** - searchable, filterable FAQ (category chips + live search)
- **`/transition-leads`** - look up your Transition Lead by name, or browse the full directory

### Chatbot (floating, every page)
Deterministic, button-driven state machine - **no LLM, no external AI call** -
following the same pattern as the PaceTracker bot described in `CHATBOT.md`.
Capabilities:
- Free-text search across the FAQ dataset (client-side keyword scoring, see `src/lib/search.ts`)
- Browse by topic/category
- "Find my Transition Lead" - name lookup against the directory
- "Ask something new" - logs unanswered questions to the admin inbox, optionally with name/email
- Static contact-routing info (who to ask for what)

Data (FAQs + leads) is fetched **once** when the chat widget opens - no polling.

### Admin panel (`/admin`, password-protected)
- **Dashboard** - quick counts across all four content types
- **FAQs** - full CRUD
- **Transition Leads** - full CRUD, including each team's member list (used by both
  the public lookup page and the chatbot's name search)
- **Questions Inbox** - view chatbot-logged questions, respond, resolve, and
  optionally push a resolved answer straight into the public FAQ
- **Relationship Tracker** - the external-relationship tracker requested in the
  Slack thread: client/partner, owner, current/future brand, transition method,
  target date, status, informed flag, outstanding actions - with an "% informed"
  and "in progress" summary, and filter by owner

---

## Auth model

Simple by design (v1): one shared admin password → HMAC-signed, httpOnly session
cookie (12-hour expiry), no external auth provider or database needed. Everything
under `/admin/**` and all mutating API routes (`POST`/`PUT`/`PATCH`/`DELETE`)
require this session; public `GET` routes (FAQs, leads) stay open since the
chatbot and public pages need them. See `src/lib/auth.ts`.

If you need per-person roles (e.g. relationship owners who can only edit their
own rows) later, that's a clean v2 addition on top of this same cookie - swap
the single password for real user records and add a `role`/`ownerId` to the
session payload.

---

## Testing

```bash
npm test        # Vitest - search scoring, session token signing, FAQ CRUD
npm run build   # Full production build + TypeScript check
npm run lint    # ESLint
```

---

## Project structure

```
src/
  app/                      - routes (App Router)
    admin/                  - password-gated admin panel
    api/                    - all backend routes
    faq/ what-changes/ brand-guide/ timeline/ transition-leads/  - public pages
  components/
    chatbot/                - floating launcher + FSM-driven chat panel
    admin/                  - AdminShell (guard + sidebar)
    Header.tsx Footer.tsx Logo.tsx BrandSplit.tsx
  lib/
    db/                     - CRUD modules per data type + seed.ts
    redis.ts                - Upstash / local-file storage abstraction
    auth.ts                 - session token signing/verification
    search.ts                - FAQ keyword search & category grouping
    types.ts                - shared TypeScript types
  instrumentation.ts        - seeds data once on server startup
public/logos/                - Eden Care & Ginja.ai marks (extracted from the deck)
```

---

## Brand theme

Colors and layout tokens are lifted directly from the ExCo-approved
"One Team. Two Brands." deck rather than invented:

- Teal `#2A797D` - primary
- Cream `#F4F3EF` / `#EFF4F3` - background
- Charcoal `#1B1B18` - body text
- Warm gray `#9A9A94` / `#6B6B66` - secondary text, borders
- Orange `#FE5F1D` - sparing accent (CTAs, chatbot "online" dot)

The two-brand duality is expressed as a recurring teal→orange split-rule divider
rather than segregating Eden Care and Ginja.ai into separate color schemes,
consistent with the "one team" message.
