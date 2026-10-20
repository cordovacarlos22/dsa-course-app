import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { useTranslation } from 'react-i18next'
import RunnableCode from './RunnableCode'
import { visualizations } from '../visualizations'
import { RUNNABLE_LANGUAGE, VIZ_LANGUAGE } from '../lib/markdownBlocks'

// The language of a fenced block, from react-markdown's "language-xxx" class.
function getBlockLanguage(codeElement) {
  const className = codeElement?.properties?.className ?? []
  const languageClass = className.find((name) => name.startsWith('language-'))
  return languageClass ? languageClass.replace('language-', '') : null
}

// The raw text inside a fenced block.
function getBlockText(codeElement) {
  return (codeElement?.children ?? [])
    .map((child) => child.value ?? '')
    .join('')
    .replace(/\n$/, '')
}

function UnknownVisualization({ name }) {
  const { t } = useTranslation()
  return (
    <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
      {t('lesson.unknownViz', { name })}
    </p>
  )
}

// Every fenced block is rendered as <pre><code>. We look at the language:
// - ```viz     → the named animation
// - ```js-run  → an editable, runnable snippet
// - anything else → a normal code block
function CodeBlock({ node, children, ...props }) {
  const codeElement = node?.children?.[0]
  const language = getBlockLanguage(codeElement)
  const text = getBlockText(codeElement)

  if (language === VIZ_LANGUAGE) {
    const Visualization = visualizations[text.trim()]
    return Visualization ? (
      <Visualization />
    ) : (
      <UnknownVisualization name={text.trim()} />
    )
  }
  if (language === RUNNABLE_LANGUAGE) {
    return <RunnableCode initialCode={text} />
  }
  return <pre {...props}>{children}</pre>
}

// A wide table (like a 5-column cheat sheet) can't shrink to a 320 px phone,
// so it scrolls sideways inside its own box instead of the whole page. The
// box takes focus so keyboard users can scroll it with the arrow keys too.
function ScrollableTable({ children }) {
  const { t } = useTranslation()
  return (
    <div
      className="overflow-x-auto"
      role="region"
      aria-label={t('lesson.table')}
      tabIndex={0}
    >
      <table>{children}</table>
    </div>
  )
}

// Renders a lesson's Markdown with the course's special blocks.
function LessonMarkdown({ markdown }) {
  return (
    <div className="prose prose-slate max-w-none prose-headings:font-extrabold prose-a:text-brand prose-code:before:content-none prose-code:after:content-none">
      <Markdown
        remarkPlugins={[remarkGfm]}
        components={{ pre: CodeBlock, table: ScrollableTable }}
      >
        {markdown}
      </Markdown>
    </div>
  )
}

export default LessonMarkdown
