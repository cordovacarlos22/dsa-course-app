import { useTranslation } from 'react-i18next'
import StepPlayer from '../components/StepPlayer'

// Linked lists vs arrays, operation by operation. The animation lights up
// one group of rows at a time: the ties, the rows arrays win, and the rows
// linked lists win.

const ROWS = [
  { key: 'push', list: 'O(1)', array: 'O(1)' },
  { key: 'pop', list: 'O(n)', array: 'O(1)' },
  { key: 'unshift', list: 'O(1)', array: 'O(n)' },
  { key: 'shift', list: 'O(1)', array: 'O(n)' },
  { key: 'insert', list: 'O(n)', array: 'O(n)' },
  { key: 'remove', list: 'O(n)', array: 'O(n)' },
  { key: 'byIndex', list: 'O(n)', array: 'O(1)' },
  { key: 'byValue', list: 'O(n)', array: 'O(n)' },
]

function winnerOf(row) {
  if (row.list === row.array) return 'tie'
  return row.list === 'O(1)' ? 'list' : 'array'
}

// Which group each step lights up (null: none).
const STEPS = [
  { captionKey: 'all', group: null },
  { captionKey: 'ties', group: 'tie' },
  { captionKey: 'arrays', group: 'array' },
  { captionKey: 'lists', group: 'list' },
  { captionKey: 'summary', group: null },
]

const BETTER = 'bg-green-100 font-bold text-green-900'
const WORSE = 'bg-red-50 text-red-800'

function cellStyle(row, column, group) {
  const winner = winnerOf(row)
  if (group === null || winner !== group) return ''
  if (winner === 'tie') return 'bg-slate-100 font-bold'
  return winner === column ? BETTER : WORSE
}

function Table({ group }) {
  const { t } = useTranslation()
  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b-2 border-slate-300 text-left">
          <th className="py-1 pr-2">{t('viz.linkedListBigO.operation')}</th>
          <th className="px-2 py-1 text-center">
            {t('viz.linkedListBigO.linkedList')}
          </th>
          <th className="px-2 py-1 text-center">
            {t('viz.linkedListBigO.array')}
          </th>
        </tr>
      </thead>
      <tbody>
        {ROWS.map((row) => {
          const isLit = group !== null && winnerOf(row) === group
          return (
            <tr
              key={row.key}
              className={`border-b border-slate-200 transition-opacity duration-500 ${
                group !== null && !isLit ? 'opacity-50' : ''
              }`}
            >
              <th scope="row" className="py-1 pr-2 text-left font-normal">
                {t(`viz.linkedListBigO.rows.${row.key}`)}
              </th>
              <td
                className={`px-2 py-1 text-center font-mono ${cellStyle(row, 'list', group)}`}
              >
                {row.list}
              </td>
              <td
                className={`px-2 py-1 text-center font-mono ${cellStyle(row, 'array', group)}`}
              >
                {row.array}
              </td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}

function LinkedListBigO() {
  const { t } = useTranslation()
  const steps = STEPS.map((step) => ({
    ...step,
    caption: t(`viz.linkedListBigO.${step.captionKey}`),
  }))
  return (
    <StepPlayer
      title={t('viz.linkedListBigO.title')}
      steps={steps}
      renderStep={(step) => <Table group={step.group} />}
    />
  )
}

export default LinkedListBigO
