---
name: DSA in JavaScript
description: A friendly, game-like course app where beginners learn data structures and algorithms in JavaScript, in English and Spanish. By charliecodeacademy.
colors:
  # Our own tokens, defined in src/index.css (@theme). Use them as bg-brand, text-ink…
  brand: '#0b84d8'
  accent: '#f5b700'
  ink: '#0f172a'
  surface: '#f8fafc'
  # Tailwind v4 palette colors the app uses by name (bg-white, border-slate-200…)
  white: '#fff'
  slate-100: 'oklch(96.8% 0.007 247.896)'
  slate-200: 'oklch(92.9% 0.013 255.508)'
  slate-300: 'oklch(86.9% 0.022 252.894)'
  slate-500: 'oklch(55.4% 0.046 257.417)'
  slate-600: 'oklch(44.6% 0.043 257.281)'
  slate-700: 'oklch(37.2% 0.044 257.287)'
  slate-900: 'oklch(20.8% 0.042 265.755)'
  slate-950: 'oklch(12.9% 0.042 264.695)'
  green-50: 'oklch(98.2% 0.018 155.826)'
  green-500: 'oklch(72.3% 0.219 149.579)'
  green-900: 'oklch(39.3% 0.095 152.535)'
  amber-50: 'oklch(98.7% 0.022 95.277)'
  amber-900: 'oklch(41.4% 0.112 45.904)'
  red-400: 'oklch(70.4% 0.191 22.216)'
  purple-500: 'oklch(62.7% 0.265 303.9)'
typography:
  display:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', 'Noto Sans', Arial, sans-serif"
    fontSize: 3rem
    fontWeight: 800
  headline:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', 'Noto Sans', Arial, sans-serif"
    fontSize: 1.875rem
    fontWeight: 800
  title:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', 'Noto Sans', Arial, sans-serif"
    fontSize: 1.25rem
    fontWeight: 700
  body:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', 'Noto Sans', Arial, sans-serif"
    fontSize: 1rem
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', 'Noto Sans', Arial, sans-serif"
    fontSize: 0.875rem
    fontWeight: 600
  code:
    fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace"
    fontSize: 0.875rem
    lineHeight: 1.5rem
rounded:
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  2xl: 1rem
  3xl: 1.5rem
  full: 9999px
spacing:
  '1': 0.25rem
  '2': 0.5rem
  '3': 0.75rem
  '4': 1rem
  '5': 1.25rem
  '6': 1.5rem
  '8': 2rem
components:
  button-primary:
    backgroundColor: '{colors.brand}'
    textColor: '{colors.white}'
    typography: '{typography.label}'
    rounded: '{rounded.xl}'
    padding: 0.5rem 1.25rem
  button-primary-disabled:
    backgroundColor: '{colors.slate-300}'
    textColor: '{colors.white}'
  button-run:
    backgroundColor: '{colors.accent}'
    textColor: '{colors.ink}'
    rounded: '{rounded.lg}'
    padding: 0.375rem 1rem
  button-outline:
    textColor: '{colors.brand}'
    rounded: '{rounded.xl}'
    padding: 0.75rem 1rem
  button-cta:
    backgroundColor: '{colors.accent}'
    textColor: '{colors.ink}'
    rounded: '{rounded.full}'
    padding: 0.75rem 2rem
  card:
    backgroundColor: '{colors.white}'
    rounded: '{rounded.2xl}'
    padding: 1.25rem
  pill:
    backgroundColor: '{colors.white}'
    rounded: '{rounded.full}'
    padding: 0.25rem 0.75rem
  feedback-correct:
    backgroundColor: '{colors.green-50}'
    textColor: '{colors.green-900}'
    rounded: '{rounded.xl}'
    padding: 1rem
  feedback-hint:
    backgroundColor: '{colors.amber-50}'
    textColor: '{colors.amber-900}'
    rounded: '{rounded.xl}'
    padding: 1rem
  code-panel:
    backgroundColor: '{colors.slate-900}'
    textColor: '{colors.slate-100}'
    rounded: '{rounded.2xl}'
---

# Design System: DSA in JavaScript

## Overview

A course app for people learning data structures and algorithms in JavaScript, many of them Spanish speakers and meeting these topics for the first time. It should feel **friendly, clear and a little playful**: a calm page to read and code on, and a small party every time the student wins something, like Duolingo.

- **Calm for learning:** a light surface, white cards, one blue for actions, and plenty of room. Lessons show first (an animation), then explain (real text), then ask (a checkpoint).
- **A game for progress:** checks, lessons and modules end in confetti, a short sound and a cheer. Wins are loud; mistakes are quiet (a hint, never a fail sound).
- **Bilingual:** every screen works in English and Spanish. Spanish text runs about 20–30% longer, so layouts must have room for it.

This file describes the look the app **already has**. Change it only in a PR that Carlos reviews.

## Colors

- **Brand blue `#0b84d8`** (`brand`): actions and focus. Primary buttons, links, the current step, outline buttons, the landing hero.
- **Accent yellow `#f5b700`** (`accent`): energy and "go". The JS logo chip, the **Run** button in code panels, the landing call-to-action, the trophy box (`bg-accent/20`).
- **Ink `#0f172a`** (`ink`): main text, and dark panels on the landing page.
- **Surface `#f8fafc`** (`surface`): the page background. Content sits on white cards above it.
- **Slate grays** for structure: `slate-200` borders and empty progress segments, `slate-300` stronger borders and disabled buttons, `slate-500`/`slate-600` secondary text.
- **Green** means success: passed progress segments (`green-500`), the "Correct!" box and the lesson-complete card (`green-50` background, `green-900` text).
- **Amber** means a hint (`amber-50` background, `amber-900` text). It's a helping hand, not an error.
- **Red** only for failing test output in the dark code console (`red-400`).
- **Code panels** are dark: `slate-900` background (`slate-950` for the output pane), `slate-100` text.
- **Confetti** uses brand blue, accent yellow, `green-500` and `purple-500`. Purple appears nowhere else.

## Typography

- **One font family: the device's system sans** (Tailwind's `font-sans`). No web fonts are downloaded, which keeps the app fast on slow phones. Code uses the system monospace (`font-mono`).
- **Headings are heavy and short:** page titles `text-3xl font-extrabold`, section titles `text-xl`/`text-2xl font-bold`, the landing headline `text-3xl sm:text-5xl font-extrabold`.
- **Body text** is `text-base`. Lesson text uses the Tailwind typography plugin (`prose prose-slate max-w-none`) with extra-bold headings and brand-blue links; the layout column sets its width.
- **Small labels** are `text-sm font-semibold`. Tiny uppercase labels (`text-xs font-semibold uppercase tracking-wide`, in `slate-500` or brand blue) name the module, the step and the checkpoint above their headings.
- Code is `font-mono text-sm` with `leading-6`.
- Headings and buttons use **sentence case** ("Check answer", "Next lesson"), in both languages.

## Layout

- **Page width:** `max-w-5xl` with `px-4` gutters. Lesson pages get the full `max-w-screen-2xl`, for the three-pane coding workspace.
- **Spacing:** Tailwind's 4 px scale. Cards use `p-5`/`p-6`, groups `gap-2` to `gap-4`, and sections are separated by `mt-8`/`mt-10`.
- **Roomy, not dense** (Carlos's feedback): give lessons, editors and animations space to breathe. Don't squeeze panels to fit more on screen.
- **Mobile first:** everything must work at 320 px wide with no sideways scroll. On screens under 360 px, the header shows only the yellow JS logo, without the app name.
- The coding workspace is three panes on large screens and tabs (`grid-cols-3` switcher) on small ones.

## Elevation & Depth

- **Mostly flat.** Cards are separated from the surface by a `border-slate-200` hairline, not by shadows.
- Shadows are rare and small: `shadow-sm` on module cards (growing to `shadow-md` on hover), `shadow` on the landing call-to-action, and `shadow-xl` only on the first-visit language dialog, which sits over a dimmed backdrop (`bg-ink/60`).

## Shapes

- Corners are soft and friendly: `rounded-xl` (12 px) for buttons and feedback boxes, `rounded-2xl` (16 px) for cards and code panels, `rounded-3xl` (24 px) for the big landing panels, `rounded-full` for pills and landing buttons, `rounded-md` for the tiny JS logo chip.
- Borders are 1 px (`border-slate-200`) on cards, or 2 px (`border-2 border-brand`) on outline buttons.

## Components

- **Primary button:** `rounded-xl bg-brand px-5 py-2 font-bold text-white`. When disabled: `disabled:bg-slate-300 disabled:cursor-not-allowed`. The lesson's **Next** button bounces once when it unlocks (`motion-safe:animate-nudge`).
- **Run / Check button** in the dark code panel: `rounded-lg bg-accent px-4 py-1.5 text-sm font-bold text-ink`.
- **Outline button:** `rounded-xl border-2 border-brand text-brand`, filling with brand blue on hover.
- **Card:** `rounded-2xl border border-slate-200 bg-white p-5`. Module cards lift slightly on hover. "Coming soon" cards are dashed (`border-dashed border-slate-300`) and muted.
- **Pill / chip:** `rounded-full bg-white px-3 py-1 text-sm font-semibold`, used for lesson stats ("✓ 4 checks passed").
- **Checkpoint feedback:** a correct answer shows a green box that pops in (`motion-safe:animate-pop`) with "✓ Correct!" plus a cheer. A wrong answer shows the amber hint box.
- **Step progress:** one rounded segment per step: green when passed, brand blue for the current step (with a `ring-2 ring-brand/40` ring), `slate-200` otherwise. Colors change with `transition-colors duration-500`.
- **Lesson-complete card:** a green card with 🎉, the stats chips, ⭐ for a perfect lesson, and a yellow 🏆 box inside it when the module is also finished.
- **Header:** white with a bottom border. The JS logo chip and app name on the left; **Learn**, the 🔊 sound toggle and the language switcher on the right.
- **Landing page:** a brand-blue hero panel (`rounded-3xl`) with a yellow call-to-action and a white outline button, centered sections, and a dark ink panel for the final call to action.

## Do's and Don'ts

**Do**

- Use the tokens (`brand`, `accent`, `ink`, `surface`) and the Tailwind classes listed here. New colors need a reason and Carlos's OK.
- Keep celebrations: confetti and sound through `celebrate(level)` in `src/lib/celebrate.js`, cheers and emoji (🎉 🏆 🔥 🎯 ⭐) in wins. Emoji are part of the game-like voice that Carlos asked for. Give them `aria-hidden="true"` when the text already says the same thing.
- Put every animation behind `motion-safe:`. Students who ask their device for less motion get no confetti and no pop, but they still get the messages and sounds.
- Check every screen in English and Spanish, at 320 px, 375 px and desktop widths.
- Put UI text in `src/locales/en.json` and `es.json`.

**Don't**

- Don't add web fonts, icon libraries, animation libraries or UI kits without Carlos's OK.
- Don't play sounds or show red alerts for mistakes. Mistakes get a hint.
- Don't make layouts denser to fit more on screen.
- Don't use Title Case.

## Known gaps

These are true today, so don't assume otherwise:

- The favicon is still Vite's default (`public/vite.svg`).
- There's no dark mode.
- There are no custom focus styles. Buttons and links use the browser's default focus ring.
