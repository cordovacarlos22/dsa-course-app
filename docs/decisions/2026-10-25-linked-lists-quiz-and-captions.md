# Linked Lists quiz and captions: balanced answers, neutral Spanish

**2026-10-25** · #46 (part 4; it doesn't close the issue: part 5 adds predict snippets to lessons 5–8; also #93's Linked Lists part and #90's captions), Carlos: finish the Section 4 work while he prepares the next transcripts

- **The quiz grows from 23 to 31 questions.** The 8 new ones are the choice checks that parts 2 and 3 turned into explain checkpoints, so they stay graded:
  - `ll-pop-prev`, `ll-unshift-front`, `ll-shift-queue`;
  - `ll-get-returns-node`, `ll-set-cost`, `ll-insert-true`, `ll-remove-most-expensive`, `ll-reverse-cost`.
  - Push's and the constructor's replaced checks already had quiz twins.
- **Balanced answers (#93):**
  - In 16 of the 23 questions, the right answer was the single longest option. Each now has a wrong option at least as long, or a shorter right one, in English and Spanish.
  - The right answers are spread 7/8/8/8 across positions 0–3.
- **Neutral Spanish:**
  - the quiz and exercise text in `linked-lists.json` (e.g. "Alguien se forma al final…", "Quien está al final de la fila se va.");
  - every Linked Lists animation caption in `src/locales/viz.es.json`. Trace inputs now read "1 nombre / 3 nombres".
  - The plural "los invitados" stays until Carlos decides (#90).
- **`docs/curriculum.md`:** the Linked Lists status shows 63 steps, 13 explain checkpoints and a 31-question quiz. Those counts include parts 1–3 (#119, #121, #122), so this PR merges after them.
