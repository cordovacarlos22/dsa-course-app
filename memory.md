# Project memory

Agents: read this at the start of every session and update it at the end (see `AGENTS.md`).

## Current stage

**Stage 1: Scaffold** (branch `chore/scaffold`)

## Decisions

- 2026-10-11: **React + Vite, not Next.js.** The app is interactive and behind a login, with no need for SEO or server rendering. Supabase is the backend. Vite is simpler for juniors.
- 2026-10-11: **Plain JavaScript, no TypeScript.** Carlos's preference: he's learning DSA in JS.
- 2026-10-11: **Tailwind CSS v4** for styling, **Supabase** for database + auth, **Vercel** for hosting.
- 2026-10-11: **GitHub Actions runs CI and deploys.** Vercel's automatic Git deploys are off.
- 2026-10-11: **Blue/green deploys:** deploy green with `--skip-domain`, smoke test it, then `vercel promote`. Rollback = `vercel rollback`. Migrations must be backward compatible (expand, then contract).
- 2026-10-11: **Two Supabase projects:** `staging` (PR previews) and `production` (`main`).
- 2026-10-11: **Multi-user from the start.** Supabase Auth with email magic link. Roles: `student` and `admin`. RLS: students see only their own attempts.
- 2026-10-11: **Content pipeline v1:** Carlos puts .docx files in `content/notes/<section>/` → Claude Code generates `content/sections/<section>.json` → validate + seed scripts. v2 (later): upload page + Claude API in a Supabase Edge Function.
- 2026-10-11: **Bilingual (en/es):** content stored as `{ en, es }` jsonb. UI uses react-i18next.
- 2026-10-11: **Exercises in JavaScript** run in a Web Worker. The runner design allows adding Python (Pyodide) later.
- 2026-10-11: **Timer is a user setting:** `countdown` (Easy 15 / Medium 25 / Hard 40 min), `stopwatch`, or `off`. The time taken is always saved.

## Stages

1. Scaffold: Vite React JS, Tailwind, ESLint/Prettier, Vitest, agent files
2. CI: `ci.yml`, GitHub repo, branch protection, Vercel project
3. Supabase schema + RLS, auth, profile page
   3b. Deploy pipeline: Playwright smoke test, `preview.yml`, `deploy.yml` (blue/green), `rollback.yml`
4. Content pipeline: schema, validate + seed scripts, sample section
5. Course and sections UI with progress bars
6. Quiz flow
7. Exercises: editor, JS runner, timer
8. i18n (ES/EN)
9. Admin progress dashboard
10. Later: Claude API upload pipeline, Python runner

## Done

- Stage 1 (in progress): Vite React (JS) scaffold, Tailwind v4, Vitest + Testing Library, Prettier + ESLint, `.env.example`, AGENTS.md / CLAUDE.md / memory.md, README.

## Next

- Finish Stage 1 and commit.
- Stage 2: Carlos installs `gh` (`brew install gh` then `gh auth login`) and creates the GitHub repo. Then add `ci.yml`.

## Course sections imported

_None yet._

## Open questions

- `.docx` notes are git-ignored by default (they may contain copyrighted transcripts). Change `.gitignore` if Carlos wants them committed (private repo only).
