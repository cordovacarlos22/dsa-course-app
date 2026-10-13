# Project memory

Agents: read this at the start of every session and update it at the end (see `AGENTS.md`).

## Current stage

- Stages 1–5 are done. **Stage 6 (lessons)** is in progress: Introduction (3 lessons) and Big O (17 lessons) are merged, EN + ES, with checkpoints.
- 2026-10-12: game-style **celebrations** merged (PR #19).
- 2026-10-12: **agent skills** (security + design) and `DESIGN.md` / `PRODUCT.md` on `chore/agent-skills`.

## Decisions

- 2026-10-11 (replaced the same day, see below): **Lessons are visual-first** (an animation opens every step, 1–3 sentences after it), **one story per module** (Big O: guest list), and **beginner loops** (`for (let i = 0; …; i++)`, no `for...of`/`forEach`). Reason: Carlos's students prefer visuals and many only know basic JavaScript.
- 2026-10-11: **Show, then explain.** Carlos: keeping the reading low didn't mean erasing it. Every step keeps its animation, but lessons teach at the depth of the course notes and transcripts (300–500 words, every point covered, in our own words). **Coding steps use Learn | Editor over Output** (two columns, the editor above the output), because three columns were too tight.
- 2026-10-12: **Celebrations, like a game** (Carlos: "like Duolingo, where they celebrate each of your achievements"). The first time a step's check passes: a small confetti burst and a cheer ("Great job!", or "🔥 3 in a row on the first try!"). The lesson's last step: two confetti cannons and a "Lesson complete" card with stats (checks, first tries, "Perfect lesson"). The module's last lesson: star fireworks and a 🏆, plus a badge on the module page. Revisits stay quiet. **Sounds** are made with Web Audio (no audio files), with a 🔊 mute button in the header (saved as `sounds` in localStorage). Devices that ask for less motion get no confetti or pop animations. One entry point, `celebrate(level)` in `src/lib/celebrate.js` (reuse it for quizzes); `canvas-confetti` is loaded on demand. **XP points, daily streaks and badges come in stage 8**, with Supabase (Carlos's choice), so they follow students across devices.
- 2026-10-12: **Agent skills, reviewed and pinned** (Carlos: repos that give agents "superpowers… also security"). He named five; all were read before adding: Cloudflare `security-audit`, `impeccable` (pbakaus), taste-skill (`design-taste-frontend`), Vercel's web interface guidelines, and awesome-design-md (VoltAgent). The four skills live in `.claude/skills/`, pinned to the reviewed commit (table and update steps in `.claude/skills/README.md`). awesome-design-md only collects other brands' `DESIGN.md` files, so we wrote our own **`DESIGN.md`** (the current look) plus **`PRODUCT.md`** (audience and promise); design skills treat them as the brief. **Left out on purpose:** the Impeccable engine (its launcher downloads a compiled program and it sends usage pings by default) and Vercel's live rule download (we read a pinned copy). **Rules:** project rules win over skills; skills propose and Carlos decides; never auto-install or update skills; full security audits only when Carlos asks, with output kept outside the repo. They were skills, not MCP servers, so no `.mcp.json` was needed.
- 2026-10-11 (later): **Big O follows both courses closely.** Carlos: "still not enough … missing a lot of the content from the 2 files … even if we are going to be super close to the original 2 courses". One lesson per lecture (17), the courses' own examples plus the guest-list animations, every point of both files (text, slides and quizzes) covered; sentences stay ours. **Sources for Big O are his two `.docx` files** in the "DSA + LEETCODE…" Desktop folder, not `guiones/`; he'll add files for the other modules later.

- 2026-10-11: **Codecademy-style learning (Carlos).** Students must prove they understood before moving on: lessons are split into **steps** (each `##` heading), every step ends with a **checkpoint** (quick question or small code task checked by tests), and **Next stays locked until it passes**. Stuck → hint, then the solution after 3 failed tries (recorded as "viewed solution"). Coding steps use a **3-pane workspace** (Learn | Editor | Output). Being built in `feat/step-checkpoints`.
- 2026-10-11: **Naming: Section → Module → Lesson → Step** (ES: Sección → Módulo → Lección → Paso). `course.json` `parts` became `sections`; the per-module quiz/exercise files moved from `content/sections/` to **`content/practice/`** (`practiceSchema`, `module.practice`).

- 2026-10-11: **Two courses combined into one (replaces the 18-module outline).** Carlos is taking two DSA courses and combines their structure into his own: **24 modules in 7 parts, algorithms first** (Foundations → Problem Solving → Searching & Sorting → Data Structures → Graph Algorithms → Dynamic Programming → Interview Practice). Blueprint v2 is in `docs/curriculum.md` (~155 exercises: 70 build it, 86 interview problems). New topics from course 2: 5-step problem-solving approach, patterns, deeper recursion, searching, radix sort, graph traversal, Dijkstra.
- 2026-10-11: **Slugs are English names without numbers** (`introduction`, `big-o`, `linked-lists`…). Existing content was renamed (old URLs like `/learn/02-big-o` now 404; no students yet).
- 2026-10-11: **Our own slides.** Carlos asked to modify the course 2 instructor's slide PDFs; that would reuse copyrighted material, so we make original slide decks per module instead (later stage). The PDFs are a topic reference only.
- 2026-10-11: **Big O lesson 1 uses an original example** (guest list: array search O(n) vs. Set lookup O(1)), replacing "loop vs. formula", which matched a course 2 slide.
- 2026-10-11: Ignore macOS/iCloud duplicate files (`name 2.ext`) in git, ESLint and Prettier: one (`src/pages/LandingPage.test 2.jsx`) appeared and hangs any tool that reads it. Carlos should delete it.

- 2026-10-11: **Course blueprint: `docs/curriculum.md` (18 modules, 6 parts).** Built from the original course's table of contents (structure only; its exercises and material are examples, never copied). Module 18 "Array Interview Problems" was added in a 6th part, "Interview Practice"; Sets live inside Hash Tables. About 110 exercises are planned (57 build it, 52 interview problems).
- 2026-10-11: **Exercise categories:** every exercise has `category: "build"` (implement the structure step by step) or `"interview"` (LeetCode-style). The module page shows both counts.

- 2026-10-11: **Landing page and course story.** Built from Carlos's course description (structure only, original wording) and his resume. Public bio facts: software engineer, B.S. Computer Engineering (UTEL 2026), AWS Certified Cloud Practitioner, DEV.F bootcamp, learned and studied while working full-time as a truck driver and driver trainer, bilingual. **Never publish his phone, email or city** (a landing test checks there's no email or phone number). Photo: `public/images/carlos-cordova.jpg` (cropped from his course image). Price: "Free during the beta".
- 2026-10-11: **No borrowed testimonials.** The reviews in the original course description belong to another instructor's students and are not used. Add real reviews from Carlos's own students later.
- 2026-10-11: **Course parts:** `content/course.json` has `parts` (Foundations, Data Structures, Recursion & Trees, Sorting, Dynamic Programming); every module must be in exactly one part (`content:validate` checks it). The landing curriculum and the course home both use them.

- 2026-10-11: **Lessons are written in English and Spanish together** from Module 1 on (Carlos's choice). Spanish is natural, not word for word, using his terms (bucle, array, nodo, puntero…). Code names stay in English; comments and printed strings are translated. Messages from the app itself (like the runner's timeout) come from `src/locales`, never hard-coded.

- 2026-10-11: **Vercel is connected** (Carlos linked the repo; Vercel team `carloscordovadevs`). Production: https://dsa-course-app.vercel.app. Vercel's Git integration currently deploys every PR (preview, behind Vercel's login wall) and `main` (production). `vercel.json` rewrites every route to `index.html` so deep links work. Stage 9 switches to the blue/green flow (turn off Git auto-deploys, deploy from GitHub Actions).

- 2026-10-11: **Lesson system.** Lessons are `content/lessons/<module-slug>/<NN-slug>.<en|es>.md` with front matter (`title`, `order`, `minutes`). Two special blocks: ` ```viz ` (the block contains an animation name; names in `src/visualizations/names.js`, components in `index.js`) and ` ```js-run ` (editable code run in a Web Worker with a 2 s limit; `src/runners/`). Rendered with react-markdown + remark-gfm + @tailwindcss/typography. The lesson page is lazy-loaded to keep the first load small. Spanish lessons fall back to English.

- 2026-10-11: **Repo is public** (Carlos's choice). Branch protection on `main`: PR required, the `Lint, test, validate, build` check must pass, admins included, no force pushes, 0 approvals (a solo dev can't approve their own PR).
- 2026-10-11: **App shell:** React Router v7 (`<BrowserRouter>` in `main.jsx`, routes in `App.jsx`), i18next + react-i18next (`src/i18n.js`, text in `src/locales/*.json`), language saved in localStorage (`src/lib/languageStorage.js`, try/catch so blocked storage never crashes), brand colors as Tailwind tokens in `src/index.css` (`brand`, `accent`, `ink`, `surface`). Course content is read from `content/` through `src/lib/course.js` (`import.meta.glob`, English fallback via `localize`).

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
2. ✅ CI + GitHub: repo `cordovacarlos22/dsa-course-app` (public since 2026-10-11), `ci.yml`, stacked PRs #1–#4 merged on 2026-10-11; CI runs on every PR and push to `main`
3. ✅ Pivot docs: AGENTS.md, memory.md, README, app title (branch `docs/pivot-course-app`)
4. ✅ App shell + i18n: router, layout, react-i18next, first-visit language picker, landing, course home (branch `feat/app-shell`)
5. ✅ Lesson system: lesson files + validation, Markdown renderer, StepPlayer, 3 animations, runnable snippets (Web Worker), first lesson (branch `feat/lesson-system`)
6. Original lessons for modules 01–03 (EN), reviewed by Carlos ← next
7. Quiz + exercise pages (CodeMirror, runner, timer)
8. Supabase: schema + RLS, magic-link auth, profile, progress, then XP points, daily streaks and badges (Carlos, 2026-10-12)
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

- 2026-10-11, `feat/step-checkpoints` (Codecademy-style learning, Carlos's request):
  - Lessons are played **step by step** (`## ` = a step, `?step=N` in the URL). Each step has a checkpoint in `<lesson>.checks.json`; **Next stays locked** until it passes. Lessons without a checks file can be clicked through (until PR 3 converts them).
  - Coding steps: **3 panes** Learn | Editor (CodeMirror, lazy-loaded) | Output (✓/✗ per test + console); tabs below 1024 px. Run / Check / Reset; hint after the first failed check, **Show solution after 3** (saved as `viewedSolution`).
  - Shared grading in `src/runners/testHarness.js` (browser worker + validator). Test messages are English (code-like) in both languages.
  - Progress in localStorage (`progress:<module>/<lesson>`), shown on the module page (✓ Completed / In progress). Moves to Supabase in stage 8.
  - Pilot: Big O lesson 1 has 4 steps (2 code + 2 choice), EN + ES.

- 2026-10-11, `feat/lesson-checkpoints-content` (PR 3): every lesson (Introduction 1–3, Big O 1–12) is now 2–4 steps with checkpoints, EN + ES: 49 checkpoints (choice + code). "Recap" folded into the last step ("In short:"), "Check yourself" removed. Intro 1 and 3 explain steps, checks and the Check workspace.

- 2026-10-11, Big O rebuilt visual-first (Carlos: "too much reading, no step-by-step animations, loops too advanced"):
  - PR A (`feat/big-o-animations`): code tracer (`CodeTrace` + generator traces in `src/visualizations/traces/`, tested against the real code) and 10 topic animations, all on the guest list. `/dev/animations` shows them all. `array-reindex` no longer uses course 1's values.
  - PR B (`content/big-o-visual`): 14 lessons (topics merged from Carlos's two courses' Big O notes, examples ours), 29 checkpoints, quiz rewritten with guest-list code (the copied `printNumbers`/`splice "hi"`/2³¹ examples are gone; array questions move to the arrays module). `content:validate` rejects `for...of` / `.forEach` in teaching code.

- 2026-10-11, PR #17 fixes (after Carlos's review): Big O lessons rewritten at transcript depth (38 steps, 38 checkpoints, EN + ES); animations sized by container queries; new traces `trace-count-guests` and `trace-give-gifts`; stopwatch "too fast to measure" step; coding workspace is Learn | Editor over Output with a sticky Back / Next bar. The PR's merge conflict came from merging #15 into the branch separately; merging `main` into the branch fixed it (never resolve such conflicts in GitHub's editor).

- 2026-10-11, PR #17 third round: 17 Big O lessons (9,060 English words, 51 steps and checkpoints, EN + ES), quiz 33 questions; new traces (`sumUpTo` loop vs formula, `printNumbers`, `printPairs`, `doubleArray`), `timing-chart` and `array-splice`; `content:validate` also rejects repeated options.

- 2026-10-12, `feat/celebrations` (PR #19): confetti and sounds for each win (step, lesson, module), cheers and first-try streaks, the "Lesson complete" card with stats, the module 🏆 badge, and the 🔊 mute button. Reduced motion respected.
- 2026-10-12, `chore/agent-skills`: the four reviewed skills, `DESIGN.md`, `PRODUCT.md`, and the "Agent skills" section in `AGENTS.md`. First runs: the security review (guidance mode) found no vulnerabilities, and the Vercel UI review found the items listed under Next.

## Next

- **UI review fixes** (Vercel guidelines run, 2026-10-12), waiting for Carlos's OK:
  1. `RunnableCode.jsx`: the code box has `outline-none` with no focus style, and long printed lines (e.g. `[1,2,3,…]`) get cut off by `overflow-hidden`.
  2. Every page has the same English `<title>`; no "Skip to content" link.
  3. `FirstVisitLanguagePicker`: the dialog doesn't take focus (a native `<dialog>` with `showModal()` would).
  4. `LessonPage`: changing steps leaves focus on the button (move it to the step heading); the sticky Back/Next bar can cover focused elements (`scroll-padding-bottom`).
  5. `DominantTerm.jsx`: `transition-all` on width, not behind `motion-safe:`. Smaller: header buttons about 28 px tall, the "Next is locked" note is hidden on phones, the workspace tabs lack arrow keys.
- **Security hardening before stage 8 (accounts):** security headers in `vercel.json` (a CSP that allows `worker-src 'self' blob:` for confetti and the code runner, `frame-ancestors 'none'`, `nosniff`, a referrer policy); `permissions: contents: read` in `ci.yml`; upgrade Vitest to ≥ 4.1.11 (dev-only advisories in tinypool and @vitest/mocker; production dependencies have none).
- **Design proposals** from the skills, for Carlos to decide: a real favicon (still Vite's), a self-hosted brand font, and no box nested inside the lesson-complete card.

- Big O module still needs: the interview problem "Count the Operations" and its slides (later stage).
- Next content (per `docs/curriculum.md`): **Big O of Arrays & Objects**, then **Classes & Pointers** lessons.
- Stage 7 (quiz + exercise pages) so students can take the quizzes and solve the exercises.
- Carlos: delete the iCloud duplicates `src/pages/LandingPage.test 2.jsx`, `src/components/SoundToggle.test 2.jsx` and `src/components/lesson/LessonComplete 2.jsx`.

## Course sections imported

| Section               | File                                         | Questions | Exercises                                                          | Spanish | Date       |
| --------------------- | -------------------------------------------- | --------- | ------------------------------------------------------------------ | ------- | ---------- |
| 1: Introduction       | `content/practice/introduction.json`         | 10        | none                                                               | done    | 2026-10-11 |
| 2: Big O              | `content/practice/big-o.json`                | 33        | find-max (easy), contains-duplicate (easy), binary-search (medium) | done    | 2026-10-11 |
| 3: Classes & Pointers | `content/practice/classes-and-pointers.json` | 12        | cookie-class (easy, class)                                         | missing | 2026-10-11 |

Modules 04–17 have empty folders; they appear in `course.json` as "coming soon".

### Lessons written

| Module          | Lessons                                                             | Languages | Date       |
| --------------- | ------------------------------------------------------------------- | --------- | ---------- |
| 01 Introduction | `01-welcome`, `02-how-to-get-the-most-out-of-it`, `03-running-code` | EN + ES   | 2026-10-11 |
| 02 Big O        | 17 lessons, one per lecture (`01-why-big-o` … `17-wrap-up`)         | EN + ES   | 2026-10-11 |

## Open questions

- 2026-10-11 (solved): Actions didn't start on the new repo until Carlos added a starter workflow (`blank.yml`) to `main`. That file then failed our Prettier check, so it was removed in `fix/ci-remove-starter-workflow`.
- (solved) Branch protection is on now that the repo is public.

- App name and domain (placeholder title: "DSA in JavaScript").
- Daily AI limit per student (default 40 messages).
- (solved) 18 modules (Carlos chose 17 + Array Interview Problems).
- The Spanish `O(n^2)` script says O(n²) is "generally efficient"; the English translation says **inefficient** (matches the wrap-up). Carlos should fix the Spanish script.
- The Intro slide 3 still says "Scott Barrett" (original instructor) instead of charliecodeacademy.
