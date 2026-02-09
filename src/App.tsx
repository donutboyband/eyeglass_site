import { useEffect, useMemo, useRef, useState } from 'react'
import './App.css'

const INSTALL_COMMAND = 'npx @eyeglass/cli init'

const QUICKSTART = [
  {
    title: 'Install + scaffold',
    code: INSTALL_COMMAND,
    note: 'Auto-detects Vite, Next.js, CRA, Remix.'
  },
  {
    title: 'Link Claude Code',
    code: 'eyeglass link',
    note: 'Creates the Claude connection + MCP bridge.'
  },
  {
    title: 'Watch & edit',
    code: 'eyeglass watch',
    note: 'HMR + auto-commit on every AI change.'
  }
]

const FLOW = [
  {
    title: 'Select UI',
    body: 'Point-and-click in the browser. Up to 5 elements per request.'
  },
  {
    title: 'Context packet',
    body: 'Component name, file path, props, a11y tree, computed styles, geometry.'
  },
  {
    title: 'Claude edit',
    body: 'Semantic snapshot goes through the MCP bridge; Claude edits files directly.'
  },
  {
    title: 'HMR + undo',
    body: 'Hot reload shows the change instantly. One-click undo rolls back the commit.'
  }
]

const PACKAGES = [
  { name: '@eyeglass/inspector', tag: '~57kb', desc: 'Web Component that captures selections + metadata.' },
  { name: '@eyeglass/bridge', tag: 'MCP', desc: 'Claude Code server that receives snapshots + patches files.' },
  { name: '@eyeglass/cli', tag: 'Setup', desc: 'Single command bootstrap with framework detection.' },
  { name: '@eyeglass/types', tag: 'TS', desc: 'Shared interfaces for inspectors, bridge, and clients.' }
]

const FRAMEWORKS = [
  { name: 'React', note: 'Vite, Next.js, CRA' },
  { name: 'Vue 3', note: 'Vite + CLI' },
  { name: 'Vue 2', note: 'Bridge back-compat' },
  { name: 'Svelte / SvelteKit', note: 'Component + style capture' },
  { name: 'Vanilla JS', note: 'Dom + style snapshot' }
]

const DEMO_SCRIPT = [
  {
    label: 'Capture snapshot',
    detail: 'Captured <Button> in src/components/PricingCard.tsx with props { intent: "primary" }',
    delay: 650
  },
  {
    label: 'Send to Claude (demo)',
    detail: 'Mock payload delivered to bridge stub — no external calls.',
    delay: 750
  },
  {
    label: 'Apply patch',
    detail: 'Changed button to "Start free trial" + accent gradient.',
    delay: 900
  },
  {
    label: 'HMR refresh',
    detail: 'Preview updated. Undo available.',
    delay: 700
  }
]

function App() {
  const [copied, setCopied] = useState(false)
  const [theme, setTheme] = useState<'dark' | 'light'>(() =>
    (localStorage.getItem('eyeglass_theme') as 'dark' | 'light') || 'dark'
  )
  const [demoState, setDemoState] = useState<'idle' | 'running' | 'done'>('idle')
  const [demoStep, setDemoStep] = useState(0)
  const [demoLog, setDemoLog] = useState<string[]>([])
  const [demoApplied, setDemoApplied] = useState(false)
  const timers = useRef<number[]>([])

  const copyCommand = () => {
    navigator.clipboard.writeText(INSTALL_COMMAND)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const toggleTheme = () => {
    setTheme((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark'
      localStorage.setItem('eyeglass_theme', next)
      return next
    })
  }

  const runDemo = () => {
    timers.current.forEach(clearTimeout)
    timers.current = []
    setDemoState('running')
    setDemoStep(0)
    setDemoLog([])
    setDemoApplied(false)

    let acc = 0
    DEMO_SCRIPT.forEach((step, idx) => {
      acc += step.delay
      timers.current.push(
        window.setTimeout(() => {
          setDemoStep(idx)
          setDemoLog((prev) => [...prev, step.detail])
          if (idx === DEMO_SCRIPT.length - 1) {
            setDemoApplied(true)
            setDemoState('done')
          }
        }, acc)
      )
    })
  }

  useEffect(() => () => timers.current.forEach(clearTimeout), [])

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  const payload = useMemo(
    () =>
      JSON.stringify(
        {
          component: 'PricingCard/Button',
          filePath: 'src/components/PricingCard.tsx',
          props: { intent: 'primary', size: 'lg', children: 'Buy now' },
          a11y: { role: 'button', name: 'Buy now', label: 'Primary CTA' },
          geometry: { x: 422, y: 688, width: 180, height: 52 },
          styles: {
            background: '#0ea5e9',
            color: '#0b1222',
            borderRadius: '9999px',
            boxShadow: '0 8px 30px rgba(14, 165, 233, 0.35)'
          },
          frameworks: { name: 'react', componentName: 'Button', ancestry: ['PricingCard', 'Layout'] },
          url: 'https://eyeglass.dev/demo'
        },
        null,
        2
      ),
    []
  )

  return (
    <div className="app">
      <nav className="nav">
        <div className="nav-content">
          <div className="nav-logo">
            <img src="/eyeglass.svg" alt="Eyeglass" />
            <span>eyeglass</span>
          </div>
          <div className="nav-links">
            <a href="#demo" className="nav-link">Demo</a>
            <a href="#flow" className="nav-link">Flow</a>
            <a href="#capabilities" className="nav-link">Capabilities</a>
            <a
              href="https://github.com/donutboyband/eyeglass"
              target="_blank"
              rel="noopener noreferrer"
              className="github-link"
            >
              <GitHubIcon />
              GitHub
            </a>
            <button className="theme-toggle" onClick={toggleTheme} title="Toggle theme">
              {theme === 'dark' ? 'Light mode' : 'Dark mode'}
            </button>
          </div>
        </div>
      </nav>

      <section className="hero">
        <div className="hero-content">
          <p className="hero-kicker">Scripted, safe demo. Works with Claude Code.</p>
          <h1>
            Point at UI. Tell AI what to change.
            <span className="highlight"> Eyeglass turns clicks into code edits.</span>
          </h1>
          <p className="hero-subtitle">
            Eyeglass sends the exact component, props, and styles your AI needs. No more “describe the div”. The demo below is fully local — no calls to Claude.
          </p>
          <div className="hero-actions">
            <a className="btn primary" href="#demo">Run the scripted demo</a>
            <a className="btn ghost" href="https://github.com/donutboyband/eyeglass" target="_blank" rel="noreferrer">View on GitHub</a>
          </div>
          <div className="install">
            <span className="prompt">$</span>
            <code>{INSTALL_COMMAND}</code>
            <button className="copy-btn" onClick={copyCommand} title="Copy to clipboard">
              {copied ? <CheckIcon /> : <CopyIcon />}
            </button>
          </div>
          <p className="hero-note">Auto-detects Vite, Next.js, CRA, Remix. Installs the inspector + bridge wiring.</p>
        </div>
        <div className="hero-proof">
          <span className="chip">Auto-commit + undo</span>
          <span className="chip">A11y + style capture</span>
          <span className="chip">Framework aware</span>
        </div>
      </section>

      <section className="section" id="quickstart">
        <div className="section-header">
          <p className="section-label">Quickstart</p>
          <h2>Three commands to run Eyeglass</h2>
        </div>
        <div className="quickstart">
          {QUICKSTART.map((item) => (
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

      <section className="section demo" id="demo">
        <div className="section-header">
          <p className="section-label">Scripted demo</p>
          <h2>See Eyeglass change a button without hitting Claude</h2>
          <p className="section-sub">Pre-scripted flow using the installed inspector. No network or file writes.</p>
        </div>
        <div className="demo-grid">
          <div className={`demo-card ${demoApplied ? 'after' : 'before'}`}>
            <div className="demo-badge">Target UI</div>
            <div className="demo-pricing">
              <div className="demo-plan">Pro workspace</div>
              <div className="demo-price">$18<span>/mo</span></div>
              <ul>
                <li>Unlimited projects</li>
                <li>Priority support</li>
                <li>Branch-aware edits</li>
              </ul>
              <button className="demo-button">{demoApplied ? 'Start free trial' : 'Buy now'}</button>
              <p className="demo-caption">{demoApplied ? 'AI applied gradient + text change' : 'Original CTA before Eyeglass'}</p>
            </div>
          </div>
          <div className="demo-panel">
            <div className="demo-panel-header">
              <div>
                <p className="eyebrow">Eyeglass inspector</p>
                <h3>{demoState === 'done' ? 'Change applied' : 'Ready to run'}</h3>
              </div>
              <button className="btn small" onClick={runDemo} disabled={demoState === 'running'}>
                {demoState === 'running' ? 'Running…' : 'Run demo'}
              </button>
            </div>
            <div className="demo-steps">
              {DEMO_SCRIPT.map((step, idx) => (
                <div key={step.label} className={`demo-step ${idx <= demoStep ? 'active' : ''}`}>
                  <div className="step-dot" />
                  <div>
                    <p className="step-label">{step.label}</p>
                    <p className="step-detail">{idx <= demoStep ? step.detail : 'Pending…'}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="demo-log">
              <div className="demo-log-header">
                <span className="dot green" />
                Demo bridge (local stub)
              </div>
              <div className="log-body">
                {demoLog.length === 0 ? <p className="muted">Waiting to start…</p> : demoLog.map((line, i) => <p key={i}>{line}</p>)}
              </div>
            </div>
            <p className="muted tiny">This demo is scripted and does not call Claude or modify files.</p>
          </div>
        </div>
      </section>

      <section className="section" id="flow">
        <div className="section-header">
          <p className="section-label">60-second flow</p>
          <h2>From click to commit</h2>
        </div>
        <div className="flow-grid">
          {FLOW.map((step, idx) => (
            <div key={step.title} className="flow-card">
              <div className="flow-num">0{idx + 1}</div>
              <h3>{step.title}</h3>
              <p>{step.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section payload" id="payload">
        <div className="section-header">
          <p className="section-label">AI context</p>
          <h2>Exactly what Claude receives</h2>
        </div>
        <div className="payload-grid">
          <div className="payload-text">
            <p>Inspector captures component + props + styles + a11y in one semantic snapshot. This is the JSON Claude gets.</p>
            <div className="chips">
              <span className="chip">Component + file path</span>
              <span className="chip">Props + ancestry</span>
              <span className="chip">A11y tree</span>
              <span className="chip">Computed styles</span>
            </div>
          </div>
          <pre className="payload-code">{payload}</pre>
        </div>
      </section>

      <section className="section" id="capabilities">
        <div className="section-header">
          <p className="section-label">Packages</p>
          <h2>The Eyeglass kit</h2>
        </div>
        <div className="packages">
          {PACKAGES.map((pkg) => (
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
            <h4>Claude Code native</h4>
            <p>Uses MCP to deliver context and receive edits. Works with Claude Code out of the box.</p>
          </div>
        </div>
      </section>

      <section className="section" id="frameworks">
        <div className="section-header">
          <p className="section-label">Framework coverage</p>
          <h2>Understands your stack</h2>
        </div>
        <div className="frameworks-grid">
          {FRAMEWORKS.map((fw) => (
            <div key={fw.name} className="framework-card">
              <h3>{fw.name}</h3>
              <p>{fw.note}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="footer">
        <div className="footer-content">
          <div className="footer-links">
            <a href="https://github.com/donutboyband/eyeglass" target="_blank" rel="noopener noreferrer" className="footer-link">GitHub</a>
            <a href="https://github.com/donutboyband/eyeglass#readme" target="_blank" rel="noopener noreferrer" className="footer-link">Docs</a>
            <a href="https://github.com/donutboyband/eyeglass/issues" target="_blank" rel="noopener noreferrer" className="footer-link">Issues</a>
          </div>
          <p className="footer-copy">MIT License</p>
        </div>
      </footer>
    </div>
  )
}

// Icons
function GitHubIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
    </svg>
  )
}

function CopyIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
      <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  )
}

export default App
