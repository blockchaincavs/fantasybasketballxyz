# Architecture

TypeScript web app: users set a weekly 7-player NBA lineup scored from real stats, compete on
global and league leaderboards and follow live games. Full requirements: `doc/REQUIREMENTS.md`.

## Layout (npm workspaces)

| Path                      | Purpose                                                                           |
| ------------------------- | --------------------------------------------------------------------------------- |
| `app/`                    | Front end only: Next.js (App Router). No game rules, no secrets.                  |
| `functions/src/rules/`    | Pure game rules (scoring, positions, calendar/lock, sub swap, leaderboards).      |
| `functions/src/adapters/` | BallDontLie client and Appwrite access, behind interfaces (in-memory fakes).      |
| `functions/src/handlers/` | Function logic as `(deps, request)` handlers; `entries/` bundle one per Function. |
| `functions/scripts/`      | Manual `demo:*` and setup scripts. Not deployed.                                  |
| `*/tests/`, `app/e2e/`    | Jest tests mirroring `src/`; Playwright smoke tests with Appwrite mocked.         |
| `data/`                   | Recorded BallDontLie fixtures for offline tests.                                  |

No separate server: Appwrite Cloud provides database (TablesDB), auth, Realtime and Functions.

## Security model

- Users never write tables directly. Lineups and sub swaps go through callable Functions that
  re-check everything with the rules and the **server clock**; only Functions write rows (server key).
- Game data is `read("users")`; lineups and profiles are readable only by their owner (row security).
- Secrets (BallDontLie, Appwrite, Stripe keys) exist only in Function variables and local `.env`.
  The browser gets public Appwrite ids only.

## Data flow

- Functions fetch from BallDontLie (scheduled sync, live polling), score, and write Appwrite rows.
- The app reads Appwrite only (never BallDontLie), applies Realtime row events, and re-fetches when
  the tab becomes visible or the browser is back online (missed events are not replayed).
- Lock state is published by a scheduled Function in a `weeks` table; the browser never decides a lock.

## Design rules

- Ports and adapters; handlers are thin (load, apply rules, save). Time and RNG are arguments.
- Writes are upserts by deterministic id (jobs are idempotent); lists page with `cursorAfter`.
- Schema as code, applied by a setup script (creates, never deletes, reports drift).
- One Appwrite project `fbx-dev`: databases `fbx_dev` (Dev) and `fbx_prod` (Prod); Dev Functions
  have a `-dev` suffix. Functions deploy from git (`dev` → Dev, `main` → Prod).
- BallDontLie (GOAT, 600 req/min): live box scores ~1/s during games only; everything else is
  fetched infrequently and stored. Live polling follows the game schedule (self-scheduling Function).

## Game rules (source of truth for `functions/src/rules/`)

- Slots PG, SG, SF, PF, C, SIXTH, SUB; no salary cap. Eligibility by BallDontLie position:
  `G` → PG/SG, `G-F` → SG/SF, `F` → SF/PF, `F-C` → PF/C, `C` → C, `PG`/`SG` alone → that slot;
  anything else → SIXTH/SUB only. SIXTH and SUB accept anyone.
- FPTS = PTS + REB + AST + STL + BLK − 2·TO (weights in one config object).
- Lineups lock Mon 05:00 PT (start of the game week); only the next week is editable.
- One sub swap per week, before Thu 05:00 PT, final: the outgoing player's whole-week FPTS are
  replaced by the SUB's whole-week FPTS. The SUB scores 0 unless swapped in.
- Leaderboards: weekly, monthly (a week counts in the month it starts), season. Tiebreak: higher
  average placement in previous weeks, then an injected RNG.
