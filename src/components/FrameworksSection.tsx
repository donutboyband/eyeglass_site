type FrameworkItem = { name: string; note: string }

type Props = { frameworks: FrameworkItem[] }

export function FrameworksSection({ frameworks }: Props) {
  return (
    <section className="section" id="frameworks">
      <div className="section-header">
        <p className="section-label">Framework coverage</p>
        <h2>Works with your stack</h2>
        <p className="section-note">Supports popular frameworks and always adding more.</p>
      </div>
      <div className="frameworks-grid">
        {frameworks.map((fw) => (
          <div key={fw.name} className="framework-card">
            <h3>{fw.name}</h3>
            <p>{fw.note}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
