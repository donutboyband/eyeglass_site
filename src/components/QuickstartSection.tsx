type QuickItem = { title: string; code: string; note: string }

type Props = { items: QuickItem[] }

export function QuickstartSection({ items }: Props) {
  return (
    <section className="section" id="quickstart">
      <div className="section-header">
        <p className="section-label">Quickstart</p>
        <h2>Three commands to run Eyeglass</h2>
      </div>
      <div className="quickstart">
        {items.map((item) => (
          <div key={item.title} className="quick-card">
            <div className="quick-header">
              <span className="dot" />
              <h3>{item.title}</h3>
            </div>
            <pre>{item.code}</pre>
            <p>{item.note}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
