# Quiz modes

**2026-10-24** · #103, Carlos chose "Start screen + finish early"

A module quiz opens on a start screen: In order or Random (`shuffle`, Fisher–Yates, in `src/lib/practice.js`), then 5, 10 or All questions. During the quiz, "Finish now" scores only the answered questions. Only a full run (All, every question answered) can change the best score, so a short practice never replaces it. Try again goes back to the start screen.
