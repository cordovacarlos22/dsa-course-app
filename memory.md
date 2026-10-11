# Project memory

Agents: read this at the start of every session and update it at the end (see `AGENTS.md`).

## Current stage

- **Stage 1: Scaffold is done** (branch `chore/scaffold`, waiting for a GitHub repo to open the PR).
- **Stage 4 (offline part) is done** (`feat/content-pipeline`), plus **course content** (`feat/course-content`, built on top of it).
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

- 2026-10-11, Stage 1 (committed on `chore/scaffold`; no remote yet, so no PR): Vite React (JS) scaffold, Tailwind v4, Vitest + Testing Library, Prettier + ESLint, `.env.example`, AGENTS.md / CLAUDE.md / memory.md, README. lint, format check, tests and build all pass.
- 2026-10-11, Stage 4 offline part (`feat/content-pipeline`): `scripts/content-schema.js` (Zod), `npm run content:validate` (runs reference solutions in `node:vm` with a 1 s timeout).
- 2026-10-11, course content (`feat/course-content`):
  - English transcripts for modules 01–03 written to the course folder (`recursos originales/modulo-0{1,2,3}-*/guiones/*.md`, 17 files, outside the repo).
  - Spanish is now optional in content (English first); `content:validate` warns about missing translations.
  - `content/course.json`: outline with all 17 modules; each section must match a module.
  - Class exercises (`kind: "class"`, step tests: create / call / read).
  - Sections 01, 02 (3 new questions) and 03. 22 unit tests.

## Next

- Push `main`, `chore/scaffold`, `feat/content-pipeline` and `feat/course-content` to GitHub and open the PRs in order (each branch is built on the previous one).
- Stage 2: Carlos installs `gh` (`brew install gh` then `gh auth login`) and creates the GitHub repo. Then add `ci.yml`.
- Spanish translation pass for sections 01 and 03 (and 02's new title fields) when Carlos is ready: `content:validate` shows the count.
- Carlos reviews the Section 3 and Section 1 questions.

## Course sections imported

| Section               | File                                       | Questions | Exercises                                                          | Spanish | Date       |
| --------------------- | ------------------------------------------ | --------- | ------------------------------------------------------------------ | ------- | ---------- |
| 1: Introduction       | `content/sections/01-introduccion.json`    | 9         | none                                                               | missing | 2026-10-11 |
| 2: Big O              | `content/sections/02-big-o.json`           | 19        | find-max (easy), contains-duplicate (easy), binary-search (medium) | done    | 2026-10-11 |
| 3: Classes & Pointers | `content/sections/03-clases-punteros.json` | 12        | cookie-class (easy, class)                                         | missing | 2026-10-11 |

Modules 04–17 have empty folders; they appear in `course.json` as "coming soon".

## Open questions

- Carlos mentioned 20 modules, but 17 folders exist. Which 3 are missing?
- The Spanish `O(n^2)` script says O(n²) is "generally efficient"; the English translation says **inefficient** (matches the wrap-up). Carlos should fix the Spanish script.
- The Intro slide 3 still says "Scott Barrett" (original instructor) instead of charliecodeacademy.
