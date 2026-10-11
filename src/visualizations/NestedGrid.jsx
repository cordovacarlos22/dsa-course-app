import { useTranslation } from 'react-i18next'
import StepPlayer from '../components/StepPlayer'
import { guestList } from './guests'

// O(n²): for every guest (a row), the inner loop visits every guest (a
// column). The grid has n × n cells, so doubling n makes 4 times the cells.

const STEPS = [
  { captionKey: 'start', n: 3, rows: 0 },
  { captionKey: 'row', n: 3, rows: 1 },
  { captionKey: 'row', n: 3, rows: 2 },
  { captionKey: 'full', n: 3, rows: 3 },
  { captionKey: 'double', n: 6, rows: 6 },
  { captionKey: 'summary', n: 6, rows: 6 },
]

function Grid({ n, rows }) {
  const guests = guestList(n)
  return (
    <table className="border-separate border-spacing-1 text-center text-xs">
      <thead>
        <tr>
          <th className="text-slate-400">i \ j</th>
          {guests.map((guest) => (
            <th key={guest} className="w-9 font-semibold text-slate-600">
              {guest}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {guests.map((rowGuest, i) => (
          <tr key={rowGuest}>
            <th className="pr-1 text-right font-semibold text-slate-600">
              {rowGuest}
            </th>
            {guests.map((columnGuest, j) => {
              const isFilled = i < rows
              const isSelf = i === j
              return (
                <td
                  key={columnGuest}
                  className={`h-7 rounded transition-colors duration-500 ${
                    !isFilled
                      ? 'bg-slate-100'
                      : isSelf
                        ? 'bg-slate-300'
                        : 'bg-brand text-white'
                  }`}
                >
                  {isFilled && !isSelf ? '👋' : ''}
                </td>
              )
            })}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

function NestedGrid() {
  const { t } = useTranslation()
  const guests = (n) => guestList(n)
  const steps = STEPS.map((step) => ({
    ...step,
    caption: t(`viz.nestedGrid.${step.captionKey}`, {
      n: step.n,
      cells: step.rows * step.n,
      guest: guests(step.n)[step.rows - 1],
      total: step.n * step.n,
    }),
  }))
  return (
    <StepPlayer
      title={t('viz.nestedGrid.title')}
      steps={steps}
      renderStep={(step) => (
        <div className="space-y-2">
          <Grid n={step.n} rows={step.rows} />
          <p className="text-sm font-semibold text-brand">
            {t('viz.nestedGrid.count', {
              cells: step.rows * step.n,
              n: step.n,
            })}
          </p>
        </div>
      )}
    />
  )
}

export default NestedGrid
