import CodeMirror, { EditorView } from '@uiw/react-codemirror'
import { javascript } from '@codemirror/lang-javascript'

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
        EditorView.contentAttributes.of({ 'aria-label': label }),
      ]}
    />
  )
}

export default CodeEditor
