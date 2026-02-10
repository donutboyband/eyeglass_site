const faq = [
  ['Does this call the agent in the demo?', 'No. The demo page intercepts bridge calls locally (mock bridge, no network or file writes).'],
  ['What frameworks are supported?', 'React, Vue 2/3, Svelte, and vanilla. Component names + file paths are captured where available.'],
  ['How many elements can I select?', 'Up to 5 at once (multi-select mode).'],
  ['How do undo/commits work?', 'On success, Eyeglass auto-commits with a tagged message [eyeglass:id]; the hub offers one-click undo via git revert.'],
  ['Can I disable auto-commit?', 'Yes, toggle it in the hub settings (gear icon). Setting persists in localStorage.'],
  ['Does the inspector run in production?', 'No. It only initializes when NODE_ENV !== "production" to keep your production bundle clean.'],
  ['Can I use this without the agent?', 'The inspector works with any MCP-compatible agent. The bridge exposes standard MCP tools.'],
  ['What about SSR/Next.js?', 'Import in a client component or use dynamic imports with { ssr: false } to prevent server-side rendering issues.'],
]

const changelog = [
  ['0.1.3 (inspector)', 'Improved highlighting cursor, multi-select polish, stability fixes.'],
  ['0.1.x (bridge/CLI)', 'MCP toolset stabilized; auto-commit tagged messages; framework detection tuned.'],
  ['Roadmap', 'Add richer diffs in hub, per-framework setup tips, and configurable bridge ports.'],
]

export function Community() {
  return (
    <>
      <section className="docs-section" id="faq">
        <h2>FAQ</h2>
        <ul className="faq-list">
          {faq.map(([q, a]) => (
            <li key={q}>
              <strong>{q}</strong>
              <p>{a}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="docs-section" id="changelog">
        <h2>Changelog</h2>
        <ul>
          {changelog.map(([ver, note]) => (
            <li key={ver}><strong>{ver}:</strong> {note}</li>
          ))}
        </ul>
      </section>

      <section className="docs-section" id="contributing">
        <h2>Contributing</h2>
        <p>Contributions are welcome if you would like! This is really a personal project, but I am always open to learning from others and hearing new ideas.</p>

        <h3>How to Contribute</h3>
        <ol>
          <li>Fork the repository on GitHub</li>
          <li>Create a feature branch (<code>git checkout -b feature/amazing-feature</code>)</li>
          <li>Make your changes with tests</li>
          <li>Commit your changes (<code>git commit -m 'Add amazing feature'</code>)</li>
          <li>Push to the branch (<code>git push origin feature/amazing-feature</code>)</li>
          <li>Open a Pull Request</li>
        </ol>

        <h3>Development Setup</h3>
        <pre><code>{`git clone https://github.com/donutboyband/eyeglass.git
cd eyeglass
npm install
npm run build`}</code></pre>

        <h3>Running Tests</h3>
        <pre><code>{`npx vitest            # Watch mode
npx vitest run        # Single run
npx vitest --coverage # With coverage`}</code></pre>

        <h3>Project Structure</h3>
        <pre><code>{`eyeglass/
├── packages/
│   ├── bridge/       # MCP server
│   ├── cli/          # CLI tool
│   ├── inspector/    # Browser component
│   └── types/        # Shared types
├── test/             # Integration tests
└── vitest.config.ts  # Test configuration`}</code></pre>

        <h3>Guidelines</h3>
        <ul>
          <li>Write tests for new features</li>
          <li>Follow existing code style</li>
          <li>Update documentation for user-facing changes</li>
          <li>Keep PRs focused on a single concern</li>
        </ul>
      </section>
    </>
  )
}
