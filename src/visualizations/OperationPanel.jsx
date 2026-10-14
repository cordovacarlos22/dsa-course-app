import { useTranslation } from 'react-i18next'

// One operation on an array or an object: the line of code, the boxes
// (children) and how many boxes it touched. "How many boxes does it touch?"
// is the question the arrays & objects module asks about every operation.
// - title: optional, e.g. "Array"
// - work: the number of boxes touched, or null to show nothing
function OperationPanel({ title = null, code, work = null, children }) {
  const { t } = useTranslation()
  return (
    <div className="space-y-2 rounded-xl border border-slate-200 p-3">
      {title && (
        <p className="text-xs font-bold tracking-wide text-slate-500 uppercase">
          {title}
        </p>
      )}
      <p className="font-mono text-sm break-all">{code}</p>
      {children}
      <p className="min-h-5 text-sm font-semibold text-brand">
        {work !== null && t('viz.touched', { count: work })}
      </p>
    </div>
  )
}

export default OperationPanel
