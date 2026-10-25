# Section exams

**2026-10-24** · #104, Carlos chose "20 mixed, untimed, open"

Each section whose modules have quizzes gets an exam card at the end of its list on `/learn`, linking to `/learn/sections/<section>/exam`. The exam has `EXAM_SIZE` (20, in `src/lib/course.js`) random questions from all the section's quizzes (`examQuestions` in `src/lib/practice.js`), or fewer if the quizzes have fewer. Each question shows its module. It's untimed and always open, and the best score is kept under `quiz:exam:<section>`. It reuses the quiz player (`QuizPlayer`, now exported from `QuizPage.jsx` and given a `quiz` description: title, back link, score id). Try again draws a new mix.
