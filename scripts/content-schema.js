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

const testCaseSchema = z
  .object({
    // The arguments passed to the function, in order.
    args: z.array(z.unknown()),
    expected: z.unknown(),
  })
  .strict()

export const exerciseSchema = z
  .object({
    slug,
    title: localizedText,
    description: localizedText,
    difficulty: z.enum(['easy', 'medium', 'hard']),
    functionName: z
      .string()
      .regex(/^[A-Za-z_$][\w$]*$/, 'must be a valid JS function name'),
    starterCode: codeByLanguage,
    solution: codeByLanguage,
    tests: z.array(testCaseSchema).min(5, 'an exercise needs at least 5 tests'),
    expectedComplexity: z.object({ time: nonEmpty, space: nonEmpty }).strict(),
  })
  .strict()

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

// The course outline: every module in order, even the ones with no quiz yet.
export const courseSchema = z
  .object({
    slug,
    title: localizedText,
    description: localizedText,
    modules: z.array(moduleSchema).min(1),
  })
  .strict()
