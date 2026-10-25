# Deeper Linked Lists, lessons 9–13

**2026-10-25** · #46 (part 3 of 4; also its part of #90), Carlos: finish the Section 4 work while he prepares the next transcripts

Every point of course 1's get, set, insert, remove and reverse lectures was already covered, so nothing was cut; the lessons got more depth. They keep their 5 steps.

- **One "Under the hood" paragraph per step (25 in all).** Topics include: `get` returns the real node; why the range check runs before the walk; get's walk can't crash; the two `value`s in `target.value = value`; `this.get` inside another method; why insert accepts `index === length` and get doesn't; linking is O(1) once you're there; removing a node doesn't erase it; a doubly linked list removes a node you already hold in O(1); "in place" means O(1) extra space; reverse's loop keeps a finished reversed part behind `current`.
- **A predict-the-output snippet in every Examples step:**
  - get without its range check;
  - changing a node vs moving a pointer;
  - insert's two link orders;
  - remove's middle case;
  - reverse's loop.
- **Each lesson's last check (Look back) is now an explain checkpoint.** The five choice questions it replaced, plus part 2's three, go into the quiz in part 4.
- **Spanish:** the singular "invitado" and "un amigo" in these five lessons and their checks are neutral now ("nombre", "alguien", "nodo", "quien"). The plural "los invitados" stays until Carlos decides (#90).
- **Part 4 does the rest of #46:**
  - the quiz: the 8 moved checks, the #93 rebalance and neutral Spanish;
  - the neutral captions in `viz.es.json`;
  - the curriculum status.
