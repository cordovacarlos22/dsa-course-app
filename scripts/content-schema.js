import { z } from 'zod'

// Content is written in English first. Spanish is added later, so it's
// optional here; validate-content.js warns about every missing translation.
const nonEmpty = z.string().trim().min(1)
export const localizedText = z
  .object({ en: nonEmpty, es: nonEmpty.optional() })
  .strict()

// Code is keyed by language so we can add Python later without changing the shape.
const codeByLanguage = z.object({ javascript: nonEmpty }).strict()

// Slugs are used in URLs, so keep them simple: "02-big-o", "find-max".
const slug = z
  .string()
  .regex(
    /^[a-z0-9]+(-[a-z0-9]+)*$/,
    'use lowercase letters, numbers and dashes',
  )

export const questionSchema = z
  .object({
    id: slug,
    topic: nonEmpty,
    prompt: localizedText,
    // Optional code snippet the student has to analyse (e.g. "what is the Big O?").
    code: nonEmpty.optional(),
    options: z
      .array(localizedText)
      .length(4, 'a question needs exactly 4 options'),
    correctIndex: z.number().int().min(0).max(3),
    explanation: localizedText,
  })
  .strict()

const jsName = z.string().regex(/^[A-Za-z_$][\w$]*$/, 'must be a valid JS name')

// Fields every exercise has, whatever kind it is.
const exerciseBase = {
  slug,
  title: localizedText,
  description: localizedText,
  difficulty: z.enum(['easy', 'medium', 'hard']),
  // "build": implement the module's data structure/algorithm step by step.
  // "interview": a LeetCode-style problem that uses it.
  category: z.enum(['build', 'interview']),
  starterCode: codeByLanguage,
  solution: codeByLanguage,
  expectedComplexity: z.object({ time: nonEmpty, space: nonEmpty }).strict(),
}

// kind "function": call one function with some arguments, check the result.
const functionTestSchema = z
  .object({
    // The arguments passed to the function, in order.
    args: z.array(z.unknown()),
    expected: z.unknown(),
  })
  .strict()

const functionExerciseSchema = z
  .object({
    ...exerciseBase,
    kind: z.literal('function'),
    functionName: jsName,
    tests: z
      .array(functionTestSchema)
      .min(5, 'an exercise needs at least 5 tests'),
  })
  .strict()

// kind "class": each test is a list of steps run on one instance.
//   { create: [args] }                      → new ClassName(...args)
//   { call: "method", args, expected? }     → instance.method(...args)
//   { read: "head.value", expected }        → read a property (dots go deeper)
const classStepSchema = z.union([
  z.object({ create: z.array(z.unknown()) }).strict(),
  z
    .object({
      call: jsName,
      args: z.array(z.unknown()).default([]),
      expected: z.unknown().optional(),
    })
    .strict(),
  z
    .object({
      read: z.string().regex(/^[A-Za-z_$][\w$]*(\.[A-Za-z_$][\w$]*)*$/),
      expected: z.unknown(),
    })
    .strict(),
])

const classTestSchema = z
  .object({ steps: z.array(classStepSchema).min(2) })
  .strict()
  .refine((test) => 'create' in test.steps[0], {
    message: 'the first step must be { create: [...] }',
  })

const classExerciseSchema = z
  .object({
    ...exerciseBase,
    kind: z.literal('class'),
    className: jsName,
    tests: z
      .array(classTestSchema)
      .min(5, 'an exercise needs at least 5 tests'),
  })
  .strict()

// "kind" is optional in the JSON and defaults to "function", so older
// exercises (like the ones in 02-big-o.json) don't need to change.
function addDefaultKind(value) {
  if (value && typeof value === 'object' && !('kind' in value)) {
    return { ...value, kind: 'function' }
  }
  return value
}

export const exerciseSchema = z.preprocess(
  addDefaultKind,
  z.discriminatedUnion('kind', [functionExerciseSchema, classExerciseSchema]),
)

// The module's folder inside Carlos's course folder (outside the repo), e.g.
// "course 1 /section 4 ", or a list when a module draws on both courses
// (Big O). Folder names keep their trailing spaces.
// Not `nonEmpty`: that trims, and the spaces are part of these names.
const folderName = z.string().regex(/\S/, 'must not be empty')
const sourceFolder = z.union([folderName, z.array(folderName).min(1)])

export const practiceSchema = z
  .object({
    slug,
    order: z.number().int().positive(),
    title: localizedText,
    sourceFolder,
    questions: z.array(questionSchema).min(1),
    exercises: z.array(exerciseSchema),
  })
  .strict()

const moduleSchema = z
  .object({
    slug,
    order: z.number().int().positive(),
    title: localizedText,
    // Optional: modules whose files aren't in the course folder yet, and the
    // ones we designed ourselves, have none.
    sourceFolder: sourceFolder.optional(),
  })
  .strict()

// Modules are grouped into sections ("Foundations", "Sorting"…) for display.
const sectionSchema = z
  .object({
    slug,
    title: localizedText,
    modules: z.array(slug).min(1),
  })
  .strict()

// The course outline: every module in order, even the ones with no quiz yet.
export const courseSchema = z
  .object({
    slug,
    title: localizedText,
    description: localizedText,
    modules: z.array(moduleSchema).min(1),
    sections: z.array(sectionSchema).min(1),
  })
  .strict()

// The front matter at the top of every lesson file.
export const lessonFrontMatterSchema = z
  .object({
    title: nonEmpty,
    order: z.number().int().positive(),
    minutes: z.number().int().positive(),
  })
  .strict()

// ---------------------------------------------------------------------------
// Lesson checkpoints: content/lessons/<module>/<NN-lesson>.checks.json
// One checkpoint per step of the lesson, in order. Students must pass it to
// unlock the next step.

const choiceCheckpointSchema = z
  .object({
    type: z.literal('choice'),
    question: localizedText,
    options: z
      .array(localizedText)
      .min(2, 'a choice checkpoint needs 2–4 options')
      .max(4, 'a choice checkpoint needs 2–4 options'),
    answer: z.number().int().min(0),
    hint: localizedText,
    explanation: localizedText,
  })
  .strict()
  .refine((checkpoint) => checkpoint.answer < checkpoint.options.length, {
    message: 'answer must be the index of one of the options',
    path: ['answer'],
  })

// Fields every code checkpoint has, whatever it tests.
const codeCheckpointBase = {
  type: z.literal('code'),
  task: localizedText,
  hint: localizedText,
  starterCode: nonEmpty,
  solution: nonEmpty,
}

const codeFunctionCheckpointSchema = z
  .object({
    ...codeCheckpointBase,
    kind: z.literal('function'),
    functionName: jsName,
    tests: z
      .array(functionTestSchema)
      .min(2, 'a code checkpoint needs at least 2 tests'),
  })
  .strict()

const codeClassCheckpointSchema = z
  .object({
    ...codeCheckpointBase,
    kind: z.literal('class'),
    className: jsName,
    tests: z
      .array(classTestSchema)
      .min(2, 'a code checkpoint needs at least 2 tests'),
  })
  .strict()

// "Explain it yourself": the student writes an explanation, then compares it
// with the model answer and ticks each checklist point it covers.
const explainCheckpointSchema = z
  .object({
    type: z.literal('explain'),
    question: localizedText,
    modelAnswer: localizedText,
    checklist: z
      .array(localizedText)
      .min(2, 'an explain checkpoint needs 2–5 checklist points')
      .max(5, 'an explain checkpoint needs 2–5 checklist points'),
  })
  .strict()

// Picked by `type` (and a code checkpoint by `kind`), so an error names the
// field that's wrong instead of "Invalid input".
export const checkpointSchema = z.discriminatedUnion('type', [
  choiceCheckpointSchema,
  explainCheckpointSchema,
  z.discriminatedUnion('kind', [
    codeFunctionCheckpointSchema,
    codeClassCheckpointSchema,
  ]),
])

export const lessonChecksSchema = z
  .object({ steps: z.array(checkpointSchema).min(1) })
  .strict()
