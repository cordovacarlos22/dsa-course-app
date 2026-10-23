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

- **Review:** the Reviewer agent reviews the diff. A change that touches a `security` area also gets a `security-audit` review.
- **QA:** the QA agent tests the PR's build in the QA environment (the Docker `preview` service, or the staging site after a merge) and posts a QA report on the PR: what it tested, what passed, and bugs filed as new issues.
- **Carlos** tests the staging site when he wants to and approves the production release.

### 5. Ship

- A merge to `main` deploys to **staging** automatically, then runs the end-to-end and smoke tests there.
- Production waits for **Carlos's approval** (a GitHub environment with a required reviewer). After he approves, the staging build is promoted to production and smoke-tested.
- The previous production deploy stays available, so a bad release is rolled back with one command.
- **Database rule (from stage 8): expand, then contract.** Staging and production may share a database during a release, so a migration must never break the version that's live. Add new tables and columns first; remove or rename old ones only in a later release.

## Definition of done

An issue is **Done** when its acceptance criteria are met, its tests are added, docs and `memory.md` are updated, review and QA passed, and it's live in production.

## Security basics, always

- Secrets live only in GitHub, Vercel and Supabase settings. Never in the repo, an issue, a PR or a log.
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

| Piece                                                                              | Status            |
| ---------------------------------------------------------------------------------- | ----------------- |
| Issue templates, PR template, CODEOWNERS, agent roles                              | ✅ live           |
| Labels and the first issues (#37–#46)                                              | ✅ live           |
| Board "DSA course app" (github.com/users/cordovacarlos22/projects/9)               | ✅ live           |
| CI: lint, format, unit tests, content, build                                       | ✅ live           |
| CI: end-to-end tests (3 setups), dependency audit, CodeQL, secret scan, Dependabot | ✅ live (#37)     |
| Docker dev and QA environment                                                      | ⏳ `chore/docker` |
| Staging deploy, Carlos's approval, production promote, rollback                    | ⏳ `ci/release`   |

Until the release pipeline is live, Vercel deploys `main` to production on every merge, so Carlos's approval happens when he merges the PR.
