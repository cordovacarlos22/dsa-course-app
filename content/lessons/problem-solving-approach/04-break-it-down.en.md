---
title: 'Step 3: Break it down'
order: 4
minutes: 9
---

> **Goal:** write the steps of your solution as comments before you write the code.

## Plan before you type

You understand the problem and you have your examples. The third step still comes **before** the real code: **break it down**. Write out the steps your solution will take, as short comments. It isn't complete pseudocode, and it doesn't need valid syntax. A few lines in plain words are enough: the main parts of the solution, not every line of it.

Why bother, when you could just start coding? Because it **makes you think about the logic before the syntax**. Writing code means juggling two things at once: what to do, and how to say it in JavaScript. A plan takes the first one off your plate. It also helps you **spot what you don't understand yet**. The step you can't put into words is exactly the one that would have tripped you up halfway through the code.

In an interview, the plan does one more job: **it shows your thinking**. A lot of what interviewers look for is how you communicate. Writing code in silence, with a frown, tells them nothing. Saying "here are the steps I'm going to take" lets them follow along, and sometimes they'll nudge you if a step is heading the wrong way. You can even ask them directly: "Does this approach sound reasonable to you?"

```viz
five-steps-break-down
```

**What just happened:** step 3's checklist has three items, and they're three reasons to plan: comments as a guide, logic before syntax, and finding the gaps early. The plan is short on purpose. If it gets as long as the code, it stops saving you time.

**Common mistake:** writing pseudocode so detailed that it's really code written in English. Keep it to the main steps; the details belong in the code.

## charCount, step by step

Let's break down `charCount`. Remember the decisions from our examples: count only letters and digits, in lowercase, and return an object. Two steps are easy: we need an **object to fill**, and we **hand that object back when we're done**. Everything else happens in between, so most of the logic lives in a **loop over the string**.

What happens to each character? There are three cases. If it's a letter or a digit that's **already a key** in the object, add 1 to its count. If it's a letter or digit that's **not a key yet**, add it with a count of 1. If it's **anything else**, like a space or a `!`, do nothing. That's the whole plan:

```js
function charCount(str) {
  // make an object to return
  // loop over the string, one character at a time
  //   a letter or digit that's already a key: add 1
  //   a letter or digit that's not a key yet: set it to 1
  //   anything else (a space, '!'): do nothing
  // return the object
}
```

There's still one choice to make: when to lowercase. We could lowercase the whole string before the loop, or each character as we read it. Both work. We'll lowercase each character as the loop reads it.

```viz
steps-to-code
```

**What just happened:** each comment got its code, one at a time, until the plan had become a function. One step had a part we didn't know how to write yet: checking whether a character is a letter or a digit. Instead of stopping there, we gave that step a name, `isAlphaNumeric`, and kept going. We'll write it in the next two lessons.

You don't have to write the whole function to make progress. Here's the plan with only the easy parts filled in. It already runs:

```js-run
function charCount(str) {
  // make an object to return
  const result = {}
  // loop over the string, one character at a time
  // (coming next)
  // return the object
  return result
}

console.log(charCount('banana')) // {} for now, but it runs!
```

**Common mistake:** leaving out the cases where you do nothing. "Anything else: skip it" is a real step, and forgetting it in the plan is how spaces end up being counted by accident.

## When time runs out

Interview problems are often too long to finish in the time you have, and sometimes that's on purpose. Interviewers want to see **how** you work, not only whether you reach the last line. This is where a written plan pays off.

Imagine you run out of time halfway through the loop. Without a plan, the interviewer sees half a function and has to guess where you were going. With the plan written above it, they can see every step you were about to take. That's often the difference between "didn't finish" and "clearly knew how to solve it". It's common for candidates to move forward without finishing the problem, because their process was easy to follow.

The plan also protects you from yourself. If you start coding without one, it's easy to get stuck in a single approach, panic when it doesn't work, and erase everything. With a plan, you can step back, look at the steps and find where things went wrong, instead of starting over from nothing.

Planning doesn't change your solution's Big O: the plan for `charCount` already tells you it's one loop over the string, so it will be O(n). Knowing that before you write a line is one more benefit of the plan.

Try it now: the function in this step's check has a plan but no code. Turn each comment into code.

**Common mistake:** deleting the plan as soon as you start coding. Keep the comments until the end. They help you check that every step is done, and you can clean them up when you look back.
