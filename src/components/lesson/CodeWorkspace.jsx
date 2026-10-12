import { lazy, Suspense, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLanguage } from '../../hooks/useLanguage'
import { localize } from '../../lib/course'
import { TRIES_BEFORE_SOLUTION } from '../../lib/progress'
import { RUN_TIMEOUT_MS, checkJavaScript, runJavaScript } from '../../runners'
import LessonMarkdown from '../LessonMarkdown'
import InlineMarkdown from './InlineMarkdown'

// CodeMirror is big, so it's only downloaded when a coding step opens.
const CodeEditor = lazy(() => import('./CodeEditor'))

const PANES = ['learn', 'code', 'output']

// A coding step. On wide screens: the lesson (Learn) on the left half, and on
// the right the editor with the output below it. On small screens: tabs.
// "Run" just runs the code; "Check" runs the checkpoint's tests.
function CodeWorkspace({
  step,
  isPassed,
  failedTries,
  onPassed,
  onFailed,
  onViewSolution,
}) {
  const { t } = useTranslation()
  const { language } = useLanguage()
  const { checkpoint } = step
  const [code, setCode] = useState(
    isPassed ? checkpoint.solution : checkpoint.starterCode,
  )
  // { mode: 'run' | 'check', result } of the last button pressed.
  const [output, setOutput] = useState(null)
  const [isBusy, setIsBusy] = useState(false)
  const [activePane, setActivePane] = useState('learn')

  async function run() {
    setIsBusy(true)
    const result = await runJavaScript(code)
    setOutput({ mode: 'run', result })
    setIsBusy(false)
    setActivePane('output')
  }

  async function check() {
    setIsBusy(true)
    const result = await checkJavaScript(code, checkpoint)
    setOutput({ mode: 'check', result })
    setIsBusy(false)
    setActivePane('output')
    if (result.passed) onPassed()
    else onFailed()
  }

  function showSolution() {
    setCode(checkpoint.solution)
    onViewSolution()
    setActivePane('code')
  }

  const canShowSolution = !isPassed && failedTries >= TRIES_BEFORE_SOLUTION
  const paneClass = (pane) =>
    `${activePane === pane ? 'flex' : 'hidden'} min-h-0 flex-col lg:flex`

  return (
    <div className="flex flex-col">
      {/* Tabs, only on small screens. */}
      <div
        role="tablist"
        aria-label={t('workspace.panes')}
        className="mb-3 grid grid-cols-3 gap-1 rounded-xl bg-slate-200 p-1 lg:hidden"
      >
        {PANES.map((pane) => (
          <button
            key={pane}
            type="button"
            role="tab"
            aria-selected={activePane === pane}
            onClick={() => setActivePane(pane)}
            className={`rounded-lg py-2 text-sm font-semibold ${
              activePane === pane ? 'bg-white shadow' : 'text-slate-600'
            }`}
          >
            {t(`workspace.${pane}`)}
          </button>
        ))}
      </div>

      <div className="grid gap-4 lg:h-[calc(100dvh-19rem)] lg:min-h-[30rem] lg:grid-cols-2">
        <section
          aria-label={t('workspace.learn')}
          className={`${paneClass('learn')} overflow-y-auto rounded-2xl border border-slate-200 bg-white p-5`}
        >
          {step.title && (
            <h2 className="mb-3 text-xl font-extrabold">{step.title}</h2>
          )}
          <LessonMarkdown markdown={step.body} />
          <div className="mt-6 rounded-xl border-2 border-brand/30 bg-brand/5 p-4">
            <h3 className="text-xs font-semibold tracking-wide text-brand uppercase">
              {t('workspace.task')}
            </h3>
            <div className="mt-1">
              <LessonMarkdown markdown={localize(checkpoint.task, language)} />
            </div>
          </div>
          {failedTries > 0 && !isPassed && (
            <div className="mt-4 rounded-xl bg-amber-50 p-4 text-amber-900">
              <span className="font-semibold">{t('checkpoint.hint')}:</span>{' '}
              <InlineMarkdown>
                {localize(checkpoint.hint, language)}
              </InlineMarkdown>
            </div>
          )}
        </section>

        {/* Right column: the editor on top, the output below it. On small
            screens this wrapper disappears (contents) and the tabs decide
            which pane shows. */}
        <div className="contents lg:grid lg:min-h-0 lg:grid-rows-[minmax(0,3fr)_minmax(0,2fr)] lg:gap-4">
          <section
            aria-label={t('workspace.code')}
            className={`${paneClass('code')} overflow-hidden rounded-2xl border border-slate-700 bg-[#282c34]`}
          >
            <div className="h-80 overflow-auto lg:h-auto lg:min-h-0 lg:flex-1">
              <Suspense
                fallback={
                  <p className="p-4 text-sm text-slate-400">
                    {t('workspace.loadingEditor')}
                  </p>
                }
              >
                <CodeEditor
                  value={code}
                  onChange={setCode}
                  label={t('workspace.editorLabel')}
                />
              </Suspense>
            </div>
            <div className="flex flex-wrap items-center gap-2 border-t border-slate-700 bg-slate-900 px-3 py-2">
              <button
                type="button"
                onClick={run}
                disabled={isBusy}
                className="rounded-lg border border-slate-500 px-3 py-1.5 text-sm font-semibold text-white disabled:opacity-60"
              >
                ▶ {t('runnable.run')}
              </button>
              <button
                type="button"
                onClick={check}
                disabled={isBusy}
                className="rounded-lg bg-accent px-4 py-1.5 text-sm font-bold text-ink disabled:opacity-60"
              >
                {isBusy ? t('runnable.running') : `✓ ${t('workspace.check')}`}
              </button>
              <button
                type="button"
                onClick={() => setCode(checkpoint.starterCode)}
                className="rounded-lg px-3 py-1.5 text-sm text-slate-300 hover:text-white"
              >
                {t('runnable.reset')}
              </button>
              {canShowSolution && (
                <button
                  type="button"
                  onClick={showSolution}
                  className="ml-auto rounded-lg px-3 py-1.5 text-sm text-slate-300 underline hover:text-white"
                >
                  {t('workspace.showSolution')}
                </button>
              )}
            </div>
          </section>

          <section
            aria-label={t('workspace.output')}
            className={`${paneClass('output')} overflow-y-auto rounded-2xl border border-slate-700 bg-slate-950 p-4 font-mono text-sm text-slate-100`}
          >
            <div role="status">
              <Output output={output} isPassed={isPassed} />
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

function Output({ output, isPassed }) {
  const { t } = useTranslation()
  if (!output) {
    return (
      <p className="text-slate-400">
        {isPassed ? `✓ ${t('checkpoint.passedBefore')}` : t('workspace.empty')}
      </p>
    )
  }

  const { mode, result } = output
  const passedCount = result.results?.filter((test) => test.ok).length ?? 0

  return (
    <div className="space-y-3">
      {result.problem === 'timeout' && (
        <p className="text-red-400">
          {t('runnable.timedOut', { seconds: RUN_TIMEOUT_MS / 1000 })}
        </p>
      )}
      {result.problem === 'crash' && !result.error && (
        <p className="text-red-400">{t('runnable.crashed')}</p>
      )}
      {result.error && (
        <p className="whitespace-pre-wrap text-red-400">{result.error}</p>
      )}

      {mode === 'check' && result.results.length > 0 && (
        <div>
          <p
            className={`font-sans font-bold ${result.passed ? 'text-green-400' : 'text-amber-300'}`}
          >
            {result.passed
              ? `✓ ${t('workspace.allPassed')}`
              : t('workspace.somePassed', {
                  passed: passedCount,
                  total: result.results.length,
                })}
          </p>
          <ul className="mt-2 space-y-1">
            {result.results.map((test, index) => (
              <li
                key={index}
                className={test.ok ? 'text-green-300' : 'text-red-300'}
              >
                {test.ok ? '✓' : '✗'} {test.message}
              </li>
            ))}
          </ul>
        </div>
      )}

      {result.logs.length > 0 && (
        <div>
          {mode === 'check' && (
            <p className="font-sans text-xs text-slate-400 uppercase">
              {t('workspace.console')}
            </p>
          )}
          {result.logs.map((line, index) => (
            <p key={index} className="whitespace-pre-wrap">
              {line}
            </p>
          ))}
        </div>
      )}
      {mode === 'run' &&
        result.logs.length === 0 &&
        !result.error &&
        !result.problem && (
          <p className="text-slate-400">{t('runnable.noOutput')}</p>
        )}
    </div>
  )
}

export default CodeWorkspace
