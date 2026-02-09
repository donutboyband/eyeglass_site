type Step = { title: string; body: string }

type Props = { steps: Step[] }

export function FlowSection({ steps }: Props) {
  return (
    <section className="section" id="flow">
      <div className="section-header">
        <p className="section-label">60-second flow</p>
        <h2>From click to commit</h2>
      </div>
      <div className="flow-grid">
        {steps.map((step, idx) => (
          <div key={step.title} className="flow-card">
            <div className="flow-num">0{idx + 1}</div>
            <h3>{step.title}</h3>
            <p>{step.body}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
