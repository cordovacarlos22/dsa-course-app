---
title: Welcome to the course
order: 1
minutes: 8
---

> **Goal:** know what data structures and algorithms are, how each lesson works, and what you'll be able to do at the end.

## Who this course is for

Data structures and algorithms, or **DSA** for short, are the toolbox every programmer reaches for, whether they know it or not. A **data structure** is a way of organizing data so that some jobs on it are fast: an array keeps items in order, an object finds a value by its key, and a linked list (which you'll build yourself) makes adding at the front cheap. An **algorithm** is a list of steps that gets a job done: checking whether a name is on a list, sorting the list, or finding the shortest route between two places on a map.

You already use both every day. The contacts app searches a list as you type, a music app sorts songs by title, and a map app runs a shortest-path algorithm every time you ask for directions. Knowing how these tools work, and what each one costs, is what lets you pick the right one instead of the first one you think of. It's also exactly what **coding interviews** test.

This course is for you if:

- you learned to code on your own and never had a formal CS class,
- you're a computer science student who wants DSA to finally _click_,
- you're switching careers into tech and need strong fundamentals, fast,
- or you have a coding interview coming up and want to walk in confident.

All you need is basic JavaScript: variables, functions, loops and arrays. We'll cover classes together in the Classes & Pointers module, right before you build your first data structure.

Here's a tiny example of both ideas at once. The array is the data structure; the loop that finds the longest name is the algorithm. Press **Run**:

```js-run
const guests = ['Ana', 'Ben', 'Cleo', 'Dev'] // a data structure: an array

// an algorithm: the steps to find the longest name
let longest = guests[0]
for (let i = 1; i < guests.length; i++) {
  if (guests[i].length > longest.length) {
    longest = guests[i]
  }
}
console.log('The longest name is', longest)
```

Those four guests will show up a lot. Most of the course's examples happen at a party: a guest list, a line at the door, name tags. One story makes it easier to focus on the new idea instead of a new example.

**Common mistake:** thinking DSA is only for interviews, or only for "math people". It's for anyone who writes code that has to handle a lot of data, and the math you'll need fits on one page. Every idea is taught with small steps and pictures.

## How a lesson works

Every lesson is a short series of **steps**, and you move to the next one only after you've shown you understood this one. That's on purpose: reading something feels like learning, but **using** it right away (answering a question, writing a few lines) is what makes it stick. Each step follows the same order:

1. **The theory:** a few short paragraphs that explain the idea in plain language, with the key words in **bold**.
2. **An animation** you control step by step, so you can _see_ an algorithm move instead of imagining it.
3. **What just happened:** a walkthrough of what the animation showed.
4. **Code you can run** right here on the page.
5. **A common mistake** to watch out for, when the topic has one.
6. **A quick check at the end:** a question or a small coding task. The **Next** button unlocks when you pass it. Stuck? A wrong try shows a hint, and after 3 tries you can see the answer.

Here's an animation from the Big O module. Press the play button, or step through it with the arrows. Don't worry about the words in it yet; they'll make sense later:

```viz
search-cases
```

**What just happened:** the animation checked a guest list one name at a time, looking for a name. When the name was first, it took one check. When the name wasn't there at all, it had to check every guest. That difference, how much work the same code does for different inputs, is what the Big O module is all about.

Now let's try running code. Change the name and press **Run**:

```js-run
const name = 'Ada'
console.log('Hi ' + name + '! Welcome to the course.')
```

That's it: no setup, no installs. You'll write a lot of code like this.

After the lessons, each module has a **quiz** to check what you learned, plus **exercises** to practice: **Build it** exercises, where you write the module's data structure or algorithm yourself, and **Interview problems** in the style of LeetCode. You can time yourself on them, like in a real interview. Soon you'll also have an **AI tutor** to ask questions, get hints when you're stuck, and get feedback on your code.

**Common mistake:** pressing play on an animation and looking away. The animations go one small step at a time on purpose. Read each caption, and if something surprised you, go back a step and watch it again.

## The road ahead

The course starts with **algorithms and ways of thinking**, not with data structures. That might seem backwards, but it's what makes everything after it easier. Big O gives you the words to compare any two pieces of code. A problem-solving method gives you a plan when you see a problem you've never solved. Then, when you build a data structure, you already know how to judge it and how to attack its code.

Here's the map, in order:

| Section                 | What you'll learn                                                                                                                                   |
| ----------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Foundations**         | Big O (how to measure efficient code) and the Big O of arrays and objects                                                                           |
| **Problem solving**     | A 5-step method for any problem, common patterns (frequency counter, two pointers, sliding window, divide and conquer) and recursion                |
| **Searching & sorting** | Linear and binary search, then six sorts: bubble, selection, insertion, merge, quick and radix                                                      |
| **Data structures**     | Classes and pointers, then linked lists, doubly linked lists, stacks and queues, binary search trees, tree traversal, heaps, hash tables and graphs |
| **Graph algorithms**    | Visiting every node of a graph, and Dijkstra's shortest path                                                                                        |
| **Dynamic programming** | Solving big problems by reusing the answers to smaller ones                                                                                         |
| **Interview practice**  | The array problems interviews ask for most                                                                                                          |

It's a lot, and some topics look scary from far away. That's why every one of them is broken into small steps, with an animation whenever a picture helps more than words.

### By the end of the course

- You'll analyze the **time and space complexity** of any code with Big O.
- You'll have a **method** for solving problems you've never seen before.
- You'll **build** linked lists, stacks, queues, trees, hash tables, graphs and heaps from scratch.
- You'll **understand** sorting, recursion and dynamic programming instead of memorizing them.
- You'll **solve** LeetCode-style problems and explain your reasoning out loud in interviews.

**Common mistake:** jumping straight to the hardest topic because it's the one interviews mention most. Graphs and dynamic programming lean on everything before them: Big O, recursion, and the data structures. Going in order is the fast way.

## Meet your instructor

Hi, I'm Carlos! I'm a software engineer, and I learned all of this the long way: I earned my Computer Engineering degree while working full-time as a truck driver and driver trainer, studying between shifts. Training new drivers taught me that any hard skill becomes easy when you break it into small, clear steps. That's how every lesson here works, and I'll be with you the whole way.

I built this course the way I wish I had learned DSA: with pictures that move, code you can run without installing anything, and a check after every step so you always know where you stand. If something doesn't click, that's not a sign you're bad at this. It usually means a step was missing, so go back one step, replay the animation, and ask the tutor.

In short:

- **DSA** = data structures (ways to organize data) plus algorithms (steps that get a job done).
- Lessons are short steps: the theory, an animation, code you can run, and a check at the end of each step.
- Each module ends with a quiz and exercises: Build its and interview problems.
- We start with the foundations (Big O) and a method for solving problems, because everything else builds on them. Classes and pointers come right before the data structures that use them.

At the end of the module, the **Module 1 quiz** on the module page checks everything together.
