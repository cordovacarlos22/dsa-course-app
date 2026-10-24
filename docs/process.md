# How we build and ship

Every change to this app goes through five stages, the way a big-tech team ships software: **plan → code → build → test → ship**. Nothing skips a stage, and every stage leaves a record (an issue, a commit, a check, a report, a deploy).

## Roles

| Role                | Who                                            | Does                                                                                                                           | Never does                                |
| ------------------- | ---------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------- |
| **Product owner**   | Carlos                                         | Decides what gets built and in what order, moves issues to **Ready**, approves every production release                        | —                                         |
| **Product manager** | PM agent (`.claude/agents/product-manager.md`) | Turns an idea into an issue: problem, user story, acceptance criteria, out of scope, risks; labels it and puts it on the board | Writes code, or marks its own issue Ready |
| **Developer**       | Developer agent (Claude Code)                  | Picks a **Ready** issue, writes the code, the tests and the docs, opens the PR                                                 | Merges its own PR, deploys to production  |
| **Reviewer**        | Reviewer agent (`.claude/agents/reviewer.md`)  | Reviews the PR for correctness, simplicity and security (with the `security-audit` skill when the PR touches risky areas)      | Pushes commits to the PR                  |
| **QA**              | QA agent (`.claude/agents/qa.md`)              | Tests the build in the QA environment (end-to-end, accessibility, layout, security headers), files bugs as issues              | Edits code or content                     |

Agents hand off through GitHub: the issue says what to build, the PR says what was built, review comments and QA reports say what's wrong. Nothing important lives only in a chat.

## The board

The GitHub Project **"DSA course app"** has one column per state:

**Backlog → Ready → In progress → In review → QA → Done**

Labels: `type:feature`, `type:bug`, `type:chore`, `type:content`, `area:lessons`, `area:runner`, `area:ci`, `area:security`, `priority:p1`–`p3`, and `security` for anything that touches login, data, secrets, the code runner or the AI tutor.

## The stages

### 1. Plan

- Every piece of work starts as an issue made from a template (**Feature**, **Bug** or **Content**).
- The PM agent drafts it: the problem, who it's for, acceptance criteria that can be checked, what's out of scope, and risks and security notes.
- **Definition of Ready:** the acceptance criteria are testable, open questions are answered, the size fits one PR, and Carlos moved it to **Ready**. Only Ready issues get built.

### 2. Code

- One issue → one branch → one PR. Branch names: `type/<issue>-<short-slug>`, e.g. `feat/42-code-replay`.
- Small commits with [Conventional Commits](https://www.conventionalcommits.org): `feat:`, `fix:`, `test:`, `docs:`, `chore:`, `ci:`, `content:`.
- The PR uses the template, says `Closes #<issue>`, and lists what was tested and what Carlos must decide.
- Every feature comes with tests of what the user sees. Docs and `memory.md` are updated in the same PR.

### 3. Build

GitHub Actions runs on every PR (`.github/workflows/ci.yml` and `codeql.yml`), and the final **CI passed** job, which branch protection requires, only passes when every job did:

- **lint and format**, **unit tests**, **content validation** and **build**,
- **end-to-end tests** against the built app, served with the production security headers,
- **security**: dependency audit, CodeQL code scanning and a secret scan.

Dependabot opens PRs for outdated or vulnerable dependencies every week. Those PRs go through the same stages.

### 4. Test

- **Review:** the Reviewer agent (`.claude/agents/reviewer.md`) reviews every PR, Dependabot's included, in a Claude Code session on Carlos's computer (on his Claude plan, so a review costs nothing extra). It checks the issue's acceptance criteria, runs the checks on the PR's code in a separate worktree, and uses a checklist for each kind of change: code, content (including the originality check against the course sources), dependency updates, and CI. A change that touches a `security` area also gets a `security-audit` review. It posts one comment: **Verdict: approve** or **Verdict: changes needed**, the blocking items, optional nitpicks and what it checked. Then it moves the issue to **QA** or back to **In progress**.
- **QA:** the QA agent tests the PR's build in the QA environment (the Docker `preview` service, or the staging site after a merge) and posts a QA report on the PR: what it tested, what passed, and bugs filed as new issues.
- **Carlos** tests the staging site when he wants to and approves the production release.

### 5. Ship

- **Staging (after the switch below):** every merge to `main` deploys to staging on Vercel: Vercel's `main` branch address, and `staging.charliecodeacademy.com` once that domain is added. It's added only after the switch, because before it a domain on `main` serves production. Staging is behind Vercel's login, so only Carlos opens it. Automatic tests against staging come after #51, which keeps the secret that lets CI past the login.
- **Release:** production is the `production` branch. To ship, run **Release** (GitHub → Actions → Release → Run workflow; it takes a commit, and the default is `main`'s latest).
  - The run waits for **Carlos's approval** in the `release` environment, which only accepts runs started from `main`.
  - It then moves `production` forward to that commit, and Vercel deploys it.
  - When the repository variable `PRODUCTION_URLS` is set, it waits for Vercel's deploy and checks that every address answers 200 with the Content-Security-Policy.
- **The `production` branch is guarded by a ruleset:** it only accepts commits whose **CI passed** and **CodeQL** checks passed on `main`, and it can't be force-pushed or deleted. So it only ever moves forward, through Release. When several PRs merge within minutes, only the last merge gets a full CI run (a newer push cancels the older run on `main`), so release the latest commit, which is the default.
- **Rollback:** in Vercel → Deployments, choose the previous production deploy → **Instant Rollback** (seconds, no rebuild). Then fix forward: revert the bad change on `main` with a PR and release that commit.
- **Switching it on (Carlos, once):**
  1. In Vercel → Settings → Environments → Production → Branch Tracking, change `main` to `production`. Until then, Vercel still deploys `main` to production on every merge, and Release only moves a branch nobody deploys.
  2. Once the domain is live, set the repository variable `PRODUCTION_URLS` to `https://charliecodeacademy.com https://app.charliecodeacademy.com/learn`.
- **Database rule (from stage 8): expand, then contract.** Staging and production may share a database during a release, so a migration must never break the version that's live. Add new tables and columns first; remove or rename old ones only in a later release.

## Definition of done

An issue is **Done** when its acceptance criteria are met, its tests are added, docs and `memory.md` are updated, review and QA passed, and it's live in production.

## Security basics, always

- Secrets will live only in **Infisical** (#51, set up before the release pipeline). GitHub, Vercel and Supabase get their copies from there. A secret never goes in the repo, an issue, a PR or a log.
- GitHub **secret scanning** and **push protection** are on: a push that contains a known kind of secret is blocked, and CI's gitleaks job scans every commit.
- Workflows get the smallest permissions they need, and third-party actions are pinned to a commit.
- Student code runs only in the Web Worker, with the app's Content-Security-Policy.
- Anything that touches login, data, the code runner, the AI tutor or secrets is labeled `security` and gets a security review before it merges.

## Accounts: who GitHub sees

For now every agent works through **Carlos's GitHub account**, so GitHub sees one person: it won't let a PR's author approve their own PR, and the history doesn't show the roles apart. Until that changes:

- the Reviewer agent posts its verdict as a review **comment** ("Verdict: approve" or "Verdict: changes needed");
- `main` requires green checks but no approvals, so Carlos can still merge;
- Carlos's real sign-off is merging the PR (and, once the release pipeline exists, approving the production deploy).

**Next step (Carlos's choice):** a separate GitHub **bot account** for the agents (for example `charliecode-bot`, added as a collaborator with a fine-grained token limited to this repo), or a GitHub App. Then agents open PRs as the bot, Carlos approves as code owner, and branch protection can require his approval.

## Status: what's live today

| Piece                                                                              | Status                                                             |
| ---------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| Issue templates, PR template, CODEOWNERS, agent roles                              | ✅ live                                                            |
| Labels and the first issues (#37–#46)                                              | ✅ live                                                            |
| Board "DSA course app" (github.com/users/cordovacarlos22/projects/9)               | ✅ live                                                            |
| CI: lint, format, unit tests, content, build                                       | ✅ live                                                            |
| CI: end-to-end tests (3 setups), dependency audit, CodeQL, secret scan, Dependabot | ✅ live (#37)                                                      |
| Required checks on `main`: CI passed and CodeQL                                    | ✅ live                                                            |
| GitHub secret scanning, push protection, Dependabot security updates               | ✅ live                                                            |
| Secrets in Infisical (OIDC from GitHub Actions)                                    | ⏳ #51                                                             |
| Docker dev and QA environment                                                      | ⏳ `chore/docker`                                                  |
| Release: `production` branch, Carlos's approval, ruleset, rollback                 | ✅ built (#39): on once Vercel's production branch is `production` |
| Staging on `staging.charliecodeacademy.com`                                        | ⏳ #70 (the domain)                                                |
| Automatic tests against staging                                                    | ⏳ after #51                                                       |

Until Carlos switches Vercel's production branch to `production`, Vercel deploys `main` to production on every merge, so his approval still happens when he merges the PR.
