import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { visualizations } from '../visualizations'
import { VISUALIZATION_NAMES } from '../visualizations/names'

// Every lesson animation on one page, so Carlos can review them before they
// go into lessons. Not linked from the menu: open /dev/animations directly.
function AnimationGalleryPage() {
  useDocumentTitle('Animations')

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-3xl font-extrabold">Animations</h1>
      {VISUALIZATION_NAMES.map((name) => {
        const Visualization = visualizations[name]
        return (
          <section key={name} className="mt-8">
            <h2 className="font-mono text-sm text-slate-500">{name}</h2>
            <Visualization />
          </section>
        )
      })}
    </div>
  )
}

export default AnimationGalleryPage
