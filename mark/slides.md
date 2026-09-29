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

```mermaid {scale: 0.58}
flowchart LR
  PR["PR"] --> GHA["GitHub Actions\nlint · typecheck · unit · Lighthouse"]
  PR --> Prev["Vercel Preview"]
  Prev --> E2E["Playwright smoke\ndiscovery → booking"]
  GHA --> Gate["Required checks"]
  E2E --> Gate
  Gate --> Prod["Production\nlead: Deployment Checks"]
```

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

<p class="muted mb-3">
Speak-through plan — each day maps to the accepted solution above.
</p>

<div class="big-list plan-speak">

- **Day 1 — Foundation:** Add reproducible `typecheck` and `test` scripts. Make lint reliable in CI. Land `.github/workflows/quality.yml` so every PR runs lint, typecheck, and the selected unit suite the same way locally and in GitHub Actions.
- **Day 2 — TypeScript migration plan:** Capture the current error baseline while `ignoreBuildErrors` stays true on Vercel. Write a short staged plan (inventory → CI gate → remove ignore flag) so we do not break Production with a big-bang flip.
- **Day 3 — Playwright smoke:** Add a small E2E path: public discovery → booking entry against a Vercel Preview URL (or documented equivalent). No production credentials. Wire it as a CI check the lead can require.
- **Day 4 — Performance + gates runbook:** Add Lighthouse CI (or equivalent) for one public route with a justified budget. Document env boundaries (local / Preview / Production) and the exact GitHub + Vercel Deployment Checks a lead should turn on — we do not change branch protection ourselves.
- **Day 5 — Harden + demo:** Fix flakes, finish the runbook (setup, verify, rollout, rollback), open the PR, and dry-run the 15–20 minute demo: green quality checks, Preview smoke, and the lead checklist.

</div>

<p class="card mt-4">

<strong>Demo promise:</strong> Show a PR where quality checks run; show Playwright against Preview; show the written plan for removing ignored TS errors and for the lead to apply required status checks.

</p>

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

- Open proxy / SSRF-style risk via arbitrary `url` + token
- Weak booking identity — Cloud Functions get `uid: undefined`
- Availability backend can be steered by the client
- Downstream errors/stacks can leak to the browser
- Hard for support and security to trust the booking boundary

</div>

---

# C2 · Evidence

<div class="kicker">What the Marketplace web routes show</div>

| Route | Issue |
|-------|--------|
| `/api/booking-proxy` | Caller supplies `url` + `token` + method + body → server `fetch` |
| `/api/bookings/get` · `update` · `delete` | Forwards `uid: undefined` to Cloud Functions |
| `/api/get-availability` | Caller can set `useNestBackend` and forward Nest fields |

<div class="card mt-4">

**Good pattern already in repo:** `validate-discount` — verify Firebase ID token, derive `uid` server-side, return a stable error shape with `traceId`.

</div>

<div class="card card-warn mt-3">

**Delete residual:** hard-delete UI may be off, but `/api/bookings/delete` still exists and is callable. UI off ≠ API safe → disable the route or put it behind the same gateway rules (future-ready).

</div>

---
layout: with-outline-center
---

# C2 · Architecture

<div class="kicker">Today vs proposed trust boundary</div>

<p class="muted mb-2"><strong>Row 1 — Today (browser-owned)</strong></p>

```mermaid {scale: 0.48}
%%{init: {'flowchart': {'htmlLabels': true, 'wrappingWidth': 220, 'nodeSpacing': 55, 'rankSpacing': 55, 'padding': 16}}}%%
flowchart LR
  B1["Browser"] -->|"url, token, method, body"| P["booking-proxy<br/>/api/booking-proxy"]
  P --> W1["Any WordPress<br/>host allowed"]
  B1 -->|"companyId, bookingId"| G1["bookings get / update<br/>/api/bookings/*"]
  G1 -->|"uid: undefined"| CF1["Cloud Functions"]
```

<p class="muted mt-4 mb-2"><strong>Row 2 — Proposed (server-owned)</strong></p>

```mermaid {scale: 0.48}
%%{init: {'flowchart': {'htmlLabels': true, 'wrappingWidth': 220, 'nodeSpacing': 55, 'rankSpacing': 55, 'padding': 16}}}%%
flowchart LR
  B2["Browser"] -->|"Bearer + safe fields"| GW["Typed booking<br/>gateway"]
  GW --> AUTH["verifyIdToken"]
  GW --> CFG["Company config<br/>+ host allowlist"]
  AUTH --> UID["uid from token"]
  CFG --> W2["Allowed WordPress<br/>host only"]
```

<p class="muted pt-3">
Browser untrusted · Next.js owns destination + credentials + identity · Nest/CF contracts stated at the Marketplace boundary
</p>

---
layout: with-outline-two-cols
---

# C2 · Solution

<div class="kicker">What we accept from the challenge</div>
<p class="muted mb-2">This is the Phase 2 scope I am proposing — one coherent booking slice</p>

<div class="big-list">

- Replace the WordPress booking **update** path (today via booking-proxy) with a **typed server-owned gateway**
- Derive destination + credentials from **server-owned company config / allowlist** — never from the browser request
- **Verify Firebase ID tokens** where the customer must be signed in; derive `uid` server-side only
- Keep a **stable, safe client error contract** and propagate a **correlation ID** to logs and downstream calls
- Keep availability **intentionally public**, but with **input schema validation** and explicit **rate / abuse controls**; stop trusting client `useNestBackend`
- Handle **delete residual**: disable the open delete route **or** apply the same gateway rules if product may re-enable it later

</div>

::right::

# Rejected

<div class="kicker">What we will not do — and why</div>

<div class="card card-warn mt-2">

**Rejected alternative:** add auth middleware to booking-proxy but still accept caller-provided `url` + `token`.

</div>

<div class="big-list mt-4">

- **Why reject:** an authenticated open proxy is still an open proxy
- **Why reject:** destination and WordPress credentials must be server-owned, not client-supplied
- **Why reject:** fixing only UI checks does not stop direct API abuse
- **Chosen instead:** one typed gateway slice + validate-discount patterns (auth, traceId, safe errors)

</div>

---

# C2 · Plan

<div class="kicker">How I will deliver Phase 2 · 3–5 working days</div>

<p class="muted mb-3">
Speak-through plan — each day maps to the accepted solution above. Work stays in the Marketplace web repo unless the panel grants Nest/CF access.
</p>

<div class="big-list plan-speak">

- **Day 1 — Helpers + design lock:** Confirm the update-gateway slice. Add shared helpers: Bearer ID-token verify, server-derived `uid`, correlation ID, safe error shape, and host allowlist. Spike where company WordPress base URL + token live in Firestore today.
- **Day 2 — Typed gateway:** Implement the server-owned update route. Point the existing client caller (`lib/api/bookings.ts` path) at the new gateway. Feature-flag the old proxy path for safe rollback.
- **Day 3 — Availability + delete residual:** Stop trusting client `useNestBackend` (read company flag server-side). Add schema validation + basic rate/abuse controls on availability. Disable or secure `/api/bookings/delete` with the same rules.
- **Day 4 — Route tests:** Positive and negative tests with mocked Firebase Admin and mocked downstream HTTP — happy path, missing/invalid token, cross-user, arbitrary host rejected, timeout, downstream 5xx. No secrets in fixtures.
- **Day 5 — Runbook + demo:** Write design summary, verify steps, rollout/rollback, and downstream contracts. Open the PR, call out any scope deltas, dry-run the 15–20 minute walkthrough.

</div>

<p class="card mt-4">

<strong>Demo promise:</strong> Show the old proxy risk (arbitrary host rejected by the new gateway); show invalid token and cross-user failures; show a happy path with mocked WordPress/CF; show availability still works without client Nest override; show delete disabled or secured.

</p>

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

- Forged or replayed clicks and website views
- PII (email) stored on operational company docs
- Unbounded array growth → cost and slower catalogue reads
- Untrusted metrics → bad marketing / ranking decisions
- Inconsistent patterns: ads use callables; views/clicks use open rules

</div>

---

# C3 · Evidence

<div class="kicker">What the repo and rules show</div>

| Area | Evidence |
|------|----------|
| Firestore rules | Public `update` if only tracking keys change |
| Client helpers | `trackCallClick` / `trackBookingClick` → `arrayUnion` with email + timestamp + source |
| Website views | Client `trackWebsiteView` writes `website_view` arrays |
| Better pattern | `AdBanner` → callables `logAdImpression` / `logAdClick` |

<div class="card mt-4">

**Good pattern already:** ad events use `{ adId, companyId, placement }` via Cloud Functions — no client `arrayUnion` for ads. Views and conversion clicks should follow that model.

</div>

<div class="card card-warn mt-3">

**Assessment constraint:** do not migrate or delete production analytics. Design for coexistence / dual-read with legacy arrays.

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
  UI2["Web UI"] -->|"minimal event<br/>no email identity"| CF["Callable ingest"]
  CF --> V["Validate + de-identify"]
  V --> D["Dedup / idempotency"]
  D --> E["Events + daily<br/>aggregates"]
  LOCK["Rules: deny client<br/>analytics writes"] --> LEG["Legacy arrays<br/>read-only coexist"]
```

<p class="muted pt-3">
DoD slice: website views + one conversion · catalogue public reads stay · no production analytics delete
</p>

---
layout: with-outline-two-cols
---

# C3 · Solution

<div class="kicker">What we accept from the challenge</div>
<p class="muted mb-2">This is the Phase 2 scope I am proposing</p>

<div class="big-list">

- Design a **server-authoritative ingest** path for **website views** + **one conversion** (booking click or call click)
- **Validate** event shape; **reject or de-identify** browser-supplied identities (no email as authority)
- Use a **scalable event model** with aggregation + retention; support reporting via aggregates
- **Tighten Firestore rules** so selected analytics fields cannot be mutated by arbitrary clients
- Keep **public catalogue reads** working
- Prefer extending the existing **ad callable** pattern (`logAdImpression` / `logAdClick`)
- **Coexistence only** — no production analytics migrate/delete in this assessment

</div>

::right::

# Rejected

<div class="kicker">What we will not do — and why</div>

<div class="card card-warn mt-2">

**Rejected alternative:** only require auth in rules, but keep client `arrayUnion` into company arrays.

</div>

<div class="big-list mt-4">

- **Why reject:** signed-in users can still forge volume and replay events
- **Why reject:** PII and unbounded document growth remain
- **Why reject:** big-bang prod array migration is out of scope and unsafe here
- **Chosen instead:** callable ingest + locked rules + aggregates beside legacy arrays

</div>

---

# C3 · Plan

<div class="kicker">How I will deliver Phase 2 · 3–5 working days</div>

<p class="muted mb-3">
Speak-through plan — each day maps to the accepted solution above.
</p>

<div class="big-list plan-speak">

- **Day 1 — Consumers + schema lock:** Confirm with the panel which reporting consumers read legacy arrays, and which conversion to implement (booking click vs call click). Lock event schema, aggregate layout, retention, and callable vs Next Admin path (prefer callable to mirror ads).
- **Day 2 — Ingest + client switch:** Implement server ingest for website_view + one conversion. Replace client helpers so they no longer `arrayUnion` those fields; send minimal events with server timestamps and dedup keys.
- **Day 3 — Rules + coexistence:** Tighten Firestore rules so selected analytics fields are not client-writable. Keep company/catalogue public reads. Document dual-read coexistence for legacy arrays — no prod wipe.
- **Day 4 — Tests + observability:** Emulator/security tests (client update denied). Unit tests for validation, dedup, aggregation, replay, and invalid events. Log/metrics for rejects and downstream failures.
- **Day 5 — Runbook + demo:** Write rollout/rollback/coexistence notes, open the PR, dry-run the 15–20 minute demo: forge path blocked, happy ingest, catalogue still readable.

</div>

<p class="card mt-4">

<strong>Demo promise:</strong> Show rules rejecting a direct client write to tracking fields; show valid website_view + conversion accepted once; show replay rejected; show public catalogue read still works; show coexistence decision (no prod delete).

</p>

<p class="muted mt-3">
<strong>Ask panel:</strong> preferred conversion · reporting consumers · non-prod Firebase / emulator · CF deploy access if needed
</p>

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
Marketplace engagement is written from the Flutter client directly into company documents: <code>website_view</code>, <code>call_clicks</code>, and <code>booking_clicks</code> via <code>FieldValue.arrayUnion</code>. Payloads include <strong>email</strong>, client <strong>date</strong>, and <strong>source</strong>. Website-view cooldown is client-only <code>SharedPreferences</code> (bypassable). Call/booking clicks have no server dedupe. Ad analytics already use callables <code>logAdImpression</code> / <code>logAdClick</code> with <code>{ adId, companyId, placement }</code> and <strong>no email</strong>.
</p>

::right::

<div class="kicker">Business impact</div>

<div class="big-list">

- Companies see inflated / forged views and clicks
- Aspio cannot trust metrics for ranking or abuse review
- Customer email retained on company documents
- Modified clients can mutate analytics if rules allow
- Unbounded arrays grow cost and document size

</div>

---

# A1 · Evidence

<div class="kicker">Verified call sites + payload</div>

| Event | Field | Mechanism |
|-------|--------|-----------|
| Website view | `website_view` | `arrayUnion` |
| Call click | `call_clicks` | `arrayUnion` |
| Booking click | `booking_clicks` | `arrayUnion` |

<div class="big-list mt-3">

- `service_popup_card.dart` — `_trackWebsiteView` / `_trackCallClick` / `_trackBookingClick`
- `marketplace_page.dart` — same three methods on `_CompanyCardState`
- Payload today: `{ email, date, source: 'Mobile Marketplace' }`
- Ads contrast: `httpsCallable` · no email · server write

</div>

---
layout: with-outline-center
---

# A1 · Architecture

<div class="kicker">Today vs proposed trust boundary</div>

<p class="muted mb-2"><strong>Row 1 — Today (device writes company arrays)</strong></p>

```mermaid {scale: 0.46}
%%{init: {'flowchart': {'htmlLabels': true, 'wrappingWidth': 220, 'padding': 16}}}%%
flowchart LR
  UI1["ServicePopupCard"] -->|"arrayUnion + email"| FS["companies doc<br/>engagement arrays"]
  UI2["Marketplace card"] -->|"arrayUnion + email"| FS
  Prefs["SharedPreferences<br/>cooldown only"] --> UI1
  AdUI["Ad UI"] -->|"adId, companyId, placement"| CFAd["logAdImpression<br/>/ logAdClick"]
```

<p class="muted mt-4 mb-2"><strong>Row 2 — Proposed (callable like ads)</strong></p>

```mermaid {scale: 0.46}
%%{init: {'flowchart': {'htmlLabels': true, 'wrappingWidth': 220, 'padding': 16}}}%%
flowchart LR
  UI["Marketplace UI"] -->|"fire-and-forget"| API["EngagementReporting"]
  API -->|"httpsCallable<br/>no email"| CF["recordEngagementEvent"]
  CF --> Val["Validate + dedupe"]
  Val --> Write["Events + aggregates"]
  Rules["Rules deny client<br/>engagement writes"] -.-> FS2["companies doc"]
```

---
layout: with-outline-two-cols
---

# A1 · Solution

<div class="kicker">What we accept from the challenge</div>

<div class="big-list">

- Reuse the **ad-analytics trust model** via `httpsCallable`
- Payload: `{ companyId, eventType, placement }` — **no email**
- `eventType`: `website_view` \| `call_click` \| `booking_click`
- Single **EngagementReporting** client used by both call sites
- Fire-and-forget — UI never waits on analytics
- Events/aggregates written **only by CF**; stop PII arrays on company root
- Emulator rules: **deny** client writes to engagement fields
- Dart unit tests + emulator positive/negative auth tests + runbook

</div>

::right::

# Rejected

<div class="kicker">What we will not do — and why</div>

<div class="card card-warn mt-2">

**Rejected:** narrow rules only, client still `arrayUnion`s.

</div>

<div class="big-list mt-4">

- **Why reject:** modified clients can still spam valid-shaped events
- **Why reject:** does not match proven ad callable pattern
- **Why reject:** still contends on company documents
- **Also rejected:** open `engagement_events` client creates — still forgeable
- **Chosen:** server-authoritative callable + deny client writes

</div>

---

# A1 · Plan

<div class="kicker">How I will deliver Phase 2 · 3–5 working days</div>

<div class="big-list plan-speak">

- **Day 1 — Seam:** Extract `EngagementReporting`; wire both call sites; keep temporary Firestore write behind the interface; add interface tests.
- **Day 2 — Callable:** Switch impl to CF payload aligned with ad callables; fire-and-forget + failure handling. Smallest slice: one event type (`call_click`) on one site first.
- **Day 3 — Rules:** Emulator denies client engagement writes; positive/negative rules tests; CF stub or paired function as lead directs.
- **Day 4 — Data model:** Events + aggregates; retention note; dual-write off by default.
- **Day 5 — Runbook + demo:** README, success + network-failure demo, PR polish.

</div>

<p class="card mt-4">

<strong>Demo promise:</strong> tap call → event without email; kill network → call/book still works; direct client update to `website_view` → DENIED.

</p>

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
| Version | `1.0.1+8` in `pubspec.yaml` |

---
layout: with-outline-center
---

# A2 · Architecture

<div class="kicker">Today vs proposed trust boundary</div>

<p class="muted mb-2"><strong>Row 1 — Today</strong></p>

```mermaid {scale: 0.48}
%%{init: {'flowchart': {'htmlLabels': true, 'wrappingWidth': 220, 'padding': 16}}}%%
flowchart LR
  Dev["Developer laptop"] --> Local["flutter test / run"]
  Local --> Manual["Manual archive<br/>/ upload"]
  Manual --> Store["TestFlight / Play internal"]
```

<p class="muted mt-4 mb-2"><strong>Row 2 — Proposed</strong></p>

```mermaid {scale: 0.46}
%%{init: {'flowchart': {'htmlLabels': true, 'wrappingWidth': 220, 'padding': 16}}}%%
flowchart LR
  PR["PR workflow"] --> Unit["Analyze + tests"]
  PR --> Emu["Emulator + rules"]
  Merge["Merge"] --> Rel["Release workflow<br/>manual approval"]
  Rel --> Fast["Fastlane"]
  Sec["GH Environments<br/>secrets"] -.-> Fast
  Fast --> Art["IPA / AAB artifacts"]
  Art --> TF["TestFlight / Play internal"]
```

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

<div class="kicker">How I will deliver Phase 2 · 3–5 working days</div>

<div class="big-list plan-speak">

- **Day 1 — PR gate:** GHA with FVM, analyze, existing tests; README CI section. Smallest slice: red/green PR gate.
- **Day 2 — Tests:** Expand focused unit tests; add `integration_test/` skeleton + one path; document device constraints.
- **Day 3 — Emulator:** Check in Firebase emulator config + one Firestore rules test; wire into PR workflow.
- **Day 4 — Release lane:** CI build numbers; Fastlane + release workflow with environment approval; secrets documentation.
- **Day 5 — Dry-run + runbook:** Dry-run or real upload if credentials exist; rollback/stop procedure; demo script.

</div>

<p class="card mt-4">

<strong>Demo promise:</strong> green PR run → release workflow needs approval → artifact / dry-run → show release-stop steps in runbook.

</p>

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

<div class="kicker">Today vs proposed trust boundary</div>

<p class="muted mb-2"><strong>Row 1 — Today</strong></p>

```mermaid {scale: 0.46}
%%{init: {'flowchart': {'htmlLabels': true, 'wrappingWidth': 220, 'padding': 16}}}%%
flowchart LR
  Link["/booking/slug"] --> R["resolveBookingSlugOrId"]
  R --> W["websites get"]
  W -->|miss| Id["company id / suffix"]
  Id -->|miss| Scan["companies.get<br/>FULL SCAN"]
  Scan --> Match["In-memory brand match"]
```

<p class="muted mt-4 mb-2"><strong>Row 2 — Proposed</strong></p>

```mermaid {scale: 0.46}
%%{init: {'flowchart': {'htmlLabels': true, 'wrappingWidth': 220, 'padding': 16}}}%%
flowchart LR
  Link2["/booking/slug"] --> R2["BookingSlugResolver"]
  R2 --> W2["O(1) websites"]
  W2 -->|miss| Idx["O(1) slug_index"]
  Idx -->|miss| Id2["O(1) companies/id"]
  Id2 -->|miss| Fail["not_found / offline<br/>fail closed"]
  R2 -.->|"never"| ScanX["Full companies scan"]
```

---
layout: with-outline-two-cols
---

# A3 · Solution

<div class="kicker">What we accept from the challenge</div>

<div class="big-list">

- Remove unbounded `companies.get()` from the customer path
- Canonical web-style slug + lookups: **websites → slug_index → company id**
- Bounded read budget (target **≤ 3** gets)
- **Fail closed** on miss / ambiguity — never silent wrong company
- Clear UX: not found / offline / retry
- Dart tests for normalization + each branch; emulator/seam tests
- Dry-run backfill plan for lead (fixtures/emulator only in Phase 2)

</div>

::right::

# Rejected

<div class="kicker">What we will not do — and why</div>

<div class="card card-warn mt-2">

**Rejected as primary:** Cloud Function resolver only.

</div>

<div class="big-list mt-4">

- **Why reject:** still need an O(1) index; adds latency/cold starts
- **Why reject:** pure CF fails closed offline without companyId cache
- **Also rejected:** keep scan but add `limit` — still non-deterministic / costly
- **Chosen:** `slug_index` + websites + id; fail closed; no scan

</div>

---

# A3 · Plan

<div class="kicker">How I will deliver Phase 2 · 3–5 working days</div>

<div class="big-list plan-speak">

- **Day 1 — Delete the scan:** Injectable resolver seam + fixtures; remove `companies.get()`; miss → not found for now; tests for id + websites paths.
- **Day 2 — Index:** Add `slug_index` reads + canonical normalization; unit tests for all branches.
- **Day 3 — UX:** Offline / not found / retry on `BookingDeepLinkPage`; widget tests.
- **Day 4 — Emulator + backfill plan:** Emulator test; idempotent dry-run backfill tool/plan; rollback docs.
- **Day 5 — Runbook + demo:** Measurement notes, PR polish, demo (success + offline + not found).

</div>

<p class="card mt-4">

<strong>Demo promise:</strong> fixture slug → correct booking; airplane mode → recovery UI; unknown slug → not found (never a random company); grep shows no full companies scan in resolver.

</p>
