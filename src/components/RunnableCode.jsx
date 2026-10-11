import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { RUN_TIMEOUT_MS, runJavaScript } from '../runners'

// A code box the student can edit and run, with the printed output below.
// (A full code editor arrives with the exercise pages in stage 7; a plain
// textarea is enough for short lesson snippets.)
function RunnableCode({ initialCode }) {
  const { t } = useTranslation()
  const [code, setCode] = useState(initialCode)
  const [result, setResult] = useState(null)
  const [isRunning, setIsRunning] = useState(false)

  async function run() {
    setIsRunning(true)
    setResult(await runJavaScript(code))
    setIsRunning(false)
  }

  function reset() {
    setCode(initialCode)
    setResult(null)
  }

  function handleKeyDown(event) {
    if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) {
      event.preventDefault()
      run()
    }
  }

  const lineCount = code.split('\n').length

  return (
    <div className="not-prose my-6 overflow-hidden rounded-2xl border border-slate-700 bg-slate-900 text-slate-100">
      <textarea
        aria-label={t('runnable.label')}
        value={code}
        onChange={(event) => setCode(event.target.value)}
        onKeyDown={handleKeyDown}
        rows={Math.min(Math.max(lineCount, 3), 20)}
        spellCheck={false}
        className="block w-full resize-y bg-transparent p-4 font-mono text-sm leading-6 outline-none"
      />
      <div className="flex items-center gap-2 border-t border-slate-700 px-4 py-2">
        <button
          type="button"
          onClick={run}
          disabled={isRunning}
          className="rounded-lg bg-accent px-4 py-1.5 text-sm font-bold text-ink disabled:opacity-60"
        >
          {isRunning ? t('runnable.running') : `▶ ${t('runnable.run')}`}
        </button>
        <button
          type="button"
          onClick={reset}
          className="rounded-lg px-3 py-1.5 text-sm text-slate-300 hover:text-white"
        >
          {t('runnable.reset')}
        </button>
        <span className="ml-auto hidden text-xs text-slate-400 sm:inline">
          {t('runnable.hint')}
        </span>
      </div>
      {result && (
        <div
          role="status"
          aria-label={t('runnable.output')}
          className="border-t border-slate-700 bg-black/40 px-4 py-3 font-mono text-sm"
        >
          {result.problem === 'timeout' && (
            <p className="text-red-400">
              {t('runnable.timedOut', { seconds: RUN_TIMEOUT_MS / 1000 })}
            </p>
          )}
          {result.problem === 'crash' && !result.error && (
            <p className="text-red-400">{t('runnable.crashed')}</p>
          )}
          {result.logs.length === 0 && !result.error && !result.problem && (
            <p className="text-slate-400">{t('runnable.noOutput')}</p>
          )}
          {result.logs.map((line, index) => (
            <p key={index} className="whitespace-pre-wrap">
              {line}
            </p>
          ))}
          {result.error && (
            <p className="whitespace-pre-wrap text-red-400">{result.error}</p>
          )}
        </div>
      )}
    </div>
  )
}

export default RunnableCode
