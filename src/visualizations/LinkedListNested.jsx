import { useTranslation } from 'react-i18next'
import StepPlayer from '../components/StepPlayer'
import LinkedListDiagram from './LinkedListDiagram'

// Under the hood of a linked list: the boxes and arrows are objects.
// - node: one node is a whole object, { value, next }
// - nested: the list is objects inside objects, built from the last guest
//   back to the first, with head on the outside and tail on the inside.

const LINE = ['Ana', 'Ben', 'Cleo', 'Dev']

// One node as code, split in parts so one part can be highlighted.
const NODE_PARTS = [
  { text: '{ ' },
  { text: "value: 'Dev'", part: 'value' },
  { text: ', ' },
  { text: 'next: null', part: 'next' },
  { text: ' }' },
]

const NODE_STEPS = [
  { captionKey: 'node', focus: null },
  { captionKey: 'value', focus: 'value' },
  { captionKey: 'next', focus: 'next' },
  { captionKey: 'whole', focus: 'whole' },
]

// The values from `first` to the end, e.g. 2 → ['Cleo', 'Dev'].
const from = (first) => LINE.slice(first)

const NESTED_STEPS = [
  { captionKey: 'dev', first: 3, pointers: {} },
  { captionKey: 'cleo', first: 2, pointers: {} },
  { captionKey: 'ben', first: 1, pointers: {} },
  { captionKey: 'ana', first: 0, pointers: { head: 'Ana' } },
  { captionKey: 'tail', first: 0, pointers: { head: 'Ana', tail: 'Dev' } },
  { captionKey: 'summary', first: 0, pointers: { head: 'Ana', tail: 'Dev' } },
]

// ['Cleo', 'Dev'] →
//   { value: 'Cleo', next:
//     { value: 'Dev', next: null }
//   }
// and with more nodes the last line is "} } }".
// (the closing braces get a line of their own, to keep lines short)
function nestedLines(values) {
  const lines = []
  for (let i = 0; i < values.length; i++) {
    const indent = '  '.repeat(i)
    const isLast = i === values.length - 1
    lines.push(
      isLast
        ? `${indent}{ value: '${values[i]}', next: null }`
        : `${indent}{ value: '${values[i]}', next:`,
    )
  }
  if (values.length > 1)
    lines.push(
      Array(values.length - 1)
        .fill('}')
        .join(' '),
    )
  return lines
}

const HIGHLIGHT = 'rounded bg-accent/30 text-slate-950'

function NodeStep({ focus }) {
  return (
    <div className="space-y-3">
      <LinkedListDiagram
        nodes={['Dev']}
        states={focus === 'whole' ? { Dev: 'found' } : {}}
      />
      <p className="font-mono text-sm">
        {NODE_PARTS.map((piece) => (
          <span
            key={piece.text}
            className={
              focus === 'whole' || (piece.part && piece.part === focus)
                ? HIGHLIGHT
                : ''
            }
          >
            {piece.text}
          </span>
        ))}
      </p>
    </div>
  )
}

// Each step lights up the node it's about: the one just added in front
// (the outermost object), or the last one for tail (the innermost).
function litLineOf(step, nodeCount) {
  if (step.captionKey === 'summary') return null
  return step.captionKey === 'tail' ? nodeCount - 1 : 0
}

function NestedStep({ step }) {
  const values = from(step.first)
  const lines = nestedLines(values)
  const litLine = litLineOf(step, values.length)
  const states =
    litLine === null
      ? {}
      : { [values[litLine]]: step.captionKey === 'tail' ? 'found' : 'new' }
  return (
    <div className="space-y-3">
      <LinkedListDiagram
        nodes={values}
        states={states}
        pointers={step.pointers}
      />
      <pre className="overflow-x-auto rounded-xl bg-slate-900 py-3 text-xs leading-6 text-slate-100 @sm:text-[13px]">
        {/* inline-block + min-w-full: a highlighted line stays highlighted
            all the way across, even when the code scrolls sideways. */}
        <div className="inline-block min-w-full">
          {lines.map((line, index) => (
            <code
              key={index}
              className={`block px-3 whitespace-pre ${index === litLine ? 'bg-accent/25' : ''}`}
            >
              {line}
            </code>
          ))}
        </div>
      </pre>
    </div>
  )
}

function LinkedListNested({ scene }) {
  const { t } = useTranslation()
  const sceneSteps = scene === 'node' ? NODE_STEPS : NESTED_STEPS
  const steps = sceneSteps.map((step) => ({
    ...step,
    caption: t(`viz.linkedListNested.${scene}.${step.captionKey}`),
  }))
  return (
    <StepPlayer
      title={t(`viz.linkedListNested.${scene}.title`)}
      steps={steps}
      renderStep={(step) =>
        scene === 'node' ? (
          <NodeStep focus={step.focus} />
        ) : (
          <NestedStep step={step} />
        )
      }
    />
  )
}

export default LinkedListNested
