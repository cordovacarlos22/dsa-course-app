---
title: The method in an interview
order: 7
minutes: 9
---

> **Goal:** put the 5 steps together the way you'd use them in an interview: out loud, one step at a time.

## The 5 steps, one more time

Here's the whole method again, the way you'll use it from now on, whether you're at a whiteboard with people watching or alone at home building an app:

1. **Understand the problem.** Explain it back, find what goes in and what comes out, check that it's enough, and name things.
2. **Explore concrete examples.** Simple, more complex, empty, invalid. Steps 1 and 2 are really both about understanding: what goes in, what comes out, and what should happen with errors and strange input.
3. **Break it down.** Write the steps as comments, and decide on a direction before you type a line. Diving in without a plan is how you get stuck in one approach, panic, erase everything and start over.
4. **Solve, or simplify.** If one part is too hard, set it aside, solve the rest, then bring it back.
5. **Look back and refactor.** Check the result, make it clearer, make it faster, and find out how others solved it.

```viz
five-steps
```

**What just happened:** this is the map from the start of the module, now with a whole lesson behind each step. In an interview, never skip steps 1 and 2. They take a few minutes, and they're the steps people skip most often when they're nervous.

The method isn't only for interviews. Any time you face something new, like sorting the search results in an app or tracking down a tricky bug, the same steps work. The rest of this course leans on them too: in the Linked Lists module, every method you build (`push`, `pop`, `insert`…) follows these five steps.

**Common mistake:** treating the steps as a strict ritual. They're a guide. On an easy problem, steps 1 to 3 might take thirty seconds, and that's fine. What matters is that you never skip them completely.

## Think out loud

In an interview, the method only helps if the interviewer can see it. They can't read your mind, so **say what you're doing** and bring them into the process. Here's what that might sound like at each step:

| Step              | What you might say                                                                                                       |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------ |
| Understand        | "In my own words: I count each letter and digit. The input is a string and the output is an object, right?"              |
| Examples          | "Let me write a few examples. What should an empty string return? Do capital letters count separately?"                  |
| Break it down     | "Here's my plan: make an object, loop over the string, count the letters and digits, return the object."                 |
| Solve or simplify | "I'm not sure about the letter check yet, so I'll write everything else first and come back to it."                      |
| Look back         | "It works. This if/else could be one line, and the check could use character codes. What other solutions have you seen?" |

A few more habits help. **Write your examples where the interviewer can see them**, and test your code with them at the end. When you're stuck, **say exactly what you're stuck on**: a precise question gets a useful hint, while silence gets nothing. And if time runs out, **walk them through the rest of your plan**.

Practicing alone? Do the same thing anyway. Explaining your steps out loud, even to nobody, makes the gaps in your thinking obvious.

**Common mistake:** going silent when the problem gets hard. That's exactly when talking helps most, because the interviewer can only help with what they can hear.

## Your turn: all five steps

Let's run the whole method on a new problem: **"Write a function that returns the longest word in a sentence."**

1. **Understand:** the input is a string of words separated by spaces, and the output is one word, a string. Our question: what if two words are equally long? We decide the **first** one wins. Names: `longestWord(sentence)`.
2. **Examples:** `longestWord('Hi Ana')` → `'Ana'`. `longestWord('party at eight')` → `'party'`, because it ties with `'eight'` and comes first. An empty string → `''`.
3. **Break it down:** split the sentence into words; remember the longest word so far; loop over the words, and replace the longest one only when a word is _longer_; return it.
4. **Solve:** that's this step's check. If splitting is new to you, `split(' ')` breaks a string into an array of words:

```js-run
console.log('party at eight'.split(' ')) // ['party', 'at', 'eight']
console.log(''.split(' ')) // ['']: one empty "word"
```

5. **Look back:** it's one pass over the words, so O(n), where n is the length of the sentence. Does it read clearly? Does the tie rule from step 1 still hold?

That's the whole module. Next comes **Problem-Solving Patterns**: recipes for whole families of problems, like counting things with an object or walking an array with two pointers. Every pattern still starts with these same five steps.

**Common mistake:** comparing with `>=` instead of `>`. Then a later word that ties replaces the earlier one, and the tie rule you decided in step 1 breaks. That's why the examples include a tie: it's the example that catches this bug.
