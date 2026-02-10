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
    </section>
  )
}
