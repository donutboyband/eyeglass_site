import { LandingDemo } from './LandingDemo'

export function DemoSection() {
  return (
    <section className="section demo" id="demo">
      <div className="section-header">
        <p className="section-label">See It In Action</p>
        <h2>Point. Describe. Done.</h2>
        <p className="section-sub">
          Select elements, type what you want, and watch Claude make the changes in real-time.
        </p>
      </div>
      <LandingDemo />
    </section>
  )
}
