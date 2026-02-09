type PackageItem = { name: string; tag: string; desc: string }

type Props = { packages: PackageItem[] }

export function PackagesSection({ packages }: Props) {
  return (
    <section className="section" id="capabilities">
      <div className="section-header">
        <p className="section-label">Packages</p>
        <h2>The Eyeglass kit</h2>
      </div>
      <div className="packages">
        {packages.map((pkg) => (
          <div key={pkg.name} className="package-card">
            <div className="package-head">
              <span className="mono">{pkg.name}</span>
              <span className="tag">{pkg.tag}</span>
            </div>
            <p>{pkg.desc}</p>
            <a className="text-link" href="https://github.com/donutboyband/eyeglass" target="_blank" rel="noreferrer">View on GitHub →</a>
          </div>
        ))}
      </div>
      <div className="trust">
        <div className="trust-card">
          <h4>Auto-commit + undo</h4>
          <p>Every change is committed with tags. One-click undo rolls back instantly.</p>
        </div>
        <div className="trust-card">
          <h4>Local-first</h4>
          <p>Inspector runs in-browser; bridge stays on your machine. Demo mode never leaves this page.</p>
        </div>
        <div className="trust-card">
          <h4>Agent-agnostic</h4>
          <p>Uses MCP or HTTP to deliver context and receive edits. Works with any AI coding agent.</p>
        </div>
      </div>
    </section>
  )
}
