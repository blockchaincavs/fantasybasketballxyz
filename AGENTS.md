# Standing Rules: fantasybasketballxyz

## Commands

- `npm run tests` (quiet, coverage summary), `npm run typecheck`, `npm run lint`. Run scripts with `-s`.
- App: `npm run -s dev:app` (http://localhost:3000), `npm run -s build:app`, `npm run -s e2e:app`.
- Cloud session: Node `fetch` needs `NODE_USE_ENV_PROXY=1 NODE_EXTRA_CA_CERTS=/root/.ccr/ca-bundle.crt`;
  the proxy injects the BallDontLie and Appwrite keys, so set `BALLDONTLIE_API_KEY=proxy-injected`,
  `APPWRITE_API_KEY=proxy-injected`. No `.env` there: pass `APPWRITE_ENV=dev`,
  `APPWRITE_ENDPOINT=https://sfo.cloud.appwrite.io/v1`, `APPWRITE_PROJECT_ID=fbx-dev` inline.
- Docs: `doc/REQUIREMENTS.md`, `ARCHITECTURE.md`, `plans/ROADMAP.md`.

## Workflow

- Branch `dev`. Start every session with `git fetch origin dev` and fast-forward. Merge to `main`
  only when the user asks.
- One milestone per session: draft it in `plans/active/` → user approves → user starts a **new
  session** to execute it. Execute only the active milestone, then stop.
- Ask the user (question prompt) for approvals and choices; record decisions in the milestone file.
- Tests live in `functions/tests/` and `app/tests/`, mirroring `src/`; e2e in `app/e2e/`.

## Boundaries (enforced by ESLint)

- `app/` = front end only: no game rules, no secrets, never imports `functions/`. It reads only
  `NEXT_PUBLIC_APPWRITE_*` and `NEXT_PUBLIC_SITE_URL`, each by its full literal name.
- `functions/` = the only backend (Appwrite Functions). Every rule is enforced there with the
  server clock. `functions/src/rules/` is pure: no I/O, `process`, clock or `Math.random` (pass
  `now` and `rng` in).
- Secrets only in `.env` (gitignored, never read by Claude) and Function variables.

## Safety

- Appwrite: one project `fbx-dev`; Dev and Prod are databases `fbx_dev` / `fbx_prod`. Never create
  a project, environment or organization (paid; a hook blocks it, don't work around it). Ask
  before anything else that costs money. Scripts and tests use `fbx_dev` only.
- Never print raw JSON or >30 log lines; write logs to `logs/` and `tail`/`grep` them.
- Don't re-download `data/` (recorded BallDontLie fixtures) unless asked.

## Definition of Done (every milestone)

1. Edge cases listed up front in the milestone file, each with a test.
2. Tests, typecheck and lint pass; coverage 100% on `functions/src/rules/`, 90% elsewhere
   (`jest.config.js`; never lower it).
3. A manual check: a `demo:*` script before the app shell exists, a page in the app after.
4. Update `ARCHITECTURE.md` (module level only) and the diagram when boundaries or data flow change.
5. Move the milestone file to `plans/archive/`, tick `plans/ROADMAP.md`, add new lessons below,
   commit on `dev`, push, stop.

## Lessons (check before acting)

- Time: Pacific `America/Los_Angeles`, DST-aware; never a fixed offset. Run time tests with
  `TZ=Asia/Tokyo` too.
- Check real API data before trusting docs: BallDontLie sends positions `F-G`/`C-F` (normalize) and
  `SG`; games nested in `/stats` have no `datetime` (use `/games`); `/box_scores/live` keeps the last
  night's finished games (decide from game states); season averages are
  `/season_averages/general?season=<start year>&season_type=regular&type=base`.
- Appwrite: upserts reject rows missing a _required_ column (optional ones left out are kept);
  data is validated before permissions (400 before 401); Function variable ids are per project and
  new variables are secret; use `executions.*` scopes. In the cloud session the proxy adds the
  server key to every Appwrite request, so a "user" client is really the server.
- Next.js inlines only literal `process.env.NEXT_PUBLIC_*` reads; route files export only handlers
  and config. A fresh clone must work with no setup.
- Tests: `jest <path>` (not `--selectProjects app <path>`); jsdom has no `dialog.showModal`, can't
  measure SVG text (check a browser screenshot) and strips spaces from email inputs; Playwright
  matches names by substring (`exact: true`); data hooks must not show rows loaded for old inputs.
