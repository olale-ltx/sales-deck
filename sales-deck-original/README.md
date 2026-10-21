# LTX — Sales Deck 2026

Live: `https://ltx.io/sites/sales-deck-n6ozqz2ztd/`

Single-file deck (`index.html`) behind a personal-data form. The folder slug is
deliberately unguessable — the deck is shared by direct link only.

---

## What the form is (and is not)

Before the deck renders, the visitor enters **first name, last name, role, and an
access code**. On success the details are written to a Google Sheet and the deck
is revealed. After sign-in, `tracker.js` also records which slides they view and
for how long, and writes that to the `deck_sessions` tab.

**This is lead capture, not access control.** The deck markup is already in the
DOM, hidden with `visibility:hidden`. Anyone can reveal it from devtools. That is
accepted and intentional — the form exists to find out *who* opened the deck, not
to stop anyone from opening it.

Real page protection is tracked separately in FTW-507 (Cloudflare Access at the
edge). If that ships, it replaces this form rather than wrapping it.

---

## Access codes

Each company gets its own code, so the sheet shows which deal a visit came from.
Codes are letters, digits and hyphens (`ACME-2026`), case-insensitive.

To add one, open the **`Codes`** tab of the spreadsheet and append a row:

| Code | Description |
|---|---|
| `ACME-2026` | Acme Corp — Q3 pitch |

No deploy needed. The script reads the tab on every request, so a new code works
immediately.

---

## Data flow

```
index.html                     Apps Script /exec              Spreadsheet
──────────                     ─────────────────              ───────────
checkCode   ──── POST JSON ──▶ validate against Codes tab ──▶ Codes
                          ◀──  { ok, company }

submitLead  ──── POST JSON ──▶ re-validate, then append   ──▶ Leads
                          ◀──  { ok, company }

sessionId   ──── POST JSON ──▶ upsert session row         ──▶ deck_sessions
```

`submitLead` re-checks the code server-side rather than trusting the page, and
refuses to write a row if it does not match.

---

## Storage

Spreadsheet [`1811-7KXo…NqFU`](https://docs.google.com/spreadsheets/d/1811-7KXo8Ak3UVtG-rHcwqiH65r_jTBV7mGe370NqFU/edit)

**`Leads`** — one row per unlock:

| Timestamp | First name | Last name | Role | Code |
|---|---|---|---|---|

**`Codes`** — one row per company:

| Code | Description |
|---|---|

The company name is not copied onto the lead row; join on `Code` with a
`VLOOKUP` against the `Codes` tab when you need it.

**`deck_sessions`** — one row per viewer session (slide dwell, device, events).
Written by `tracker.js`. Read it in the sheet; there is no public read API.

---

## The API

One endpoint, JSON in and JSON out, routed by `op`:

```
https://script.google.com/macros/s/AKfycbyq4huld2hEfeJvDtFkx6Fcrk3kWNaPXlC7c42Wwfet04qU4tXfqapcR72NsN33g9Nj/exec
```

| `op` | `data` | Success | Failure |
|---|---|---|---|
| `ping` | — | `{ ok: true }` | — |
| `checkCode` | `{ code }` | `{ ok: true, company }` | `{ ok: false, error: "invalid_code" }` |
| `submitLead` | `{ firstName, lastName, role, code }` | `{ ok: true, company }` | `{ ok: false, error: "invalid_code" \| "missing_name" }` |

Other errors: `unknown_op`, `bad_json`, `server_error`.

`GET /exec` is a health check only and returns `{ ok: true }` — it does not route
operations.

### Calling it

```js
async function callApi(op, data) {
  const res = await fetch(API_URL, {
    method: 'POST',
    // text/plain keeps this a CORS-simple request. application/json would
    // trigger an OPTIONS preflight, which Apps Script never answers.
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify({ op, data })
  });
  return res.json();
}
```

Two rules that are easy to break:

- **Never `Content-Type: application/json`.** It makes the request non-simple, so
  the browser preflights. Apps Script answers `OPTIONS` with `200` and a bare
  `allow: HEAD, GET, POST` — no `Access-Control-Allow-Origin`, no
  `Access-Control-Allow-Headers` — so the preflight fails and the real request is
  never sent. It will still work in curl and Postman, because neither preflights.
  That asymmetry is what makes this so confusing to debug.
- **Never `mode: 'no-cors'`.** The response becomes opaque, so the code check
  cannot read its own answer and failures become invisible.

Successful responses do carry `access-control-allow-origin: *`, so a normal fetch
reads them fine.

### Testing

`/exec` answers a POST with a `302` to a one-time result URL that must be fetched
with GET. Use `-L` and let curl switch methods on its own — passing `-X POST`
forces POST onto the redirect too, and the result URL replies `405`.

```bash
API='https://script.google.com/macros/s/AKfycbyq4huld2hEfeJvDtFkx6Fcrk3kWNaPXlC7c42Wwfet04qU4tXfqapcR72NsN33g9Nj/exec'

curl -sSL "$API" -H 'Content-Type: text/plain;charset=utf-8' \
  --data-raw '{"op":"ping"}'

curl -sSL "$API" -H 'Content-Type: text/plain;charset=utf-8' \
  --data-raw '{"op":"checkCode","data":{"code":"ACME-2026"}}'
```

Expect roughly **2 seconds** per call. Apps Script is slow to wake, so the form
needs a pending state on the button rather than looking frozen.

---

## Apps Script

Project
[`1NxrYkU7…yetpA`](https://script.google.com/u/0/home/projects/1NxrYkU7EwX4px7DBN-e0RmGlZ6Id8jzGy7ruIiuredX5-gjHmTgyetpA/edit),
bound to the spreadsheet above. Apps Script has no version control, so the
deployed source is mirrored in `Code.gs` in this folder — **update that file
whenever the script changes.** The live script handles the lead form (`op`)
and session tracking (`sessionId` payloads) in the same `/exec` URL.

### Redeploying

**Deploy → Manage deployments → pencil icon → Version: New version → Deploy.**

This keeps the existing `/exec` URL. Using *New deployment* mints a different URL
and the page keeps talking to the old one.

### Design notes

- **Sanitizing.** Names keep Unicode letters, combining marks, spaces, hyphens
  and apostrophes, so `Anne-Marie`, `O'Brien` and `José` survive intact. Codes are
  uppercased and reduced to `A-Z0-9-`. Everything else is dropped, and each field
  is length-capped.
- **Formula injection.** Sanitizing is hygiene, not the defense. Any value
  starting with `=`, `+`, `-`, `@`, tab or CR is prefixed with `'` before it
  reaches a cell — otherwise a crafted name becomes a live formula the moment
  someone opens the sheet. Codes legitimately allow a leading hyphen, so this
  guard matters.
- **Concurrency.** `LockService` serializes writes; concurrent `appendRow` calls
  can otherwise interleave.
- **No auth.** The endpoint is public and unauthenticated. A shared token would
  have to ship in the page source anyway, so it would only deter drive-by bots.
  The blast radius is junk rows in `Leads`, and invalid codes are rejected.

### Source

The live script is `Code.gs` in this folder. Paste it into the Apps Script
project and redeploy as a **new version** of the existing web app (not a new
deployment).

Optional script properties:

| Property | Value |
|---|---|
| `SLACK_WEBHOOK` | optional incoming-webhook URL for open/re-open/forwarded alerts |
| `SHEET_ID` | override; defaults to the spreadsheet id already in `CONFIG` |

---

## Open items

Tracked in FTW-533:

- Production CSP must allow **both** `script.google.com` and
  `script.googleusercontent.com` — `fetch` follows the redirect and CSP checks
  both hops. Works on preview either way, so a miss here is silent in production.
- Names must not be pushed to the GTM dataLayer (PII policy, GDPR).
- Page needs `noindex` on production (FTW-482).
- Privacy notice on the form needs a legal read.
