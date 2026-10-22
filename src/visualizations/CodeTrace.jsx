import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import StepPlayer from '../components/StepPlayer'
import GuestRow from './GuestRow'
import LinkedListDiagram from './LinkedListDiagram'

// Plays a piece of code line by line: the current line is highlighted, and
// next to it the student sees the input as boxes, the variables, a counter of
// the operations so far, and what the code printed. See ./traces/index.js.

// The size of an input: a number (n), or how many guests / orders /
// answers / characters / list values it has. Inputs named by a `label`
// (like a constructor call) have no size.
function sizeOf(input) {
  if (input.n !== undefined) return input.n
  if (input.values) return input.values.length
  if (input.rsvps) return Object.keys(input.rsvps).length
  if (input.text !== undefined) return input.text.length
  if (input.label !== undefined) return 0
  return (input.guests ?? input.orders).length
}

// The boxes drawn under the code: the guest list by default. A trace can
// draw its own boxes with items(input), or none by returning null.
function itemsOf(trace, input) {
  return trace.items ? trace.items(input) : input.guests
}

function CodeTrace({ trace }) {
  const { t } = useTranslation()
  const [inputIndex, setInputIndex] = useState(0)
  const input = trace.inputs[inputIndex]
  const captionOf = (step) =>
    t(`viz.trace.${trace.key}.${step.captionKey}`, step.params)
  const steps = Array.from(trace.run(input)).map((step) => ({
    ...step,
    caption: captionOf(step),
  }))

  const picker =
    trace.inputs.length > 1 ? (
      <div
        role="group"
        aria-label={t('viz.trace.pickInput')}
        className="mt-2 flex flex-wrap gap-2"
      >
        {trace.inputs.map((option, index) => (
          <button
            key={index}
            type="button"
            aria-pressed={index === inputIndex}
            onClick={() => setInputIndex(index)}
            className={`rounded-full border px-3 py-1 text-xs font-semibold ${
              index === inputIndex
                ? 'border-brand bg-brand text-white'
                : 'border-slate-300 text-slate-700 hover:border-brand'
            }`}
          >
            {t(`viz.trace.${trace.key}.input`, {
              n: sizeOf(option).toLocaleString('en-US'),
              count: sizeOf(option),
              name: option.name,
              answer: option.answer,
              text: option.text,
              label: option.label,
            })}
          </button>
        ))}
      </div>
    ) : null

  return (
    <StepPlayer
      // A new input starts the animation again from the first step.
      key={inputIndex}
      title={t(`viz.trace.${trace.key}.title`)}
      toolbar={picker}
      steps={steps}
      renderStep={(step) => (
        <TraceStep trace={trace} input={input} step={step} />
      )}
    />
  )
}

function TraceStep({ trace, input, step }) {
  const { t } = useTranslation()
  const lines = trace.code.split('\n')
  // Side by side only when the animation itself is wide enough (42rem);
  // otherwise the code goes on top and the guest list below it.
  return (
    <div className="grid gap-3 @2xl:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
      <pre className="overflow-x-auto rounded-xl bg-slate-900 py-3 text-[13px] leading-6 text-slate-100">
        {/* inline-block + min-w-full: the current line stays highlighted all
            the way across, even when a long line makes the code scroll. */}
        <div className="inline-block min-w-full">
          {lines.map((line, index) => {
            const number = index + 1
            const isCurrent = number === step.line
            const cost = step.costs?.[number]
            return (
              <div
                key={number}
                aria-current={isCurrent ? 'step' : undefined}
                className={`flex gap-3 px-3 transition-colors duration-300 ${
                  isCurrent ? 'bg-accent/25' : ''
                }`}
              >
                <span className="w-4 shrink-0 text-right text-slate-500 select-none">
                  {number}
                </span>
                <code className="flex-1 whitespace-pre">{line}</code>
                {cost && (
                  <span className="shrink-0 rounded bg-sky-400/20 px-1.5 text-xs font-bold text-sky-200">
                    {cost}
                  </span>
                )}
              </div>
            )
          })}
        </div>
      </pre>

      <div className="space-y-3">
        {step.list && <LinkedListDiagram {...step.list} />}
        {itemsOf(trace, input) && (
          <GuestRow
            items={itemsOf(trace, input)}
            states={step.states}
            pointers={step.pointers}
          />
        )}
        {step.vars?.length > 0 && (
          <dl className="flex flex-wrap gap-2 text-sm">
            {step.vars.map(([name, value]) => (
              <div
                key={name}
                className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 font-mono"
              >
                <dt className="inline text-slate-500">{name} = </dt>
                <dd className="inline font-bold">{String(value)}</dd>
              </div>
            ))}
          </dl>
        )}
        {trace.counter && (
          <p className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-brand tabular-nums">
              {step.ops}
            </span>
            <span className="text-sm text-slate-600">
              {t(`viz.trace.counters.${trace.counter}`, { count: step.ops })}
            </span>
          </p>
        )}
        {step.output && (
          <div className="rounded-lg bg-slate-950 p-2 font-mono text-xs text-slate-100">
            <p className="mb-1 font-sans text-[10px] text-slate-400 uppercase">
              {t('viz.trace.console')}
            </p>
            {step.output.length === 0 ? (
              <p className="text-slate-500">…</p>
            ) : (
              step.output.map((text, index) => <p key={index}>{text}</p>)
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default CodeTrace
