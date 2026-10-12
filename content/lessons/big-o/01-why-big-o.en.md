---
title: Why Big O?
order: 1
minutes: 9
---

> **Goal:** understand why we need a way to compare code, and what this module will teach you.

## Big O is a big deal

```viz
big-o-growth-chart
```

Welcome to the first big topic of the course: **Big O notation**. It's "big" because of how much it matters, not because it's long or hard. Almost every lesson after this module comes back to it: every data structure and every algorithm we build gets a Big O label, so this is the framework we'll use to talk about code for the rest of the course.

A quick, friendly warning: there's a little bit of math in this module, and a word you may not have heard in years (or ever): **logarithm**. Don't panic, and push through. The math is only here to give us a shared language. The rest of the course is not this mathy.

By the end of this module you'll be able to:

- explain **why** we need something like Big O,
- describe **what** Big O is,
- **simplify** Big O expressions,
- define **time complexity** and **space complexity**,
- find the time and space complexity of a piece of code,
- explain what a **logarithm** is.

The chart above is a preview: each line is a different way the work can grow as the input grows. By the end, you'll know each one by name.

## Many ways to solve the same problem

For almost every problem in this course there are many working solutions: not just different variable names, but completely different approaches. Take "reverse a string". Here are two ways to do it. Press **Run**:

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

People have posted ten or more different ways to reverse a string in JavaScript. They all work. So which one is **best**?

Here's the same situation with our party. You're at the door with the guest list, and `isInvited` checks the names one by one, stopping as soon as it finds the name:

```viz
trace-is-invited
```

Try the three names at the top. Finding 'Ana' takes 1 check, 'Dev' takes 4, and 'Zoe', who isn't invited, takes all 6. Keep an eye on that counter: it's the amount of work the code did.

## A version that never stops early

Here's a second version. It gives exactly the same answers:

```viz
trace-is-invited-all
```

`isInvitedAll` sets `found = true` when it sees the name… and then keeps reading anyway. Pick **find 'Ana'**: Ana is the very first guest, and it still checks all 6 names.

Both functions are correct, and with 6 guests you'd never notice a difference. But one does less work. How would you explain which one is better, without saying "it feels faster"? Instead of vague words like "great" or "awful", we want a **label**: a number-like rating we can compare, the way a car's fuel label lets you compare cars without driving them. That label is Big O.

## Does it matter, if it works?

```viz
stopwatch-race
```

A fair question: if my code works, why do I care which version is best? Sometimes you don't. On a small project, the solution you can get working is the best solution.

But in other situations it matters a lot:

- **Big data.** At a company handling hundreds of millions of records, one version of a function might save an **hour** every time it runs.
- **Trade-offs.** It's rarely "this one is always great, that one is always terrible". One approach might be great with huge inputs, another more consistent. Big O gives you the words to discuss that.
- **Finding slow code.** When your code works but the page is slow or the browser freezes, Big O helps you spot the parts that are inefficient.
- **Interviews.** You'll hear "What's the Big O of your solution?" or "Here are three functions. What's the Big O of each one?"

Interviews are important, but the real goal is to understand your code and be able to talk about it clearly.

## Time and space

```viz
memory-boxes
```

Picture two pieces of code on a scale: code 1 and code 2. They do the same job, but they're written differently. Maybe code 1 is easier to read; maybe code 2 has other advantages. Big O is the mathematical way to decide which one runs more efficiently.

We can't weigh code, so imagine a stopwatch. Code 1 runs in 15 seconds; code 2 runs much longer. By that measure, code 1 is better. That's **time complexity**. But we don't actually measure it in seconds: we measure it in **number of operations**. Run the same code on a faster computer and it finishes sooner, yet it does exactly the same number of operations. So its time complexity is the same on any computer.

Big O also measures **space complexity**: how much **memory** the code uses. Say code 1 finishes in 15 seconds but uses a lot of memory, while code 2 takes a full minute but uses very little. If memory is what matters most to you, code 2 is the better one.

We'll focus mostly on time, but space comes up in interviews too: _"Great, you've optimized it for time. What if we care more about memory? How would you write it?"_ So you'll learn both.
