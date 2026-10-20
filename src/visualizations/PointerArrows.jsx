import { useTranslation } from 'react-i18next'
import StepPlayer from '../components/StepPlayer'
import { BOX_STATE_STYLES } from './boxStyles'

// Values vs references. A variable that holds a number holds the number
// itself, so copying it copies the number. A variable that holds an object
// holds an arrow to it, so copying it copies the arrow: both variables now
// point to the same object. An object nothing points to can't be reached,
// and garbage collection removes it. Three scenes, one per lesson step:
// value-copy, reference-copy and pointer-move.

// Each object gets its own color, and the arrows pointing to it share it.
const OBJECT_COLORS = {
  A: { card: 'border-sky-500 bg-sky-50', chip: 'bg-sky-100 text-sky-900' },
  B: {
    card: 'border-amber-500 bg-amber-50',
    chip: 'bg-amber-100 text-amber-900',
  },
}

const SCENES = {
  valueCopy: [
    {
      captionKey: 'start',
      code: 'let guestCount = 5',
      vars: [{ name: 'guestCount', value: 5, state: 'new' }],
    },
    {
      captionKey: 'copy',
      code: 'let seats = guestCount',
      vars: [
        { name: 'guestCount', value: 5 },
        { name: 'seats', value: 5, state: 'new' },
      ],
    },
    {
      captionKey: 'change',
      code: 'guestCount = 8',
      vars: [
        { name: 'guestCount', value: 8, state: 'moved' },
        { name: 'seats', value: 5 },
      ],
    },
    {
      captionKey: 'summary',
      code: 'seats // 5',
      vars: [
        { name: 'guestCount', value: 8 },
        { name: 'seats', value: 5, state: 'found' },
      ],
    },
  ],
  referenceCopy: [
    {
      captionKey: 'start',
      code: "let card = { value: 'Ana' }",
      vars: [{ name: 'card', to: 'A' }],
      objects: [{ id: 'A', value: 'Ana', state: 'new' }],
    },
    {
      captionKey: 'copy',
      code: 'let sameCard = card',
      vars: [
        { name: 'card', to: 'A' },
        { name: 'sameCard', to: 'A', state: 'new' },
      ],
      objects: [{ id: 'A', value: 'Ana' }],
    },
    {
      captionKey: 'change',
      code: "card.value = 'Ben'",
      vars: [
        { name: 'card', to: 'A' },
        { name: 'sameCard', to: 'A' },
      ],
      objects: [{ id: 'A', value: 'Ben', state: 'moved' }],
    },
    {
      captionKey: 'read',
      code: "sameCard.value // 'Ben'",
      vars: [
        { name: 'card', to: 'A' },
        { name: 'sameCard', to: 'A', state: 'found' },
      ],
      objects: [{ id: 'A', value: 'Ben', state: 'found' }],
    },
    {
      captionKey: 'summary',
      code: 'card === sameCard // true',
      vars: [
        { name: 'card', to: 'A' },
        { name: 'sameCard', to: 'A' },
      ],
      objects: [{ id: 'A', value: 'Ben' }],
    },
  ],
  pointerMove: [
    {
      captionKey: 'start',
      code: "let first = { value: 'Ana' }",
      vars: [{ name: 'first', to: 'A' }],
      objects: [{ id: 'A', value: 'Ana', state: 'new' }],
    },
    {
      captionKey: 'second',
      code: 'let second = first',
      vars: [
        { name: 'first', to: 'A' },
        { name: 'second', to: 'A', state: 'new' },
      ],
      objects: [{ id: 'A', value: 'Ana' }],
    },
    {
      captionKey: 'third',
      code: "let third = { value: 'Cleo' }",
      vars: [
        { name: 'first', to: 'A' },
        { name: 'second', to: 'A' },
        { name: 'third', to: 'B', state: 'new' },
      ],
      objects: [
        { id: 'A', value: 'Ana' },
        { id: 'B', value: 'Cleo', state: 'new' },
      ],
    },
    {
      captionKey: 'moveSecond',
      code: 'second = third',
      vars: [
        { name: 'first', to: 'A' },
        { name: 'second', to: 'B', state: 'moved' },
        { name: 'third', to: 'B' },
      ],
      objects: [
        { id: 'A', value: 'Ana' },
        { id: 'B', value: 'Cleo' },
      ],
    },
    {
      captionKey: 'moveFirst',
      code: 'first = third',
      vars: [
        { name: 'first', to: 'B', state: 'moved' },
        { name: 'second', to: 'B' },
        { name: 'third', to: 'B' },
      ],
      objects: [
        { id: 'A', value: 'Ana', state: 'removed' },
        { id: 'B', value: 'Cleo' },
      ],
    },
    {
      captionKey: 'collected',
      code: '// garbage collection',
      vars: [
        { name: 'first', to: 'B' },
        { name: 'second', to: 'B' },
        { name: 'third', to: 'B' },
      ],
      objects: [{ id: 'B', value: 'Cleo' }],
    },
  ],
}

// Like BOX_STATE_STYLES.removed, but only the object's value is crossed out,
// so "nothing points here" stays easy to read.
const UNREACHABLE_STYLE = 'border-dashed border-red-300 bg-white text-slate-500'

const highlight = (state) =>
  state ? (BOX_STATE_STYLES[state] ?? '') : 'border-slate-300 bg-white'

function Variables({ vars }) {
  const { t } = useTranslation()
  return (
    <div>
      <p className="text-[11px] font-bold tracking-wide text-slate-500 uppercase">
        {t('viz.pointerArrows.variables')}
      </p>
      <ul className="mt-1 space-y-1.5">
        {vars.map((variable) => (
          <li
            key={variable.name}
            className={`flex items-center gap-2 rounded-lg border-2 px-2 py-1 font-mono text-sm transition-colors duration-500 ${highlight(variable.state)}`}
          >
            <span className="font-bold">{variable.name}</span>
            {variable.to ? (
              <span
                className={`ml-auto rounded px-1.5 text-xs font-bold ${OBJECT_COLORS[variable.to].chip}`}
              >
                → {variable.to}
              </span>
            ) : (
              <span className="ml-auto text-base font-bold">
                {variable.value}
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}

function Objects({ objects, vars }) {
  const { t } = useTranslation()
  return (
    <div>
      <p className="text-[11px] font-bold tracking-wide text-slate-500 uppercase">
        {t('viz.pointerArrows.objects')}
      </p>
      <ul className="mt-1 space-y-1.5">
        {objects.map((object) => {
          const pointedBy = vars
            .filter((variable) => variable.to === object.id)
            .map((variable) => variable.name)
          const isUnreachable = object.state === 'removed'
          return (
            <li
              key={object.id}
              className={`rounded-lg border-2 px-2 py-1 transition-colors duration-500 ${
                isUnreachable
                  ? UNREACHABLE_STYLE
                  : object.state
                    ? BOX_STATE_STYLES[object.state]
                    : OBJECT_COLORS[object.id].card
              }`}
            >
              <p className="flex items-center gap-2 font-mono text-sm">
                <span
                  className={`rounded px-1.5 text-xs font-bold ${OBJECT_COLORS[object.id].chip}`}
                >
                  {object.id}
                </span>
                <span className={isUnreachable ? 'line-through' : ''}>
                  {`{ value: '${object.value}' }`}
                </span>
              </p>
              <p className="text-xs text-slate-600">
                {pointedBy.length > 0
                  ? t('viz.pointerArrows.pointedBy', {
                      names: pointedBy.join(', '),
                    })
                  : t('viz.pointerArrows.nobody')}
              </p>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

function PointerArrows({ scene }) {
  const { t } = useTranslation()
  const steps = SCENES[scene].map((step) => ({
    ...step,
    caption: t(`viz.pointerArrows.${scene}.${step.captionKey}`),
  }))
  return (
    <StepPlayer
      title={t(`viz.pointerArrows.${scene}.title`)}
      steps={steps}
      renderStep={(step) => (
        <div className="space-y-3">
          <p className="font-mono text-sm break-all">{step.code}</p>
          <div className="grid gap-3 @md:grid-cols-2">
            <Variables vars={step.vars} />
            {step.objects && (
              <Objects objects={step.objects} vars={step.vars} />
            )}
          </div>
        </div>
      )}
    />
  )
}

export default PointerArrows
