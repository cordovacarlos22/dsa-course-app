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

export const sectionSchema = z
  .object({
    slug,
    order: z.number().int().positive(),
    title: localizedText,
    // Module folder in Carlos's course folder (outside the repo), e.g.
    // "recursos originales/modulo-02-big-o".
    sourceFolder: nonEmpty,
    questions: z.array(questionSchema).min(1),
    exercises: z.array(exerciseSchema),
  })
  .strict()

const moduleSchema = z
  .object({
    slug,
    order: z.number().int().positive(),
    title: localizedText,
    // Module folder in Carlos's course folder (outside the repo).
    sourceFolder: nonEmpty,
  })
  .strict()

// Modules are grouped into parts ("Foundations", "Sorting"…) for display.
const partSchema = z
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
    parts: z.array(partSchema).min(1),
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
