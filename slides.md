---
theme: default
colorSchema: light
title: Aspio Marketplace — SE1→SE2 Phase 1
info: |
  Phase 1 technical proposals for Marketplace Web and Marketplace App.
class: text-left
drawings:
  persist: false
transition: fade-out
mdc: true
fonts:
  sans: Plus Jakarta Sans
  serif: Plus Jakarta Sans
  mono: JetBrains Mono
  weights: [400, 500, 600, 700, 800]
  italic: false
themeConfig:
  primary: '#0f766e'
defaults:
  layout: with-outline
---

# Title

<div class="kicker">Aspio · SE1 → SE2 · Phase 1</div>

# Marketplace Web + App

<p class="lead">Phase 1 proposals for both surfaces — same rhythm, separate trust boundaries.</p>

<div class="pt-6 muted">
Proposal only · Implementation after written acceptance
</div>

---

# Agenda

<div class="kicker">Part A — Marketplace Web</div>

| # | Challenge | Risk if we do nothing |
|---|-----------|------------------------|
| **W1** | **Ship without proof** — no CI quality gates before Vercel | Type errors and broken booking paths can reach customers |
| **W2** | **Trusted booking gateway** — APIs trust the browser too much | Arbitrary hosts, weak identity, hard-to-trust booking boundary |
| **W3** | **Authoritative analytics** — clients can forge metrics | Fake clicks/views, PII on company docs |

<div class="kicker mt-6">Part B — Marketplace App</div>

| # | Challenge | Risk if we do nothing |
|---|-----------|------------------------|
| **A1** | **Trusted engagement events** — client writes analytics | Forgeable views/clicks + email on company docs |
| **A2** | **Release confidence pipeline** — no store release gate | Broken builds reach TestFlight / Play internal |
| **A3** | **Scalable booking deep links** — full companies scan | Cost, latency, wrong-company / offline confusion |

<p class="muted pt-4">
Rhythm each time: <strong>Problem → Evidence → Architecture → Solution → Plan</strong>
</p>

---
layout: with-outline-center
---

<div class="kicker">Context</div>

# Marketplace surfaces

<p class="lead" style="max-width: 32ch; margin: 0.75rem auto 1.25rem;">
Aspio customer marketplace — Web first in this deck, then the Flutter App.
</p>

<div class="big-list" style="max-width: 36rem; margin: 0 auto; text-align: left;">

- **Web:** Next.js 16 / React 19 · Vercel · Firebase · Nest / Cloud Functions
- **App:** Flutter Marketplace · Firebase · Sentry / App Check / Shorebird
- Shared concerns: booking trust, engagement integrity, release confidence
- Evidence: web repo + Vercel; app challenges from the mobile proposal packs

</div>

---

# What Phase 1 is

<div class="kicker">The gate before we write production code</div>

<p class="muted mb-4">
Phase 1 is the <strong>proposal</strong>. The panel must accept the scope in writing before Phase 2 implementation starts.
</p>

<div class="big-list">

- I present the problem, architecture, tradeoffs, and a testable plan
- Panel outcome: **Accepted** / **Accepted with changes** / Not accepted
- If accepted with changes, <strong>those changes become the scope</strong>
- I implement in Phase 2 **only after** that written acceptance

</div>

<div class="card mt-6">

**Ask at the end:** assign one challenge → accept this proposal as Phase 2 scope.

</div>

---
layout: with-outline-section
---

# Challenge 1

## Ship without proof

<p class="title-speak">
Marketplace can deploy to Vercel without proving lint, types, tests, booking smoke, or basic performance.
</p>

<p class="muted mt-4">
Brief name: <strong>Release confidence for Marketplace</strong>
</p>

---
layout: with-outline-two-cols
---

# C1 · Problem

<div class="kicker">Full problem</div>

<p class="lead" style="font-size: 1.15rem !important; max-width: 28ch;">
The repo only enforces <strong>branch policy</strong>. There is no required typecheck or test suite in CI. Next.js is set to <strong>ignore TypeScript build errors</strong>. Booking unit tests exist but nothing runs them. Vercel only runs <strong>next build</strong>, with <strong>no Deployment Checks</strong>.
</p>

<p class="muted mt-3" style="font-size: 1rem !important;">
Short version: we check the git path, not that the product still works.
</p>

::right::

<div class="kicker">Business impact</div>

<div class="big-list">

- Type or booking bugs can reach **Production customers**
- Discovery → booking funnel breaks hurt conversion
- Failures show up late — on Vercel or in prod, not in the PR
- Branch policy feels “safe” while quality is still ungated

</div>

---

# C1 · Evidence

<div class="kicker">What the repo and Vercel show</div>

<div class="big-list">

- <span class="danger">No quality CI</span> — only branch-policy workflows
- <span class="danger">No typecheck / test scripts</span> — `package.json` has build + lint only
- <span class="danger">`ignoreBuildErrors: true`</span> — TypeScript debt can still ship
- <span class="danger">~23 booking-related tests</span> — no runner, no CI gate
- <span class="danger">Vercel = `next build` only</span> — Deployment Checks: **none**
- Preview URL exists — still **ungated** for quality signals

</div>

---
layout: with-outline-center
---

# C1 · Architecture

<div class="kicker">Proposed quality pipeline</div>

<div class="diagram-wrap">

```mermaid {scale: 0.52}
flowchart LR
  PR["PR opened / updated"] --> GHA["GitHub Actions\nquality.yml"]
  PR --> Prev["Vercel Preview\nauto deploy"]
  GHA --> Checks["lint · typecheck\nunit · Lighthouse"]
  Prev --> E2E["Playwright smoke\ndiscovery → booking"]
  Checks --> Gate["Required checks"]
  E2E --> Gate
  Gate --> Prod["Production\nlead: Deployment Checks"]
```

</div>

<div class="big-list mt-3" style="font-size: 0.9rem !important;">

- **Trigger:** every PR open/update
- **We add:** `quality.yml` + npm scripts (`typecheck`, `test`) — yml **runs** the unit tests (test files already exist / we wire a runner)
- **Vercel Preview:** already auto for PRs — we add Playwright **against that URL**
- **Gate → Prod:** lead turns on required checks / Deployment Checks (we document; don’t flip ourselves)

</div>

<p class="muted pt-2">
CI owns quality · Vercel hosts · browser untrusted · Firebase/Nest unchanged
</p>

---
layout: with-outline-two-cols
---

# C1 · Solution

<div class="kicker">What we accept from the challenge</div>
<p class="muted mb-2">This is the Phase 2 scope I am proposing</p>

<div class="big-list">

- Add a **GitHub Actions** quality workflow: lint, typecheck, unit tests
- Add **Playwright** smoke: public discovery → booking entry on Preview
- **Document** how checks gate merge and Production (lead applies settings)
- **Staged plan** to remove `ignoreBuildErrors` safely
- Add a **Lighthouse** budget on one public route
- Document **env boundaries**: local / Preview / Production — no secrets in `NEXT_PUBLIC_*`

</div>

::right::

# Rejected

<div class="kicker">What we will not do — and why</div>

<div class="card card-warn mt-2">

**Rejected alternative:** only turn off `ignoreBuildErrors` and hope Vercel build is enough.

</div>

<div class="big-list mt-4">

- **Why reject:** ~255 TS errors today — flipping the flag alone can break Production builds
- **Why reject:** still no unit tests, Playwright, or Lighthouse gate
- **Why reject:** booking tests stay unrunnable — the brief’s main risk stays open
- **Chosen instead:** full quality pipeline + staged TypeScript cleanup

</div>

---

# C1 · Plan

<div class="kicker">How I will deliver Phase 2 · 3–5 working days</div>

<div class="big-list plan-speak">

- Add npm scripts for typecheck + unit tests, and a GitHub Actions **`quality.yml`** that runs them on every PR (yml = robot recipe; tests live in files + scripts).
- Count today’s TypeScript errors. Keep the “ignore errors on build” flag for now. Write a short step-by-step plan to turn that flag off later without killing the live site overnight.
- Add a short browser test: find a business → reach booking start. Run it on the temporary Preview site (not Production). No Production secrets.
- Add a basic page-speed check on one public page. Write which settings a lead should turn on in GitHub/Vercel so bad PRs cannot merge or go live. We document; we don’t flip protected settings ourselves.
- Fix flaky checks, finish the short how-to (setup, verify, undo), open the PR, practice the panel walkthrough.

</div>

---
layout: with-outline-section
---

# Challenge 2

## Trusted booking gateway

<p class="title-speak">
Booking APIs currently trust the browser for destination, credentials, and identity — so authorization and failure behavior are hard to reason about.
</p>

<p class="muted mt-4">
Brief name: <strong>Trusted booking gateway</strong>
</p>

---
layout: with-outline-two-cols
---

# C2 · Problem

<div class="kicker">Full problem</div>

<p class="lead" style="font-size: 0.95rem !important; max-width: 30ch;">
<code>app/api/booking-proxy</code> accepts a caller-provided <strong>url</strong>, <strong>token</strong>, <strong>HTTP method</strong>, and <strong>body</strong>, then the server fetches that URL. Separate booking <strong>get</strong> and <strong>update</strong> routes forward <code>uid: undefined</code> to Cloud Functions. The availability route lets a caller set <code>useNestBackend</code> and forwards body fields to Nest. These boundaries make source-of-truth authorization, destination control, and failure behavior difficult to reason about.
</p>

<p class="muted mt-3">
Short version: the browser helps decide <strong>where</strong>, <strong>with which token</strong>, and <strong>as whom</strong>.
</p>

::right::

<div class="kicker">Business impact</div>

<div class="big-list">

- **Open proxy / SSRF-style risk** — our server can be told to call a URL we did not choose, with a token we did not own
- **Weak booking identity** — get/update send `uid: undefined`, so we cannot prove which customer did the action
- **Client-steered availability** — browser can force the Nest path instead of reading the company flag
- **Error leakage** — raw downstream failures can surface to the customer
- **Untrusted booking boundary** — support and security cannot rely on these doors

</div>

---

# C2 · Evidence

<div class="kicker">What the Marketplace web routes show</div>

| Route | Issue | UI today |
|-------|--------|----------|
| `/api/booking-proxy` | Caller supplies `url` + `token` + method + body → server `fetch` | **No page** uses helpers — route still live |
| `/api/bookings/get` | Forwards `uid: undefined` to `getBookingById` | Booking **detail** load fallback (Firestore → WordPress) |
| `/api/bookings/update` | Forwards `uid: undefined` to `editBookingById` | Save hidden in `view=true`; route still callable |
| `/api/bookings/delete` | Same `uid: undefined` pattern | **No UI** — cancel is the product path |
| `/api/get-availability` | Client can set `useNestBackend` | Booking flow `/booking/[companyId]` |

---
layout: with-outline-center
---

# C2 · Architecture

<div class="kicker">Proposed trust boundary (server-owned)</div>

```mermaid {scale: 0.48}
%%{init: {'flowchart': {'htmlLabels': true, 'wrappingWidth': 200, 'nodeSpacing': 45, 'rankSpacing': 50, 'padding': 14}}}%%
flowchart LR
  B2["Browser"] -->|"safe fields only"| API["Next booking APIs"]
  API --> OFF["Drop open proxy<br/>+ get/update/delete"]
  API --> FLAG["Firestore use_nest_booking_backend"]
  FLAG --> Nest["Availability:<br/>Nest or getAvailability CF<br/>— server decides"]
  API -.->|"rare WP legacy only"| WP["Server-owned WP proxy<br/>(like Business callable)"]
```

<p class="muted pt-3">
Detail = Firebase first · drop getBookingById / update · open booking-proxy gone · rare WP via server-injected token — never client url+token · Nest vs getAvailability = server reads company flag
</p>

---
layout: with-outline-two-cols
---

# C2 · Solution

<div class="kicker">What we accept from the challenge</div>
<p class="muted mb-2">Phase 2 — close weak booking doors; availability Nest flag on server only</p>

<div class="big-list">

- **Disable/remove** open `/api/booking-proxy` + dead helpers (client url + token)
- **Disable/remove** `/api/bookings/get`, `/update`, `/delete` — no customer update UI; detail uses **Firestore**; cancel stays
- **Rare WordPress legacy:** if a booking is missing in Firebase, use a **server-owned** WP path (Business-style `wordpressProxy` / callable injects token) — **not** the open booking-proxy
- **Availability:** drop client `useNestBackend`; server reads Firebase **`use_nest_booking_backend` only** + schema / rate controls

</div>

::right::

# Rejected

<div class="kicker">What we will not do — and why</div>

<div class="card card-warn mt-2">

**Rejected:** keep open `booking-proxy` (or “add login” but still accept client `url` + `token`) for get.

</div>

<div class="big-list mt-4">

- **Why reject:** authenticated open proxy is still an open proxy
- **Why reject:** Marketplace get/update with `uid: undefined` stay weak if we keep them
- **Chosen:** drop get/update/delete + open proxy; Firebase detail; rare WP via **server-owned** proxy only; Nest flag server-only

</div>

---

# C2 · Plan

<div class="kicker">How I will deliver Phase 2 · 1 working day</div>

<div class="big-list plan-speak">

- **Disable/remove** open `/api/booking-proxy`, `/api/bookings/get`, `/update`, `/delete` (+ dead helpers)
- Detail load = Firestore only; optional rare WP fetch via **server-owned** proxy (token not from client)
- **Availability:** drop client `useNestBackend`; read `use_nest_booking_backend` from Firestore; basic schema / rate controls
- **Tests + runbook:** closed routes 410/404; Nest flag ignored from client; verify + rollback in the PR

</div>

---
layout: with-outline-section
---

# Challenge 3

## Authoritative analytics

<p class="title-speak">
Anyone can write marketplace analytics into company documents — so clicks and views are not trustworthy metrics.
</p>

<p class="muted mt-4">
Brief name: <strong>Authoritative marketplace analytics</strong>
</p>

---
layout: with-outline-two-cols
---

# C3 · Problem

<div class="kicker">Full problem</div>

<p class="lead" style="font-size: 0.92rem !important; max-width: 30ch;">
Firestore rules permit anyone to update company <code>call_clicks</code>, <code>booking_clicks</code>, <code>website_view</code>, and <code>ad_analytics</code>. Client helpers append <strong>email</strong>, <strong>client timestamps</strong>, and <strong>source</strong> values directly to company-document arrays. A browser can forge or replay this data, PII is retained in operational documents, and document growth has no visible retention boundary. The repository already uses callable functions for ad events, so there is a real alternative pattern to evaluate.
</p>

<p class="muted mt-3">
Short version: we treat analytics as if the browser were honest — it is not.
</p>

::right::

<div class="kicker">Business impact</div>

<div class="big-list">

- **Forged clicks / views** — anyone can fake or replay marketplace engagement
- **PII on company docs** — email sits on operational arrays (privacy / retention risk, not a legal verdict)
- **Unbounded arrays** — docs grow → cost and slower company reads
- **Untrusted metrics** — bad calls on marketing, ranking, “what works”
- **Split patterns** — ads already use callables; views/clicks still trust the client

</div>

---

# C3 · Evidence

<div class="kicker">What the repo and rules show</div>

| Area | Evidence |
|------|----------|
| Firestore rules | Public `update` if only tracking keys change (`call_clicks`, `booking_clicks`, `website_view`, `ad_analytics`) |
| Client helpers | `trackCallClick` / `trackBookingClick` → `arrayUnion` `{ email, date, source }` |
| Website views | Client `trackWebsiteView` writes `website_view` arrays |
| Better pattern | Ads → callables `logAdImpression` / `logAdClick` with `{ adId, companyId, placement }` — no email |

<div class="card mt-4">

**Pattern to extend:** ad callables already do trusted server writes. Views + one conversion should follow that — not client `arrayUnion`.

</div>

---
layout: with-outline-center
---

# C3 · Architecture

<div class="kicker">Today vs proposed trust boundary</div>

<p class="muted mb-2"><strong>Row 1 — Today (client-authoritative)</strong></p>

```mermaid {scale: 0.48}
%%{init: {'flowchart': {'htmlLabels': true, 'wrappingWidth': 220, 'nodeSpacing': 50, 'rankSpacing': 50, 'padding': 16}}}%%
flowchart LR
  UI["Web UI"] --> H["Client helpers<br/>track clicks / views"]
  H -->|"arrayUnion + email<br/>+ client timestamp"| CO["companies doc<br/>tracking arrays"]
  R["Firestore rules<br/>public update OK"] --> CO
  UI --> ADS["Ad callables<br/>logAdImpression / Click"]
```

<p class="muted mt-4 mb-2"><strong>Row 2 — Proposed (server-authoritative)</strong></p>

```mermaid {scale: 0.48}
%%{init: {'flowchart': {'htmlLabels': true, 'wrappingWidth': 220, 'nodeSpacing': 50, 'rankSpacing': 50, 'padding': 16}}}%%
flowchart LR
  UI2["Web UI"] -->|"companyId, eventType,<br/>placement — no email"| CF["Callable ingest<br/>(extend ad pattern)"]
  CF --> CFG["Company windows<br/>or CF defaults"]
  CFG --> V["Hash + idempotency<br/>+ count once"]
  V --> E["Events / aggregates"]
  LOCK["Rules: deny client<br/>analytics writes"] --> LEG["Legacy arrays<br/>read-only coexist"]
```

<p class="muted pt-3">
Per-company windows on Firebase (admin-editable). Null → CF defaults: website ~1h · call ~10m · book ~15m. Hash event fields + idempotency key → same click once. No email · optional server uid if panel asks.
</p>

---
layout: with-outline-two-cols
---

# C3 · Solution

<div class="kicker">What we accept from the challenge</div>
<p class="muted mb-2">Phase 2 scope — ad-style callable + lock client writes</p>

<div class="big-list">

- Extend the **ad callable pattern** for **website_view** + **one conversion** (booking or call click)
- Client sends `{ companyId, eventType, placement }` (+ optional `clientEventId`) — **no email**
- CF **validates** and writes **events / counts** (server timestamp)
- **Dedupe windows on the company doc** (admin can change per company): `website_view` / `call_click` / `booking_click` minutes
- **If null → CF defaults:** website **~1h** · call **~10m** · book **~15m** (shared with App)
- **Hash + idempotency:** mash event fields into one fingerprint; same key / same window → count once
- **Tighten rules** — clients cannot `arrayUnion` those tracking fields
- **Legacy arrays stay** — coexistence only; no production analytics wipe
- **Optional (Accepted with Changes):** if logged in, server may attach **`uid` from token** — never client email/name

</div>

::right::

# Rejected

<div class="kicker">What we will not do — and why</div>

<div class="card card-warn mt-2">

**Rejected:** require auth in Firestore rules, but keep client `arrayUnion` into company arrays.

</div>

<div class="big-list mt-4">

- **Why reject:** a signed-in user can still forge and replay volume
- **Why reject:** email/PII and unbounded arrays remain
- **Chosen:** callable ingest (like ads) + deny client tracking writes + leave legacy arrays read-only

</div>

---

# C3 · Plan

<div class="kicker">How I will deliver Phase 2 · 1 working day</div>

<div class="big-list plan-speak">

- **Callable + client switch:** website_view + one conversion via ad-style CF; stop client `arrayUnion` for those fields
- **Company windows + defaults:** read per-company minutes; if null use CF defaults (website ~1h · call ~10m · book ~15m)
- **Hash + idempotency in CF:** fingerprint event fields; reject same key / same-window replay
- **Rules:** deny client writes to selected tracking fields; keep public catalogue reads
- **Coexistence + tests + runbook:** no prod array wipe; client write denied; verify + rollback in the PR

</div>

---
layout: with-outline-section
---

# Marketplace App

## Phase 1 challenges

<p class="title-speak">
Flutter Marketplace — engagement trust, release confidence, and scalable booking deep links.
</p>

<p class="muted mt-4">
Same Phase 1 gate: proposal only until Accepted / Accepted with Changes.
</p>

---
layout: with-outline-section
---

# App C1

## Trusted engagement events

<p class="title-speak">
Organic marketplace engagement is written from the Flutter client into company documents — unlike ad analytics, which already use trusted callables.
</p>

---
layout: with-outline-two-cols
---

# A1 · Problem

<div class="kicker">Full problem</div>

<p class="lead" style="font-size: 0.92rem !important; max-width: 30ch;">
Same engagement as Marketplace <strong>Web</strong>: the Flutter client writes <code>website_view</code>, <code>call_clicks</code>, and <code>booking_clicks</code> onto company docs via <code>FieldValue.arrayUnion</code>. Payload includes <strong>email</strong>, client <strong>date</strong>, and <strong>source</strong>. Website-view cooldown is client-only <code>SharedPreferences</code> (bypassable). Call/booking clicks have no server dedupe. Ads already use callables with <strong>no email</strong>.
</p>

::right::

<div class="kicker">Business impact</div>

<div class="big-list">

- **Forged clicks / views** — same trust hole as web
- **PII on company docs** — email on operational arrays
- **Unbounded arrays** — cost and larger company reads
- **Untrusted metrics** — ranking / abuse review unreliable
- **Split patterns** — ads use callables; organic engagement still trusts the device

</div>

---

# A1 · Evidence

<div class="kicker">Verified call sites + same shape as web</div>

| Event | Field | Mechanism |
|-------|--------|-----------|
| Website view | `website_view` | `arrayUnion` |
| Call click | `call_clicks` | `arrayUnion` |
| Booking click | `booking_clicks` | `arrayUnion` |

<div class="big-list mt-3">

- `service_popup_card.dart` — `_trackWebsiteView` / `_trackCallClick` / `_trackBookingClick`
- `marketplace_page.dart` — same three on `_CompanyCardState`
- Payload today: `{ email, date, source: 'Mobile Marketplace' }` — **same idea as web**
- Ads contrast: `httpsCallable` · `{ adId, companyId, placement }` · no email

</div>

---
layout: with-outline-center
---

# A1 · Architecture

<div class="kicker">Today vs proposed — shared CF with Web C3</div>

<p class="muted mb-2"><strong>Row 1 — Today (device writes company arrays)</strong></p>

```mermaid {scale: 0.46}
%%{init: {'flowchart': {'htmlLabels': true, 'wrappingWidth': 220, 'padding': 16}}}%%
flowchart LR
  UI1["ServicePopupCard"] -->|"arrayUnion + email"| FS["companies doc<br/>engagement arrays"]
  UI2["Marketplace card"] -->|"arrayUnion + email"| FS
  Prefs["SharedPreferences<br/>1h view cooldown"] --> UI1
```

<p class="muted mt-2" style="font-size: 0.85rem !important;">
Cooldown = phone-only “don’t count another website view for 1 hour” — easy to bypass; not a server rule.
</p>

<p class="muted mt-4 mb-2"><strong>Row 2 — Proposed (same callable as Web)</strong></p>

```mermaid {scale: 0.46}
%%{init: {'flowchart': {'htmlLabels': true, 'wrappingWidth': 220, 'padding': 16}}}%%
flowchart LR
  UI["Flutter UI"] -->|"don't wait on analytics"| API["EngagementReporting"]
  Web["Web UI"] -->|"same payload"| CF["Shared CF<br/>recordEngagementEvent"]
  API -->|"companyId, eventType,<br/>placement — no email"| CF
  CF --> CFG["Company windows<br/>or CF defaults"]
  CFG --> Val["Hash + idempotency<br/>count once"]
  Val --> Write["Events / aggregates"]
  Rules["Rules deny client<br/>engagement writes"] -.-> FS2["Legacy arrays<br/>coexist"]
```

<p class="muted pt-2">
Same as Web: per-company windows (admin) · null → website ~1h · call ~10m · book ~15m · hash + idempotency · don’t wait on analytics · optional server uid if panel asks
</p>

---
layout: with-outline-two-cols
---

# A1 · Solution

<div class="kicker">What we accept from the challenge</div>
<p class="muted mb-2">Flutter client → <strong>same CF as Web C3</strong> — not a second function</p>

<div class="big-list">

- Call shared **`recordEngagementEvent`** (or extend ads-family) — same contract as web
- Payload: `{ companyId, eventType, placement }` — **no email**
- `eventType`: `website_view` \| `call_click` \| `booking_click`
- Single **EngagementReporting** used by both Flutter call sites; don’t wait on analytics
- CF writes **events / counts**; stop client `arrayUnion` + PII
- **Dedupe windows on the company doc** (admin can change) — same fields as Web C3
- **If null → CF defaults:** website **~1h** · call **~10m** · book **~15m** (replaces weak phone-only cooldown)
- **Hash + idempotency:** fingerprint event fields; same key / same window → once
- **Rules deny** client engagement writes; legacy arrays coexist
- **Optional (Accepted with Changes):** server-derived **`uid`** when logged in

</div>

::right::

# Rejected

<div class="kicker">What we will not do — and why</div>

<div class="card card-warn mt-2">

**Rejected:** narrow rules only, client still `arrayUnion`s.

</div>

<div class="big-list mt-4">

- **Why reject:** signed-in / modified clients can still spam valid-shaped events
- **Why reject:** does not match proven ad callable pattern
- **Why reject:** a mobile-only CF when web needs the same door
- **Chosen:** shared server-authoritative callable + deny client writes

</div>

---

# A1 · Plan

<div class="kicker">How I will deliver Phase 2 · aligned with Web C3</div>

<div class="big-list plan-speak">

- Extract **EngagementReporting**; wire both Flutter call sites (popup + card)
- Point the client at the **shared CF** (same payload + company windows / defaults + hash as web); don’t wait on analytics; no email
- Emulator rules: deny client engagement writes; legacy arrays read-only coexist
- Dart unit tests + rules positive/negative; runbook + PR (pair with web CF if lead splits repos)

</div>

---
layout: with-outline-section
---

# App C2

## Release confidence pipeline

<p class="title-speak">
Runtime controls exist (Sentry, App Check, Shorebird), but there is no repeatable gate that proves a commit is fit for TestFlight / Play internal.
</p>

---
layout: with-outline-two-cols
---

# A2 · Problem

<div class="kicker">Full problem</div>

<p class="lead" style="font-size: 0.92rem !important; max-width: 30ch;">
Flutter tests exist but are thin. This tree is missing checked-in GitHub Actions build/test/release, Fastlane, Codemagic config, Firebase Emulator Suite config, <code>integration_test/</code>, and Firestore rules in VCS. Sentry, App Check, and Shorebird run in-app — they are <strong>not</strong> a release gate. Success is a secure, reviewable pipeline for TestFlight and Play internal — not a production store launch.
</p>

::right::

<div class="kicker">Business impact</div>

<div class="big-list">

- Broken builds reach internal testers more easily
- Regressions hurt booking / marketplace trust early
- Manual “works on my machine” — slow, non-auditable
- Signing secrets risk if handled ad hoc
- Leadership has no evidence trail for raised baseline

</div>

---

# A2 · Evidence

<div class="kicker">What this checkout shows</div>

| Capability | Status |
|------------|--------|
| Unit / widget tests | Present but thin |
| GHA build/test/release | Missing |
| Fastlane / Codemagic | Missing |
| Emulator + rules in VCS | Missing |
| `integration_test/` | Missing |
| Sentry / App Check / Shorebird | Present in-app |

---
layout: with-outline-center
---

# A2 · Architecture

<div class="kicker">Today vs proposed — trust boundaries</div>

<p class="muted mb-2"><strong>Row 1 — Today (no enforced gate)</strong></p>

```mermaid {scale: 0.48}
%%{init: {'flowchart': {'htmlLabels': true, 'wrappingWidth': 220, 'padding': 16}}}%%
flowchart LR
  Dev["Dev machine"] --> Local["fvm flutter test / run"]
  Local --> Manual["Manual archive / upload"]
  Manual --> TF["TestFlight / Play internal"]
  Runtime["Sentry · App Check · Shorebird<br/>(in-app only — not a gate)"] -.-> TF
```

<p class="muted mt-4 mb-2"><strong>Row 2 — Proposed (PR CI + approved release)</strong></p>

```mermaid {scale: 0.42}
%%{init: {'flowchart': {'htmlLabels': true, 'wrappingWidth': 220, 'padding': 16}}}%%
flowchart LR
  PR["PR open / update"] --> GHA["GitHub Actions<br/>PR workflow"]
  GHA --> Fmt["format / analyze"]
  GHA --> Tests["unit + widget + ≥1 integration"]
  GHA --> Emu["Firebase Emulator<br/>+ Firestore rules"]
  Fmt --> Merge["Merge when green"]
  Tests --> Merge
  Emu --> Merge
  Merge --> Rel["workflow_dispatch<br/>+ environment approval"]
  Rel --> Lane["Fastlane lanes"]
  Sec["GitHub Environments<br/>keystore / ASC / Play JSON"] -.->|"inject, never log"| Lane
  Lane --> Art["IPA / AAB artifacts"]
  Art --> Dist["TestFlight · Play internal"]
```

<p class="muted pt-3">
PR CI = untrusted branch, no store secrets. Release = protected environment + Fastlane. Same split as Web C1: prove on every PR, distribute only after approval.
</p>
---
layout: with-outline-two-cols
---

# A2 · Solution

<div class="kicker">What we accept from the challenge</div>

<div class="big-list">

- **GitHub Actions + Fastlane** as default stack
- **PR workflow:** FVM Flutter 3.29.1 → format/analyze → expanded tests → ≥1 integration path → emulator + rules test
- **Release workflow:** `workflow_dispatch` + environment approval; lanes for Android internal + iOS TestFlight (or documented dry-run)
- **CI injects build numbers** — no `pubspec` churn on every PR
- Secrets only in protected environments — never logged / never committed
- Auditable artifacts + rollback / release-stop runbook

</div>

::right::

# Rejected

<div class="kicker">What we will not do — and why</div>

<div class="card card-warn mt-2">

**Rejected as primary:** Codemagic-only pipeline.

</div>

<div class="big-list mt-4">

- **Why reject:** second vendor outside GitHub PR checks
- **Why reject:** credential/cost duplication vs Actions Environments
- **Also rejected:** PR-only CI with no approved release lane
- **Chosen:** Actions (PR) + Actions/Fastlane (approved release)
- Panel may Accept with Changes if Codemagic preferred

</div>

---

# A2 · Plan

<div class="kicker">How I will deliver Phase 2</div>

<div class="big-list plan-speak">

- Make every PR go red/green automatically (code checks + existing tests)
- Add more small tests + one “run the app” path; note what device/CI can run
- Check in fake Firebase + one security-rules test; run it on PRs
- Add an approved release job that builds iOS/Android files; document locked secrets (no keys in the repo)
- Practice a dry-run upload + how to stop a bad tester build; polish the PR for the panel

</div>

---
layout: with-outline-section
---

# App C3

## Scalable booking deep links

<p class="title-speak">
Booking deep-link resolution can fall back to a full <code>companies</code> collection scan — unbounded cost and wrong-company risk.
</p>

---
layout: with-outline-two-cols
---

# A3 · Problem

<div class="kicker">Full problem</div>

<p class="lead" style="font-size: 0.9rem !important; max-width: 30ch;">
<code>resolveBookingSlugOrId</code> tries websites lookup and company id forms, then falls back to <code>db.collection('companies').get()</code> — a full collection scan — and matches brand/legal/website fields in memory. Dual slug helpers disagree (hyphenated web-style vs no-hyphen share slug). Offline/cache behavior is unclear; fuzzy match can resolve the <strong>wrong company</strong>.
</p>

::right::

<div class="kicker">Business impact</div>

<div class="big-list">

- Slow or failed Book links from ads / SMS / web
- Firestore reads scale with entire companies collection
- Lost bookings on timeout or mis-resolve
- Confusing offline / stale cache behavior
- Support cannot explain intermittent failures

</div>

---

# A3 · Evidence

<div class="kicker">Resolver path today</div>

<div class="big-list">

- File: `lib/core/deep_link/booking_slug_resolver.dart`
- Order: `websites/{id}` → company doc id / suffix → **full `companies.get()`** → in-memory match
- Caller: `BookingDeepLinkPage` → `go('/booking?companyId=…')` or generic error
- `generateBookingUrlSlug` (hyphenated) vs `generateCompanySlug` (no hyphens)

</div>

---
layout: with-outline-center
---

# A3 · Architecture

<div class="kicker">Proposed — look up one company, never download all</div>

```mermaid {scale: 0.48}
%%{init: {'flowchart': {'htmlLabels': true, 'wrappingWidth': 220, 'padding': 16}}}%%
flowchart LR
  Link2["Book link<br/>/booking/name"] --> Norm["Canonical slug<br/>(web hyphens)"]
  Norm --> R2["Find company"]
  R2 --> W2["1 read: websites"]
  W2 -->|miss| Idx["1 read: slug_index<br/>doc id = slug"]
  Idx -->|miss| Id2["1 read: company id"]
  Id2 -->|miss| Fail["Stop: not found<br/>or offline"]
  R2 -.->|"never"| ScanX["Download all companies"]
  R2 -.->|"never"| QX["Query + composite index"]
```

<p class="muted pt-3">
<strong>Canonical <code>slug_index/{slug}</code></strong> = one doc per slug (direct get). Not a composite-index query over companies. ≤3 reads. Unsure → stop.
</p>

<div class="card mt-3" style="font-size: 0.85rem !important;">

<strong>Must fix:</strong> full <code>companies.get()</code> scan · dual slug helpers (hyphen vs no-hyphen) · fuzzy wrong-company match · unclear offline UX · missing <code>slug_index</code> + backfill

</div>
---
layout: with-outline-two-cols
---

# A3 · Solution

<div class="kicker">What we accept from the challenge</div>

<div class="big-list">

- **Remove** the “download all companies” fallback from the Book-link path
- **One canonical slug** (web hyphens) for booking deep links — retire no-hyphen helper on this path
- Lookups: **website → `slug_index/{canonicalSlug}` → company id** (≤ **3** gets)
- **`slug_index` = doc-id map**, not a composite-index company query
- If unsure → **stop** (not found / offline) — never open a random company
- Clear screens: not found / offline / retry
- **Also fix:** backfill plan for `slug_index`; privileged writes only; share-URL dual-slug debt documented if out of slice

</div>

::right::

# Rejected

<div class="kicker">What we will not do — and why</div>

<div class="card card-warn mt-2">

**Rejected:** Cloud Function for every Book link · “scan with a limit” · resolve via **composite-index query** on companies

</div>

<div class="big-list mt-4">

- **Why not CF-only:** still need a fast index; adds latency / cold starts; worse offline
- **Why not limited scan:** still slow, still can pick the wrong shop
- **Why not composite query:** multi-field indexes help filtered lists — deep links need slug→company once; doc-id `slug_index` is cheaper and unambiguous
- **Chosen:** canonical `slug_index` + website + id · fail closed · no full scan

</div>
---

# A3 · Plan

<div class="kicker">How I will deliver Phase 2 · step by step</div>

<div class="big-list plan-speak">

1. **Keep working paths:** Book Now from the **popup** (and notifications) already open `/booking?companyId=…` — they **skip** slug resolve; leave that alone.
2. **Same logic when id is missing:** public `/booking/{slugOrId}` (ads / SMS / shared links) has no `companyId` → run the new resolver (same logic everywhere we lack an id).
3. **Remove the scan:** delete full `companies.get()` fallback; temporary miss → not found; keep `websites/{id}` + `companies/{id}` gets.
4. **Canonical slug + `slug_index`:** one hyphenated web-style slug; `get slug_index/{slug}` → `companyId` (doc-id map, not composite query).
5. **Fail closed UX:** Book-link screen shows not found / offline / retry — never a wrong company.
6. **Tests + backfill plan:** unit/emulator branches; dry-run `slug_index` backfill for lead; document share-URL dual-slug follow-up if out of slice.

</div>

---
