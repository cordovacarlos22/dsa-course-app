# Course blueprint: DSA in JavaScript

This is the plan for the whole course: what each module teaches and what students practice. Agents and Carlos use it to write lessons, quizzes, exercises and slides **in order**. Update a module's **Status** whenever its content is merged.

## Principles

1. **Our own material.** The course combines the topic order of two popular DSA courses that Carlos took. Their lessons, slides, exercises, starter files, solutions, quizzes and wording are **examples of structure only and are never copied, edited or reused**. Every lesson, slide, explanation, example, problem statement, test and solution in this app is written from scratch.
2. **Algorithms first.** Students learn to measure code (Big O), then a method and patterns for solving problems, then searching and sorting, and only then build data structures (starting with classes and pointers, the tools every data structure uses), graph algorithms and dynamic programming.
3. **One module = one topic**, always in the same rhythm:
   1. **Lessons:** short explanations, step-by-step animations and runnable code.
   2. **Quiz:** checks understanding, with an explanation for every answer.
   3. **Build it:** implement the data structure or algorithm yourself, one method or step at a time (`category: "build"`).
   4. **Interview problems:** LeetCode-style problems that use the topic (`category: "interview"`).
   5. **Slides:** a short, downloadable deck that summarizes the module (our own text and diagrams, in Carlos's brand, EN + ES). Planned for every module; built in a later stage.
4. **Difficulty mix:** mostly easy and medium, with a few hard problems at the end of a module. Every exercise has at least 5 tests, including edge cases (empty input, one item, duplicates, negatives, not found).
5. **Problem names** use the classic, generic names of well-known problems (e.g. "Two Sum", "Balanced Brackets"), because the problems themselves belong to no one. **Statements, examples, tests and solutions are always ours.**
6. **English and Spanish.** Lessons, quizzes and slides are written in both languages (see `AGENTS.md` for the Spanish terms).
7. **Animations** are named in `kebab-case` (e.g. `linked-list-push`) and built with `StepPlayer` when the lesson needs them.

## Sections and modules

| Section                | Modules                                                                                                                                                           |
| ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1. Foundations         | Introduction · Big O · Big O of Arrays & Objects                                                                                                                  |
| 2. Problem Solving     | A Problem-Solving Approach · Problem-Solving Patterns · Recursion                                                                                                 |
| 3. Searching & Sorting | Searching Algorithms · Basic Sorts · Merge Sort · Quick Sort · Radix Sort                                                                                         |
| 4. Data Structures     | Classes & Pointers · Linked Lists · Doubly Linked Lists · Stacks & Queues · Binary Search Trees · Tree Traversal · Heaps & Priority Queues · Hash Tables · Graphs |
| 5. Graph Algorithms    | Graph Traversal · Dijkstra's Shortest Path                                                                                                                        |
| 6. Dynamic Programming | Dynamic Programming                                                                                                                                               |
| 7. Interview Practice  | Array Interview Problems                                                                                                                                          |

Planned practice: about **155 exercises** (70 build it, 86 interview problems), 24 quizzes and 24 slide decks. Module slugs are English names without numbers; the order lives in `content/course.json`.

---

# Section 1 · Foundations

## Introduction (`introduction`)

**Status:** ✅ 3 lessons, theory first, deeper (#43) (EN + ES, 13 checkpoints, 3 of them explain) · ✅ quiz, 16 questions (EN + ES) · ⬜ slides
**Goal:** know what the course covers, how to study, and how to run code in the app.

- **Lessons:** Welcome to the course · Getting the most out of this course · Running code in this course
- **Quiz:** Big O as the language of efficiency, why classes and pointers matter, `head`/`tail` are pointers, copying an object copies the arrow, array vs object lookups, practice routine, running code, line tags in the replay, why code runs in a Web Worker, `+` joining text, a SyntaxError runs nothing, infinite-loop protection.
- **Practice:** none.

## Big O (`big-o`)

**Status:** ✅ 17 lessons, 56 steps (EN + ES, 56 checkpoints, all theory first; all 17 lessons deeper, with explain checks and an under-the-hood part, #43 and #44) · ✅ quiz, 49 questions (EN + ES) · ✅ 6 interview problems · ⬜ slides
**Goal:** measure and compare the efficiency of code, in time and space.
**Sources:** Carlos's two Big O files (course 1 "Section 2 - Big o notes.docx" and course 2 "Intro to Big O.docx", text and images; see AGENTS.md).
**Style:** one lesson per lecture of both courses, at their depth (450–900 words each), with the courses' own examples written as indexed loops; every step has an animation except three practice steps, lesson 3's "Count it yourself", lesson 10's "Spot the dominant term in code" and lesson 14's "Trading space for time", which use runnable code instead, and the party **guest list** is the story of the animations.

- **Lessons** (sources and animations in parentheses):
  1. Why Big O? ✅ (C2 intro + motivation, C1 intro: `big-o-growth-chart`, `trace-is-invited`, `trace-is-invited-all`, `stopwatch-race`, `memory-boxes`)
  2. Timing our code ✅ (C2: `trace-sum-loop`, `trace-sum-formula`, `big-o-growth-chart`, `stopwatch-race`)
  3. Counting operations ✅ (with a "Count it yourself" step; C2: `trace-sum-formula`, `trace-sum-loop`, `linear-boxes`, `trace-count-guests`)
  4. Visualizing time complexities ✅ (C2: `timing-chart`, `stopwatch-race`, `big-o-growth-chart`)
  5. The official intro to Big O ✅ (C2: `big-o-growth-chart`, `same-shape`, `trace-print-seats`)
  6. Best, average and worst case ✅ (with "When all three cases match"; C1 + Big O notes handout: `search-cases`, `trace-is-invited`, `trace-count-short-names`)
  7. O(n): linear time ✅ (C1: `trace-print-numbers`, `linear-boxes`, `trace-welcome-all`)
  8. Drop the constants ✅ (C1 + C2: `trace-welcome-and-goodbye`, `same-shape`, `big-o-growth-chart`)
  9. O(n²): a loop inside a loop ✅ (C1: `trace-print-seats`, `nested-grid`, `big-o-growth-chart`)
  10. Drop the non-dominant terms ✅ (with "Spot the dominant term in code"; C1 + C2: `dominant-term`, `big-o-growth-chart`)
  11. O(1): constant time ✅ (C1: `trace-sum-formula`, `constant-jump`, `trace-is-invited`)
  12. Rules of thumb ✅ (C2: `trace-party-summary`, `trace-greet-everyone`, `trace-give-gifts`)
  13. Different terms for inputs ✅ (C1: `two-inputs`, `trace-welcome-and-goodbye`)
  14. Space complexity ✅ (C2: `memory-boxes`, `trace-count-guests`, `trace-double-orders`)
  15. Logarithms and O(log n) ✅ (C1 + C2: `halving-count`, `binary-search-halving`, `big-o-growth-chart`)
  16. Big O of arrays ✅ (C1 + C2 "When are arrays slow?": `constant-jump`, `array-reindex`, `array-splice`, `search-cases`)
  17. Wrap-up ✅ (C1 wrap-up + cheat sheet, C2 recap: `big-o-growth-chart`, `search-cases`, `dominant-term`)
- **Quiz:** the topics of course 1's quiz and course 2's three quizzes (simplifying, time complexity of functions, space complexity), plus timing and counting, Ω/Θ/O, logarithms and array operations. Our own questions and code.
- **Build it:** none.
- **Interview problems:** ✅ Find the Maximum · ✅ Contains Duplicate · ✅ Binary Search · ✅ Count the Operations (predict the count, then check it) · ✅ Count the Handshakes (medium: n(n − 1) / 2 as a formula) · ✅ Count the Halvings (easy: O(log n) with a loop)

## Big O of Arrays & Objects (`arrays-and-objects`)

**Status:** ✅ 4 lessons, 14 steps (EN + ES, 14 checkpoints) · ✅ quiz, 15 questions (EN + ES) · ✅ 3 interview problems · ⬜ slides
**Goal:** know the cost of the built-in tools you use every day.
**Sources:** course 2's Section 3 ("analyzing performance of arrays and objects": 4 lectures, 2 quizzes, 13 slides). Its "When are arrays slow?" lecture went into Big O lesson 16, since it repeated most of it.
**Style:** theory first (see AGENTS.md); the party continues with the `guests` array and the `rsvps` object.

- **Lessons** (sources and animations in parentheses):
  1. The data structures you get for free ✅ (C2 intro: `array-vs-object`, `search-cases`, `big-o-growth-chart`)
  2. Big O of objects ✅ (C2 objects lecture: `object-access`, `object-insert-remove`, `trace-has-answer`)
  3. Big O of object methods ✅ (C2 objects lecture: `object-to-array`, `object-has-key`, `nested-grid`)
  4. Big O of array methods ✅ (C2 array methods lecture: `array-reindex`, `array-copy-methods`, `sort-growth-chart`, `array-loop-methods`, `array-vs-object`)
- **Quiz:** object operations, search vs. access, `Object.keys`/`values`/`entries` and `hasOwnProperty`, push/pop vs. shift/unshift, `shift` in a loop, concat/slice/splice, `sort` (and sorting numbers), the hidden loops in `map`/`filter`, the cost of a callback, and "pick the faster version".
- **Build it:** none.
- **Interview problems:** ✅ Word Frequency (easy) · ✅ Last Answer Wins (easy) · ✅ Guests Who Arrived (medium: O(n + m) with an object instead of O(n · m); replaces "Pick the Faster Version", whose idea moved into the quiz)

---

# Section 2 · Problem Solving

## A Problem-Solving Approach (`problem-solving-approach`)

**Status:** ✅ 7 lessons, 21 steps (EN + ES, 21 checkpoints) · ✅ quiz, 14 questions (EN + ES) · ✅ 3 interview problems · ⬜ slides
**Goal:** have a repeatable method for any problem, even one you've never seen.
**Sources:** course 2's Section 4 (7 lectures and the first 25 pages of its slides; no quiz).
**Style:** theory first; the same two examples all the way through, `add(num1, num2)` and `countCharacters(str)`, and the `five-steps` map reused in every lesson.

- **Lessons** (sources and animations in parentheses):
  1. Why you need a method ✅ (C2 intro: `trace-is-invited`, `five-steps`)
  2. Step 1: Understand the problem ✅ (C2 L21: `five-steps-understand`)
  3. Step 2: Explore concrete examples ✅ (C2 L22: `five-steps-examples`, `example-ladder`)
  4. Step 3: Break it down ✅ (C2 L23: `five-steps-break-down`, `steps-to-code`)
  5. Step 4: Solve or simplify ✅ (C2 L24: `five-steps-solve`, `trace-count-characters`, `solution-layers`)
  6. Step 5: Look back and refactor ✅ (C2 L25: `five-steps-look-back`, `char-code-ranges`)
  7. The method in an interview ✅ (C2 recap, plus the interview advice from every lecture: `five-steps`)
- **Quiz:** what each step is for, what to ask about inputs and outputs, number limits in JavaScript, the four kinds of examples, invalid inputs that look valid, planning with comments, simplifying, `NaN` from a missing count, refactoring vs. Big O, `countCharacters`'s O(1) space, thinking out loud.
- **Build it:** none.
- **Interview problems:** ✅ Count the Vowels · ✅ Character Counter · ✅ Title Case (each description prompts the 5 steps)

## Problem-Solving Patterns (`problem-solving-patterns`)

**Status:** ⬜
**Goal:** recognize the patterns that turn O(n²) solutions into O(n).

- **Lessons:** What is a pattern? · Frequency counter · Multiple pointers · Sliding window · Divide and conquer
- **Animations:** `frequency-counter`, `two-pointers`, `sliding-window`
- **Quiz:** which pattern fits which problem, and the Big O before and after.
- **Build it:** none.
- **Interview problems:**
  - Is Anagram (frequency counter)
  - Same Digit Frequency (frequency counter)
  - Any Duplicates (frequency counter or pointers)
  - Count Distinct in a Sorted Array (multiple pointers)
  - Pair With an Average (multiple pointers)
  - Is Subsequence (multiple pointers)
  - Max Sum of K Consecutive (sliding window)
  - Shortest Subarray With Sum ≥ Target (sliding window)
  - Longest Substring Without Repeats (sliding window)
  - Search a Rotated Sorted Array (divide and conquer)

## Recursion (`recursion`)

**Status:** ⬜
**Goal:** think recursively and follow the call stack.

- **Lessons:** What is recursion? · The call stack (`call-stack`) · Your first recursive function · Factorial, step by step · Common pitfalls (no base case, wrong return) · Helper-method recursion · Pure recursion
- **Quiz:** base case, recursive case, stack overflow, the order calls finish, helper vs. pure.
- **Build it:** none.
- **Interview problems:** Factorial · Power (xⁿ) · Product of an Array · Sum of a Range · Fibonacci · Reverse a String · Is Palindrome · Flatten Nested Arrays · Sum of Nested Even Numbers · Collect Strings From a Nested Object

---

# Section 3 · Searching & Sorting

## Searching Algorithms (`searching`)

**Status:** ⬜
**Goal:** find things fast, and know when you can.

- **Lessons:** Linear search · Binary search (`binary-search-halving`) · Binary search Big O · Searching inside a string (naive string search)
- **Quiz:** when binary search is allowed, Big O of each, naive string search cost.
- **Build it:** linearSearch · binarySearch · countOccurrences (naive string search)
- **Interview problems:** First and Last Position in a Sorted Array · Count Zeros in a Sorted Array

## Basic Sorts (`basic-sorts`)

**Status:** ⬜
**Goal:** understand the three simple sorts and when they're good enough.

- **Lessons:** Why sorting matters (and how JavaScript's `sort` really compares) · Bubble sort · Optimizing bubble sort · Selection sort · Insertion sort · Comparing the three
- **Animations:** `bubble-sort`, `selection-sort`, `insertion-sort`
- **Quiz:** how each works, best/worst cases, space, why insertion sort shines on almost-sorted data, `sort` with a comparator.
- **Build it:** bubbleSort · selectionSort · insertionSort
- **Interview problems:** Sort by a Custom Rule (comparator) · Sort a Linked List (any basic sort; unlocked after the Linked Lists module)

## Merge Sort (`merge-sort`)

**Status:** ⬜
**Goal:** split, sort and merge: O(n log n).

- **Lessons:** Divide and conquer, again · Merging two sorted arrays (`merge-two-arrays`) · Merge sort (`merge-sort`) · Merge sort Big O
- **Quiz:** why log n levels, the cost of merging, extra space.
- **Build it:** merge · mergeSort
- **Interview problems:** Merge Two Sorted Linked Lists (unlocked after the Linked Lists module)

## Quick Sort (`quick-sort`)

**Status:** ⬜
**Goal:** sort in place around a pivot.

- **Lessons:** The idea of quick sort · The pivot step (`quick-sort-pivot`) · Quick sort · Following the call stack · Quick sort Big O (and its worst case)
- **Quiz:** what the pivot does, sorted input as the worst case, in-place sorting.
- **Build it:** pivot · quickSort
- **Interview problems:** none.

## Radix Sort (`radix-sort`)

**Status:** ⬜
**Goal:** sort numbers without comparing them.

- **Lessons:** Sorting without comparisons · Helper methods (digit at a position, digit count, most digits) · Radix sort (`radix-sort-buckets`) · Radix sort Big O
- **Quiz:** buckets, why it works on integers, O(nk).
- **Build it:** getDigit · digitCount · mostDigits · radixSort
- **Interview problems:** none.

---

# Section 4 · Data Structures

## Classes & Pointers (`classes-and-pointers`)

**Status:** ✅ 2 lessons, 9 steps, deeper (#45) (EN + ES, 9 checkpoints, 2 of them explain) · ✅ quiz, 24 questions (EN + ES) · ✅ 5 build it · ⬜ slides
**Goal:** write classes and understand references, the two tools behind every data structure.
**Place:** it opens the Data Structures section, right before Linked Lists (Carlos, 2026-10-19), because both courses teach classes right before their first data structure.
**Sources:** course 1's Section 3 (2 lectures and `cookie.js`). Course 2's class lecture (instance vs. static methods) joins when Carlos sends it.
**Style:** theory first; party invitations printed from a template for classes (our own picture, not the course's cookie cutter), and guest cards (`{ value: 'Ana' }`) for pointers.

- **Lessons** (sources and animations in parentheses):
  1. Classes: the blueprint for every data structure ✅ (C1 classes lecture: `invitation-template`, `invitation-new`, `invitation-methods`, `list-class-preview`)
  2. Pointers: values vs. references ✅ (C1 pointers lecture: `value-copy`, `reference-copy`, `pointer-move`)
  3. Instance methods vs. static (class) methods ⬜ (waits for course 2's lecture)
- **Quiz:** classes vs. instances, naming, `constructor`, what `new` does (and forgetting it), `this`, getters/setters, why data structures are classes, copying values vs. sharing references, `===` on objects, moving pointers, garbage collection (and removed list nodes). Static methods come with lesson 3.
- **Build it:** ✅ The Invitation Class · ✅ The Door Counter (`Counter`: increment, decrement, reset) · ✅ The Seating Table (`Table`: seat, freeSeats) · ✅ Count the Cards (follow `next` pointers) · ✅ Every Other Card · A `Point` class with a static `distance` method (with course 2's lecture)
- **Interview problems:** none.

## Linked Lists (`linked-lists`)

**Status:** ✅ 13 lessons, 60 steps (EN + ES, 60 checkpoints) · ✅ quiz, 23 questions (EN + ES) · ✅ 10 build it · ⬜ interview problems (with course 1's Section 5) · ⬜ slides
**Goal:** build a singly linked list from scratch and solve classic pointer problems.
**Sources:** course 1's Section 4 (14 lectures, 3 quiz questions, exercise files and a Big O table). Course 2's own linked list section joins later, when Carlos sends it.
**Style:** theory first. Every method lesson (constructor to reverse) follows the 5 steps from A Problem-Solving Approach: understand, examples (empty, one, many), break it down, write the code, look back. The party continues as a **conga line** of guests: each one holds on to the next, `head` is the front and `tail` is the back. Our list can start empty (`new LinkedList()`) or with one guest (`new LinkedList('Ana')`).

- **Lessons** (one per lecture; the two pop lectures make one lesson; sources and animations in parentheses):
  1. What is a linked list? ✅ (C1 intro: `array-vs-linked-list`, `linked-list-anatomy`, `list-class-preview`)
  2. Linked lists vs. arrays in Big O ✅ (C1 Big O lecture, the Big O table and the quiz: `linked-list-cost-end`, `linked-list-cost-front`, `linked-list-cost-middle`, `linked-list-cost-lookup`, `linked-list-big-o`)
  3. Under the hood: nodes are objects ✅ (C1 under the hood: `linked-list-node`, `linked-list-nested`, `trace-ll-walk`)
  4. The constructor ✅ (C1 constructor, in 5 steps: `linked-list-node-class`, `linked-list-constructor-examples`, `linked-list-constructor-plan`, `trace-ll-constructor`, `five-steps-look-back`)
  5. push ✅ (C1 push, in 5 steps: `linked-list-push`, `linked-list-push-examples`, `linked-list-push-plan`, `trace-ll-push`)
  6. pop ✅ (C1 pop intro + pop code: `linked-list-pop`, `linked-list-pop-examples`, `linked-list-pop-plan`, `trace-ll-pop`)
  7. unshift ✅ (C1 unshift: `linked-list-unshift`, `linked-list-unshift-examples`, `linked-list-unshift-plan`, `trace-ll-unshift`)
  8. shift ✅ (C1 shift: `linked-list-shift`, `linked-list-shift-examples`, `linked-list-shift-plan`, `trace-ll-shift`)
  9. get ✅ (C1 get: `linked-list-get`, `linked-list-get-examples`, `linked-list-get-plan`, `trace-ll-get`)
  10. set ✅ (C1 set: `linked-list-set`, `linked-list-set-examples`, `linked-list-set-plan`, `trace-ll-set`)
  11. insert ✅ (C1 insert: `linked-list-insert`, `linked-list-insert-examples`, `linked-list-insert-plan`, `trace-ll-insert`)
  12. remove ✅ (C1 remove: `linked-list-remove`, `linked-list-remove-examples`, `linked-list-remove-plan`, `trace-ll-remove`)
  13. reverse ✅ (C1 reverse: `linked-list-reverse`, `linked-list-reverse-examples`, `linked-list-reverse-plan`, `trace-ll-reverse`; the diagram draws the nodes where they stand, so the gap shows)
- **Quiz:** Big O of each operation vs. arrays, why pop is O(n), what `head`/`tail`/`length` hold, nodes as nested objects, the walk, the constructor (the empty start, and `0` as a value), push on an empty list and `return this`, pop's one-node case and empty return, unshift's order, why shift cuts the returned node loose, get's last index, set reusing get, insert at `length` and its double-counting bug, remove's `before.next`, and why reverse saves `next` first.
- **Build it (class `LinkedList`):** ✅ constructor (Start the Conga Line) · ✅ push (Join at the Back) · ✅ pop (Leave from the Back) · ✅ unshift (Join at the Front) · ✅ shift (Leave from the Front) · ✅ get (Who Is Third in Line?) · ✅ set (Fix the Name Tag) · ✅ insert (Squeeze Into the Line) · ✅ remove (Leave From the Middle) · ✅ reverse (Turn the Line Around)
- **Interview problems** (with course 1's Section 5, the linked list LeetCode exercises): Middle Node · Has Cycle · K-th Node From the End · Remove Duplicates · Binary List to Number · Partition Around a Value · Reverse a Sublist · Swap Pairs · Rotate the List

## Doubly Linked Lists (`doubly-linked-lists`)

**Status:** ⬜
**Goal:** add `prev` pointers and see which operations become faster.

- **Lessons:** Why a second pointer? · constructor · push · pop · unshift · shift · get (from the closer end) · set · insert · remove · Singly vs. doubly linked lists
- **Animations:** `dll-pop`, `dll-get-closer-end`, `dll-insert`, `dll-remove`
- **Quiz:** what changes vs. a singly linked list, pop in O(1), memory trade-off.
- **Build it (class `DoublyLinkedList`):** constructor · push · pop · unshift · shift · get · set · insert · remove
- **Interview problems:** Is Palindrome · Reverse · Partition Around a Value · Reverse a Sublist · Swap Pairs

## Stacks & Queues (`stacks-and-queues`)

**Status:** ⬜
**Goal:** model "last in, first out" and "first in, first out" and know when to use each.

- **Lessons:** What is a stack? · A stack with an array · A stack from scratch · Stack Big O · What is a queue? · A queue with an array (and its hidden cost) · A queue from scratch · Queue Big O
- **Animations:** `stack-push-pop`, `queue-enqueue-dequeue`
- **Quiz:** LIFO vs. FIFO, which end to use for O(1), real-world uses.
- **Build it:** `Stack` push · pop · `Queue` enqueue · dequeue
- **Interview problems:** Reverse a String With a Stack · Balanced Brackets · Sort a Stack · Queue From Two Stacks · Stack From Two Queues

## Binary Search Trees (`binary-search-trees`)

**Status:** ⬜
**Goal:** understand tree vocabulary and build a binary search tree, iteratively and recursively.

- **Lessons:** Trees and their vocabulary · Where trees are used · Binary trees and binary search trees · Searching a BST · The constructor · insert · contains · BST Big O (balanced vs. unbalanced) · Recursive insert and contains · Deleting a node: the three cases
- **Animations:** `bst-insert`, `bst-contains`, `bst-delete-cases`
- **Quiz:** root/leaf/parent/child, the BST rule, O(log n) vs. O(n), the three delete cases.
- **Build it (class `BST`):** insert · contains · rInsert · rContains · minValue · remove
- **Interview problems:** Minimum and Maximum Value · Count the Nodes · Second Largest Value · Is Balanced

## Tree Traversal (`tree-traversal`)

**Status:** ⬜
**Goal:** visit every node of a tree in different orders, and pick the right one.

- **Lessons:** Why traversal orders matter · Breadth-first search (BFS) · Depth-first: pre-order · Depth-first: post-order · Depth-first: in-order · When to use BFS vs. DFS
- **Animations:** `tree-bfs`, `tree-dfs-preorder`, `tree-dfs-postorder`, `tree-dfs-inorder`
- **Quiz:** queue vs. call stack, which order gives sorted output, space trade-offs.
- **Build it:** BFS · DFS pre-order · DFS post-order · DFS in-order
- **Interview problems:** Maximum Depth · Average of Each Level

## Heaps & Priority Queues (`heaps-and-priority-queues`)

**Status:** ⬜
**Goal:** keep the largest (or smallest) item ready in O(1) and update it in O(log n).

- **Lessons:** What is a heap? · Storing a heap in an array · insert (bubble up) · Removing the max (sink down) · Priority queues · Heap Big O
- **Animations:** `heap-insert`, `heap-remove`
- **Quiz:** the heap property, array indexes, Big O of insert/remove/peek.
- **Build it:** `MaxHeap` insert · extractMax · `PriorityQueue` enqueue · dequeue
- **Interview problems:** K-th Smallest Element · Running Maximum

## Hash Tables (`hash-tables`)

**Status:** ⬜
**Goal:** store and find data in O(1) on average, and use hashing to speed up problems.

- **Lessons:** What is a hash table? · Hash functions (and how to improve one) · Collisions: separate chaining and linear probing · set · get · keys and values · Hash table Big O · The "trade memory for speed" pattern · Sets
- **Animations:** `hash-table-set`, `hash-collision`
- **Quiz:** what a hash function does, collisions, average vs. worst case, `Set` vs. `Map`.
- **Build it (class `HashTable`):** hash · set · get · keys · values
- **Interview problems:** Items in Common · Find Duplicates · First Unique Character · Group Anagrams · Two Sum · Subarray Sum Equals Target · Has Unique Characters · Pairs With a Target Sum · Longest Consecutive Run

## Graphs (`graphs`)

**Status:** ⬜
**Goal:** represent connections between things and edit a graph.

- **Lessons:** What is a graph? · Where graphs are used · Types of graphs (directed, undirected, weighted) · Adjacency matrix · Adjacency list · Matrix vs. list Big O · Adding vertices and edges · Removing edges and vertices
- **Animations:** `graph-adjacency-list`, `graph-remove-vertex`
- **Quiz:** graph types, matrix vs. list space and time, removing a vertex.
- **Build it (class `Graph`, adjacency list):** addVertex · addEdge · removeEdge · removeVertex
- **Interview problems:** Vertex Degree

---

# Section 5 · Graph Algorithms

## Graph Traversal (`graph-traversal`)

**Status:** ⬜
**Goal:** visit every vertex reachable from a starting point, depth-first and breadth-first.

- **Lessons:** Why traverse a graph? · Depth-first, recursively · Depth-first, with your own stack · Breadth-first with a queue · BFS vs. DFS on graphs
- **Animations:** `graph-dfs`, `graph-bfs`
- **Quiz:** visited sets, stack vs. queue, the order vertices are visited.
- **Build it:** dfsRecursive · dfsIterative · bfs
- **Interview problems:** Has a Path Between Two Vertices · Count Connected Groups

## Dijkstra's Shortest Path (`dijkstra`)

**Status:** ⬜
**Goal:** find the shortest path in a weighted graph.

- **Lessons:** What problem does Dijkstra solve? · A weighted graph · Walking through the algorithm (`dijkstra-walkthrough`) · A simple priority queue · Writing Dijkstra's algorithm · Making it faster with a heap
- **Quiz:** the distances table, the previous table, why a priority queue, Big O.
- **Build it:** `WeightedGraph` addEdge · shortestPath (returns the path)
- **Interview problems:** Shortest Travel Time (returns the total distance)

---

# Section 6 · Dynamic Programming

## Dynamic Programming (`dynamic-programming`)

**Status:** ⬜
**Goal:** solve big problems by reusing the answers to smaller ones.

- **Lessons:** Overlapping subproblems · Optimal substructure · Fibonacci the slow way (`fibonacci-call-tree`) · Its Big O · Memoization (top-down) · Tabulation (bottom-up) · Greedy vs. dynamic programming: making change
- **Quiz:** spotting repeated work, memo vs. table, Big O before and after, when greedy fails.
- **Build it:** Fibonacci With Memoization · Bottom-Up Fibonacci
- **Interview problems:** Climbing Stairs · Fewest Coins · Ways to Make Change · Greedy Coins (and why it can fail)

---

# Section 7 · Interview Practice

## Array Interview Problems (`array-interview-problems`)

**Status:** ⬜
**Goal:** practice the array patterns interviews ask for most.

- **Lessons:** Picking the right pattern for an array problem
- **Quiz:** picking the pattern, in-place vs. extra space.
- **Build it:** none.
- **Interview problems:** Remove an Element In Place · Maximum and Minimum · Longest String · Remove Duplicates From a Sorted Array · Best Time to Buy and Sell · Rotate an Array · Maximum Subarray Sum
