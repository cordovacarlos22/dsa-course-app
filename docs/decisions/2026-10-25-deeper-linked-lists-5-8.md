# Deeper Linked Lists, lessons 5–8

**2026-10-25** · #46 (part 2 of 3; also its part of #90), Carlos chose "Bugs first, then #46"

Every point of course 1's push, pop (intro and code), unshift and shift lectures was already covered, so nothing was cut; the lessons got more depth. They keep their 5 steps.

- **One "Under the hood" paragraph per step (20 in all):**
  - **push:** `return this` returns the same list; `head`, `tail` and `length` stay in agreement; the `Node` class sets the end marker; changing a node vs moving a pointer; `tail` trades a pointer for a walk.
  - **pop:** the popped node is already cut off; `undefined` matches an array's `pop`; the trailing pointer; pop doesn't destroy the node; `prev` would make it O(1).
  - **unshift:** only `head` is needed; the empty case equals push's; "link before you move"; the build-from-the-back loop was unshift; front-only adding and removing makes a stack.
  - **shift:** it returns the node like pop; `head` empties itself; `oldHead.next = null` is about correctness, not memory; the length check matches pop; push plus shift makes a queue.
- **Each lesson's last check (Look back) is now an explain checkpoint.** The quiz already has push's twin (`ll-push-chaining`). The pop, unshift and shift choices it replaced move into the quiz in part 3, with the rest of the quiz changes.
- **Spanish:** the singular "invitado", "tú mismo" and the `'Invitado ' + k` label in these four lessons and their checks are neutral now ("nombre", "persona", "alguien", "nodo"). The plural "los invitados" stays until Carlos decides (#90).
