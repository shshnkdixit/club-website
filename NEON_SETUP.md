# Neon Database & Admin Dashboard Setup

This app is a Next.js site whose content — projects, events, research
papers, team roster, testimonials, achievements, roadmap, resources,
club members, and global site settings — all lives in a Postgres
database and is fully editable from `/admin`, the built-in dashboard.

If `DATABASE_URL` is not set, the app silently falls back to a local
file-backed database (PGlite) in `./data/file.db`. That's fine for
offline development, but it is **local to your machine only** — every
visitor to a deployed site needs a shared, always-on database, which
is what Neon provides for free.

## 1. Create a Neon database

1. Go to https://neon.tech and sign up (free tier is enough to start).
2. Create a new project (any name/region is fine).
3. On the project dashboard, click **Connect** and copy the **pooled
   connection string** — it looks like:
   ```
   postgresql://neondb_owner:AbC123@ep-cool-name-12345.us-east-2.aws.neon.tech/neondb?sslmode=require
   ```

## 2. Configure the app

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
2. Paste your connection string as `DATABASE_URL` in `.env.local`.
3. If you deploy to Vercel (or another host), add the same
   `DATABASE_URL` value in that platform's environment variable
   settings — `.env.local` is git-ignored and never deployed with your
   code.

## 3. Install dependencies and seed the database

```bash
npm install
npm run db:seed     # creates all 19 tables (if missing) and loads starter content
npm run db:verify    # prints a row count for every table, confirms Neon is reachable
```

`db:seed` is safe to run more than once — it upserts by row `id`
instead of duplicating rows.

## 4. Run it

```bash
npm run dev
```

Visit `http://localhost:3000` for the public site and
`http://localhost:3000/admin-login` for the dashboard.

### Default admin login

The seed script creates a starter SUPERADMIN account — check
`INITIAL_ADMIN_USERS` in `src/lib/data.ts` for the seeded email and
password, and **change that password immediately** from the Staff &
Users tab in the dashboard once you're in (or delete the seed account
and create your own).

## 5. What's editable from the dashboard

Every section below reads from and writes to your Neon database in
real time — no redeploy needed to change content:

- **Telemetry Overview** — at-a-glance stats
- **Events & Workshops** — create/edit/delete, view RSVPs
- **Challenges** — coding quests, review submissions
- **Projects** — club project showcase
- **Site Content** — AI domain tracks, research papers, testimonials,
  achievements, and global settings (club name, hero copy, social
  links)
- **Knowledge Vault** — curated resources/links
- **Roadmap** — phased curriculum milestones
- **Team Leadership** *(SuperAdmin only)* — org chart / leadership bios
- **Members** — club member directory
- **Staff & Users** *(SuperAdmin only)* — admin accounts
- **Join Form Config** *(SuperAdmin only)* — controls the public
  `/join` application form's fields and copy

## How saves work

Each dashboard write updates your browser's local cache immediately
(so the UI feels instant) and fires a background request to the
matching `/api/admin/...` route, which writes straight to Postgres.
Every visitor's page (including yours, on next load) fetches the
current data from `/api/cms`, so once a save reaches the database it's
live for everyone — not just the browser that made the change.

## Security note

Admin login is verified server-side against the `admin_users` table
(via `/api/admin/login`) rather than trusting the browser, and `/admin`
redirects to the login gate if there's no session cookie at all. That
said, this project stores staff passwords in plain text in the
database and uses a simple session cookie rather than a signed token.
That's an acceptable bar for an internal club tool, but if you're
putting real member data behind this, consider hashing passwords
(e.g. bcrypt) and issuing signed/expiring sessions before a wider
launch.
