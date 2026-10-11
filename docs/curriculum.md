# Course blueprint: DSA in JavaScript

This is the plan for the whole course: what each module teaches and what students practice. Agents and Carlos use it to write lessons, quizzes and exercises **in order**. Update the **Status** of a module whenever its content is merged.

## Principles

1. **Our own material.** The course's structure is inspired by the topic order of a popular DSA course (lessons → quiz → build it → interview problems). That course's lessons, exercises, starter files, solutions and wording are **examples only and are never copied**. Every lesson, explanation, example, problem statement, test and solution in this app is written from scratch.
2. **One module = one topic**, always in the same rhythm:
   1. **Lessons:** short explanations, step-by-step animations and runnable code.
   2. **Quiz:** checks understanding, with an explanation for every answer.
   3. **Build it:** implement the data structure or algorithm yourself, one method at a time (`category: "build"`).
   4. **Interview problems:** LeetCode-style problems that use the topic (`category: "interview"`).
3. **Difficulty mix:** mostly easy and medium, with a few hard problems at the end of a module. Every exercise has at least 5 tests, including edge cases (empty input, one item, duplicates, negatives, not found).
4. **Problem names** use the classic, generic names of well-known problems (e.g. "Two Sum", "Balanced Brackets"), because the problems themselves belong to no one. **Statements, examples, tests and solutions are always ours.**
5. **English and Spanish.** Lessons and quizzes are written in both languages (see `AGENTS.md` for the Spanish terms).
6. **Animations** are named in `kebab-case` (e.g. `linked-list-push`) and built with `StepPlayer` when the lesson needs them.

## Parts and modules

| Part                   | Modules                                                                                                          |
| ---------------------- | ---------------------------------------------------------------------------------------------------------------- |
| 1. Foundations         | 01 Introduction · 02 Big O · 03 Classes & Pointers                                                               |
| 2. Data Structures     | 04 Linked Lists · 05 Doubly Linked Lists · 06 Stacks & Queues · 07 Trees · 08 Hash Tables · 09 Graphs · 10 Heaps |
| 3. Recursion & Trees   | 11 Recursion · 12 Recursive Binary Search Tree · 13 Tree Traversal                                               |
| 4. Sorting             | 14 Basic Sorts · 15 Merge Sort · 16 Quick Sort                                                                   |
| 5. Dynamic Programming | 17 Dynamic Programming                                                                                           |
| 6. Interview Practice  | 18 Array Interview Problems                                                                                      |

Planned practice: about **110 exercises** (57 build it, 52 interview problems) and 18 quizzes (one per module).

---

## 01 · Introduction

**Status:** ✅ lessons (EN + ES) · ✅ quiz (EN + ES)
**Goal:** know what the course covers, how to study, and how to run code in the app.

- **Lessons:** Welcome to the course · How to get the most out of this course · Running code in this course
- **Quiz:** Big O as the language of efficiency, why classes and pointers come early, `head`/`tail` are pointers, practice routine, running code, infinite-loop protection.
- **Practice:** none.

## 02 · Big O

**Status:** 🟡 1 of 11 lessons (EN) · ✅ quiz (EN + ES) · ✅ 3 interview problems
**Goal:** measure and compare the efficiency of code, in time and space.

- **Lessons:**
  1. What is Big O? ✅ (`big-o-growth-chart`)
  2. Best, average and worst case (Ω, Θ, O)
  3. O(n): linear time
  4. Dropping constants
  5. O(n²): nested loops
  6. Dropping non-dominant terms
  7. O(1): constant time
  8. O(log n): divide and conquer (`binary-search-halving`)
  9. Different inputs, different variables (O(a + b) vs O(a · b))
  10. The Big O of array operations (`array-reindex`)
  11. Wrap-up: comparing growth rates
- **Quiz:** reading the Big O of code, simplification rules, Ω/Θ/O, log n, array operations.
- **Build it:** none (Big O is a way of thinking, not a data structure).
- **Interview problems:** ✅ Find the Maximum (O(n)) · ✅ Contains Duplicate (O(n²) → O(n)) · ✅ Binary Search (O(log n))

## 03 · Classes & Pointers

**Status:** ⬜ lessons · ✅ quiz (EN) · ✅ 1 build it
**Goal:** write classes and understand references, the two tools behind every data structure.

- **Lessons:** Classes: the blueprint for every data structure · Pointers: values vs. references
- **Quiz:** classes, `constructor`, `new`, `this`, getters/setters, copying values vs. sharing references, reassigning pointers, garbage collection.
- **Build it:** ✅ The Cookie Class · A `Counter` class (increment, decrement, reset)
- **Interview problems:** none.

## 04 · Linked Lists

**Status:** ⬜
**Goal:** build a singly linked list from scratch and solve classic pointer problems.

- **Lessons:** What is a linked list? · Linked lists vs. arrays in Big O · Nodes and pointers under the hood · The constructor · push · pop · unshift · shift · get · set · insert · remove · reverse
- **Animations:** `linked-list-push`, `linked-list-pop`, `linked-list-unshift`, `linked-list-shift`, `linked-list-insert`, `linked-list-remove`, `linked-list-reverse`
- **Quiz:** Big O of each operation vs. arrays, why pop is O(n), what `head`/`tail`/`length` hold.
- **Build it (class `LinkedList`):** constructor · push · pop · unshift · shift · get · set · insert · remove · reverse
- **Interview problems:**
  - Middle Node: two pointers moving at different speeds
  - Has Cycle: detect a loop without extra memory
  - K-th Node From the End: keep a fixed gap between two pointers
  - Remove Duplicates: a Set to remember values already seen
  - Binary List to Number: walk the list and build a number
  - Partition Around a Value: rebuild a list from two sublists
  - Reverse a Sublist: reverse only positions `m` to `n`
  - Swap Pairs: relink nodes two at a time

## 05 · Doubly Linked Lists

**Status:** ⬜
**Goal:** add `prev` pointers and see which operations become faster.

- **Lessons:** Why a second pointer? · constructor · push · pop · unshift · shift · get (from the closer end) · set · insert · remove
- **Animations:** `dll-pop`, `dll-get-closer-end`, `dll-insert`, `dll-remove`
- **Quiz:** what changes vs. a singly linked list, pop in O(1), memory trade-off.
- **Build it (class `DoublyLinkedList`):** constructor · push · pop · unshift · shift · get · set · insert · remove
- **Interview problems:** Is Palindrome (walk inward from both ends) · Reverse (swap `next`/`prev`) · Partition Around a Value · Reverse a Sublist · Swap Pairs

## 06 · Stacks & Queues

**Status:** ⬜
**Goal:** model "last in, first out" and "first in, first out" and know when to use each.

- **Lessons:** What is a stack? · Building a stack · push and pop · What is a queue? · Building a queue · enqueue and dequeue
- **Animations:** `stack-push-pop`, `queue-enqueue-dequeue`
- **Quiz:** LIFO vs. FIFO, which end to use for O(1), real-world uses.
- **Build it:** `Stack` constructor · push · pop · `Queue` constructor · enqueue · dequeue
- **Interview problems:** Stack With an Array · Reverse a String With a Stack · Balanced Brackets · Sort a Stack (using one extra stack) · Queue From Two Stacks

## 07 · Trees

**Status:** ⬜
**Goal:** understand tree vocabulary and build a binary search tree.

- **Lessons:** Trees and their vocabulary · Binary search trees · BST Big O (balanced vs. unbalanced) · The constructor · insert · contains
- **Animations:** `bst-insert`, `bst-contains`
- **Quiz:** root/leaf/parent/child, the BST rule, O(log n) vs. O(n) when unbalanced.
- **Build it (class `BST`):** constructor · insert · contains
- **Interview problems:** Minimum and Maximum Value · Count the Nodes

## 08 · Hash Tables (and Sets)

**Status:** ⬜
**Goal:** store and find data in O(1) on average, and use hashing to speed up problems.

- **Lessons:** What is a hash table? · Hash functions · Collisions · The constructor · set · get · keys · Hash table Big O · The "trade memory for speed" pattern · Sets
- **Animations:** `hash-table-set`, `hash-collision`
- **Quiz:** what a hash function does, collisions and separate chaining, average vs. worst case, `Set` vs. `Map`.
- **Build it (class `HashTable`):** constructor · set · get · keys
- **Interview problems:**
  - Items in Common: two arrays, one hash lookup
  - Find Duplicates: counting with a hash map
  - First Unique Character
  - Group Anagrams: a sorted key per word
  - Two Sum
  - Subarray Sum Equals Target: running sums
  - Remove Duplicates With a Set
  - Has Unique Characters
  - Pairs With a Target Sum (two arrays)
  - Longest Consecutive Run

## 09 · Graphs

**Status:** ⬜
**Goal:** represent connections between things and edit a graph.

- **Lessons:** What is a graph? · Adjacency matrix · Adjacency list · Graph Big O · Adding vertices and edges · Removing edges and vertices
- **Animations:** `graph-adjacency-list`, `graph-remove-vertex`
- **Quiz:** directed/undirected/weighted, matrix vs. list space, removing a vertex.
- **Build it (class `Graph`, adjacency list):** addVertex · addEdge · removeEdge · removeVertex
- **Interview problems:** Vertex Degree

## 10 · Heaps

**Status:** ⬜
**Goal:** keep the largest (or smallest) item ready in O(1) and update in O(log n).

- **Lessons:** What is a heap? · Storing a heap in an array · Helper methods (parent, left, right, swap) · insert (bubble up) · remove (sink down) · Priority queues and heap Big O
- **Animations:** `heap-insert`, `heap-remove`
- **Quiz:** the heap property, array indexes, Big O of insert/remove/peek.
- **Build it (class `MaxHeap`):** insert · remove
- **Interview problems:** K-th Smallest Element · Running Maximum

## 11 · Recursion

**Status:** ⬜
**Goal:** think recursively and follow the call stack.

- **Lessons:** What is recursion? · The call stack · Factorial, step by step
- **Animations:** `call-stack`
- **Quiz:** base case, recursive case, stack overflow, the order calls finish.
- **Build it:** none.
- **Interview problems:** Factorial · Power (xⁿ) · Reverse a String Recursively

## 12 · Recursive Binary Search Tree

**Status:** ⬜
**Goal:** rewrite BST methods recursively, including the tricky delete.

- **Lessons:** contains, recursively · insert, recursively · Deleting a node: the three cases · Finding the minimum value · Delete, step by step
- **Animations:** `bst-delete-cases`
- **Quiz:** the three delete cases, why the minimum of the right subtree.
- **Build it:** rContains · rInsert · minValue · deleteNode
- **Interview problems:** none (covered by Build it and module 13).

## 13 · Tree Traversal

**Status:** ⬜
**Goal:** visit every node of a tree in different orders.

- **Lessons:** Why traversal orders matter · Breadth-first search (BFS) · Depth-first: pre-order · Depth-first: post-order · Depth-first: in-order
- **Animations:** `tree-bfs`, `tree-dfs-preorder`, `tree-dfs-postorder`, `tree-dfs-inorder`
- **Quiz:** queue vs. call stack, which order gives sorted output, uses of each order.
- **Build it:** BFS · DFS pre-order · DFS post-order · DFS in-order
- **Interview problems:** Maximum Depth · Average of Each Level

## 14 · Basic Sorts

**Status:** ⬜
**Goal:** understand the three simple sorts and when they're good enough.

- **Lessons:** Bubble sort · Selection sort · Insertion sort · Basic sorts Big O (and why insertion sort shines on almost-sorted data)
- **Animations:** `bubble-sort`, `selection-sort`, `insertion-sort`
- **Quiz:** how each one works, best/worst cases, space usage.
- **Build it:** bubbleSort · selectionSort · insertionSort
- **Interview problems:** Sort a Linked List (with any basic sort)

## 15 · Merge Sort

**Status:** ⬜
**Goal:** split, sort and merge: O(n log n).

- **Lessons:** Divide and conquer, again · Merging two sorted arrays · Merge sort · Merge sort Big O
- **Animations:** `merge-two-arrays`, `merge-sort`
- **Quiz:** why log n levels, the cost of merging, extra space.
- **Build it:** merge · mergeSort
- **Interview problems:** Merge Two Sorted Linked Lists

## 16 · Quick Sort

**Status:** ⬜
**Goal:** sort in place around a pivot.

- **Lessons:** The idea of quick sort · The pivot step · Quick sort · Quick sort Big O (and its worst case)
- **Animations:** `quick-sort-pivot`
- **Quiz:** what the pivot does, sorted input as the worst case, in-place sorting.
- **Build it:** pivot · quickSort
- **Interview problems:** none.

## 17 · Dynamic Programming

**Status:** ⬜
**Goal:** solve big problems by reusing the answers to smaller ones.

- **Lessons:** Overlapping subproblems · Optimal substructure · Fibonacci the slow way · Memoization (top-down) · Tabulation (bottom-up)
- **Animations:** `fibonacci-call-tree`
- **Quiz:** spotting repeated work, memo vs. table, Big O before and after.
- **Build it:** Fibonacci With Memoization · Bottom-Up Fibonacci
- **Interview problems:** Climbing Stairs · Fewest Coins

## 18 · Array Interview Problems

**Status:** ⬜
**Goal:** practice the array patterns interviews ask for most.

- **Lessons:** Common array patterns: two pointers, sliding window, running best
- **Quiz:** picking the pattern, in-place vs. extra space.
- **Build it:** none.
- **Interview problems:** Remove an Element In Place · Maximum and Minimum · Longest String · Remove Duplicates From a Sorted Array · Best Time to Buy and Sell · Rotate an Array · Maximum Subarray Sum
