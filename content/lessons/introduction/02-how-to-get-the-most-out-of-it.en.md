---
title: Getting the most out of this course
order: 2
minutes: 12
---

> **Goal:** understand why the course starts with Big O, why classes and pointers come before the data structures, and build a study routine that works.

## "Can I skip straight to the code?"

Some people only want to write code and skip anything that sounds like theory. You can: the Data Structures section is right there in the course map. But two short topics make everything in it easier: **Big O**, which comes next, and **classes and pointers**, which open that section. This step is about the first one.

**Big O** is how programmers describe the **efficiency** of code. Not in seconds, which change from computer to computer, but in how the amount of work grows as the input grows. Here's a situation where that matters. You're building an app, and the most important thing it does is **remove the last item** from a list, thousands of times per second. You could store the list as a **singly linked list**, where each item only knows the item after it, or as a **doubly linked list**, where each item knows the one before it too. Which one should you pick?

The doubly linked list is _much_ faster at this exact job. The animation below shows why the singly linked list struggles. You don't need to understand every line yet; you'll build this in the Linked Lists module.

```viz
linked-list-cost-end
```

**What just happened:** adding Eve at the end took two moves, because `tail` already pointed at the last guest. But removing Eve meant moving `tail` back to Dev, and in a singly linked list nothing points back from Eve. So the code walked the whole line from the front to find the guest before the tail. With 4 guests that's a short walk; with 4,000 it's a long one. A doubly linked list would step back from the tail in one move. Big O is the language for exactly this difference: one version does the same small amount of work every time, the other does more work the longer the list gets.

Before you run the next box, make a guess: if a line of 400 guests takes 398 steps, how many steps will a line of 4,000 take? Then run it to see how the walk grows with the size of the list:

```js-run
// A singly linked list can only be walked forward, from the front.
// To remove the last guest, you first have to reach the guest before it.
const sizes = [4, 400, 4000]
for (let k = 0; k < sizes.length; k++) {
  let steps = 0
  for (let i = 0; i < sizes[k] - 2; i++) {
    steps++
  }
  console.log(sizes[k] + ' guests: ' + steps + ' steps to reach the second-to-last guest')
}
```

The walk is always 2 steps shorter than the line, so every extra guest adds one more step: the work grows **in step with** the length of the line. On a long line, those 2 steps stop mattering: 10 times the guests, about 10 times the steps (398 → 3,998). The doubly linked list does the same one move whether the line has 4 guests or 4 million. Saying "this one grows with the list, that one doesn't" precisely, and spotting it just by reading code, is what the Big O module teaches.

There are three reasons to learn Big O first:

1. **Every topic uses it.** For each data structure and algorithm in this course, we'll ask, "What's its Big O?", and the quizzes ask it too.
2. **It helps you choose.** Picking the right data structure for a job, like the linked list above, means comparing their Big O.
3. **Interviews always ask about it.** In a coding interview, you'll almost certainly be asked for the Big O of your solution.

Big O describes two kinds of cost. **Time complexity** is how the number of **operations** grows as the input grows. We count operations instead of seconds because the same code finishes sooner on a faster computer, but it still does exactly the same operations. **Space complexity** is how the **memory** the code needs grows. Sometimes you trade one for the other: a version that runs faster might need more memory. This course focuses mostly on time, but interviewers ask about both, so the Big O module teaches both.

**Common mistake:** skipping Big O because it has a little math in it. Every module after it uses Big O to explain _why_ one method is fast and another is slow. Without it, you'd have to memorize those answers instead of working them out.

## Why classes matter

Every data structure in this course is built as a **class**. A class is a blueprint: it describes the data each object holds and the **methods** (functions) that work with that data. A linked list, for example, is a `LinkedList` class with methods like `push` and `pop`, and every list you make with it gets those methods. So you need the basics of classes before you build one, and that's why the Data Structures section opens with a short Classes & Pointers module, just two lessons long.

Here's a sneak peek, so the word doesn't look scary when you meet it. Don't worry about every detail; the Classes & Pointers module explains each line. This class is a blueprint for the party's name tags. Every tag made from it holds a guest's name and has a `read` method:

```js-run
class NameTag {
  constructor(guest) {
    this.guest = guest
  }

  read() {
    return 'Hi, my name is ' + this.guest
  }
}

const tagForAna = new NameTag('Ana')
const tagForBen = new NameTag('Ben')
console.log(tagForAna.read())
console.log(tagForBen.read())
```

One blueprint, two tags. `new NameTag('Ana')` made one object from the blueprint, and `new NameTag('Ben')` made another. Each tag keeps its own name, and both got the same `read` method without writing it twice. A linked list works the same way: one `LinkedList` class, and every list you make with `new LinkedList(...)` gets `push`, `pop` and the rest.

**Common mistake:** thinking the class _is_ the object. The class is only the blueprint: nothing exists until `new` makes an object from it. `NameTag` doesn't have a guest; `tagForAna` does.

## Pointers, under the hood

**Pointers** are the other key idea, and they trip up a lot of people. When a variable holds an object, it doesn't hold a copy of the object: it holds a **reference**, an arrow to where the object lives. In this course we call a variable like that a **pointer**. Pointers can be moved to point at a different object, and two pointers can point at the same object.

That makes a variable that holds an object behave differently from one that holds a number. Copy a number into a second variable and you get a second, separate number. Copy an object variable and you get a second arrow to the **same** object, so a change made through one arrow shows up through the other. Watch both cases:

```viz
value-copy
```

**What just happened:** `let seats = guestCount` copied the 5 into `seats` at that moment, and nothing linked the two variables after that. When `guestCount` became 8, `seats` kept its own 5.

```viz
reference-copy
```

**What just happened:** `let sameCard = card` copied the arrow, not the object, so both variables pointed at the same object A. Changing `card.value` changed object A, and reading `sameCard.value` showed the change too: there was only ever one object.

Now try it with different values. Predict what this prints, then run it:

```js-run
// A number: the variable holds the value itself.
let seats = 10
let seatsLeft = seats // copies the number
seatsLeft = seatsLeft - 1
console.log('seats:', seats, '| seatsLeft:', seatsLeft)

// An object: the variable holds an arrow to the object.
const ana = { name: 'Ana', table: 1 }
const sameGuest = ana // copies the arrow, not the guest
sameGuest.table = 4
console.log('Ana sits at table', ana.table)
```

`seats` stayed 10, because `seatsLeft` got its own copy of the number. But `ana.table` became 4, even though the code only changed `sameGuest`. There was only ever **one** guest object, with two arrows pointing at it. Linked lists are built on exactly this: a node's `next` is an arrow to another node, and moving an arrow changes what the list looks like without copying anything.

**Common mistake:** expecting `const` to freeze an object. `const sameGuest = ana` means that arrow can't be moved to a different object, but the object it points at can still change. That's why `sameGuest.table = 4` worked.

## `head` and `tail` are pointers

A **linked list** is a chain of **nodes**. Each node is a small object that holds a `value` and a `next` pointer to the node after it, and the last node's `next` is `null`, which means "nothing comes after me". The list itself keeps two more pointers: `head`, which points to the first node, and `tail`, which points to the last one.

Here's where that matters. Look at the labels in this linked list:

```viz
linked-list-anatomy
```

**What just happened:** each box is a **node**, holding a value and a `next` pointer to the node after it. `head` and `tail` sat **above** the boxes, pointing down at the first and the last node. They aren't nodes themselves. They're variables that point to nodes.

Run this tiny example. We make one node, point `head` and `tail` at it, then add a second node to the end:

```js-run
const firstNode = { value: 4, next: null }
let head = firstNode
let tail = firstNode
console.log('Do head and tail point to the same node?', head === tail)

// Add a new node to the end of the chain:
const nodeToAdd = { value: 7, next: null }
tail.next = nodeToAdd // 1. the current last node points to the new one
tail = nodeToAdd // 2. tail moves to the new node

console.log('head points to the node with', head.value)
console.log('tail points to the node with', tail.value)
console.log('the node after head has', head.next.value)
```

Notice that `head` never moved: it still points to the first node. Only `tail` moved, because `tail` is a pointer, and pointers can be moved to a different node. You'll learn exactly how this works in the Classes & Pointers module.

**Common mistake:** looking at a linked list diagram and calling the first box "head" and the last box "tail". In fact, `head` and `tail` are **not** the boxes (the nodes). They are **variables that point to** nodes. It just happens that `head` points at the first one right now, and that can change.

## Your study routine

The fastest way to learn DSA is to **practice right after you learn**. Reading a solution feels like understanding it, but the real test is writing it yourself while the idea is still fresh. Each time you pull an idea back out of your memory, by answering a question or writing code, it gets easier to remember next time. That's why every step in this course ends with a check, and why each module ends with practice.

Everything happens right here in the browser, so there's nothing to download or set up. Here's the routine:

1. Read the lesson and play with every animation and code box. Change the code and run it again.
2. At the end of the module, take the **quiz** on the module page.
3. Then do the **exercises**. **Build it** exercises have you write the module's code yourself, one method or step at a time, and **Interview problems** use the topic on a LeetCode-style problem. Write the code yourself, even if it feels slow at first. Each exercise checks your code with tests, gives a hint after a failed try, and shows how long you took.

Each exercise comes with starter code, so you skip the setup and spend your time on the one idea the module taught. Do them as soon as you finish the module, not "later".

**Common mistake:** saving all the practice for the end of the course. A little practice after each module sticks much better than a lot of practice months later. And when you're stuck, try the hint before you reveal the answer: the struggle is part of how it sticks.

In short:

- **Big O** is how we compare code, in time (operations) and space (memory). Every topic uses it, it helps you choose data structures, and interviews ask about it.
- Every data structure is a **class**: a blueprint, and `new` makes objects from it.
- A variable that holds an object is a **pointer**: copying it copies the arrow, not the object.
- `head` and `tail` are **pointers** to nodes, not the nodes themselves.
- Practice right after each module: the quiz, then the exercises.

When you finish this module, the **Module 1 quiz** is waiting on the module page.
