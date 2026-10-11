# DSA Course Companion

Multiple-choice quizzes and timed LeetCode-style exercises for each section of the Udemy course _DSA + LeetCode for Coding Interviews_. Built so students can check that they really learned each topic. English and Spanish.

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

## Adding course notes

1. Save your `.docx` notes or transcript in `content/notes/<section-slug>/`, for example `content/notes/02-big-o/notes.docx`.
2. Ask Claude Code: _"generate content for section 02-big-o"_.
3. Review the generated `content/sections/02-big-o.json`, then commit it on a branch and open a PR.

## For AI agents

Read [`AGENTS.md`](./AGENTS.md) and [`memory.md`](./memory.md).
