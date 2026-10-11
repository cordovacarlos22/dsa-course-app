# AGENTS.md

Instructions for any AI agent (Claude Code, Codex, Cursor, etc.) working in this repo.

## Memory (read this first)

This project has a memory file: **[`memory.md`](./memory.md)**.

1. **At the start of every session**, read `memory.md` to learn the decisions made so far, the current stage, and what comes next.
2. **At the end of every session** (or after finishing a stage), update `memory.md`:
   - add new decisions to **Decisions** (with the date and the reason),
   - update **Current stage**, **Done** and **Next**,
   - add every course section you imported to **Course sections imported**.
3. Keep entries short. Never delete past decisions: if one changes, add a new entry that says what replaced it.

## Role

Act as a senior full-stack developer who writes **simple, clear code that a junior developer can understand**. The owner (Carlos) is learning DSA in JavaScript and will later share this app with his own students.

## What the app does

A companion app for the Udemy course _DSA + LeetCode for Coding Interviews_:

1. **Quizzes:** multiple-choice questions for each course section.
2. **Timed exercises:** LeetCode-style problems for each section that needs them. Students write JavaScript in the browser and hidden tests check it.
3. **Progress tracking:** each student sees their own progress; the admin sees everyone's.
4. **Two languages:** English and Spanish (UI and content).

## Stack

| Part     | Tool                                                       |
| -------- | ---------------------------------------------------------- |
| Frontend | React + Vite, **plain JavaScript (JSX), never TypeScript** |
| Styling  | Tailwind CSS v4                                            |
| Backend  | Supabase (Postgres, Auth, Row Level Security)              |
| Tests    | Vitest + React Testing Library, Playwright (smoke test)    |
| CI/CD    | GitHub Actions                                             |
| Hosting  | Vercel (blue/green deploys driven by GitHub Actions)       |

## Folder map

```
AGENTS.md            # this file
CLAUDE.md            # points Claude Code to this file
memory.md            # project memory (see above)
content/course.json  # course outline: all modules, in order
content/sections/    # generated quiz + exercise JSON, one file per section
scripts/             # Node scripts (content validation, seeding)
supabase/migrations/ # SQL schema and RLS policies
src/
  components/        # reusable UI pieces
  pages/             # one file per route/page
  hooks/             # custom React hooks
  lib/               # clients and helpers (e.g. supabase.js)
  runners/           # code runners, one per programming language
  locales/           # UI text: en.json, es.json
  test/              # test setup
.github/workflows/   # CI/CD pipelines
```

## Commands

```bash
npm run dev           # start the app at http://localhost:5173
npm test              # run unit tests once
npm run test:watch    # run tests on every save
npm run lint          # ESLint
npm run format        # format all files with Prettier
npm run format:check  # check formatting (CI runs this)
npm run build         # production build into dist/
```

Before every commit, run: `npm run lint && npm run format:check && npm test && npm run build`

## Coding rules

- **JavaScript only.** Use `.js` / `.jsx` files. No TypeScript.
- Small functions and components that do one thing each.
- Clear names: `calculateScore`, not `calc`; `isTimerRunning`, not `flag`.
- Comments explain **why**, not what. Skip comments the code already makes obvious.
- Prefer simple code to clever code. No new library unless it saves real work. Say why when you add one.
- Every new feature comes with tests. Test what the user sees (React Testing Library), not implementation details.
- UI text goes in `src/locales/*.json`, never hard-coded (once i18n is set up, stage 8).
- Secrets live in `.env.local` (git-ignored). Only `VITE_` variables reach the browser, so never put a service-role key in one.

## Git workflow (like a big-tech team)

1. Never commit to `main` directly. Create a branch: `feat/quiz-page`, `fix/timer-reset`, `chore/ci`.
2. Make **small commits** using [Conventional Commits](https://www.conventionalcommits.org): `feat: add quiz score screen`, `fix: stop timer on submit`, `test: cover runner timeout`.
3. Open a Pull Request. CI must pass (lint, format, tests, build, preview smoke test).
4. Merge to `main`. The deploy pipeline releases the change with blue/green.
5. One stage of the plan = one branch = one PR.

## Deployment (blue/green)

- `main` is deployed by GitHub Actions, not by Vercel's Git integration.
- The pipeline deploys a new "green" copy without switching the domain, smoke-tests it, then promotes it. The old "blue" copy stays available for instant rollback.
- **Database rule: expand, then contract.** Blue and green share the same database, so a migration must never break the version that's currently live. Add new tables/columns first. Remove or rename old ones only in a later release, once no live version uses them.

## Content generation procedure

When Carlos says _"generate content for section N"_:

1. **Find the sources.** They live **outside the repo**, in Carlos's course folder:

   ```
   ~/Desktop/curso por mi /Curso-de-Estructuras-de-Datos-y-Algoritmos-en-JavaScript-con-Ejercicios-de-LEETCODE/
   ├── recursos originales/modulo-NN-<slug>/   ← THE source (English version)
   │   ├── guiones/*.md                        ← English lesson transcripts + slide outlines
   │   └── *.pdf, *.js, images                 ← English resources
   └── recursos /guiones/modulo-NN-<slug>/     ← Spanish transcripts (.docx), only to translate from
   ```

   - Folder names contain **trailing spaces** (`curso por mi /`, `recursos /`), so always quote paths.
   - Skip binary and junk files: `.key`, `.m4v`, `.mov`, `.mp3`, `.DS_Store`, `.textClipping`, `~$*.docx`.
   - No other folders are sources (not the Udemy notes folder, not old exercise repos).

2. **If the module has no English transcripts yet**, translate them first:
   - Read each Spanish script with `textutil -convert txt -stdout "<path>.docx"`.
   - Write one file per lesson to `recursos originales/modulo-NN-<slug>/guiones/NN-<lesson>.md`, numbered in course order.
   - Format: `# <Lesson title>`, then `> Translated from recursos /guiones/<file>.docx`, then `## Transcript` (a faithful translation; keep code names as in the English `.js` resources) and `## Slides`. Drop the chatbot footer line ("Estas diapositivas proporcionan…").
   - Never write into `recursos /` and never touch the course folder's git state.

3. **Read everything** in `recursos originales/modulo-NN-<slug>/`: the `guiones/*.md`, the `.pdf`s and the `.js` files.

4. **Write `content/sections/<NN-slug>.json`.** The slug is the module folder name (`02-big-o`, `03-clases-punteros`); `content/course.json` lists them all.
   - **English first.** `en` is required; `es` can be added later (the validator warns about missing Spanish).
   - **10–16 multiple-choice questions** covering every lesson: 4 options each, exactly one correct, a short explanation. Test understanding (why, when, Big O), not just memorization. Use the `code` field for "what does this code do / what's its Big O?" questions. Spread the correct answer across positions 0–3.
   - **0–3 exercises**, only if the module teaches something you can practice in code:
     - `kind: "function"` (default): `functionName` + tests `{ args, expected }`.
     - `kind: "class"`: `className` + tests made of steps: `{ create: [args] }`, `{ call: "method", args: [], expected }`, `{ read: "prop.path", expected }`.
     - Each has a difficulty (`easy` / `medium` / `hard`), a description, JS starter code, a reference solution, **at least 5 tests** (include edge cases), and the expected time/space complexity.
   - **Original wording only.** Use the transcripts to learn _what_ to test, but never copy questions, transcripts or slides word for word.

5. Run `npm run content:validate` and fix every error. It checks the schemas (`scripts/content-schema.js`), that the slug exists in `course.json`, unique ids, and runs every reference solution against its tests.

6. Add the section to **Course sections imported** in `memory.md`.

## Privacy

- Never commit Carlos's transcripts or course resources. Only the generated `content/course.json` and `content/sections/*.json` go in git.
- Never write the Udemy course URL into this repo. The repo may become public.
