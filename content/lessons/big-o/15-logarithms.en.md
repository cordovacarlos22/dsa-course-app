---
title: 'Logarithms and O(log n)'
order: 15
minutes: 9
---

> **Goal:** understand what a logarithm is (with as little math as possible) and why O(log n) is so fast.

## The opposite of an exponent

Some algorithms have a Big O that isn't O(1), O(n) or O(n²). One that comes up more than you might expect involves **logarithms**, so here's the short version. Whether you learned logs at school and forgot them, or never learned them at all, you don't need to be a math master.

A **logarithm is the opposite of an exponent**, the same way division is the opposite of multiplication. Just like 2 × 0.5 = 1 can be turned around into 1 ÷ 2 = 0.5, an exponent can be turned around into a logarithm:

- **2³ = 8** means "multiply three 2s together and you get 8".
- **log₂(8) = 3** asks the same thing backwards: "2 to **what** power equals 8?" The answer is 3.

In general: log₂(value) = exponent, and 2^exponent = value.

```viz
halving-count
```

Here's the rule of thumb that makes it easy: **the binary logarithm of a number is roughly how many times you can divide it by 2 before you get to 1 or less.** 8 → 4 → 2 → 1 is 3 divisions, so log₂(8) = 3. 16 needs 4, so log₂(16) = 4.

Numbers that don't divide evenly land in between. 25 → 12.5 → 6.25 → 3.125 → 1.56 → 0.78: we pass 1 between the 4th and the 5th division, and log₂(25) is about 4.64:

```js-run
console.log(Math.log2(8)) // 3
console.log(Math.log2(16)) // 4
console.log(Math.log2(25)) // about 4.64
console.log(Math.log2(1000000)) // about 20
```

Logs can have other bases: log₃, log₁₀, and one called "natural log". Technically you always need a base, but in Big O the base doesn't change the shape of the curve, so we leave it out and just write **log n**.

## Divide and conquer

```viz
binary-search-halving
```

Where do logarithms show up in code? Take a **sorted** array of 8 numbers, 1 to 8, and look for the number 1. The smart way: cut the array in half and ask, "Is 1 in the first half or the second half?" It's not in the second half, so we don't even have to look at those numbers. Cut what's left in half again, and again, and we've found it.

Count the steps: **3**. The array had **8** items, and 2³ = 8. That's log₂(8) = 3. This technique is called **divide and conquer**, and it only works because the data is **sorted**.

Cutting 8 items in half may not seem like a big deal. But with a million items, the very first cut saves you from looking at half a million of them. And with **2,147,483,648** items (that's 2³¹, over two billion), divide and conquer finds any item in **31 steps**. Looking at the items one by one, finding the last one would take more than two billion checks. That's the power of **O(log n)**. The animation does the same thing with our guest list, sorted from A to Z.

## Where logarithms show up

```viz
big-o-growth-chart
```

On the graph, O(log n) is a little steep at the very start, then stays **very flat**. Not as flat as O(1), but very efficient compared with O(n) and O(n²): a thousand times more data adds only about 10 more steps.

There's one more notation worth seeing: **O(n log n)**, sometimes called **linearithmic**. It's the time of the best general-purpose **sorting** algorithms, like merge sort and quick sort, which keep splitting the data and putting it back together. It's not as good as O(n), but much better than O(n²). It's the most efficient a sorting algorithm can be when it has to sort any kind of data, like strings. (Algorithms that only sort numbers can sometimes do better; you'll see one later.)

You'll meet logarithms again in:

- **searching algorithms**, like binary search: O(log n),
- **efficient sorting algorithms**: O(n log n),
- **recursion**, where they describe the **space** some recursive functions use.

From here on, almost everything in this course will be one of these: **O(1), O(log n), O(n), O(n log n) or O(n²)**.
