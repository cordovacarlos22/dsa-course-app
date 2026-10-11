# DSA in JavaScript (course app)

A course app for learning data structures and algorithms in JavaScript: original written lessons with step-by-step animations and runnable code, quizzes, timed LeetCode-style exercises, and an **AI tutor** (lesson chat, hints, code review, mock interviews). English first, Spanish later.

## Getting started

```bash
npm install
cp .env.example .env.local   # then fill in your Supabase values
npm run dev                  # http://localhost:5173
```

## Scripts

| Command                | What it does                      |
| ---------------------- | --------------------------------- |
| `npm run dev`          | Start the dev server              |
| `npm test`             | Run unit tests                    |
| `npm run test:watch`   | Run tests on every save           |
| `npm run lint`         | Check code with ESLint            |
| `npm run format`       | Format code with Prettier         |
| `npm run format:check` | Check formatting (used by CI)     |
| `npm run build`        | Build for production into `dist/` |

## Adding course content

The course material lives **outside this repo**, in the course folder on Carlos's Desktop:
`curso por mi /Curso-de-…-LEETCODE/recursos originales/modulo-NN-<slug>/` (English transcripts in `guiones/` plus PDFs and code).

1. Add the module's material to its `recursos originales/modulo-NN-<slug>/` folder. If you only have Spanish scripts in `recursos /guiones/`, Claude Code translates them first.
2. Ask Claude Code: _"write the lessons for the Big O module"_ (modules are listed in `docs/curriculum.md`).
3. Review the generated lessons (`content/lessons/<module-slug>/`) and quiz/exercises (`content/sections/<module-slug>.json`), run `npm run content:validate`, then commit on a branch and open a PR.

## For AI agents

Read [`AGENTS.md`](./AGENTS.md) and [`memory.md`](./memory.md).
