---
title: 'Step 5: Look back and refactor'
order: 6
minutes: 12
---

> **Goal:** improve a working solution by asking the refactoring questions, and know the difference between making code clearer and making it faster.

## You're not done yet

Your code works. It's tempting to stop right there, close the laptop and move on, and sometimes that's the right call: with a deadline tomorrow, working code is what matters most. But step 5, **look back and refactor**, is the step that turns you into a better developer. Skipping it is a missed chance to learn.

Looking back means really examining your solution, line by line. What do you like about it, and what don't you? Is it easy to read? Is it efficient? Those two goals, **efficiency** and **readability**, sometimes pull in different directions, and good code strikes a balance between them. To **refactor** means to change how code is written without changing what it does. Here are the questions to ask:

1. **Does it really work?** Run your examples again.
2. **Is there another way to get there?** There's rarely only one solution.
3. **Is it easy to read?** Could someone else follow it quickly?
4. **Where else could this help?** The answer, or the idea behind it, might solve another problem. Each problem you solve builds intuition for the next one.
5. **Can it be faster, or use less memory?** Its Big O in time and in space.
6. **What else could be cleaner?** Style, naming, and the conventions of the language and of your team.
7. **How did other people solve it?**

```viz
five-steps-look-back
```

**What just happened:** the seven questions appeared one by one. Notice that only one of them is about speed. The others are about correctness, clarity and learning. In an interview, ask them out loud when you finish, even if you don't have time to act on all of them. The last one is a great question for the interviewer: they've usually seen the same problem solved in many ways, and "what other solutions have you seen?" can teach you a lot. Working alone, look for other solutions online, even in another language. Comparing them with yours is one of the fastest ways to pick up new ideas.

**Common mistake:** thinking that refactoring means "make it shorter". Shorter code that nobody can read isn't better. The goal is code that's correct, clear and fast enough.

## Clearer code

Let's look back at our `charCount`. It works, but a few things could read better.

**The count update.** Five lines for "add 1, or start at 1" is a lot. One line does the same job: `result[char] = (result[char] || 0) + 1`. The `||` operator gives you its right side when the left side is "falsy", and `undefined` is falsy. So a new key starts from `0` and becomes `1`, and a key that already has a count keeps it and gets 1 more.

**The helper.** The check already lives in its own function, `isAlphaNumeric`. That's a refactor in itself: the loop now reads almost like a sentence. "For each character, if it's a letter or a digit, count it."

**Modern syntax.** Use `const` for values that never change and `let` for the ones that do, and avoid the old `var`. You'll also see a different kind of loop, `for...of`, which gives you each character directly, without an index:

```js
for (const char of str) {
  // char is each character, one at a time
}
```

It does the same work as our indexed loop (one pass, O(n)), so choosing between them is a question of style. In this course we keep writing `for (let i = 0; …)` loops, because you can always see exactly which position you're on.

```js-run
function isAlphaNumeric(char) {
  const allowed = 'abcdefghijklmnopqrstuvwxyz0123456789'
  return allowed.includes(char)
}

function charCount(str) {
  const result = {}
  for (let i = 0; i < str.length; i++) {
    const char = str[i].toLowerCase()
    if (isAlphaNumeric(char)) {
      result[char] = (result[char] || 0) + 1
    }
  }
  return result
}

console.log(charCount('Hi Ana!'))
console.log(charCount('Party at 8!'))
```

**What just happened:** the results are the same as before, with fewer lines that are still easy to read. And we know they're the same because we re-ran the examples, which is question 1 on the list.

**Common mistake:** refactoring without re-running the examples. A "refactor" that changes the result isn't a refactor; it's a new bug.

## Faster code: character codes

Now question 5: performance. Our `isAlphaNumeric` searches a list of 36 characters. A regular expression would be shorter to write, but how fast a regular expression runs depends on the pattern and on the JavaScript engine, and for a check this simple it can be slower than you'd expect. There's a simpler idea underneath every character: **its number**.

Computers store every character as a number, called its **character code**. `'a'.charCodeAt(0)` gives `97`, `'b'` is `98`, and so on. The useful part is that related characters sit together in blocks: the digits `'0'` to `'9'` are codes **48–57**, the capital letters `'A'` to `'Z'` are **65–90**, and the lowercase letters `'a'` to `'z'` are **97–122**. So "is this a letter or a digit?" becomes three comparisons between numbers, some of the simplest and fastest operations a computer can do.

```viz
char-code-ranges
```

**What just happened:** each character landed on the number line at its code. `'a'`, `'Z'` and `'7'` fell inside a green block; the space and the `!` fell outside. The interesting ones are at the edges: `'['` is 91, one past `'Z'`, and the backtick is 96, one before `'a'`. Get a single comparison wrong (`<` instead of `<=`) and the edges are exactly where the bug appears.

Here's the refactored helper, plus a way to compare it with a regular expression. Don't guess which one is faster: **measure it**, just like in the Big O module's timing lesson.

```js-run
function isAlphaNumeric(char) {
  const code = char.charCodeAt(0)
  if (code >= 48 && code <= 57) return true // 0–9
  if (code >= 65 && code <= 90) return true // A–Z
  if (code >= 97 && code <= 122) return true // a–z
  return false
}

console.log(isAlphaNumeric('a'), isAlphaNumeric('Z'), isAlphaNumeric('7'))
console.log(isAlphaNumeric(' '), isAlphaNumeric('!'), isAlphaNumeric('['))

let text = ''
for (let i = 0; i < 100000; i++) {
  text += 'Hi Ana! 8'[i % 9]
}

let start = performance.now()
let found = 0
for (let i = 0; i < text.length; i++) {
  if (isAlphaNumeric(text[i])) found++
}
console.log('character codes:', (performance.now() - start).toFixed(1), 'ms')

start = performance.now()
found = 0
for (let i = 0; i < text.length; i++) {
  if (/[a-z0-9]/i.test(text[i])) found++
}
console.log('regular expression:', (performance.now() - start).toFixed(1), 'ms')
```

Your times will vary from run to run and from browser to browser. And notice what _doesn't_ change: both versions do a constant amount of work per character, so `charCount` is **O(n)** either way. A faster check shrinks the constant, not the Big O.

One more thing to think about: is it better to lowercase the whole string first, or to check each character first and lowercase only the letters and digits? It depends on the inputs. If they're full of spaces and symbols, checking first skips some work. And what about space? The object can never hold more than 36 keys (26 letters and 10 digits), however long the string is. So `charCount` is **O(n) time and O(1) space**.

**Common mistake:** believing a faster helper changes the Big O. Here it changes the constant, which is a real improvement, but `charCount` was O(n) before and is still O(n).
