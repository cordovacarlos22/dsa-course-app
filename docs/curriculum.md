# Course blueprint: DSA in JavaScript

This is the plan for the whole course: what each module teaches and what students practice. Agents and Carlos use it to write lessons, quizzes, exercises and slides **in order**. Update a module's **Status** whenever its content is merged.

## Principles

1. **Our own material.** The course combines the topic order of two popular DSA courses that Carlos took. Their lessons, slides, exercises, starter files, solutions, quizzes and wording are **examples of structure only and are never copied, edited or reused**. Every lesson, slide, explanation, example, problem statement, test and solution in this app is written from scratch.
2. **Algorithms first.** Students learn to measure code (Big O), then a method and patterns for solving problems, then searching and sorting, and only then build data structures, graph algorithms and dynamic programming.
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

| Section                | Modules                                                                                                                                      |
| ---------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| 1. Foundations         | Introduction · Big O · Big O of Arrays & Objects · Classes & Pointers                                                                        |
| 2. Problem Solving     | A Problem-Solving Approach · Problem-Solving Patterns · Recursion                                                                            |
| 3. Searching & Sorting | Searching Algorithms · Basic Sorts · Merge Sort · Quick Sort · Radix Sort                                                                    |
| 4. Data Structures     | Linked Lists · Doubly Linked Lists · Stacks & Queues · Binary Search Trees · Tree Traversal · Heaps & Priority Queues · Hash Tables · Graphs |
| 5. Graph Algorithms    | Graph Traversal · Dijkstra's Shortest Path                                                                                                   |
| 6. Dynamic Programming | Dynamic Programming                                                                                                                          |
| 7. Interview Practice  | Array Interview Problems                                                                                                                     |

Planned practice: about **155 exercises** (70 build it, 86 interview problems), 24 quizzes and 24 slide decks. Module slugs are English names without numbers; the order lives in `content/course.json`.

---

# Section 1 · Foundations

## Introduction (`introduction`)

**Status:** ✅ 3 lessons (EN + ES) · ✅ quiz (EN + ES) · ⬜ slides
**Goal:** know what the course covers, how to study, and how to run code in the app.

- **Lessons:** Welcome to the course · How to get the most out of this course · Running code in this course
- **Quiz:** Big O as the language of efficiency, why classes and pointers matter, `head`/`tail` are pointers, practice routine, running code, infinite-loop protection.
- **Practice:** none.

## Big O (`big-o`)

**Status:** ✅ 12 lessons (EN + ES) · ✅ quiz (EN + ES) · 🟡 3 of 4 interview problems · ⬜ slides
**Goal:** measure and compare the efficiency of code, in time and space.

- **Lessons:**
  1. What is Big O? ✅ (`big-o-growth-chart`)
  2. Why a stopwatch isn't enough: timing vs. counting operations ✅
  3. Best, average and worst case (Ω, Θ, O) ✅
  4. O(n): linear time ✅
  5. Dropping constants ✅
  6. O(n²): nested loops ✅
  7. Dropping non-dominant terms ✅
  8. O(1): constant time ✅
  9. Different inputs, different variables (O(a + b) vs. O(a · b)) ✅
  10. Space complexity ✅
  11. Logarithms and O(log n) ✅ (`binary-search-halving`)
  12. Wrap-up: comparing growth rates ✅ (`big-o-growth-chart`)
- **Quiz:** reading the Big O of code, simplification rules, Ω/Θ/O, space complexity, logarithms.
- **Build it:** none.
- **Interview problems:** ✅ Find the Maximum · ✅ Contains Duplicate · ✅ Binary Search · Count the Operations (predict the count, then check it)

## Big O of Arrays & Objects (`arrays-and-objects`)

**Status:** ⬜
**Goal:** know the cost of the built-in tools you use every day.

- **Lessons:** Objects: what's fast and what isn't · Object methods (keys, values, entries, hasOwnProperty) · When are arrays slow? (`array-reindex`) · Array methods and their Big O (push, pop, shift, unshift, slice, splice, sort, map, filter…)
- **Quiz:** Big O of object vs. array operations, why `shift` is O(n), the cost of `sort`.
- **Build it:** none.
- **Interview problems:** Word Frequency (counting with an object) · Last Item Wins (use only O(1) operations) · Pick the Faster Version (two solutions: choose and explain)

## Classes & Pointers (`classes-and-pointers`)

**Status:** ⬜ lessons · ✅ quiz (EN) · ✅ 1 build it · ⬜ slides
**Goal:** write classes and understand references, the two tools behind every data structure.

- **Lessons:** Classes: the blueprint for every data structure · Instance methods vs. static (class) methods · Pointers: values vs. references
- **Quiz:** `constructor`, `new`, `this`, getters/setters, static methods, copying values vs. sharing references, garbage collection.
- **Build it:** ✅ The Cookie Class · A `Counter` class (increment, decrement, reset) · A `Point` class with a static `distance` method
- **Interview problems:** none.

---

# Section 2 · Problem Solving

## A Problem-Solving Approach (`problem-solving-approach`)

**Status:** ⬜
**Goal:** have a repeatable method for any problem, even one you've never seen.

- **Lessons:**
  1. Why you need a method
  2. Step 1: Understand the problem (inputs, outputs, edge cases, asking questions)
  3. Step 2: Make concrete examples
  4. Step 3: Break it down (write the steps before the code)
  5. Step 4: Solve it, or solve a simpler version first
  6. Step 5: Look back and improve
  7. Using the method in an interview
- **Quiz:** what each step is for, what to ask an interviewer, when to simplify.
- **Build it:** none.
- **Interview problems:** Count the Vowels · Character Counter · Title Case (each solved by following the 5 steps)

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

## Linked Lists (`linked-lists`)

**Status:** ⬜
**Goal:** build a singly linked list from scratch and solve classic pointer problems.

- **Lessons:** What is a linked list? · Linked lists vs. arrays in Big O · Nodes and pointers under the hood · The constructor · push · pop · unshift · shift · get · set · insert · remove · reverse
- **Animations:** `linked-list-push`, `linked-list-pop`, `linked-list-unshift`, `linked-list-shift`, `linked-list-insert`, `linked-list-remove`, `linked-list-reverse`
- **Quiz:** Big O of each operation vs. arrays, why pop is O(n), what `head`/`tail`/`length` hold.
- **Build it (class `LinkedList`):** constructor · push · pop · unshift · shift · get · set · insert · remove · reverse
- **Interview problems:** Middle Node · Has Cycle · K-th Node From the End · Remove Duplicates · Binary List to Number · Partition Around a Value · Reverse a Sublist · Swap Pairs · Rotate the List

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
