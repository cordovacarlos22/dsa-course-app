---
title: Why Big O?
order: 1
minutes: 7
---

> **Goal:** understand why "it works" isn't the whole story, and what Big O measures.

## Two versions that both work

You're at the door of a party, holding the guest list. Someone walks up and says their name. Is it on the list? Here's one way to write that check. Press **Play** to watch it run:

```viz
trace-is-invited
```

`isInvited` starts at the top of the list (`i = 0`) and compares each name with the one it's looking for. As soon as it finds a match, it **stops** and returns `true`. If it reaches the end without a match, the name isn't there, so it returns `false`.

Use the buttons above the code to try three names. Finding 'Ana' takes 1 check, 'Dev' takes 4, and 'Zoe', who isn't invited, takes all 6. Keep an eye on the counter: it shows how many names the code had to look at. That number is going to matter a lot.

## A version that never stops early

Here's a second version. It gives exactly the same answers:

```viz
trace-is-invited-all
```

`isInvitedAll` uses a variable, `found`, that starts as `false`. When it sees the name, it sets `found = true`… and then keeps going anyway. It always reads the **whole** list before answering. Pick **find 'Ana'**: Ana is the very first guest, and the code still checks all 6 names.

Both functions are correct. If you only tried them with a few names, you couldn't tell them apart. But one of them does less work. So which one is **better**? And how would you explain why to someone else, without saying "it just feels faster"?

## What does "better" mean?

```viz
big-o-growth-chart
```

"Better" can mean different things:

- **Faster:** it finishes in less time.
- **Lighter:** it uses less memory.
- **Clearer:** it's easier to read and change.

These can pull against each other. The fastest solution sometimes uses more memory, and very short, clever code is often harder to read. Good developers can talk about these trade-offs.

**Big O** gives us a shared way to talk about the first two. It doesn't say "this takes 3 seconds". It describes **how the work grows as the input grows**. Think of the fuel label on a car: it doesn't tell you how long your trip will take, but it tells you how the fuel you need grows with the distance you drive. The chart above shows the most common shapes of growth. In this module you'll learn to look at code and say which shape it has.

## Why it matters

```viz
memory-boxes
```

Why learn this before anything else?

- **Interviews ask for it.** After you solve a coding problem, the next question is almost always: "What's the Big O of your solution?"
- **Real data is big.** With 6 guests, any code is instant. With 10 million users, one version might take seconds and the other one hours.
- **It helps you find slow code.** When an app gets slow, Big O tells you where to look.
- **It helps you choose.** Every data structure in this course is compared using Big O.

Big O measures two things. **Time complexity** is how the number of steps grows with the input. **Space complexity** is how the extra memory grows. The animation above is a preview: counting guests needs one box of memory, but making a name tag for every guest needs a new box per guest. In an interview you may hear: _"Great, it's fast. Can you make it use less memory?"_ We'll focus mostly on time, and space gets its own lesson.
