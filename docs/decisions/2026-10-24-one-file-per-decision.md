# One file per decision; PRs don't edit memory.md

**2026-10-24** · #114, Carlos

Every PR added its decision at the top of `memory.md`'s Decisions list, so whichever PR merged first gave every other open PR a conflict, even when Carlos merged them in order (it happened after each merge of #105, #107, #108 and #109). Now a PR adds its decision as a new file in `docs/decisions/` and never edits `memory.md`. New files don't conflict, so approved PRs merge one after another with nothing to fix. `memory.md`'s Current stage, Done, Next and Course sections imported are refreshed in one small docs PR after a batch merges, when no other PR is open. `package-lock.json` keeps its one-at-a-time rule. The 2026-10-24 batch (#45, #100–#104) moved into decision files; older decisions stay in `memory.md`.
