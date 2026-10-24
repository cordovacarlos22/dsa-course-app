---
title: 'Logarithms and O(log n)'
order: 15
minutes: 12
---

> **Goal:** understand what a logarithm is (with as little math as possible) and why O(log n) is so fast.

## The opposite of an exponent

Some algorithms have a Big O that isn't O(1), O(n) or O(n²). One that comes up more than you might expect involves **logarithms**, so here's the short version. Whether you learned logs at school and forgot them, or never learned them at all, you don't need to be a math master.

A **logarithm undoes an exponent**. An exponent starts from how many 2s you multiply together and gives you the result. A logarithm starts from the result and gives you back how many 2s you multiplied:

- **2³ = 8** means "multiply three 2s together and you get 8".
- **log₂(8) = 3** asks the same thing backwards: "2 to **what** power equals 8?" The answer is 3.

In general: log₂(value) = exponent, and 2^exponent = value. The small 2 is the **base**: log₂ is the **binary logarithm**, the one that comes up most in code, because so many algorithms split things in two.

Here's the rule of thumb that makes it easy: **the binary logarithm of a number is roughly how many times you can divide it by 2 before you get to 1 or less.** You don't need a formula, just a count of halvings.

```viz
halving-count
```

**What just happened:** 16 boxes were cut in half again and again: 16 → 8 → 4 → 2 → 1. That's 4 halvings, so log₂(16) = 4. Then the last caption jumped ahead: 1,024 boxes need only 10 halvings, and a million need about 20. The input grew a thousand times, but the count of halvings only doubled.

Numbers that don't divide evenly land in between. 25 → 12.5 → 6.25 → 3.125 → 1.56 → 0.78: we pass 1 between the 4th and the 5th division, and log₂(25) is about 4.64. JavaScript can work these out with `Math.log2`, and a halving loop gives the same counts:

```js-run
console.log(Math.log2(8)) // 3
console.log(Math.log2(16)) // 4
console.log(Math.log2(25)) // about 4.64
console.log(Math.log2(1000000)) // about 20

// The same idea with a loop: count the halvings until 1 is left.
let boxes = 16
let halvings = 0
while (boxes > 1) {
  boxes = boxes / 2
  halvings++
}
console.log('16 boxes:', halvings, 'halvings')
```

Logs can have other bases: log₃, log₁₀, and one called "natural log". Technically you always need a base, but in Big O the base doesn't change the shape of the curve, so we leave it out and just write **log n**.

**Under the hood:** why can Big O leave the base out? Because switching bases only multiplies by a constant. log₂ of a number is always about 3.32 times its log₁₀: log₂(1,000) ≈ 9.97 while log₁₀(1,000) = 3, and for a million it's about 19.93 against 6. Same ratio, every time. A constant multiplier is exactly what the drop-constants rule throws away, so log₂ n, log₁₀ n and the natural log all draw the same curve, just stretched a little. That's why everyone simply writes O(log n).

**Common mistake:** thinking log n means "n divided by 2". Half of a million is 500,000; log₂ of a million is about 20. The log isn't one halving: it's **how many** halvings it takes to get down to 1.

## Divide and conquer

Where do logarithms show up in code? Anywhere an algorithm can **throw away half of the work** at every step. Take a **sorted** array of 8 numbers, 1 to 8, and look for the number 1. The smart way: look at the middle and ask which half could hold the 1. The array is sorted, so the 1 can only be in the left half, and every number on the right can be skipped without a single look. Split what's left the same way, then once more, and the 1 is found.

Count the steps: **3**. The array had **8** items, and 2³ = 8. That's log₂(8) = 3. This technique is called **divide and conquer**, and it only works because the data is **sorted**: being sorted is what tells you which half can't contain the answer.

Cutting 8 items in half may not seem like a big deal. But with a million items, the very first cut saves you from looking at half a million of them. And with **2,147,483,648** items (that's 2³¹, over two billion), divide and conquer finds any item in **31 steps**. Looking at the items one by one, finding the last one would take more than two billion checks. That's the power of **O(log n)**. The animation does the same thing with our guest list, sorted from A to Z:

```viz
binary-search-halving
```

**What just happened:** the search looked at the middle name of the sorted list and compared it with the name it wanted. Because the list is in ABC order, that one comparison told it which half couldn't contain the name, so it threw that half away. It repeated that on what was left, and found the name after 3 checks in a list of 8: log₂(8) = 3.

Count the halvings for bigger and bigger lists. Notice how slowly the answer grows:

```js-run
function halvingsToOne(n) {
  let remaining = n
  let steps = 0
  while (remaining > 1) {
    remaining = Math.floor(remaining / 2)
    steps++
  }
  return steps
}

const sizes = [8, 1000, 1000000, 2147483648]
for (let i = 0; i < sizes.length; i++) {
  console.log(sizes[i], 'items:', halvingsToOne(sizes[i]), 'halvings')
}
```

**Common mistake:** using divide and conquer on data that isn't sorted. In an unsorted list, the middle name tells you nothing about where the name you want is, so you can't throw half away. Then you're back to checking items one by one: O(n).

## Where logarithms show up

On the graph, O(log n) is a little steep at the very start, then stays **very flat**. Not as flat as O(1), but very efficient compared with O(n) and O(n²): a thousand times more data adds only about 10 more steps.

```viz
big-o-growth-chart
```

**What just happened:** O(1) stayed perfectly flat, and O(log n) rose a little at the start and then barely moved, while O(n) and O(n²) kept climbing. From best to worst: O(1), O(log n), O(n), O(n²).

There's one more notation worth seeing: **O(n log n)**, sometimes called **linearithmic**. It's what you get when an algorithm does O(n) work at each of log n levels, and it's the time of the best general-purpose **sorting** algorithms, like merge sort and quick sort, which keep splitting the data and putting it back together. It's not as good as O(n), but much better than O(n²). It's the most efficient a sorting algorithm can be when it has to sort any kind of data, like strings. (Algorithms that only sort numbers can sometimes do better; you'll see one later.)

```viz
sort-growth-chart
```

**What just happened:** O(n log n) sat just above the straight line of O(n), and far below O(n²). That's where a good sort lands: a bit more than one pass over the data, and nowhere near comparing every pair.

Run the numbers for a million items:

```js-run
const n = 1000000
const logN = Math.round(Math.log2(n))
console.log('O(log n):  ', logN)
console.log('O(n):      ', n)
console.log('O(n log n):', n * logN)
console.log('O(n²):     ', n * n)
```

You'll meet logarithms again in:

- **searching algorithms**, like binary search: O(log n),
- **efficient sorting algorithms**: O(n log n),
- **recursion**, where they describe the **space** some recursive functions use.

From here on, almost everything in this course will be one of these: **O(1), O(log n), O(n), O(n log n) or O(n²)**.

**Common mistake:** mixing up O(log n) and O(n log n). O(log n) is better than O(n): it's binary search, which skips most of the data. O(n log n) is a bit **worse** than O(n): it's sorting, which has to touch every item a few times over.
