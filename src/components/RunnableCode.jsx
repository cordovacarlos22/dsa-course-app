import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { RUN_TIMEOUT_MS, runJavaScript } from '../runners'
import { prefersReducedMotion } from '../lib/prefersReducedMotion'

// How long each output line waits before the next one appears.
const REPLAY_STEP_MS = 800
// More output than this is shown at once: a replay would take too long.
const MAX_REPLAY_LINES = 60

function canReplay(lineCount) {
  return lineCount > 0 && lineCount <= MAX_REPLAY_LINES
}

// What the code printed, then its error, each with the code line it came
// from (null when the runner couldn't tell).
function outputLines(result) {
  const printed = result.logs.map((text, index) => ({
    text,
    line: result.lines?.[index] ?? null,
  }))
  if (!result.error) return printed
  return [
    ...printed,
    { text: result.error, line: result.errorLine ?? null, isError: true },
  ]
}

// A code box the student can edit and run. After Run, the output replays line
// by line next to the code, with the line that printed it highlighted, so
// the student sees what happened instead of all of it in a flash.
function RunnableCode({ initialCode }) {
  const { t } = useTranslation()
  const [code, setCode] = useState(initialCode)
  // The code that produced `result`: the replay shows this one, even if the
  // student typed more while it was running.
  const [ranCode, setRanCode] = useState('')
  const [result, setResult] = useState(null)
  const [isRunning, setIsRunning] = useState(false)
  const [isReplaying, setIsReplaying] = useState(false)
  // How many output lines are showing, and whether more appear on their own.
  const [shown, setShown] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  // Run and Edit swap the buttons out, so keyboard focus would be lost. This
  // says where it goes next: 'replay' or 'edit' (after Run), 'editor' (after
  // Edit).
  const moveFocusTo = useRef(null)

  const output = result ? outputLines(result) : []
  const isTooLong = output.length > MAX_REPLAY_LINES
  const isDone = shown >= output.length
  const currentLine = output[shown - 1]?.line ?? null

  useEffect(() => {
    if (!isPlaying) return
    const timer = setTimeout(() => {
      setShown(shown + 1)
      if (shown + 1 >= output.length) setIsPlaying(false)
    }, REPLAY_STEP_MS)
    return () => clearTimeout(timer)
  }, [isPlaying, shown, output.length])

  async function run() {
    const codeToRun = code
    setIsRunning(true)
    const newResult = await runJavaScript(codeToRun)
    setIsRunning(false)
    setRanCode(codeToRun)
    setResult(newResult)
    // A timeout or a crash has nothing to replay: it shows as before.
    if (newResult.problem) return
    const count = outputLines(newResult).length
    // Devices that ask for less motion, and long output, get it all at once.
    const showAtOnce = prefersReducedMotion() || count > MAX_REPLAY_LINES
    moveFocusTo.current = canReplay(count) ? 'replay' : 'edit'
    setIsReplaying(true)
    setShown(showAtOnce ? count : 0)
    setIsPlaying(!showAtOnce && count > 0)
  }

  function replay() {
    setShown(0)
    setIsPlaying(!prefersReducedMotion())
  }

  function step() {
    setIsPlaying(false)
    setShown(Math.min(shown + 1, output.length))
  }

  function showAll() {
    setIsPlaying(false)
    setShown(output.length)
  }

  function edit() {
    moveFocusTo.current = 'editor'
    setIsPlaying(false)
    setIsReplaying(false)
    setShown(0)
    setResult(null)
  }

  // A ref callback that focuses the element when it appears, if it's the
  // one Run or Edit asked for.
  function focusIfAsked(target) {
    return (node) => {
      if (node && moveFocusTo.current === target) {
        moveFocusTo.current = null
        node.focus()
      }
    }
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
  const buttonClass =
    'rounded-lg border border-slate-600 px-3 py-1.5 text-sm font-semibold text-slate-100 hover:bg-slate-800 disabled:opacity-40 disabled:hover:bg-transparent'

  return (
    <div
      data-runnable-code
      className="not-prose my-6 overflow-hidden rounded-2xl border border-slate-700 bg-slate-900 text-slate-100"
    >
      {isReplaying ? (
        <ol
          aria-label={t('runnable.codeThatRan')}
          className="overflow-x-auto py-4 font-mono text-sm leading-6"
        >
          {ranCode.split('\n').map((text, index) => {
            const line = index + 1
            const isCurrent = line === currentLine
            return (
              <li
                key={line}
                aria-current={isCurrent ? 'true' : undefined}
                className={`flex w-max min-w-full gap-4 px-4 ${isCurrent ? 'bg-accent/20' : ''}`}
              >
                <span
                  aria-hidden="true"
                  className="w-6 shrink-0 text-right text-slate-500 select-none"
                >
                  {line}
                </span>
                <code className="whitespace-pre">{text || ' '}</code>
              </li>
            )
          })}
        </ol>
      ) : (
        <textarea
          ref={focusIfAsked('editor')}
          aria-label={t('runnable.label')}
          value={code}
          onChange={(event) => setCode(event.target.value)}
          onKeyDown={handleKeyDown}
          rows={Math.min(Math.max(lineCount, 3), 20)}
          spellCheck={false}
          className="block w-full resize-y bg-transparent p-4 font-mono text-sm leading-6 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-accent"
        />
      )}

      <div className="flex flex-wrap items-center gap-2 border-t border-slate-700 px-4 py-2">
        {isReplaying ? (
          <>
            <button
              ref={focusIfAsked('replay')}
              type="button"
              onClick={replay}
              disabled={!canReplay(output.length)}
              className="rounded-lg bg-accent px-4 py-1.5 text-sm font-bold text-ink disabled:opacity-60"
            >
              <span aria-hidden="true">↺</span> {t('runnable.replay')}
            </button>
            <button
              type="button"
              onClick={step}
              disabled={isDone}
              className={buttonClass}
            >
              {t('runnable.step')} <span aria-hidden="true">→</span>
            </button>
            <button
              type="button"
              onClick={showAll}
              disabled={isDone}
              className={buttonClass}
            >
              {t('runnable.showAll')}
            </button>
            <button
              ref={focusIfAsked('edit')}
              type="button"
              onClick={edit}
              className="rounded-lg px-3 py-1.5 text-sm text-slate-300 hover:text-white"
            >
              <span aria-hidden="true">✎</span> {t('runnable.edit')}
            </button>
          </>
        ) : (
          <>
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
          </>
        )}
      </div>

      {result && (
        <div
          role="status"
          // Only read the newly added line aloud, not the whole output again.
          aria-atomic="false"
          aria-label={t('runnable.output')}
          // wrap-anywhere: printed arrays like [0,10,20,…] have no spaces, so
          // without it a long one runs off the box and gets cut off.
          className="border-t border-slate-700 bg-black/40 px-4 py-3 font-mono text-sm wrap-anywhere"
        >
          {result.problem === 'timeout' && (
            <p className="text-red-400">
              {t('runnable.timedOut', { seconds: RUN_TIMEOUT_MS / 1000 })}
            </p>
          )}
          {result.problem === 'crash' && !result.error && (
            <p className="text-red-400">{t('runnable.crashed')}</p>
          )}
          {output.length === 0 && !result.problem && (
            <p className="text-slate-400">{t('runnable.noOutput')}</p>
          )}
          {isTooLong && (
            <p className="mb-2 font-sans text-xs text-slate-400">
              {t('runnable.allAtOnce', { count: output.length })}
            </p>
          )}
          {output
            .slice(0, isReplaying ? shown : output.length)
            .map((entry, index) => (
              <p
                key={index}
                className={`whitespace-pre-wrap ${entry.isError ? 'text-red-400' : ''}`}
              >
                {entry.line !== null && (
                  <span className="mr-2 rounded bg-slate-700 px-1.5 py-0.5 font-sans text-xs text-slate-300">
                    {t('runnable.lineTag', { line: entry.line })}
                  </span>
                )}
                {entry.text}
              </p>
            ))}
        </div>
      )}
    </div>
  )
}

export default RunnableCode
