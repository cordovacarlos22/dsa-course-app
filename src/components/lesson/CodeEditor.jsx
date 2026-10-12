import CodeMirror, { EditorView } from '@uiw/react-codemirror'
import { javascript } from '@codemirror/lang-javascript'

// CodeMirror marks focus with a dark dotted line that can't be seen on the
// dark editor, so the active editor gets the brand's yellow ring instead.
const focusRing = EditorView.theme({
  '&.cm-focused': {
    outline: '2px solid var(--color-accent)',
    outlineOffset: '-2px',
  },
})

// The code editor of the workspace (CodeMirror 6 with JavaScript highlighting).
// Kept in its own file so tests can swap it for a plain textarea.
function CodeEditor({ value, onChange, label }) {
  return (
    <CodeMirror
      value={value}
      onChange={onChange}
      theme="dark"
      height="100%"
      className="h-full text-sm"
      extensions={[
        javascript(),
        focusRing,
        EditorView.contentAttributes.of({ 'aria-label': label }),
      ]}
    />
  )
}

export default CodeEditor
