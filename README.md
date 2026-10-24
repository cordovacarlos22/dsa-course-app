# DSA in JavaScript (course app)

A course app for learning data structures and algorithms in JavaScript: original written lessons with step-by-step animations and runnable code, quizzes, timed LeetCode-style exercises, and an **AI tutor** (lesson chat, hints, code review, mock interviews). English first, Spanish later.

## Getting started

```bash
npm install
cp .env.example .env.local   # then fill in your Supabase values
npm run dev                  # http://localhost:5173
```

## Run it with Docker

With [Docker Desktop](https://www.docker.com/products/docker-desktop/) (or Colima) running:

```bash
docker compose up dev       # dev server with live reload: http://localhost:5173
docker compose up preview   # the production build with vercel.json's headers: http://localhost:4174
docker compose down         # stop them (add -v to also delete their node_modules volumes)
```

- Both are only reachable from this computer.
- After a dependency change (`package.json`), rebuild with `docker compose up --build -V dev`. `-V` gives the container a fresh `node_modules`.
- In VS Code, **Dev Containers: Reopen in Container** opens the project inside the same `dev` service (`.devcontainer/devcontainer.json`).
- To run the end-to-end tests against the container: `E2E_BASE_URL=http://127.0.0.1:4174 npm run test:e2e`.
- If a new terminal says `docker: command not found`, add Docker's folder to your PATH in `~/.zprofile`: `export PATH="$HOME/.docker/bin:$PATH"`.

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
3. Review the generated lessons (`content/lessons/<module-slug>/`) and quiz/exercises (`content/practice/<module-slug>.json`), run `npm run content:validate`, then commit on a branch and open a PR.

## For AI agents

Read [`AGENTS.md`](./AGENTS.md) and [`memory.md`](./memory.md).
