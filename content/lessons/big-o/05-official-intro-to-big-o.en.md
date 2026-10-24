---
title: The official intro to Big O
order: 5
minutes: 12
---

> **Goal:** know the official meaning of Big O, and use it on four examples.

## Fuzzy counting, made official

We've been talking about Big O without officially naming it. Here it is: **Big O notation is a formal way of fuzzy counting.** It lets us say precisely **how an algorithm's running time changes when its input gets bigger**. That's all it is: a description of the relationship between the size of the input and the time the code takes.

"Formal" is the important word. Fuzzy counting on its own is just a habit: count roughly, keep the trend. Big O turns that habit into a precise rule that everyone uses the same way, so that when one developer says "this is O(n)", every other developer knows exactly what kind of growth they mean. It ignores the small details on purpose and keeps only the broad trend.

We've already seen two trends:

- With the formula version of `sumOneTo`, the size of n doesn't change the time at all.
- With the loop version, as n grows, the runtime grows with it in a roughly one-to-one pattern.

Here they are again, timed for bigger and bigger n:

```viz
timing-chart
```

**What just happened:** the loop's times lined up in a straight line, and the formula's stayed flat along the bottom. Those two lines are what Big O describes. It doesn't care that the loop took a little over a second at n = 1 billion on one particular computer; it cares that the loop's time grows **with** n, and the formula's doesn't.

When you're unsure about a piece of code, ask yourself: _as the input grows, what will this chart look like?_ Does the time stay flat, grow in a straight line, or shoot up? You can answer that by doubling n and watching the work:

```js-run
// The operation counts we found in lesson 3:
function loopOperations(n) {
  return 5 * n + 2
}
function formulaOperations(n) {
  return 3
}

let n = 1000
for (let i = 0; i < 4; i++) {
  console.log('n =', n, '| loop:', loopOperations(n), '| formula:', formulaOperations(n))
  n = n * 2
}
```

Each time n doubles, the loop's work about doubles and the formula's stays put. That's the whole answer to "what's the Big O?": not a number of seconds, but how the work responds when the input grows.

**Common mistake:** thinking Big O tells you how long code takes. "O(n)" doesn't mean "n milliseconds" or anything like it. It's a description of growth, which is why the same code has the same Big O on every computer.

## The definition

Here's the official definition. It looks scary, so we'll unpack it right after:

> An algorithm is **O(f(n))** if, **once n is big enough**, the number of simple operations it needs is never more than **a constant times f(n)**.

`f(n)` just means "some function of n": a formula that turns the input size into an amount of work. The common ones are:

- **f(n) = n**: linear. As n grows, the runtime grows in proportion.
- **f(n) = n²**: quadratic. The runtime grows with the square of n.
- **f(n) = 1**: constant. As n grows, the runtime doesn't change.
- …and a few others you'll meet soon, like log n.

Now the two tricky parts. "**A constant times** f(n)" means we're allowed to multiply f(n) by any fixed number we like, as long as it doesn't depend on n. "**Once n is big enough**" means the count only has to stay under that limit for large inputs; for tiny inputs, anything goes. (Mathematicians say the count is **eventually** under the limit.) Together, they're what make Big O fuzzy: they let it ignore the details that don't matter for big inputs.

```viz
same-shape
```

**What just happened:** n, 2n and 3n all drew straight lines. 2n and 3n were steeper, but they had the same **shape**: double the input and each one doubles. Only n² was different, bending upward and leaving the others behind. Steepness is what "a constant times f(n)" absorbs; shape is what Big O keeps.

Here's the definition at work. The loop version does about 5n + 2 operations. Once n is at least 2, that's never more than 6 × n, so it's **O(n)**. Run it and see where "big enough" starts:

```js-run
for (let n = 1; n <= 6; n++) {
  const operations = 5 * n + 2
  const limit = 6 * n
  console.log('n =', n, '| 5n + 2 =', operations, '| 6n =', limit, '| under the limit?', operations <= limit)
}
```

At n = 1, the count is over the limit (7 against 6). From n = 2 on, it never goes over again. It doesn't matter whether the count is 1n, 5n or 50n: on a giant chart, all of them are straight lines, and we simplify them to just n.

One more thing to remember: Big O describes the **worst case**, the upper limit of the runtime. Whatever the input, the code won't do worse than this.

**Common mistake:** thinking "a constant times f(n)" lets any code be O(n) if you pick a big enough constant. Try it with n²: even with a constant of 1,000, n² passes 1,000 × n as soon as n goes past 1,000, and it never comes back. No constant can make a curve that bends up stay under a straight line.

## Four examples

Time to put labels on real code. For each function, ask the question from step 1: as n grows, does the work stay flat, grow in a line, or shoot up? You don't need to count every operation. Look for the loops and ask how many times each one runs.

1. **`sumOneToFormula(n)`** always does 3 operations. The line is flat: **O(1)**.
2. **`sumOneTo(n)`** with a loop does about 5n + 2 operations: **O(n)**.
3. **`arriveAndLeave(n)`** counts the guests coming in, from 0 to n − 1, then counts them going home, back down to 0, with two loops one **after** the other. Each loop grows with n, so the total is about 2n. You might want to call it O(2n), but Big O only keeps the overall shape, so it's simply **O(n)**.
4. **`printSeats(n)`** prints every seat in a room with n rows of n seats (a row number, then a seat number) with a loop **inside** another loop. That's very different from two loops in a row. Because the loops are nested, the inner one runs all n of its turns **for every single turn** of the outer one.

Watch the nested loops of `printSeats`:

```viz
trace-print-seats
```

**What just happened:** for i = 0, the inner loop went through every j: (0, 0), (0, 1), (0, 2)… Then i moved to 1, and the inner loop started over from the beginning. With n = 3, that's 3 turns of the outer loop × 3 turns of the inner loop = 9 seats. Pick n = 4 and you get 16.

Run `arriveAndLeave` and count its lines:

```js-run
function arriveAndLeave(n) {
  console.log('Doors open!')
  for (let i = 0; i < n; i++) {
    console.log(i)
  }
  console.log("Everyone's here! Time to head home...")
  for (let j = n - 1; j >= 0; j--) {
    console.log(j)
  }
  console.log('The last guest is gone.')
}

arriveAndLeave(3)
```

Six numbers for n = 3: two loops of n, so about 2n, and that's **O(n)**. Now count the seats that `printSeats` visits. Before you run it, predict the answer for n = 10:

```js-run
function printSeats(n) {
  let seats = 0
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      seats = seats + 1
    }
  }
  return seats
}

console.log('n = 2:', printSeats(2), 'seats') // 4
console.log('n = 3:', printSeats(3), 'seats') // 9
console.log('n = 4:', printSeats(4), 'seats') // 16
console.log('n = 10:', printSeats(10), 'seats')
```

2 → 4, 3 → 9, 4 → 16, 10 → 100: the runtime grows like n × n, so it's **O(n²)**. That grows much faster than O(n): try n = 1,000 and you get a million seats.

**Under the hood:** look at where `let j = 0` sits: inside the outer loop's `{ }`. So it runs again on every turn of the outer loop, and the inner loop starts over from 0 each time. That restart is the whole difference between loops in a row and nested loops. In a row, the second loop starts once, after the first one is done. Nested, the inner loop starts n times, once per turn of the outer loop, and every start costs n more turns.

So our four functions are: constant, linear, linear and quadratic. If this feels like a lot, that's normal. The next lessons take each shape slowly, one at a time.

**Common mistake:** seeing two loops and calling it O(2n) every time. Two loops **in a row** add up: n + n = 2n, which is O(n). Two loops **one inside the other** multiply: n × n, which is O(n²). Before you count, check where the second loop is.
