import { useTranslation } from 'react-i18next'
import StepPlayer from '../components/StepPlayer'
import { BOX_STATE_STYLES, DEFAULT_BOX_STYLE } from './boxStyles'

// A class is a cookie cutter: one Cookie class stamps out as many cookies
// (instances) as we want, and each keeps its own flavor. Three scenes, one
// per lesson step (see ./index.js):
// - instances: new Cookie(...) twice
// - new: the four things `new` does
// - methods: getFlavor and setFlavor on one cookie, not the other

const CLASS_LINES = [
  'class Cookie {',
  '  constructor(flavor)',
  '  getFlavor()',
  '  setFlavor(flavor)',
  '}',
]

const CHOCOLATE = { name: 'cookieOne', flavor: 'chocolate' }
const VANILLA = { name: 'cookieTwo', flavor: 'vanilla' }

const SCENES = {
  instances: [
    { captionKey: 'start', code: 'class Cookie { … }', cookies: [] },
    {
      captionKey: 'first',
      code: "const cookieOne = new Cookie('chocolate')",
      cookies: [{ ...CHOCOLATE, state: 'new' }],
    },
    {
      captionKey: 'second',
      code: "const cookieTwo = new Cookie('vanilla')",
      cookies: [CHOCOLATE, { ...VANILLA, state: 'new' }],
    },
    {
      captionKey: 'summary',
      code: 'class Cookie { … }',
      cookies: [CHOCOLATE, VANILLA],
    },
  ],
  new: [
    {
      captionKey: 'start',
      code: "const cookieOne = new Cookie('chocolate')",
      stage: 0,
    },
    {
      captionKey: 'empty',
      code: "const cookieOne = new Cookie('chocolate')",
      stage: 1,
    },
    {
      captionKey: 'this',
      code: "const cookieOne = new Cookie('chocolate')",
      stage: 2,
    },
    { captionKey: 'run', code: "this.flavor = 'chocolate'", stage: 3 },
    {
      captionKey: 'returned',
      code: "const cookieOne = new Cookie('chocolate')",
      stage: 4,
    },
  ],
  methods: [
    {
      captionKey: 'start',
      code: 'cookieOne, cookieTwo',
      cookies: [CHOCOLATE, VANILLA],
    },
    {
      captionKey: 'getOne',
      code: "cookieOne.getFlavor() // 'chocolate'",
      cookies: [{ ...CHOCOLATE, state: 'found' }, VANILLA],
    },
    {
      captionKey: 'getTwo',
      code: "cookieTwo.getFlavor() // 'vanilla'",
      cookies: [CHOCOLATE, { ...VANILLA, state: 'found' }],
    },
    {
      captionKey: 'set',
      code: "cookieOne.setFlavor('oatmeal')",
      cookies: [{ ...CHOCOLATE, flavor: 'oatmeal', state: 'moved' }, VANILLA],
    },
    {
      captionKey: 'getAgain',
      code: "cookieOne.getFlavor() // 'oatmeal'",
      cookies: [{ ...CHOCOLATE, flavor: 'oatmeal', state: 'found' }, VANILLA],
    },
    {
      captionKey: 'summary',
      code: 'cookieOne, cookieTwo',
      cookies: [{ ...CHOCOLATE, flavor: 'oatmeal' }, VANILLA],
    },
  ],
}

function ClassCard() {
  const { t } = useTranslation()
  return (
    <div className="rounded-2xl border-2 border-dashed border-brand/60 bg-sky-50/50 p-3">
      <p className="text-[11px] font-bold tracking-wide text-slate-500 uppercase">
        {t('viz.cookieCutter.classLabel')}
      </p>
      <pre className="mt-1 font-mono text-xs leading-5 text-slate-800">
        {CLASS_LINES.join('\n')}
      </pre>
    </div>
  )
}

function Cookies({ cookies }) {
  const { t } = useTranslation()
  return (
    <div>
      <p className="text-[11px] font-bold tracking-wide text-slate-500 uppercase">
        {t('viz.cookieCutter.instancesLabel')}
      </p>
      <ul className="mt-1 flex min-h-24 flex-wrap gap-2">
        {cookies.map((cookie) => (
          <li
            key={cookie.name}
            className={`flex h-24 w-24 flex-col items-center justify-center rounded-full border-2 text-center transition-colors duration-500 ${
              BOX_STATE_STYLES[cookie.state] ?? DEFAULT_BOX_STYLE
            }`}
          >
            <span className="text-sm font-bold">{cookie.name}</span>
            <span className="font-mono text-xs">
              &apos;{cookie.flavor}&apos;
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

// The four things `new Cookie('chocolate')` does, ticked off one by one,
// next to the object as it's being built.
const NEW_OBJECT_AT_STAGE = [
  '',
  '{}',
  'this → {}',
  "this → { flavor: 'chocolate' }",
  "cookieOne → { flavor: 'chocolate' }",
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
            {t(`viz.cookieCutter.new.parts.${number - 1}`)}
          </li>
        ))}
      </ol>
      <p className="flex min-h-12 items-center justify-center rounded-xl border-2 border-slate-200 p-3 font-mono text-sm">
        {NEW_OBJECT_AT_STAGE[stage]}
      </p>
    </div>
  )
}

function CookieCutter({ scene }) {
  const { t } = useTranslation()
  const steps = SCENES[scene].map((step) => ({
    ...step,
    caption: t(`viz.cookieCutter.${scene}.${step.captionKey}`),
  }))
  return (
    <StepPlayer
      title={t(`viz.cookieCutter.${scene}.title`)}
      steps={steps}
      renderStep={(step) => (
        <div className="space-y-3">
          <p className="font-mono text-sm break-all">{step.code}</p>
          {scene === 'new' ? (
            <NewSteps stage={step.stage} />
          ) : (
            <div className="grid gap-3 @lg:grid-cols-[minmax(0,14rem)_minmax(0,1fr)]">
              <ClassCard />
              <Cookies cookies={step.cookies} />
            </div>
          )}
        </div>
      )}
    />
  )
}

export default CookieCutter
