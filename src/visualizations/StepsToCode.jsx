import { useTranslation } from 'react-i18next'
import StepPlayer from '../components/StepPlayer'

// Break it down: charCount starts as a plan written in comments, and each
// comment gets its code underneath, one step at a time. isAlphaNumeric is a
// helper we haven't written yet: naming a step you can't do yet lets you
// keep going.

const PLAN = [
  { key: 'makeObject', indent: '  ', code: ['  const result = {}'] },
  {
    key: 'loop',
    indent: '  ',
    code: [
      '  for (let i = 0; i < str.length; i++) {',
      '    const char = str[i].toLowerCase()',
    ],
  },
  {
    key: 'addOne',
    indent: '    ',
    code: [
      '    if (isAlphaNumeric(char) && result[char] > 0) {',
      '      result[char]++',
    ],
  },
  {
    key: 'setOne',
    indent: '    ',
    code: ['    } else if (isAlphaNumeric(char)) {', '      result[char] = 1'],
  },
  { key: 'skip', indent: '    ', code: ['    }', '  }'] },
  { key: 'returnIt', indent: '  ', code: ['  return result'] },
]

const STEPS = [
  { captionKey: 'start', filled: 0 },
  ...PLAN.map((part, index) => ({ captionKey: part.key, filled: index + 1 })),
  { captionKey: 'summary', filled: PLAN.length, done: true },
]

function StepsToCode() {
  const { t } = useTranslation()
  const steps = STEPS.map((step) => ({
    ...step,
    caption: t(`viz.stepsToCode.${step.captionKey}`),
  }))
  return (
    <StepPlayer
      title={t('viz.stepsToCode.title')}
      steps={steps}
      renderStep={(step) => (
        <pre className="overflow-x-auto rounded-xl bg-slate-900 p-3 text-[13px] leading-6 text-slate-100">
          {/* inline-block min-w-full: a highlighted line spans the whole box,
              even when a long line scrolls sideways. */}
          <code className="inline-block min-w-full">
            <span className="block">{'function charCount(str) {'}</span>
            {PLAN.map((part, index) => {
              const isFilled = index < step.filled
              const isNewest = index === step.filled - 1 && !step.done
              return (
                <span key={part.key} className="block">
                  <span className="block text-emerald-300">
                    {part.indent}
                    {'// '}
                    {t(`viz.stepsToCode.comments.${part.key}`)}
                  </span>
                  {isFilled &&
                    part.code.map((line) => (
                      <span
                        key={line}
                        className={`block transition-colors duration-500 ${
                          isNewest ? 'bg-accent/25' : ''
                        }`}
                      >
                        {line}
                      </span>
                    ))}
                </span>
              )
            })}
            <span className="block">{'}'}</span>
          </code>
        </pre>
      )}
    />
  )
}

export default StepsToCode
