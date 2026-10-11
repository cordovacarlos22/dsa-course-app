import { useTranslation } from 'react-i18next'
import StepPlayer from '../components/StepPlayer'
import GuestRow from './GuestRow'
import { guestList } from './guests'

// Different inputs, different variables: a loop over the guests (a) then a
// loop over the helpers (b) is O(a + b). A loop over helpers inside a loop
// over guests is O(a · b).

const GUESTS = guestList(4)
const HELPERS = ['Rosa', 'Sam']

const all = (count, state) =>
  Object.fromEntries(Array.from({ length: count }, (_, k) => [k, state]))

const STEPS = [
  { captionKey: 'start', guests: {}, helpers: {}, grid: false },
  { captionKey: 'guests', guests: all(4, 'found'), helpers: {}, grid: false },
  {
    captionKey: 'helpers',
    guests: all(4, 'found'),
    helpers: all(2, 'found'),
    grid: false,
  },
  { captionKey: 'grid', guests: {}, helpers: {}, grid: true },
  { captionKey: 'summary', guests: {}, helpers: {}, grid: true },
]

function TwoInputs() {
  const { t } = useTranslation()
  const steps = STEPS.map((step) => ({
    ...step,
    caption: t(`viz.twoInputs.${step.captionKey}`),
  }))
  return (
    <StepPlayer
      title={t('viz.twoInputs.title')}
      steps={steps}
      renderStep={(step) =>
        step.grid ? (
          <table className="border-separate border-spacing-1 text-center text-xs">
            <thead>
              <tr>
                <th />
                {HELPERS.map((helper) => (
                  <th
                    key={helper}
                    className="px-1 font-semibold text-slate-600"
                  >
                    {helper}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {GUESTS.map((guest) => (
                <tr key={guest}>
                  <th className="pr-1 text-right font-semibold text-slate-600">
                    {guest}
                  </th>
                  {HELPERS.map((helper) => (
                    <td
                      key={helper}
                      className="h-7 w-12 rounded bg-brand text-white"
                    >
                      🙏
                    </td>
                  ))}
                </tr>
              ))}
              <tr>
                <td
                  colSpan={3}
                  className="pt-1 text-left text-sm font-semibold text-brand"
                >
                  a · b = 4 · 2 = 8
                </td>
              </tr>
            </tbody>
          </table>
        ) : (
          <div className="space-y-3">
            <div>
              <p className="text-xs font-semibold text-slate-500">
                guests (a = 4)
              </p>
              <GuestRow items={GUESTS} states={step.guests} />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500">
                helpers (b = 2)
              </p>
              <GuestRow items={HELPERS} states={step.helpers} />
            </div>
          </div>
        )
      }
    />
  )
}

export default TwoInputs
