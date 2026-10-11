# Project memory

Agents: read this at the start of every session and update it at the end (see `AGENTS.md`).

## Current stage

- **Stage 1: Scaffold is done** (branch `chore/scaffold`, waiting for a GitHub repo to open the PR).
- **Stage 4 (offline part) is done** (branch `feat/content-pipeline`, built on top of `chore/scaffold`). It was brought forward because Carlos's notes were ready.
- Next up: Stage 2 (CI). It needs a GitHub repo.

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
- 2026-10-11: **Notes stay on Carlos's Desktop** (course folder, outside the repo), not in `content/notes/`. Agents read the .docx text, the images embedded in it, and the PDF/JS resources. Questions use **original wording only** (no copying Udemy quizzes). This replaces the `content/notes/` part of the content pipeline v1 decision.
- 2026-10-11: **`content:validate` runs reference solutions in `node:vm` with a 1 s timeout per test**, so a buggy solution with an infinite loop fails instead of hanging CI.
- 2026-10-11: **Course source changed (replaces the "Notes stay on Carlos's Desktop" decision above).** The only source is Carlos's course folder `~/Desktop/curso por mi /Curso-de-…-LEETCODE/recursos originales/modulo-NN-<slug>/` (English version: `guiones/*.md` transcripts + PDF/JS resources). Spanish scripts in `recursos /guiones/` are translated to English into `recursos originales/…/guiones/` first. The Udemy notes folder is no longer used.
- 2026-10-11: **English first, Spanish later.** Content JSON requires `en`; `es` is optional until the translation pass. `content:validate` warns about missing Spanish.
- 2026-10-11: **Course outline = the 17 module folders** (`modulo-01-introduccion` … `modulo-17-programacion-dimanica`), stored in `content/course.json`. Carlos mentioned 20 modules; ask which 3 are missing.
- 2026-10-11: **Language picker on first visit** (ES/EN, remembered; changeable in the profile). Built in stage 8.
- 2026-10-11: **Timer is a user setting:** `countdown` (Easy 15 / Medium 25 / Hard 40 min), `stopwatch`, or `off`. The time taken is always saved.

## Stages

1. Scaffold: Vite React JS, Tailwind, ESLint/Prettier, Vitest, agent files
2. CI: `ci.yml`, GitHub repo, branch protection, Vercel project
3. Supabase schema + RLS, auth, profile page
   3b. Deploy pipeline: Playwright smoke test, `preview.yml`, `deploy.yml` (blue/green), `rollback.yml`
4. Content pipeline: schema + validate + Section 2 ✅; seed into Supabase (after stage 3)
5. Course and sections UI with progress bars
6. Quiz flow
7. Exercises: editor, JS runner, timer
8. i18n (ES/EN)
9. Admin progress dashboard
10. Later: Claude API upload pipeline, Python runner

## Done

- 2026-10-11, Stage 1 (committed on `chore/scaffold`; no remote yet, so no PR): Vite React (JS) scaffold, Tailwind v4, Vitest + Testing Library, Prettier + ESLint, `.env.example`, AGENTS.md / CLAUDE.md / memory.md, README. `.docx` notes are git-ignored. lint, format check, tests and build all pass.

- 2026-10-11, Stage 4 offline part (branch `feat/content-pipeline`): `scripts/content-schema.js` (Zod), `npm run content:validate` (+ 8 tests), `content/sections/02-big-o.json`.

## Next

- Push `main` and `chore/scaffold` to GitHub and open the Stage 1 PR.
- Open a PR for `feat/content-pipeline` after Stage 1 is merged (rebase onto `main`).
- Stage 2: Carlos installs `gh` (`brew install gh` then `gh auth login`) and creates the GitHub repo. Then add `ci.yml`.

## Course sections imported

| Section                 | File                             | Questions | Exercises                                                          | Date       |
| ----------------------- | -------------------------------- | --------- | ------------------------------------------------------------------ | ---------- |
| 2: Big O (lessons 3–13) | `content/sections/02-big-o.json` | 16        | find-max (easy), contains-duplicate (easy), binary-search (medium) | 2026-10-11 |

Skipped: Section 1 (Introduction). It's a course overview with nothing to quiz yet.

## Open questions

- `.docx` notes are git-ignored by default (they may contain copyrighted transcripts). Change `.gitignore` if Carlos wants them committed (private repo only).
