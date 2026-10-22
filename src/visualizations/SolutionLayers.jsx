import { useTranslation } from 'react-i18next'
import StepPlayer from '../components/StepPlayer'
import ObjectCards from './ObjectCards'

// Solve a simpler problem first: countCharacters without the hard parts, then the
// hard parts added back one at a time. After each layer we run it on
// 'Hi Ana!' and look at what's still wrong. Nothing written earlier is
// thrown away: each layer only adds.

const LAYERS = [
  {
    lines: [
      'function countCharacters(text) {',
      '  const result = {}',
      '  for (let i = 0; i < text.length; i++) {',
      '    const character = text[i]',
      '    if (result[character] > 0) {',
      '      result[character]++',
      '    } else {',
      '      result[character] = 1',
      '    }',
      '  }',
      '  return result',
      '}',
    ],
    added: [],
    // ' ' is drawn as ␣ so the space key is visible.
    output: [
      ['H', 1],
      ['i', 1],
      ['␣', 1],
      ['A', 1],
      ['n', 1],
      ['a', 1],
      ['!', 1],
    ],
    problems: { H: 'moved', '␣': 'moved', A: 'moved', '!': 'moved' },
  },
  {
    lines: [
      'function countCharacters(text) {',
      '  const result = {}',
      '  for (let i = 0; i < text.length; i++) {',
      '    const character = text[i].toLowerCase()',
      '    if (result[character] > 0) {',
      '      result[character]++',
      '    } else {',
      '      result[character] = 1',
      '    }',
      '  }',
      '  return result',
      '}',
    ],
    added: [4],
    output: [
      ['h', 1],
      ['i', 1],
      ['␣', 1],
      ['a', 2],
      ['n', 1],
      ['!', 1],
    ],
    problems: { '␣': 'moved', '!': 'moved' },
  },
  {
    lines: [
      'function countCharacters(text) {',
      '  const result = {}',
      '  for (let i = 0; i < text.length; i++) {',
      '    const character = text[i].toLowerCase()',
      '    if (isLetterOrDigit(character)) {',
      '      if (result[character] > 0) {',
      '        result[character]++',
      '      } else {',
      '        result[character] = 1',
      '      }',
      '    }',
      '  }',
      '  return result',
      '}',
    ],
    added: [5, 11],
    output: [
      ['h', 1],
      ['i', 1],
      ['a', 2],
      ['n', 1],
    ],
    problems: {},
  },
]

const allFound = (output) =>
  Object.fromEntries(output.map(([key]) => [key, 'found']))

const STEPS = [
  { captionKey: 'simple', layer: 0, showOutput: false },
  { captionKey: 'simpleOutput', layer: 0, showOutput: true },
  { captionKey: 'lowercase', layer: 1, showOutput: false },
  { captionKey: 'lowercaseOutput', layer: 1, showOutput: true },
  { captionKey: 'check', layer: 2, showOutput: false },
  { captionKey: 'checkOutput', layer: 2, showOutput: true },
]

function SolutionLayers() {
  const { t } = useTranslation()
  const steps = STEPS.map((step) => ({
    ...step,
    caption: t(`viz.solutionLayers.${step.captionKey}`),
  }))
  return (
    <StepPlayer
      title={t('viz.solutionLayers.title')}
      steps={steps}
      renderStep={(step) => {
        const layer = LAYERS[step.layer]
        const isLast = step.layer === LAYERS.length - 1
        return (
          <div className="grid gap-3 @2xl:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
            <pre className="overflow-x-auto rounded-xl bg-slate-900 py-3 text-[13px] leading-6 text-slate-100">
              {/* A highlighted line spans the whole box, even when a long
                  line scrolls sideways. */}
              <div className="inline-block min-w-full">
                {layer.lines.map((line, index) => (
                  <code
                    key={index}
                    className={`block px-3 whitespace-pre ${
                      layer.added.includes(index + 1) && !step.showOutput
                        ? 'bg-accent/25'
                        : ''
                    }`}
                  >
                    {line}
                  </code>
                ))}
              </div>
            </pre>
            <div className="space-y-2 rounded-xl border border-slate-200 p-3">
              <p className="font-mono text-sm">
                countCharacters(&apos;Hi Ana!&apos;)
              </p>
              {step.showOutput ? (
                <ObjectCards
                  entries={layer.output}
                  states={isLast ? allFound(layer.output) : layer.problems}
                />
              ) : (
                <p className="text-sm text-slate-500">…</p>
              )}
            </div>
          </div>
        )
      }}
    />
  )
}

export default SolutionLayers
