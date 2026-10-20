import { useTranslation } from 'react-i18next'
import StepPlayer from '../components/StepPlayer'
import GuestRow from './GuestRow'
import OperationPanel from './OperationPanel'

// A preview of the LinkedList class from the next module: one class, and
// each method does one specific job on the list. The guests are drawn as
// plain boxes here; the Linked Lists module shows the nodes and arrows.

const STEPS = [
  {
    captionKey: 'create',
    code: "const line = new LinkedList('Ana')",
    items: ['Ana'],
    states: { 0: 'new' },
  },
  {
    captionKey: 'push',
    code: "line.push('Ben')",
    items: ['Ana', 'Ben'],
    states: { 1: 'new' },
  },
  {
    captionKey: 'unshift',
    code: "line.unshift('Zoe')",
    items: ['Zoe', 'Ana', 'Ben'],
    states: { 0: 'new' },
  },
  {
    captionKey: 'insert',
    code: "line.insert(1, 'Cleo')",
    items: ['Zoe', 'Cleo', 'Ana', 'Ben'],
    states: { 1: 'new' },
  },
  {
    captionKey: 'remove',
    code: 'line.remove(1)',
    items: ['Zoe', 'Cleo', 'Ana', 'Ben'],
    states: { 1: 'removed' },
  },
  {
    captionKey: 'pop',
    code: 'line.pop()',
    items: ['Zoe', 'Ana', 'Ben'],
    states: { 2: 'removed' },
  },
  {
    captionKey: 'shift',
    code: 'line.shift()',
    items: ['Zoe', 'Ana'],
    states: { 0: 'removed' },
  },
  { captionKey: 'summary', code: 'line', items: ['Ana'], states: {} },
]

function ListClassPreview() {
  const { t } = useTranslation()
  const steps = STEPS.map((step) => ({
    ...step,
    caption: t(`viz.listClassPreview.${step.captionKey}`),
  }))
  return (
    <StepPlayer
      title={t('viz.listClassPreview.title')}
      steps={steps}
      renderStep={(step) => (
        <OperationPanel code={step.code}>
          <GuestRow items={step.items} states={step.states} />
        </OperationPanel>
      )}
    />
  )
}

export default ListClassPreview
