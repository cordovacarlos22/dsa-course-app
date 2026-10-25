# Deeper Linked Lists, lessons 1–4

**2026-10-25** · #46 (part 1 of 3; also its part of #90), Carlos chose "Bugs first, then #46"

Every point of course 1's first four Linked Lists lectures (intro, Big O, under the hood, constructor) was already covered, so nothing was cut; the lessons got more depth.

- **Lessons 1–3 each get a new last step with an explain checkpoint:** "Following the links" (positions are link counts from `head`), "Memory: one block or many nodes" (an array's copy-on-grow vs one pointer per node; both O(n) space) and "Changing a node vs moving a pointer".
- **Lesson 4 keeps its 5 steps.** Its last choice check (`line.head === line.tail`) became an explain checkpoint; the quiz already asks the same question (`ll-tail-equals-head`).
- **Every step gets one "Under the hood" paragraph ("Por dentro").** Topics: the heap, `null` vs `undefined`, no built-in linked list in JavaScript, one-way pointers, the garbage collector, why insert is O(n) for different reasons, the CPU cache, shared object shapes, how DevTools prints nesting, missing parameters are `undefined`, and the DevTools view of a new list (from the source's constructor lecture).
- **Predict-the-output snippets** were added in lessons 1 and 3.
- **Spanish:** the singular "invitado" and "cómodo" in these four lessons and their checks are neutral now ("nombre", "alguien", "persona"). The plural "los invitados" stays until Carlos decides (#90).
- **Quiz changes all wait for part 3,** so the three PRs don't conflict over `linked-lists.json`.
