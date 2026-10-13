# Product

<!-- impeccable:product-schema 1 -->

What the app is and who it's for, so agents that design or write UI start from the same facts. It records product truth, not looks: the look is in `DESIGN.md`, and how to build is in `AGENTS.md`.

## Platform

web

## Users

People learning data structures and algorithms in JavaScript, many of them Spanish speakers and Carlos's own students. The landing page names four groups:

- **Interview prep:** JavaScript developers who want to walk into technical interviews with confidence.
- **University students** who want their DSA class to finally click.
- **Self-taught developers** filling computer science gaps.
- **Career switchers** who need strong fundamentals, fast.

They study on phones and laptops, often in short sessions, and many meet these topics for the first time.

## Product Purpose

A complete DSA course with an AI tutor, by Carlos (charliecodeacademy). Students learn each topic in the app:

1. **Lessons** split into short steps. Each step shows an animation, explains it in full, often runs real code, and ends with a checkpoint (a question or a small coding task) that unlocks the next step.
2. **Quizzes:** multiple-choice questions per module.
3. **Timed exercises:** LeetCode-style problems solved in the browser, checked by hidden tests.
4. **An AI tutor** for lesson questions, hints, code review and mock interviews, with a daily limit per student.
5. **Progress** that each student sees, and the admin sees for everyone.

Success: a student finishes a module able to explain the idea, code it, and say its Big O.

## Positioning

- **Carlos's own course, in his own words,** following the order and depth of the two DSA courses he took, with original explanations, questions and exercises.
- **English and Spanish** for the whole app and every lesson, for a Spanish-speaking audience that most DSA courses skip.
- **Show, then explain:** every step pairs an animation with a real explanation.
- **Learning by doing, gated:** a step's check must pass before Next unlocks.
- **A tutor that teaches instead of solving:** hints go from a nudge, to an approach, to pseudo-code, never the full solution.

## Operating Context

- The course is organized as Section → Module → Lesson → Step (Sección → Módulo → Lección → Paso): 24 modules in 7 sections, in the order of `docs/curriculum.md`.
- Student code runs in the browser in a Web Worker, with a 2-second limit.
- The language is picked on the first visit and can be changed in the header.
- Wins are celebrated like a game (confetti, sound, cheers), with a mute button. Devices that ask for less motion get no confetti.
- Free with login while it's being built (the "Free during the beta" badge). Payments come later.

## Capabilities and Constraints

- **Built today:** the landing page, the course home, module pages, and lessons with checkpoints and celebrations. Content: the Introduction and Big O modules.
- **Coming next:** quiz and exercise pages, Supabase accounts and progress (with XP and streaks), the AI tutor, and the remaining modules.
- **Stack:** React + Vite, plain JavaScript (never TypeScript), Tailwind v4, Supabase, Vercel. Details are in `AGENTS.md`.
- **Code shown to students** uses a beginner style: classic `for` loops, no advanced tools before the module that teaches them.
- **Undecided:** prices, payment provider, and the final domain.

## Brand Commitments

- **Name:** "DSA in JavaScript" (ES: "DSA en JavaScript"), "Made by charliecodeacademy".
- **Brand colors:** blue `#0b84d8` and yellow `#f5b700` (see `DESIGN.md`).
- **Voice:** friendly, direct and encouraging, as in the current UI and lessons. Carlos is a career switcher himself, and he approved telling that story on the landing page.
- **Originality:** every sentence is written fresh. Course transcripts, slides and quiz text are never copied.

## Evidence on Hand

- **Real:** the lessons in `content/lessons/`, practice sets in `content/practice/`, the animations in `src/visualizations/`, and Carlos's photo and bio on the landing page.
- **None yet:** no testimonials, reviews, student counts, completion rates or press. Don't invent them.

## Product Principles

1. Understanding first: an idea isn't done until the student can explain it, code it, and give its Big O.
2. Every step earns the next one with a check.
3. Celebrate wins loudly; meet mistakes with a hint, never a fail sound.
4. Spanish speakers get the same course, not a lesser translation.
5. Simple over clever, in the UI and in the code students read.

## Accessibility & Inclusion

- Works at 320 px wide with no sideways scroll, in both languages.
- Respects `prefers-reduced-motion`. Sounds have a mute button that the app remembers.
- Every control can be used with a keyboard and has an accessible name. Status messages use `role="status"`.
