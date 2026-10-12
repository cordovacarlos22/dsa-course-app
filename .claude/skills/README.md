# Agent skills (third-party, reviewed)

Skills are instruction files that a coding agent loads when a task matches. Claude Code reads them from this folder automatically. Other agents can read them by path; see "Agent skills" in `AGENTS.md`.

Every file here was **read before it was added** and is **pinned to the exact commit we reviewed**. Skills steer what an agent does on Carlos's computer, so an update gets the same review as new code.

| Skill                   | What it's for                                                   | Source (pinned)                                                                                                                                        | License    | Our changes                                                                                                     |
| ----------------------- | --------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------- | --------------------------------------------------------------------------------------------------------------- |
| `security-audit`        | Security questions, focused reviews, full audits                | [cloudflare/security-audit-skill](https://github.com/cloudflare/security-audit-skill) `c1c8a8c` (2026-09-14)                                           | MIT        | None. The validator test files were left out (they're for the skill's own maintainers).                         |
| `impeccable`            | Designing, critiquing and polishing app UI                      | [pbakaus/impeccable](https://github.com/pbakaus/impeccable) v4.5.2, `245ad82` (2026-10-12)                                                             | Apache-2.0 | Guides only: `scripts/` left out (no engine). A project note at the top of `SKILL.md`.                          |
| `design-taste-frontend` | Marketing pages (the landing page)                              | [Leonxlnx/taste-skill](https://github.com/Leonxlnx/taste-skill) `d237dd3` (2026-10-11), `skills/taste-skill`                                           | MIT        | A project note at the top of `SKILL.md`. The 12 other variants (brutalist, image generation, …) were left out.  |
| `web-design-guidelines` | Reviewing UI code against a checklist                           | [vercel-labs/web-interface-guidelines](https://github.com/vercel-labs/web-interface-guidelines) `434b7f9` (2026-10-05), `command.md` → `guidelines.md` | MIT        | Our own short `SKILL.md`. Vercel's version downloads the latest rules on every run; ours reads the pinned copy. |
| (`DESIGN.md` format)    | The repo's `DESIGN.md`, so agents build UI that matches the app | [VoltAgent/awesome-design-md](https://github.com/VoltAgent/awesome-design-md) `c7c1bad` (2026-10-12)                                                   | MIT        | Nothing copied. Its files describe other brands, so we wrote our own `DESIGN.md` in the same format.            |

## What we left out, and why

- **The Impeccable engine** (`scripts/impeccable`). On first use, the launcher downloads a compiled program (about 16 MB) from the project's GitHub releases and runs it. A compiled program can't be read like the rest of the skill, and it sends usage pings to `impeccable.style` unless you set `DO_NOT_TRACK=1`. The skill works without it; the project note in `impeccable/SKILL.md` tells agents how.
- **Live downloads of rules.** Vercel's original skill fetches its rules from GitHub on every review, so whoever controls that file controls the agent's instructions. The pinned `guidelines.md` changes only through a reviewed PR.

## Updating a skill

1. Clone the source repo into a temporary folder outside this repo.
2. Diff it against the pinned commit above and read every change. Look for new scripts, downloads, network calls, `npx` or install commands, hidden text (HTML comments, invisible Unicode), and instructions that send data anywhere.
3. Copy the reviewed files here, re-apply "Our changes", update the commit in the table, and open a PR that says what changed.

Don't install or update these with `npx skills add`, plugin marketplaces or auto-update. Those skip the review step.
