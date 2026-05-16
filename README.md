# InnBucks — Social Media Growth Platform

InnBucks is a Kenya-focused social media growth service. Customers pay via M-Pesa and receive followers, views, likes, or subscribers across 7 platforms. Orders are placed automatically through the SMMWiz (MoreThanPanel) API.

There are two customer touchpoints:
- **Website** — [innbucks.org](https://innbucks.org) (Next.js, hosted on Vercel)
- **Telegram Bot** — [@innbucksboost88_bot](https://t.me/innbucksboost88_bot)

---

## Architecture

```
Customer
  │
  ├─ Website (Vercel / Next.js)
  │     └─ POST /api/orders ──────────────────────┐
  │                                                │
  └─ Telegram Bot (@innbucksboost88_bot)           │
        └─ STK push via bot flow ─────────────────┐│
                                                   ││
                              ┌────────────────────┘│
                              │  API Server (:8006)  │
                              │  (innbucks-server)   │
                              │                      │
                              │  MegaPay webhook ────┘
                              │  ConfirmTransaction
                              │  Push → Redis Queue
                              └──────────┬───────────
                                         │
                              ┌──────────▼───────────┐
                              │   Redis Queue         │
                              │   innbucks:order_queue│
                              └──────────┬───────────┘
                                         │ (every 15s)
                              ┌──────────▼───────────┐
                              │  Background Worker    │
                              │  (innbucks-worker)    │
                              │                       │
                              │  processQueue()       │
                              │  → SMMWiz API         │
                              │  pollPayments() (10s) │
                              │  pollOrders() (2min)  │
                              │  triggerRefills (24h) │
                              └───────────────────────┘
```

### Key Design Decisions

- **Redis queue** sits between payment confirmation and SMMWiz API calls. Orders queue up and are drained at a controlled rate (`QUEUE_MAX_CONCURRENT`, default 5). Admins can pause/resume without users knowing.
- **Worker polls MegaPay** every 10 seconds for STK push results (bot flow). Web flow uses MegaPay's webhook instead.
- **Auto-drip** is applied to follower orders over 1,000 — delivery is spread across multiple days to look organic.
- **30-day refill** is triggered by the worker every 24 hours for eligible completed orders.

---

## Repository Layout

```
InnBucks/
├── cmd/
│   ├── bot/        main.go   — Telegram bot entry point
│   ├── server/     main.go   — REST API + MegaPay webhook server
│   └── worker/     main.go   — Background payment poller + queue processor
│
├── internal/
│   ├── bot/
│   │   ├── bot.go            — Bot struct, Run loop, FulfillOrder
│   │   ├── handler.go        — All message/callback handlers
│   │   ├── packages.go       — Package catalog (44 packages across 7 platforms)
│   │   └── admin_notifier.go — Admin Telegram notifications via separate bot token
│   ├── db/
│   │   ├── store.go          — All PostgreSQL queries
│   │   └── schema.sql        — Table definitions
│   ├── models/
│   │   └── models.go         — Order, Client, Transaction, Package types
│   ├── queue/
│   │   └── queue.go          — Redis-backed order queue
│   ├── megapay/
│   │   └── client.go         — MegaPay STK push + status check
│   ├── smmpanel/
│   │   └── client.go         — SMMWiz (MoreThanPanel) order + refill API
│   └── profile/
│       └── lookup.go         — TikTok/Instagram profile scraper (for the web UI)
│
├── beyondboost/              — Git submodule: Next.js frontend (innbucks.org)
├── go.mod
└── README.md
```

---

## Server Location

Everything runs on a single VPS (`vmi3255937`).

### Directory Structure

| Path | Contents |
|------|----------|
| `~/Innbucks/` | Go source code (git repo, branch: `main`) |
| `/opt/innbucks/bin/` | Compiled binaries (`server`, `worker`, `bot`) |
| `/etc/systemd/system/` | Service unit files |
| `/etc/nginx/sites-enabled/api.innbucks.org` | Nginx HTTPS reverse proxy config |

### Systemd Services

| Service | Binary | Purpose |
|---------|--------|---------|
| `innbucks-server` | `/opt/innbucks/bin/server` | REST API on port 8006 |
| `innbucks-worker` | `/opt/innbucks/bin/worker` | Payment polling + queue processing |
| `innbucks-bot` | `/opt/innbucks/bin/bot` | Telegram bot |

```bash
# Check status
sudo systemctl status innbucks-server innbucks-worker innbucks-bot --no-pager

# View live logs
sudo journalctl -u innbucks-worker -f
sudo journalctl -u innbucks-bot -f
sudo journalctl -u innbucks-server -f

# Restart a service
sudo systemctl restart innbucks-worker
```

### Nginx

Nginx listens on HTTPS (443) and proxies `api.innbucks.org` → `127.0.0.1:8006`.

Config: `/etc/nginx/sites-enabled/api.innbucks.org`

Vercel rewrites `/api/*` on `innbucks.org` → `https://api.innbucks.org/api/*`.

### Databases & Middleware

| Service | Address | Details |
|---------|---------|---------|
| PostgreSQL | localhost | DB: `innbucks`, User: `innbucks` |
| Redis | `127.0.0.1:6379` | Order queue only — no auth, local only |

---

## Deploying Changes

```bash
# 1. Make changes locally, commit and push
git add <files>
git commit -m "your message"
git push origin main

# 2. On VPS — pull, build, restart
cd ~/Innbucks
git pull

go build -o /opt/innbucks/bin/innbucks-server ./cmd/server
go build -o /opt/innbucks/bin/innbucks-worker ./cmd/worker
go build -o /opt/innbucks/bin/innbucks-bot    ./cmd/bot

sudo systemctl stop innbucks-bot
cp /opt/innbucks/bin/innbucks-bot /opt/innbucks/bin/bot
sudo systemctl restart innbucks-server innbucks-worker innbucks-bot
```

> The bot binary must be copied to `bot` (not `innbucks-bot`) because that is what the systemd unit expects. Stop the service first to avoid "Text file busy".

---

## Environment Variables

Both `.env` (local) and systemd `EnvironmentFile` (VPS) provide these.

| Variable | Used By | Description |
|----------|---------|-------------|
| `DATABASE_URL` | all | PostgreSQL connection string |
| `TELEGRAM_BOT_TOKEN` | bot, worker | Main bot token (@innbucksboost88_bot) |
| `MEGAPAY_API_KEY` | server, worker | MegaPay API key |
| `MEGAPAY_EMAIL` | server, worker | MegaPay account email |
| `MEGAPAY_WEBHOOK_SECRET` | server | HMAC secret for webhook signature verification |
| `MTP_API_KEY` | bot, server, worker | MoreThanPanel (SMMWiz) API key |
| `ADMIN_TELEGRAM_IDS` | bot, worker | Comma-separated admin Telegram user IDs |
| `ADMIN_BOT_TOKEN` | bot, server | Separate bot token for admin notifications |
| `ADMIN_CHAT_ID` | bot, server | Admin chat/group ID for notifications |
| `FRONTEND_ORIGIN` | server | Allowed CORS origin (e.g. `https://innbucks.org`) |
| `SOCIAL_PROOF_CHANNEL_ID` | bot, worker | Telegram channel to post order completions |
| `REDIS_ADDR` | bot, server, worker | Redis address (default: `127.0.0.1:6379`) |
| `QUEUE_MAX_CONCURRENT` | bot, server, worker | Max simultaneous SMMWiz orders (default: `5`) |
| `BALANCE_ALERT_THRESHOLD` | worker | Alert if SMMWiz balance drops below this (USD, default: `5.0`) |

---

## Package Catalog

44 packages across 7 platforms. Each has a unique `ID`, price in KES, and one or more SMMWiz service components.

### Tiers (web packages)

Every platform has 5 tiers with consistent pricing:

| Tier | ID suffix | Price |
|------|-----------|-------|
| 🔥 Test Drive | `_web_test` | KES 249 |
| ⚡ Starter Boost | `_web_starter` | KES 699 |
| 💎 Legit Profile | `_web_legit` | KES 1,299 |
| 👑 Influencer Status | `_web_influencer` | KES 2,499 |
| 🦁 Bazuu VIP | `_web_bazuu` | KES 4,999 |

### Platforms

| Platform | Followers/Subs Service | Engagement Service |
|----------|----------------------|-------------------|
| TikTok | 5760 (Followers) | 9121 (Views), 2699 (Likes) |
| Instagram | 5440 (Followers) | 2916 (Likes) |
| YouTube | 7494 (Subscribers) | 6003 (Views) |
| Facebook | 9061 / 5798 (Page Followers) | — |
| X/Twitter | 9527 (Tweet Views) | — |
| Telegram | 8136 (Channel Members) | — |
| Spotify | 3541 (Plays) | — |

Wholesale rates are from MoreThanPanel at ~130 KES/USD. See comments in [`internal/bot/packages.go`](internal/bot/packages.go) for per-service rates.

---

## Order Flow

### Bot (Telegram)

1. Customer selects platform → tier → enters profile link
2. Bot initiates STK push via MegaPay
3. Worker polls MegaPay every 10s — on `Completed`:
   - `ConfirmTransaction` in DB
   - Push `orderID` to Redis queue
4. Worker `processQueue` (every 15s) drains queue → calls SMMWiz
5. Worker `pollOrders` (every 2min) checks SMMWiz status → notifies customer on completion

### Web (innbucks.org)

1. Customer fills form → POST `/api/orders` → STK push sent
2. MegaPay sends webhook to `/webhook/megapay` on payment success
3. Server confirms transaction → pushes to Redis queue
4. Same queue/worker flow from step 4 above

---

## Admin Commands (Bot)

Only works for Telegram user IDs listed in `ADMIN_TELEGRAM_IDS`.

| Command | Action |
|---------|--------|
| `/stats` | Daily revenue, order counts by package |
| `/pause` | Pause the Redis queue (stops new SMMWiz calls silently) |
| `/resume` | Resume the queue |
| `/queuestat` | Show queue depth, active slots, paused state |

---

## Referral System

- Each customer gets a unique referral code (`/referral` command in bot)
- When a referred customer completes their first order, the referrer earns KES 50 credit
- Credit balance visible via `/credits` command

---

## Database Schema

Five tables: `clients`, `orders`, `transactions`, `refill_records`, `referrals`.

See [`internal/db/schema.sql`](internal/db/schema.sql) for full definitions.

```bash
# Connect to DB on VPS
sudo -u postgres psql -d innbucks

# Quick order check
SELECT id, package_id, status, total_kes, created_at FROM orders ORDER BY id DESC LIMIT 10;
```
