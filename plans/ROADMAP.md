# Roadmap

One milestone per Claude Code session. Only the file in `plans/active/` is worked on.
When a milestone is done, its file moves to `plans/archive/` and it is ticked here.
The Definition of Done is in `AGENTS.md`. Every milestone ends with something you can run
to check it yourself (a `demo:*` script before M4, the app in the browser from M4 on).

There is no separate server: `functions/` (Appwrite Functions) is the whole backend and
`app/` is the front end only.

- [ ] **M0** Foundation: repo hygiene, workspaces, Jest, lint, docs, diagram, Claude settings
- [ ] **M1** Game rules in `functions/src/rules/`: scoring, positions, lineup rules, calendar/lock, sub swap, leaderboards and tiebreak
- [ ] **M2** BallDontLie adapter (rate limit, retry, cache), fixtures in `data/`, mapping to rule types, replay tests of past weeks
- [ ] **M3** Appwrite Cloud: one project (`fbx-dev`, databases `fbx_dev` / `fbx_prod`), schema-as-code and setup script, collection permissions (users read-only on game data), repository adapters, integration tests
- [ ] **M4** Front-end shell in `app/`: Next.js, orange/blue light/dark theme, responsive menu, auth/SSO, SEO base, shared Appwrite Realtime helper
- [ ] **M4b** UI foundation: reference orange/blue palette (FantasyBasketball_UI), mobile-first responsive layout (CSS Grid/Flexbox), reusable UI components and a modern sign-in page (3 styles to pick from), magic-link sign-in to the app's domain (code as fallback)
- [ ] **M5** Appwrite Functions: submitLineup, subSwap (callable); Monday lock and Thursday sub cutoff (update the `weeks` table the app watches), live stat polling (`/box_scores/live` ~1/s; see API budget in `ARCHITECTURE.md`), scoring, leaderboards (scheduled); Dev Functions (`-dev` suffix, `APPWRITE_ENV=dev`, database `fbx_dev`) and `SIMULATED_NOW` on Dev only; a Dev-only "test clock" so the weekly lock and sub cutoff can be tried from the app (user, 2026-11-22)
- [ ] **M6** SVG team logos (city abbreviation and colors; round badge, user 2026-11-23) and jersey avatars (name and number) in `app/`; no gallery page (user)
- [ ] **M7** Home view: lineup builder (hidden/disabled live when the week locks) and player stats (live lineup FPTS)
- [ ] **M8** Leaderboard (weekly/monthly/season), Stats and Standings views (live updates)
- [ ] **M9** Games view: court scoreboard, play-by-play, box score, chat (all live)
- [ ] **M10** News view (live news feed)
- [ ] **M11** Leagues: create, join, separate leaderboard (live league updates)
- [ ] **M12** Stripe subscriptions and entitlements (webhook as a Function; needs Pro and All-Star prices)
- [ ] **M13** Ads (research first)
- [ ] **M13b** Clean-up before production (user, 2026-11-23): user names (accounts only have an
      email, so Appwrite shows no name: ask for a display name at first sign-in, save it as the Appwrite
      user name and in `profiles`, show it instead of the email); shorter magic-link expiry (Appwrite's
      default is 1 hour: check what can be shortened, otherwise reject old links in the app); redo the
      Dev test clock page (`/test-clock`): still too complicated, make it much simpler
- [ ] **M14** Hardening: security review, performance, SEO and agent optimization, Prod database `fbx_prod` in the same `fbx-dev` project (no new project), deploy; host on **fantasybasketball.xyz** (register it as an Appwrite Web platform so magic links point there)

Every screen milestone (M6–M11) uses the M4b components and tokens and must pass the responsive
checks (no sideways scroll from 320 px up).

Realtime is not a separate milestone. M4 builds the shared helper, and each of M7–M11 adds its
own real-time updates across sessions.

## Decisions carried over

- Appwrite: one project only (`fbx-dev`); Dev and Prod are databases `fbx_dev` / `fbx_prod` in it.
- Live stats: no cron; a self-scheduling Function starts at each game day's first tip-off, polls
  ~1/s in runs of up to 13 min, then schedules the next tip-off. Functions deploy from git.
- Sign-in: Appwrite's built-in magic link and email code; no external email provider.

## Open decisions

- Prices for the Pro (season) and All-Star (yearly) tiers.
- Ad network and placement policy.
