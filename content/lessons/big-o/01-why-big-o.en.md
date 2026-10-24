---
title: Why Big O?
order: 1
minutes: 12
---

> **Goal:** understand why we need a way to compare code, and what this module will teach you.

## Big O is a big deal

Welcome to the first big topic of the course: **Big O notation**. It's "big" because of how much it matters, not because it's long or hard. Almost every lesson after this module comes back to it: every data structure and every algorithm we build gets a Big O label, so this is the framework we'll use to talk about code for the rest of the course.

In one sentence, **Big O** describes **how the work a piece of code does grows as its input grows**. Not how many seconds it takes on your laptop, but the _shape_ of the growth: does the work stay the same when the input doubles, double with it, or explode? That shape is what lets you compare two solutions before you've even run them.

A quick, friendly warning: there's a little bit of math in this module, and a word you may not have heard in years (or ever): **logarithm**. Don't panic, and push through. The math is only here to give us a shared language. The rest of the course is not this mathy.

By the end of this module you'll be able to:

- explain **why** we need something like Big O,
- describe **what** Big O is,
- **simplify** Big O expressions,
- define **time complexity** and **space complexity**,
- find the time and space complexity of a piece of code,
- explain what a **logarithm** is.

Here's a preview of where we're going:

```viz
big-o-growth-chart
```

**What just happened:** each line on the chart is a different way the work can grow as the input grows. The flat line never grows, the straight line grows evenly, and the steep curve shoots up so fast it leaves the others behind. By the end of this module, you'll know each one by name and be able to tell which one a piece of code follows.

Numbers make the difference clear. Run this to compare work that grows like n with work that grows like n × n:

```js-run
const sizes = [10, 100, 1000]
for (let i = 0; i < sizes.length; i++) {
  const n = sizes[i]
  console.log('n =', n, '| n steps:', n, '| n × n steps:', n * n)
}
```

**Common mistake:** trying to memorize the shapes before understanding them. You won't need flashcards. Each shape gets its own lesson, with code you can run, and by the end you'll be able to work them out on your own.

## Many ways to solve the same problem

For almost every problem in this course there are many working solutions: not just different variable names or a `while` loop instead of a `for` loop, but completely different approaches. Take "reverse a string". One solution walks the string backwards with a loop and builds a new string one letter at a time. Another uses no loop of its own at all: it splits the string into letters, reverses them with a built-in method, and joins them back. People have posted ten or more different ways to reverse a string in JavaScript. They all work. So which one is **best**?

That's the question Big O answers. It's a system for **comparing** code: for talking about how one solution performs next to another, using the same words every time.

Here's the same situation with our party. You're at the door with the guest list, and `isInvited` checks the names one by one, stopping as soon as it finds the name:

```viz
trace-is-invited
```

**What just happened:** try the three names at the top. Finding 'Ana' takes 1 check, 'Dev' takes 4, and 'Zoe', who isn't on the list, takes all 6. Keep an eye on that counter: it's the amount of work the code did. The same function did very different amounts of work depending on its input.

Here are the two ways to reverse a string from the start of this step. Press **Run**:

```js-run
function reverseWithLoop(text) {
  let reversed = ''
  for (let i = text.length - 1; i >= 0; i--) {
    reversed = reversed + text[i]
  }
  return reversed
}

function reverseWithMethods(text) {
  return text.split('').reverse().join('')
}

console.log(reverseWithLoop('hello'), reverseWithMethods('hello'))
```

**Under the hood:** `reverseWithMethods` looks like one step, but it's three trips over the letters. `split('')` walks the text and builds an array with one item per letter. `reverse()` walks that array, swapping letters from the two ends toward the middle. And `join('')` walks it once more to glue the letters into a new text. That's three hidden loops, and each one grows with the length of the text. Built-in methods aren't magic: someone wrote the loop for you.

**Common mistake:** judging code by how short it is. `reverseWithMethods` is one line, but `split`, `reverse` and `join` each go through every letter behind the scenes. Fewer lines doesn't mean less work.

## A version that never stops early

Two pieces of code can give exactly the same answers and still do very different amounts of work. That's the case with the next function. It answers the same question as `isInvited`, "is this name on the list?", but it never stops early: even after it finds the name, it keeps reading to the end of the list.

How would you explain which one is better, without saying "it feels faster"? Instead of vague words like "great" or "awful", we want a **label**: a number-like rating we can compare, the way a car's fuel label lets you compare cars without driving them. That label is Big O. Here's the second version:

```viz
trace-is-invited-all
```

**What just happened:** `isInvitedAll` set `found = true` when it saw the name… and then kept reading anyway. Pick **find 'Ana'**: Ana is the very first guest, and the code still checks all 6 names. `isInvited` would have stopped after one check.

Before you run it, predict: how many checks will each version make for 'Ana', who's first in line? And for 'Zoe', who isn't on the list? Then run both versions side by side. Each one counts its checks as it goes:

```js-run
const guests = ['Ana', 'Ben', 'Cleo', 'Dev', 'Eli', 'Fay']

function isInvited(name) {
  let checks = 0
  for (let i = 0; i < guests.length; i++) {
    checks++
    if (guests[i] === name) {
      return 'found after ' + checks + ' checks'
    }
  }
  return 'not found after ' + checks + ' checks'
}

function isInvitedAll(name) {
  let checks = 0
  let found = false
  for (let i = 0; i < guests.length; i++) {
    checks++
    if (guests[i] === name) {
      found = true
    }
  }
  if (found) {
    return 'found after ' + checks + ' checks'
  }
  return 'not found after ' + checks + ' checks'
}

console.log('isInvited:   ', isInvited('Ana'))
console.log('isInvitedAll:', isInvitedAll('Ana'))
console.log('isInvited:   ', isInvited('Zoe'))
console.log('isInvitedAll:', isInvitedAll('Zoe'))
```

For 'Ana', it's 1 check against 6: `isInvited` stopped as soon as it could. For 'Zoe', both made 6 checks, because when the name isn't there, even the version that stops early has to read the whole list. So stopping early helps with some inputs, never hurts, and in the worst case both versions do the same work. You'll meet that idea again in the lesson on best, average and worst cases.

**Common mistake:** deciding it doesn't matter because the list is short. With 6 guests you'd never notice a difference. With 6 million names in a database, one version can answer instantly and the other reads every name, every time.

## Does it matter, if it works?

A fair question: if my code works, why do I care which version is best? Sometimes you don't. On a small project, the solution you can get working is the best solution. Working code always comes first.

But in other situations performance matters a lot, and there really is a best solution:

- **Big data.** At a company handling hundreds of millions of records, one version of a function might finish a full **hour** sooner than another, on every single run.
- **Trade-offs.** It's rarely "this one is always great, that one is always terrible". One approach might be great with huge inputs, another more consistent but slower up front. Big O gives you the words to discuss that.
- **Finding slow code.** When your code works but the page is slow or the browser freezes, Big O helps you spot the parts that are inefficient.
- **Interviews.** You'll hear "What's the Big O of your solution?" or "Here are three functions. What's the Big O of each one?"

Interviews are important, but the real goal is to understand your code and be able to talk about it clearly. And there's one more reason we can't just time code with a stopwatch and call it a day:

```viz
stopwatch-race
```

**What just happened:** the same code ran on a fast laptop and an old phone. The times were very different, and they changed again on a second run, even though nothing in the code changed. But the number of steps was the same every time: it only changed when the number of guests changed. That's why Big O counts steps, not seconds. You'll explore this in the next lesson.

**Common mistake:** worrying about speed before the code works. First make it correct, then ask "what's its Big O, and can I do better?" A fast answer that's wrong is still wrong.

## Time and space

Picture two pieces of code on a scale: code 1 and code 2. They do the same job, but they're written differently. Maybe code 1 is easier to read; maybe code 2 has other advantages. Big O is the mathematical way to decide which one runs more efficiently.

We can't weigh code, so imagine a stopwatch. Code 1 runs in 15 seconds; code 2 runs much longer. By that measure, code 1 is better. That's **time complexity**. But we don't actually measure it in seconds: we measure it in **number of operations**. Run the same code on a faster computer and it finishes sooner, yet it does exactly the same number of operations. So its time complexity is the same on any computer.

Big O also measures **space complexity**: how much **memory** the code uses. Say code 1 finishes in 15 seconds but uses a lot of memory, while code 2 takes a full minute but uses very little. If memory is what matters most to you, code 2 is the better one.

```viz
memory-boxes
```

**What just happened:** counting the guests needed just one box of memory, the counter, whether there were 3 guests or 6, and it would still be one box with 6 million. Making a name tag for every guest needed one new box per guest, so the memory grew with the list. Same guests, two jobs, and two very different amounts of extra memory.

Here are both jobs in code:

```js-run
const guests = ['Ana', 'Ben', 'Cleo', 'Dev']

// One extra box, however many guests there are:
let count = 0
for (let i = 0; i < guests.length; i++) {
  count = count + 1
}
console.log('Guests:', count)

// One new name tag per guest:
const nameTags = []
for (let i = 0; i < guests.length; i++) {
  nameTags.push('Hello, my name is ' + guests[i])
}
console.log(nameTags)
```

We'll focus mostly on time, but space comes up in interviews too: _"Great, you've optimized it for time. What if we care more about memory? How would you write it?"_ So you'll learn both.

**Common mistake:** thinking time complexity is measured in seconds. Seconds depend on the computer. Time complexity counts **operations**, which only depend on the code and the size of its input.
