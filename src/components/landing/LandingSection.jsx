// The common frame of every landing page section: an anchor id, a title and
// an optional subtitle.
function LandingSection({ id, title, subtitle, children }) {
  const headingId = `${id}-title`
  return (
    <section id={id} aria-labelledby={headingId} className="scroll-mt-20">
      <h2
        id={headingId}
        className="text-center text-2xl font-extrabold sm:text-3xl"
      >
        {title}
      </h2>
      {subtitle && (
        <p className="mx-auto mt-2 max-w-2xl text-center text-slate-600">
          {subtitle}
        </p>
      )}
      <div className="mt-8">{children}</div>
    </section>
  )
}

export default LandingSection
