import { EyeglassDemo } from '../EyeglassDemo'

const installCommand = 'npx @eyeglass/cli init'

export function GettingStarted() {
  return (
    <>
      <div className="docs-hero">
        <p className="section-label">Documentation</p>
        <h1>Eyeglass Documentation</h1>
        <p className="hero-subtitle">Visual debugging for AI coding agents. Point at UI elements, describe what you want, and let the agent edit with full context.</p>
        <div className="hero-actions minimal" style={{ justifyContent: 'flex-start' }}>
          <a className="link-arrow" href="#quickstart">Get Started →</a>
          <code className="install minimal">{installCommand}</code>
        </div>
      </div>

      <EyeglassDemo />

      <section className="docs-section" id="overview">
        <h2>Overview</h2>
        <p>Eyeglass bridges the gap between what you see in your browser and what your AI coding assistant can understand. It's a visual debugging tool that lets you point at any UI element and tell Claude what to change—without leaving your browser.</p>
        <p><strong>The Problem:</strong> Describing UI bugs to AI is tedious. "The blue button in the sidebar" could mean anything.</p>
        <p><strong>The Solution:</strong> Click any element. Eyeglass captures its component name, file path, styles, accessibility tree, and geometry. Claude receives this rich context and makes precise changes.</p>
        <h3>Key Benefits</h3>
        <ul>
          <li><strong>Visual Selection:</strong> Click elements instead of describing them in text</li>
          <li><strong>Framework-Aware:</strong> Extracts React/Vue/Svelte component names and file paths</li>
          <li><strong>Semantic Context:</strong> Full accessibility, style, and layout information</li>
          <li><strong>Git Integration:</strong> Auto-commit changes with one-click undo</li>
          <li><strong>Real-Time Feedback:</strong> See Claude's progress directly in your browser</li>
        </ul>
      </section>

      <section className="docs-section" id="quickstart">
        <h2>Quick Start</h2>
        <h3>1. Install Eyeglass</h3>
        <pre><code>npx @eyeglass/cli init</code></pre>
        <p>This single command:</p>
        <ul>
          <li>Installs <code>@eyeglass/inspector</code> as a dev dependency</li>
          <li>Creates <code>.claude/settings.json</code> with MCP configuration</li>
          <li>Configures your bundler (Vite, Next.js, CRA, or Remix)</li>
          <li>Creates a <code>/eyeglass</code> skill for hands-free listening</li>
        </ul>

        <h3>2. Start Your Dev Server</h3>
        <pre><code>npm run dev</code></pre>

        <h3>3. Start the Agent</h3>
        <pre><code>claude</code></pre>
        <p>Tell Claude to listen for requests:</p>
        <pre><code>&gt; wait_for_request</code></pre>

        <h3>4. Use Eyeglass</h3>
        <p>In your browser:</p>
        <ol>
          <li>Click any element to select it (multi-select with Cmd/Ctrl)</li>
          <li>Type your request in the Eyeglass panel</li>
          <li>Submit—Claude automatically receives it and starts working</li>
          <li>Watch changes appear via hot reload</li>
        </ol>
      </section>

      <section className="docs-section" id="how-it-works">
        <h2>How It Works</h2>
        <ol>
          <li><strong>You select an element</strong> in your browser and type a request (e.g., "make this blue")</li>
          <li><strong>The Inspector</strong> captures semantic information: component name, file path, accessibility tree, styles</li>
          <li><strong>The Bridge</strong> stores this context and notifies Claude via MCP</li>
          <li><strong>Claude</strong> receives the full context and makes the code changes</li>
          <li><strong>Hot reload</strong> updates your browser automatically</li>
        </ol>
      </section>
    </>
  )
}
