---
title: 'Wrap-up: comparing everything'
order: 17
minutes: 11
---

> **Goal:** put every Big O side by side, know the words people use for each, and review the rules.

## The numbers side by side

You've now met every shape this course uses: O(1), O(log n), O(n), O(n log n) and O(n²). Each one describes how the work grows with the input, and the gaps between them aren't small. They're the difference between code that handles a million items without blinking and code that freezes on ten thousand.

That's also why **choosing the right algorithm matters more than buying a faster computer**. A computer that's 10 times faster runs every algorithm 10 times faster, but it doesn't change any shape. An O(n²) algorithm on that new computer can only handle about 3 times more items in the same time (because 3 × 3 is about 10). Switching to an O(n) algorithm does much more: the million steps O(n²) spends on 1,000 items are enough for O(n) to handle a million items.

```viz
big-o-growth-chart
```

**What just happened:** the chart added the shapes one at a time, from the flat line of O(1) to the steep curve of O(n²), and then showed them all together. At the right edge, they're spread so far apart that O(1) and O(log n) look like they're lying on the floor.

How far apart are these shapes, really? Run this to count the steps for n = 100 and n = 1,000:

```js-run
const sizes = [100, 1000]
for (let i = 0; i < sizes.length; i++) {
  const n = sizes[i]
  console.log('n =', n)
  console.log('  O(1):', 1, ' O(log n):', Math.round(Math.log2(n)))
  console.log('  O(n):', n, ' O(n²):', n * n)
}
```

With n = 100: O(1) is 1, O(log n) is about 7, O(n) is 100 and O(n²) is 10,000. With n = 1,000: 1, about 10 (2¹⁰ = 1,024, close to a thousand), 1,000 and **1,000,000**. The gap between O(n) and O(n²) is already huge with a thousand items, and real apps handle millions.

**Common mistake:** thinking a fast enough computer makes Big O irrelevant. Hardware speeds up every step by the same amount, but it can't change how many steps there are. With big inputs, the shape always wins.

## The words, and a cheat sheet

Interviewers and other developers rarely say "O of n squared" out loud without a name or a picture to go with it. Each shape has a **name**, and most have a phrase that people use for it. Knowing both helps you follow a conversation and explain your own code:

| Big O      | Name                   | You'll hear…            | Example                        |
| ---------- | ---------------------- | ----------------------- | ------------------------------ |
| O(1)       | constant               | "constant time"         | reading an array item by index |
| O(log n)   | logarithmic            | "divide and conquer"    | binary search                  |
| O(n)       | linear                 | "proportional"          | looping through an array       |
| O(n log n) | linearithmic           | "the best general sort" | merge sort, quick sort         |
| O(n²)      | quadratic (polynomial) | "a loop within a loop"  | every guest greets every guest |

A great free reference is the **Big O Cheat Sheet** at bigocheatsheet.com. Its chart rates each growth rate on a scale from **Excellent** to **Horrible**: O(1) and O(log n) sit at the excellent end, O(n²), O(2ⁿ) and O(n!) at the horrible end, and O(n) and O(n log n) in between. It also shows O(2ⁿ) and O(n!), which grow even faster; O(n!) is something you'll basically only see if you write bad code on purpose.

Below the chart, its tables list common data structures with their **average (Θ)** and **worst (O)** time for each operation, plus their space. The sorting table adds the **best case (Ω)** too. Those are the three cases from lesson 6:

```viz
search-cases
```

**What just happened:** the same search did 1 check in the best case (Ω), about half the list in the average case (Θ), and every guest in the worst case (O). The cheat sheet's tables use exactly these three columns, so you can read them now.

You'll notice that some sorts have terrible time complexity but great space complexity (selection sort), while others have great time complexity but need more space (merge sort): the time and space trade-off again. Keep the page handy and come back to it as you learn each topic.

See how fast the "horrible" end grows, even for a small n:

```js-run
const n = 16

let factorial = 1
for (let i = 2; i <= n; i++) {
  factorial = factorial * i
}

console.log('n = 16')
console.log('O(log n):', Math.log2(n))
console.log('O(n²):', n * n)
console.log('O(2ⁿ):', Math.pow(2, n))
console.log('O(n!):', factorial)
```

**Under the hood:** where do O(2ⁿ) and O(n!) come from? From code that tries **every possibility**. Each guest can be invited or not, so n guests give 2ⁿ possible guest lists: 1,024 for 10 guests, over a million for 20. Code that checks every possible list is O(2ⁿ). And n guests can sit in n! different orders (n × (n − 1) × … × 1): 3,628,800 orders for 10 guests, and about 2.4 quintillion for 20. Code that tries every seating order is O(n!). A few problems really need that much work, but most of the time, a function that tries everything is a sign that a smarter approach exists.

**Common mistake:** memorizing the table instead of the reasons. If you know **why** binary search is O(log n) (it halves the data every step), you'll recognize the same shape in code you've never seen. A memorized table can't do that.

## Recap

**Big O notation** is our tool for judging how an algorithm performs. It gives us a **high-level understanding** of how the runtime (time complexity) or the memory (space complexity) of an algorithm changes as its input grows. It doesn't care about precision, only about **general trends**. And it's a property of the **algorithm** itself, not of the machine running it: a faster computer finishes each step sooner, but it still does the same number of steps, so the trend is the same.

The rules you learned:

1. **Count operations, not seconds.**
2. Big O is the **worst case** (Ω is the best case, Θ the average).
3. **Drop the constants:** O(2n) → O(n), O(100n²) → O(n²), O(500) → O(1).
4. **Drop the non-dominant terms:** O(n² + n) → O(n²).
5. **Different inputs, different terms:** O(a + b) and O(a · b).
6. A **loop within a loop** is O(n²); **divide and conquer** is O(log n); **O(1)** is the most efficient of all.
7. Measure **space** too: the extra memory the algorithm creates.

From best to worst: **O(1) < O(log n) < O(n) < O(n log n) < O(n²)**.

```viz
dominant-term
```

**What just happened:** this was rule 4 at work. As n grew, the n² part did more and more of the work in n² + n, until the n part was a sliver. That's why the simplified answer is O(n²).

Here's one last function to analyze with all the rules at once. Predict its Big O, then run it and watch the counts grow:

```js-run
function partyPlan(guests) {
  let steps = 0
  steps++ // the host checks the door: O(1)
  for (let i = 0; i < guests.length; i++) {
    steps++ // welcome each guest: O(n)
  }
  for (let i = 0; i < guests.length; i++) {
    for (let j = 0; j < guests.length; j++) {
      steps++ // each guest meets each guest: O(n²)
    }
  }
  return steps
}

const sizes = [10, 100, 1000]
for (let k = 0; k < sizes.length; k++) {
  const guests = []
  for (let i = 0; i < sizes[k]; i++) {
    guests.push('Guest ' + i)
  }
  console.log(sizes[k], 'guests:', partyPlan(guests), 'steps')
}
```

It's 1 + n + n², and by the rules, that's **O(n²)**: ten times the guests, about a hundred times the steps.

Big O is everywhere in this course, and you'll get plenty of practice with it. Before moving on, take the **Big O quiz** on the module page.

**Common mistake:** analyzing only time. Every answer has two halves: "This is O(n²) time and O(1) space." Interviewers often ask for the second half right after you give the first.
