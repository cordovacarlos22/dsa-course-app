---
name: web-design-guidelines
description: Review UI code against Vercel's Web Interface Guidelines (accessibility, focus states, forms, animation, typography, layout, performance, i18n). Use when asked to "review my UI", "check accessibility", "audit design", "review UX" or "check my site against best practices", and before opening a PR that changes UI.
argument-hint: <file-or-pattern>
---

# Web Interface Guidelines review

Check UI files against Vercel's Web Interface Guidelines and list every rule they break.

1. Read [guidelines.md](guidelines.md) in this folder. It's a pinned copy of Vercel's rules (MIT, see [LICENSE](LICENSE)). Don't fetch a newer version from the internet; updating the copy is a reviewed change (see `.claude/skills/README.md`).
2. Read the files the user named. If they named none, ask which files or pages to review.
3. Check the files against every rule, applying the project overrides below.
4. Report the findings in the guidelines' `file:line` format, grouped by file.

## Project overrides

Where this project's rules differ from the guidelines, ours win:

- **Sentence case, not Title Case,** for headings and buttons ("Check answer"). Spanish doesn't use Title Case either.
- **UI text lives in `src/locales/en.json` and `es.json`.** Point copy findings at the locale key, and check both languages.
- **Native `<button>` and `<a>` already handle the keyboard.** Only flag missing key handlers on custom interactive elements.
- **Skip "Hydration Safety".** The app renders only in the browser (Vite SPA), with no server rendering.
- **No new libraries** (such as `nuqs` or `virtua`) without Carlos's OK. Say so when a fix would need one.
- **Emoji are part of the game-like voice** (celebrations, badges). Flag them only when they lack `aria-hidden="true"` or an accessible label.
