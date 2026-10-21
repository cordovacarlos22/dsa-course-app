---
title: 'Step 1: Understand the problem'
order: 2
minutes: 10
---

> **Goal:** ask five questions about a problem before writing any code, and see how much they reveal about something as simple as adding two numbers.

## Slow down before you start

When you're handed a new problem, especially with a clock running, the urge is to start typing right away. Your heart races, and code appearing on the screen feels like progress. But typing fast in the wrong direction isn't progress. The first step is to take a minute and make sure you **understand the problem**.

That sounds obvious, but there's a concrete way to do it. Ask these five questions, to yourself or out loud to the interviewer:

1. **Can I explain it back in my own words?** If all you can do is repeat it, you don't understand it yet.
2. **What goes in?** The inputs: what type, how big, how many?
3. **What comes out?** The output: what should the function give back, and in what shape?
4. **Is that enough to get the answer?** Do the inputs give you everything you need to work out the output? You may not know until you start solving, and that's fine, but ask anyway.
5. **What will I call things?** Names for the function, its inputs and its result.

```viz
five-steps-understand
```

**What just happened:** each question added a line to the checklist. None of them needs code, and together they take a minute or two. In an interview they also show that you think before you type, which is exactly what interviewers want to see.

Let's try them on the simplest problem there is: **"Write a function that adds two numbers together."** Explained back in our own words: "given two numbers, give back their total", or simply "implement addition". Easy. The next questions are where it gets interesting.

**Common mistake:** "explaining it back" by repeating it word for word. Change the words: that's how you find out whether you really understood it.

## Inputs: which numbers?

"Two numbers" sounds clear until you ask what kind. Whole numbers only, or decimals too? How big can they get? Always exactly two, or could someone want to add ten? Each answer can change the code, so each one is worth asking.

Size matters more than you'd think. In JavaScript, every number is stored the same way, in a fixed amount of memory (64 bits). That has consequences. Decimals aren't always exact. Whole numbers are only exact up to `Number.MAX_SAFE_INTEGER`, which is 9,007,199,254,740,991. Above that, JavaScript starts rounding, and past about 1.8 × 10³⁰⁸ it gives up and returns `Infinity`. Run this:

```js-run
console.log(0.1 + 0.2) // not exactly 0.3!
console.log(Number.MAX_SAFE_INTEGER)
console.log(9007199254740992 + 1) // the + 1 gets lost
console.log(1e308 + 1e308) // too big: Infinity
```

**What just happened:** the same `+` you use every day gave three surprising answers. `0.1 + 0.2` isn't exactly `0.3`, adding 1 to a huge number did nothing, and two very large numbers added up to `Infinity`. So "add two numbers" becomes a much harder problem if the numbers can be huge. One way to handle that is to store each number as a **string** of digits and add them digit by digit, the way you learned on paper. JavaScript also has a special type for huge whole numbers, `BigInt`, but in an interview you'd ask before relying on it.

And how many inputs? Adding ten numbers is a perfectly reasonable thing to want. A function that only accepts two is a decision, and it's better to make it on purpose than by accident.

None of this means you should panic about every input. It means you should **ask**. Often the interviewer will say "assume normal-sized whole numbers". But now you both know it, and you've shown that you know the edge exists.

**Common mistake:** assuming "numbers" means small whole numbers. The person who wrote the problem may have a very different picture in mind.

## Outputs, missing inputs and names

Now the outputs. Should `addNumbers` return a number? If both inputs are decimals, should a decimal come back? If we add huge numbers as strings, should it return a string? Again: ask.

The fourth question, **is that enough to get the answer?**, catches missing information. What if someone calls `addNumbers(5)` with only one number? There's nothing to add it to. Should the missing number count as 0? Should `addNumbers` return `undefined`, or stop with an error? There's no right answer until someone decides. Here's what a first version does on its own:

```js-run
function addNumbers(first, second) {
  return first + second
}

console.log(addNumbers(2, 3)) // 5
console.log(addNumbers(5)) // NaN: 5 + undefined
console.log(addNumbers('2', 3)) // '23': a string sneaks in and + joins them
```

**What just happened:** `addNumbers(5)` returned `NaN` ("not a number"), because `second` is `undefined` and `5 + undefined` isn't a number. And `addNumbers('2', 3)` returned the string `'23'`, because when one side of `+` is a string, JavaScript joins text instead of adding. The code runs, but not the way anyone wanted. Those are exactly the cases the questions are meant to catch.

Finally, **labels**: give the important pieces clear names before you write the code. Here that's easy: the function is `addNumbers`, the inputs are `first` and `second`, and what comes back is the `result`. In bigger problems, good names are half the battle. They make the plan easier to write, the code easier to read and your explanation easier to follow.

In an interview, the answer to many of these questions will be "don't worry about that" or "assume the input is valid". That's fine. You've still shown that you think about edge cases, and you've found out exactly what you need to handle.

**Common mistake:** treating these questions as a formality and then ignoring the answers. Each answer is a decision your code has to follow, like the one in this step's check.
