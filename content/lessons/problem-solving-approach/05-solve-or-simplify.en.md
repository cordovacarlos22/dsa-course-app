---
title: 'Step 4: Solve or simplify'
order: 5
minutes: 11
---

> **Goal:** when you can't solve the whole problem, solve a simpler version first, then add the hard part back.

## Solve it, or solve a simpler problem

You understand the problem, and you have examples and a plan. Step 4 is to **solve it**: if the plan feels solid, write the code. Often, though, you'll feel good about most of it, maybe 80%, and be stuck on one or two parts. That's where the second half of the step comes in: **if you can't solve the problem, solve a simpler problem**.

Simplifying doesn't mean switching to a different, easier problem. It means **temporarily ignoring the part that's giving you trouble**, so you can make progress on everything else. Here's how:

1. **Find the core difficulty:** the one part you don't know how to do.
2. **Ignore it for now.**
3. **Write a simplified solution:** everything except that part.
4. **Add the difficulty back in.**

Why is this worth it? In an interview, getting stuck on one hard part and writing nothing at all looks much worse than writing everything you can and saying "I'll come back to this part". And there's a second reason: while you write the simpler version, you often **figure out the hard part**. Seeing real code run makes the missing piece easier to picture.

```viz
five-steps-solve
```

**What just happened:** the four moves of simplifying appeared in order: find the hard part, set it aside, solve the rest, bring it back. The important word is _temporarily_. You're not dropping the hard part, you're postponing it.

**Common mistake:** simplifying by changing the problem. Solving "add two small numbers" when the problem is about huge ones isn't simplifying; it's solving something else. Keep the real problem, and set aside only the hard piece.

## The simple charCount

What's hard about `charCount` depends on who's solving it. If loops still feel shaky, the loop might be the hard part. Then you could handle the first character by hand, then the second, notice the pattern, and only then turn it into a loop. If objects feel new, you could start by looping and just printing each character. On a whiteboard, you might forget how to lowercase a string in JavaScript (it's `toLowerCase()`). Say so out loud, and leave it for later.

For most people, the hardest part is **checking whether a character is a letter or a digit**. So let's ignore that, ignore lowercasing too, and write everything else. The object starts empty. For each character: if it's already a key, add 1; otherwise, set it to 1.

```js-run
function charCount(str) {
  const result = {}
  for (let i = 0; i < str.length; i++) {
    const char = str[i]
    if (result[char] > 0) {
      result[char]++
    } else {
      result[char] = 1
    }
  }
  return result
}

console.log(charCount('banana'))
console.log(charCount('Hi Ana!'))
```

`result[char] > 0` is how we check whether the character is already a key: a missing key gives `undefined`, and `undefined > 0` is `false`.

```viz
trace-char-count
```

**What just happened:** the trace read one character at a time. A new character got a count of 1, and a character it had already seen got 1 more. With `'banana'`, the answer is already right: `{ b: 1, a: 3, n: 2 }`. With `'Hi Ana!'` it isn't yet: `'H'` and `'A'` are counted separately from `'h'` and `'a'`, and the space and the `!` are counted too. But look at how much already works: the object, the loop, the counting and the return. We're most of the way there.

**Common mistake:** writing `result[char]++` without checking first. On a key that doesn't exist yet, that's `undefined + 1`, which is `NaN`:

```js-run
const counts = {}
counts.a++
console.log(counts.a) // NaN: there was no count to add 1 to
```

## Add the hard parts back

Now bring the difficulties back, one at a time, and re-run the examples after each change. Lowercasing is one small change: read each character as `str[i].toLowerCase()`. That makes `'H'` and `'h'` the same key.

The letter-or-digit check is the real difficulty, and there are several ways to do it. You could write a string with every allowed character and check whether it **includes** the character. You could use a **regular expression**, a small pattern language for text: `/[a-z0-9]/` matches one lowercase letter or digit. Or you could use the numbers behind every character, which is the next lesson. The list of allowed characters is the easiest to read, so let's start there. Notice that it doesn't change anything we already wrote: it just wraps the counting in an `if`.

```viz
solution-layers
```

**What just happened:** the simple version stayed, and each layer added a little. Layer 2 changed one line to lowercase each character, and `'a'` reached 2. Layer 3 wrapped the counting in an `if`, and the space and the `!` disappeared. Nothing was thrown away.

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
      if (result[char] > 0) {
        result[char]++
      } else {
        result[char] = 1
      }
    }
  }
  return result
}

console.log(charCount('Hi Ana!'))
console.log(charCount('Party at 8!'))
```

`allowed.includes(char)` is a search, but over a fixed list of 36 characters, so it takes the same time whatever the input: O(1) for each character. The whole function is one pass over the string, so it's **O(n)**.

If you get stuck on the check in an interview, say it out loud: "Here I need to check whether the character is a letter or a digit. I could use a regular expression or a list of characters. Do you have a preference?" Asking for a hint like that is completely fine. Getting 90% of the way there and asking a precise question about the last 10% shows real problem-solving skill.

**Common mistake:** erasing working code to start over when you get stuck. The simple version is your foundation: from here on, you only add to it.
