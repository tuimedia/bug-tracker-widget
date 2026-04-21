# @tuimedia/bug-tracker-widget

A self-contained [Lit](https://lit.dev/) web component that adds a floating bug reporting widget to any web app. Framework-agnostic — works with Vue, React, plain HTML, or anything else.

Features:
- Report an issue form (title, steps, expected/actual behaviour, page URL, screenshots)
- My issues list with pagination and ticket detail view
- Screenshot upload via S3 presigned URLs
- Optional Sentry integration
- Persists form state in `localStorage`

---

## Prerequisites

The widget proxies all requests through your app's backend. You'll need:

1. A running [bug tracker API](https://github.com/tuimedia/deloitte-bug-tracker)
2. [`tuimedia/bug-tracker-client-bundle`](https://github.com/tuimedia/bug-tracker-client-bundle) wired into your Symfony app
3. A `/api/me` endpoint on your frontend that returns at least `{ email, displayName, isAdmin }` — the widget uses this to populate reporter details and to decide whether to render at all (only shown when `isAdmin: true`)

---

## 1. Backend — install the client bundle

The bundle registers proxy routes at `/api/feedback/*`, enforces role-based access, and prevents `reporterEmail` spoofing by overwriting it with the authenticated user's identity server-side.

### Install via Composer

```bash
composer require tuimedia/bug-tracker-client-bundle
```

### Register the bundle

```php
// config/bundles.php
return [
    // ...
    Tui\BugTrackerBundle\TuiBugTrackerBundle::class => ['all' => true],
];
```

### Mount the routes

```yaml
# config/routes/bug_tracker.yaml
tui_bug_tracker:
    resource: '@TuiBugTrackerBundle/config/routes.yaml'
    prefix: /api/feedback
```

### Configure

```yaml
# config/packages/tui_bug_tracker.yaml
tui_bug_tracker:
    base_url: '%env(BUG_TRACKER_BASE_URL)%'
    api_key: '%env(BUG_TRACKER_API_KEY)%'
    required_role: ROLE_ADMIN   # or ROLE_FEEDBACK, etc.
```

```dotenv
BUG_TRACKER_BASE_URL=https://bug-tracker.example.com
BUG_TRACKER_API_KEY=your-api-key
```

### Local development

Add the bug tracker as an opt-in Docker service:

```yaml
# docker-compose.yml
services:
  bug-tracker-app:
    image: 076917342673.dkr.ecr.eu-west-1.amazonaws.com/deloitte-bug-tracker:dev
    pull_policy: always
    profiles: [bug-tracker]
    ports:
      - "8090:80"
```

Authenticate with ECR, then start:

```bash
aws ecr get-login-password --region eu-west-1 --profile deloitte \
  | docker login --username AWS --password-stdin 076917342673.dkr.ecr.eu-west-1.amazonaws.com

docker compose --profile bug-tracker up
```

Admin UI available at `http://localhost:8090`.

### AWS credentials (S3 screenshot uploads)

The bug tracker uploads screenshots to S3 using a UAT task role. Credentials expire after ~1 hour. Add a refresh script and wire it into your `docker-compose.yml`:

```bash
# scripts/refresh-bug-tracker-creds.sh
./scripts/refresh-bug-tracker-creds.sh
```

---

## 2. Frontend — install the widget

### Configure `.npmrc`

Add to your project's `.npmrc` (create it if it doesn't exist):

```
@tuimedia:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=YOUR_GITHUB_TOKEN
```

You'll need a GitHub personal access token with `read:packages` scope. For CI, use a repository secret.

### Install

```bash
pnpm add @tuimedia/bug-tracker-widget
```

### Add to your app

#### Option A — import in your JS entry point (recommended for Vite projects)

```js
// main.js / main.ts
import '@tuimedia/bug-tracker-widget'
```

Then add the element wherever you want it rendered (e.g. `App.vue`, `App.jsx`, or directly in HTML):

```html
<bug-tracker-widget></bug-tracker-widget>
```

In Vue, tell the compiler to treat it as a custom element so it doesn't warn about an unknown component:

```js
// vite.config.js
vue({
  template: {
    compilerOptions: {
      isCustomElement: tag => tag === 'bug-tracker-widget',
    },
  },
})
```

#### Option B — script tag (plain HTML / no bundler)

```html
<script type="module" src="/path/to/bug-tracker-widget.js"></script>
<bug-tracker-widget></bug-tracker-widget>
```

### Sentry integration (optional)

If you use Sentry, expose it on `window` after initialising — the widget will pick it up automatically and link submitted reports to a Sentry event:

```js
import * as Sentry from '@sentry/vue' // or @sentry/browser, etc.

Sentry.init({ /* ... */ })

window.Sentry = Sentry
```

---

## How the widget decides what to show

The widget calls `GET /api/me` (with `credentials: 'include'`) on mount. It expects a response like:

```json
{
  "email": "user@example.com",
  "displayName": "Jane Smith",
  "isAdmin": true
}
```

- If `isAdmin` is `false` or the request fails, the widget renders nothing
- `email` and `displayName` are sent as `reporterEmail` / `reporterName` on ticket submission (the backend also overwrites `reporterEmail` server-side as a second layer of protection)

---

## API reference

All requests go through your Symfony app at `/api/feedback/*`. See the [client bundle README](https://github.com/tuimedia/bug-tracker-client-bundle) for full details. Key endpoints:

| Method | Path | Description |
|---|---|---|
| `POST` | `/api/feedback/tickets` | Submit a ticket |
| `GET` | `/api/feedback/tickets/mine` | List the current user's tickets |
| `GET` | `/api/feedback/tickets/mine/:id` | Get a single ticket |
| `POST` | `/api/feedback/attachments/presign` | Get a presigned S3 upload URL |
| `GET` | `/api/feedback/attachments/:id` | Retrieve an attachment (proxied redirect to S3) |

---

## Publishing a new version

Bump the version in `package.json`, commit, then tag:

```bash
git tag v1.2.3
git push origin v1.2.3
```

The GitHub Actions workflow publishes automatically on tag push.
