---
title: Why you need a method
order: 1
minutes: 9
---

> **Goal:** know what an algorithm is, why solving new problems is a skill you can learn, and meet the 5 steps you'll use for the rest of the course.

## What is an algorithm?

"Algorithm" is one of those words you hear everywhere. A music app has an algorithm that picks your next song, a map app has one that picks your route, and every social app has one that decides which posts you see first. The word sounds fancy, but the meaning is simple: an **algorithm** is a **list of steps that gets a job done**. That's all it is.

So the steps for finding the first 100 prime numbers are an algorithm. So are the steps a social app follows to rank millions of posts, built by large teams over many years. And so is a three-line loop: `isInvited` from the Big O module, which checks the guest list one name at a time, is an algorithm too. Most tasks can be solved by **many different algorithms**, and Big O is how we compare them.

Almost everything you do as a programmer involves an algorithm, from a tiny helper function to a whole app. In this course we focus on a narrower kind: problems you can solve with one function, the kind that come up in **coding interviews** and in everyday code. The good news is that the skills you build on small problems carry over to big ones.

```viz
trace-is-invited
```

**What just happened:** `isInvited` followed a fixed set of steps: start at the first guest, compare the name, move to the next one, and stop when it finds the name or runs out of guests. Those steps are the algorithm. Another algorithm could sort the list first and then jump around like binary search: the same task, different steps, and a different Big O.

Here's another algorithm you can run. It finds the first 10 **prime numbers** (numbers greater than 1 that can only be divided evenly by 1 and by themselves):

```js-run
function isPrime(number) {
  if (number < 2) return false
  for (let i = 2; i < number; i++) {
    if (number % i === 0) return false // it divides evenly: not prime
  }
  return true
}

const primes = []
let candidate = 2
while (primes.length < 10) {
  if (isPrime(candidate)) primes.push(candidate)
  candidate++
}
console.log(primes)
```

This is one way to do it, not the only one. For example, `isPrime` doesn't need to try every number below `number`: it could stop much earlier and get the same answer with fewer steps. You'll see that idea again and again in this course. There's rarely just one algorithm for a task, and part of the job is choosing a good one.

**Common mistake:** thinking an algorithm has to be big and clever. A loop that counts the short names on a guest list is an algorithm. The skill is choosing good steps, not fancy ones.

## Solving problems is a skill

Learning the syntax of a language takes time, but it's the easier part. You can follow a tutorial, copy a pattern or rebuild an app step by step. The hard part comes when you face a problem **you've never seen before** and nobody gives you the steps. That's exactly what a coding interview is: a new problem, a clock, and someone watching you think.

It's easy to believe that some people are simply born good at this. Some people do pick it up faster, like with anything else. But problem solving **can be learned**. It's common for someone to freeze completely in their first practice interview, and then, a couple of weeks later, to solve a brand-new problem of the same difficulty calmly. Their talent didn't change in two weeks. What changed is that they had a plan to follow.

So there are two ways to get better:

1. **Have a plan for solving problems.** A list of steps to follow when you're stuck, so you're never just staring at a blank screen. That's this module.
2. **Master the common patterns.** Many interview problems belong to families, and each family has a recipe you can reuse again and again: frequency counters, multiple pointers, sliding windows and more. That's the next module.

Both pay off well beyond interviews. Every feature you'll ever build starts as a problem you haven't solved yet, so a method for new problems is a method for your whole career.

**Common mistake:** memorizing hundreds of solutions instead of learning how to find one. A memorized answer breaks the moment the interviewer changes one detail. A method still works.

## The 5 steps

Here's the plan. It isn't magic, it isn't foolproof, and it won't solve the problem for you. What it does is give you something concrete to do next, every single time, so you can stay calm and keep moving. Many of these ideas are adapted from a classic book about problem solving, _How to Solve It_, written by the mathematician **George Pólya** in 1945. It was written for math problems, but it works just as well for code.

The five steps are:

1. **Understand the problem**
2. **Explore concrete examples**
3. **Break it down**
4. **Solve it, or simplify it**
5. **Look back and refactor**

```viz
five-steps
```

**What just happened:** the five steps lit up one at a time, in the order you'll use them. The first two are both about understanding: what goes in, what comes out, and what the strange cases are. The third is a plan. Only the fourth step writes the real code, and the fifth makes it better.

Each step gets its own lesson in this module, and we'll use the same two examples the whole way through: adding two numbers, and counting the characters in a string. In the last lesson you'll put all five steps together the way you would in an interview. And you'll keep using them after this module: in the Linked Lists module, every method you build follows these same five steps.

**Common mistake:** jumping straight to step 4. Writing code right away feels fast, but code written before you understand the problem is the slowest kind of code: you end up rewriting it.
