import Markdown from 'react-markdown'

// Short checkpoint text (questions, options, hints) with `code`, **bold** and
// _italics_, rendered inline (no paragraphs, so it fits inside a label).
const components = {
  p: ({ children }) => children,
  // wrap-anywhere: a long name like `rsvps.hasOwnProperty('Dev')` has no
  // spaces, so on a narrow phone it may break mid-word instead of pushing the
  // page sideways.
  code: ({ children }) => (
    <code className="rounded bg-slate-100 px-1 py-0.5 font-mono text-[0.9em] text-ink wrap-anywhere">
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
