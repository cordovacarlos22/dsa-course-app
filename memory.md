# Project memory

Agents: read this at the start of every session and update it at the end (see `AGENTS.md`).

## Current stage

- **Stage 1: Scaffold is done** (branch `chore/scaffold`, waiting for a GitHub repo to open the PR).
- **Stage 4 (offline part) is done** (`feat/content-pipeline`), plus **course content** (`feat/course-content`, built on top of it).
- Next up: Stage 2 (CI). It needs a GitHub repo.

## Decisions

- 2026-10-11: **PIVOT: from "companion tool" to Carlos's own course app with an AI tutor.** Students learn inside the app: original written lessons + step-by-step animations + runnable code, quizzes, timed exercises, and an AI tutor (lesson chat, hints, code review, mock interview) through a Supabase Edge Function calling Claude. Free with login while building; daily AI quota per student; payments later. Lessons are **original, in Carlos's words**; the translated transcripts are only an example of topic order and depth. This replaces "companion for the Udemy course" in every decision below.
- 2026-10-11: **Content is static in the repo** (`content/course.json`, `content/lessons/`, `content/sections/`), bundled with `import.meta.glob`. No content tables and no seed step. Supabase stores only users, progress and tutor messages.

- 2026-10-11: **React + Vite, not Next.js.** The app is interactive and behind a login, with no need for SEO or server rendering. Supabase is the backend. Vite is simpler for juniors.
- 2026-10-11: **Plain JavaScript, no TypeScript.** Carlos's preference: he's learning DSA in JS.
- 2026-10-11: **Tailwind CSS v4** for styling, **Supabase** for database + auth, **Vercel** for hosting.
- 2026-10-11: **GitHub Actions runs CI and deploys.** Vercel's automatic Git deploys are off.
- 2026-10-11: **Blue/green deploys:** deploy green with `--skip-domain`, smoke test it, then `vercel promote`. Rollback = `vercel rollback`. Migrations must be backward compatible (expand, then contract).
- 2026-10-11: **Two Supabase projects:** `staging` (PR previews) and `production` (`main`).
- 2026-10-11: **Multi-user from the start.** Supabase Auth with email magic link. Roles: `student` and `admin`. RLS: students see only their own attempts.
- 2026-10-11 (replaced by the pivot): **Content pipeline v1:** Carlos puts .docx files in `content/notes/<section>/` → Claude Code generates `content/sections/<section>.json` → validate + seed scripts. v2 (later): upload page + Claude API in a Supabase Edge Function.
- 2026-10-11: **Bilingual (en/es):** content stored as `{ en, es }` jsonb. UI uses react-i18next.
- 2026-10-11: **Exercises in JavaScript** run in a Web Worker. The runner design allows adding Python (Pyodide) later.
- 2026-10-11: **Notes stay on Carlos's Desktop** (course folder, outside the repo), not in `content/notes/`. Agents read the .docx text, the images embedded in it, and the PDF/JS resources. Questions use **original wording only** (no copying Udemy quizzes). This replaces the `content/notes/` part of the content pipeline v1 decision.
- 2026-10-11: **`content:validate` runs reference solutions in `node:vm` with a 1 s timeout per test**, so a buggy solution with an infinite loop fails instead of hanging CI.
- 2026-10-11: **Course source changed (replaces the "Notes stay on Carlos's Desktop" decision above).** The only source is Carlos's course folder `~/Desktop/curso por mi /Curso-de-…-LEETCODE/recursos originales/modulo-NN-<slug>/` (English version: `guiones/*.md` transcripts + PDF/JS resources). Spanish scripts in `recursos /guiones/` are translated to English into `recursos originales/…/guiones/` first. The Udemy notes folder is no longer used.
- 2026-10-11: **English first, Spanish later.** Content JSON requires `en`; `es` is optional until the translation pass. `content:validate` warns about missing Spanish.
- 2026-10-11: **Course outline = the 17 module folders** (`modulo-01-introduccion` … `modulo-17-programacion-dimanica`), stored in `content/course.json`. Carlos mentioned 20 modules; ask which 3 are missing.
- 2026-10-11: **Language picker on first visit** (ES/EN, remembered; changeable in the profile). Built in stage 8.
- 2026-10-11: **Timer is a user setting:** `countdown` (Easy 15 / Medium 25 / Hard 40 min), `stopwatch`, or `off`. The time taken is always saved.

## Stages (after the pivot)

1. ✅ Scaffold
2. CI + GitHub: `ci.yml`, push the branches, PRs in order, branch protection
3. Pivot docs: AGENTS.md, memory.md, README, app title ← current
4. App shell + i18n: router, layout, react-i18next, first-visit language picker, landing, course home
5. Lesson system: lesson schema + validation, Markdown renderer, StepPlayer, first 3 animations, runnable snippets (Web Worker)
6. Original lessons for modules 01–03 (EN), reviewed by Carlos
7. Quiz + exercise pages (CodeMirror, runner, timer)
8. Supabase: schema + RLS, magic-link auth, profile, progress
9. Deploy pipeline: preview / deploy (blue/green) / rollback, Playwright smoke test
10. AI tutor v1: `tutor` Edge Function (streaming, quota), lesson chat, hints
11. AI tutor v2: code review, mock interview
12. Admin dashboard, Spanish pass, modules 04+, payments later

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

- Stage 4 (app shell + i18n) can start now; no accounts needed.
- Stage 2 needs Carlos: `brew install gh`, `gh auth login`, and a public/private decision. Then push `main`, `chore/scaffold`, `feat/content-pipeline`, `feat/course-content`, `docs/pivot-course-app` and open PRs in order.
- Carlos reviews the Section 1 and Section 3 questions.
- Spanish pass later (`content:validate` shows the count).

## Course sections imported

| Section               | File                                       | Questions | Exercises                                                          | Spanish | Date       |
| --------------------- | ------------------------------------------ | --------- | ------------------------------------------------------------------ | ------- | ---------- |
| 1: Introduction       | `content/sections/01-introduccion.json`    | 9         | none                                                               | missing | 2026-10-11 |
| 2: Big O              | `content/sections/02-big-o.json`           | 19        | find-max (easy), contains-duplicate (easy), binary-search (medium) | done    | 2026-10-11 |
| 3: Classes & Pointers | `content/sections/03-clases-punteros.json` | 12        | cookie-class (easy, class)                                         | missing | 2026-10-11 |

Modules 04–17 have empty folders; they appear in `course.json` as "coming soon".

## Open questions

- App name and domain (placeholder title: "DSA in JavaScript").
- Daily AI limit per student (default 40 messages).
- Carlos mentioned 20 modules, but 17 folders exist. Which 3 are missing?
- The Spanish `O(n^2)` script says O(n²) is "generally efficient"; the English translation says **inefficient** (matches the wrap-up). Carlos should fix the Spanish script.
- The Intro slide 3 still says "Scott Barrett" (original instructor) instead of charliecodeacademy.
