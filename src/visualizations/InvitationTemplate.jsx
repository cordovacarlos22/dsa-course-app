import { useTranslation } from 'react-i18next'
import StepPlayer from '../components/StepPlayer'
import { BOX_STATE_STYLES, DEFAULT_BOX_STYLE } from './boxStyles'

// A class is an invitation template: one Invitation class prints as many
// invitations (instances) as we want, and each keeps its own guest. Three
// scenes, one per lesson step (see ./index.js):
// - instances: new Invitation(...) twice
// - new: the four things `new` does
// - methods: getGuest and setGuest on one invitation, not the other

const CLASS_LINES = [
  'class Invitation {',
  '  constructor(guest)',
  '  getGuest()',
  '  setGuest(guest)',
  '}',
]

const FOR_ANA = { name: 'forAna', guest: 'Ana' }
const FOR_BEN = { name: 'forBen', guest: 'Ben' }

const SCENES = {
  instances: [
    { captionKey: 'start', code: 'class Invitation { … }', invitations: [] },
    {
      captionKey: 'first',
      code: "const forAna = new Invitation('Ana')",
      invitations: [{ ...FOR_ANA, state: 'new' }],
    },
    {
      captionKey: 'second',
      code: "const forBen = new Invitation('Ben')",
      invitations: [FOR_ANA, { ...FOR_BEN, state: 'new' }],
    },
    {
      captionKey: 'summary',
      code: 'class Invitation { … }',
      invitations: [FOR_ANA, FOR_BEN],
    },
  ],
  new: [
    {
      captionKey: 'start',
      code: "const forAna = new Invitation('Ana')",
      stage: 0,
    },
    {
      captionKey: 'empty',
      code: "const forAna = new Invitation('Ana')",
      stage: 1,
    },
    {
      captionKey: 'this',
      code: "const forAna = new Invitation('Ana')",
      stage: 2,
    },
    { captionKey: 'run', code: "this.guest = 'Ana'", stage: 3 },
    {
      captionKey: 'returned',
      code: "const forAna = new Invitation('Ana')",
      stage: 4,
    },
  ],
  methods: [
    {
      captionKey: 'start',
      code: 'forAna, forBen',
      invitations: [FOR_ANA, FOR_BEN],
    },
    {
      captionKey: 'getOne',
      code: "forAna.getGuest() // 'Ana'",
      invitations: [{ ...FOR_ANA, state: 'found' }, FOR_BEN],
    },
    {
      captionKey: 'getTwo',
      code: "forBen.getGuest() // 'Ben'",
      invitations: [FOR_ANA, { ...FOR_BEN, state: 'found' }],
    },
    {
      captionKey: 'set',
      code: "forBen.setGuest('Benny')",
      invitations: [FOR_ANA, { ...FOR_BEN, guest: 'Benny', state: 'moved' }],
    },
    {
      captionKey: 'getAgain',
      code: "forBen.getGuest() // 'Benny'",
      invitations: [FOR_ANA, { ...FOR_BEN, guest: 'Benny', state: 'found' }],
    },
    {
      captionKey: 'summary',
      code: 'forAna, forBen',
      invitations: [FOR_ANA, { ...FOR_BEN, guest: 'Benny' }],
    },
  ],
}

function ClassCard() {
  const { t } = useTranslation()
  return (
    <div className="rounded-2xl border-2 border-dashed border-brand/60 bg-sky-50/50 p-3">
      <p className="text-[11px] font-bold tracking-wide text-slate-500 uppercase">
        {t('viz.invitationTemplate.classLabel')}
      </p>
      <pre className="mt-1 font-mono text-xs leading-5 text-slate-800">
        {CLASS_LINES.join('\n')}
      </pre>
    </div>
  )
}

function Invitations({ invitations }) {
  const { t } = useTranslation()
  return (
    <div>
      <p className="text-[11px] font-bold tracking-wide text-slate-500 uppercase">
        {t('viz.invitationTemplate.instancesLabel')}
      </p>
      <ul className="mt-1 flex min-h-24 flex-wrap gap-2">
        {invitations.map((invitation) => (
          <li
            key={invitation.name}
            className={`flex h-24 w-28 flex-col items-center justify-center rounded-lg border-2 text-center transition-colors duration-500 ${
              BOX_STATE_STYLES[invitation.state] ?? DEFAULT_BOX_STYLE
            }`}
          >
            <span aria-hidden="true" className="text-lg leading-none">
              ✉️
            </span>
            <span className="text-sm font-bold">{invitation.name}</span>
            <span className="font-mono text-xs">
              &apos;{invitation.guest}&apos;
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

// The four things `new Invitation('Ana')` does, ticked off one by one,
// next to the object as it's being built.
const NEW_OBJECT_AT_STAGE = [
  '',
  '{}',
  'this → {}',
  "this → { guest: 'Ana' }",
  "forAna → { guest: 'Ana' }",
]

function NewSteps({ stage }) {
  const { t } = useTranslation()
  return (
    <div className="grid gap-3 @lg:grid-cols-2">
      <ol className="space-y-1">
        {[1, 2, 3, 4].map((number) => (
          <li
            key={number}
            className={`flex gap-2 rounded-lg px-2 py-1 text-sm transition-colors duration-500 ${
              number === stage
                ? 'bg-amber-50 font-semibold'
                : number < stage
                  ? 'text-slate-700'
                  : 'text-slate-300'
            }`}
          >
            <span aria-hidden="true" className="w-4 text-green-700">
              {number <= stage ? '✓' : ''}
            </span>
            {t(`viz.invitationTemplate.new.parts.${number - 1}`)}
          </li>
        ))}
      </ol>
      <p className="flex min-h-12 items-center justify-center rounded-xl border-2 border-slate-200 p-3 font-mono text-sm">
        {NEW_OBJECT_AT_STAGE[stage]}
      </p>
    </div>
  )
}

function InvitationTemplate({ scene }) {
  const { t } = useTranslation()
  const steps = SCENES[scene].map((step) => ({
    ...step,
    caption: t(`viz.invitationTemplate.${scene}.${step.captionKey}`),
  }))
  return (
    <StepPlayer
      title={t(`viz.invitationTemplate.${scene}.title`)}
      steps={steps}
      renderStep={(step) => (
        <div className="space-y-3">
          <p className="font-mono text-sm break-all">{step.code}</p>
          {scene === 'new' ? (
            <NewSteps stage={step.stage} />
          ) : (
            <div className="grid gap-3 @lg:grid-cols-[minmax(0,14rem)_minmax(0,1fr)]">
              <ClassCard />
              <Invitations invitations={step.invitations} />
            </div>
          )}
        </div>
      )}
    />
  )
}

export default InvitationTemplate
