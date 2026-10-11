import Markdown from 'react-markdown'

// Short checkpoint text (questions, options, hints) with `code`, **bold** and
// _italics_, rendered inline (no paragraphs, so it fits inside a label).
const components = {
  p: ({ children }) => children,
  code: ({ children }) => (
    <code className="rounded bg-slate-100 px-1 py-0.5 font-mono text-[0.9em] text-ink">
      {children}
    </code>
  ),
}

function InlineMarkdown({ children }) {
  return (
    <Markdown
      allowedElements={['p', 'code', 'strong', 'em']}
      unwrapDisallowed
      components={components}
    >
      {children}
    </Markdown>
  )
}

export default InlineMarkdown
